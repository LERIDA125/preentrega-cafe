import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mensajeDeError } from '../utils/firebaseErrors'

/**
 * Acceso a la colección `orders`.
 *
 * La orden guarda un **snapshot** del producto (nombre y precio al momento de
 * comprar). Si mañana cambia el precio del café, el pedido histórico no cambia:
 * eso es exactamente lo que se espera de una orden.
 *
 * El `numero` que ve el comprador es sólo visual. El identificador real es el
 * `id` del documento.
 *
 * Crear una orden y descontar stock es **una sola operación atómica**: si un
 * producto no alcanza, no se crea la orden y no se descuenta nada. Sin eso, dos
 * compradores simultáneos podían llevarse el mismo último kilo.
 */

const COLECCION = 'orders'
const COLECCION_PRODUCTOS = 'productos'

const aOrden = (documento) => ({ ...documento.data(), id: documento.id })

/** Error de negocio: su mensaje está escrito para el comprador y no se traduce. */
export class ErrorDeStock extends Error {
  constructor(mensaje) {
    super(mensaje)
    this.name = 'ErrorDeStock'
  }
}

/** Envuelve una operación para no filtrar errores crudos de Firebase a la UI. */
const conError = async (accion, mensaje) => {
  try {
    return await accion()
  } catch (error) {
    if (error instanceof ErrorDeStock) throw error
    throw new Error(mensajeDeError(error, mensaje), { cause: error })
  }
}

/** Número legible y corto para mostrar en pantalla. No reemplaza al `id`. */
export const generarNumeroOrden = () =>
  `CDO-${Date.now().toString(36).toUpperCase().slice(-6)}`

/** Deja sólo lo que una orden necesita de cada ítem del carrito. */
export const aItemDeOrden = ({ id, nombre, precio, cantidad, subtotal }) => ({
  id: String(id),
  nombre,
  precio,
  cantidad,
  subtotal,
})

const mensajeDeAgotado = (nombre) =>
  `"${nombre}" se agotó mientras comprabas. Quitalo del carrito para seguir.`

const mensajeDeFaltante = (nombre, stock) =>
  `De "${nombre}" quedan ${stock} ${stock === 1 ? 'unidad' : 'unidades'}. ` +
  'Ajustá la cantidad para seguir.'

/**
 * Crea la orden y descuenta el stock en una transacción.
 *
 * El precio y el total se recalculan con lo que dice la base, no con lo que
 * manda el cliente: el carrito es del visitante y se puede manipular. El stock
 * se valida contra el documento recién leído dentro de la transacción.
 *
 * `estado` y `fecha` los pone el servicio: una orden nunca nace sin estado ni
 * con una fecha del reloj del cliente.
 *
 * Devuelve el id del documento creado.
 */
export const createOrder = ({ numero, buyer, items }) =>
  conError(async () => {
    // El id se genera en el cliente para poder escribir la orden dentro de la
    // misma transacción. No es secuencial ni adivinable.
    const referenciaOrden = doc(collection(db, COLECCION))
    let totalConfirmado = 0

    await runTransaction(db, async (transaccion) => {
      // Firestore exige todas las lecturas antes de la primera escritura.
      const leidos = []

      for (const item of items) {
        const identificador = String(item.id)
        const referencia = doc(db, COLECCION_PRODUCTOS, identificador)
        const instantanea = await transaccion.get(referencia)

        if (!instantanea.exists()) {
          throw new ErrorDeStock(
            `"${item.nombre ?? 'Un producto'}" ya no está disponible. Quitalo del carrito para seguir.`
          )
        }

        const producto = instantanea.data()
        const cantidad = Math.floor(Number(item.cantidad))
        const stock = Number(producto.stock ?? 0)

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
          throw new ErrorDeStock(`La cantidad de "${producto.nombre}" no es válida.`)
        }

        if (stock < cantidad) {
          throw new ErrorDeStock(
            stock <= 0 ? mensajeDeAgotado(producto.nombre) : mensajeDeFaltante(producto.nombre, stock)
          )
        }

        leidos.push({ referencia, producto, identificador, cantidad, stock })
      }

      const lineas = leidos.map(({ identificador, producto, cantidad }) =>
        aItemDeOrden({
          id: identificador,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad,
          subtotal: producto.precio * cantidad,
        })
      )

      totalConfirmado = lineas.reduce((suma, linea) => suma + linea.subtotal, 0)

      for (const { referencia, stock, cantidad } of leidos) {
        transaccion.update(referencia, { stock: stock - cantidad })
      }

      transaccion.set(referenciaOrden, {
        numero,
        buyer,
        items: lineas,
        total: totalConfirmado,
        estado: 'pendiente',
        fecha: serverTimestamp(),
      })
    })

    return { id: referenciaOrden.id, total: totalConfirmado }
  }, 'No pudimos registrar el pedido. Revisá la conexión y volvé a intentar.')

/**
 * Suscripción en tiempo real a las órdenes, de la más nueva a la más vieja.
 *
 * `orderBy('fecha', 'desc')` necesita un índice simple que Firestore crea solo
 * para `fecha`. Si la consola pide un índice compuesto, el error de la
 * suscripción trae el enlace para crearlo en un clic.
 *
 * Devuelve la función para cancelarla (la misma que retorna `onSnapshot`).
 */
export const subscribeOrders = (onData, onError) => {
  return onSnapshot(
    query(collection(db, COLECCION), orderBy('fecha', 'desc')),
    (snapshot) => onData(snapshot.docs.map(aOrden)),
    (error) => {
      const fallo = new Error('No pudimos cargar las órdenes.', { cause: error })
      if (onError) onError(fallo)
      else console.error(fallo)
    }
  )
}
