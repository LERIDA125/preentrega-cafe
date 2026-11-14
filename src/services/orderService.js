import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
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
 */

const COLECCION = 'orders'

const aOrden = (documento) => ({ ...documento.data(), id: documento.id })

/** Envuelve una operación para no filtrar errores crudos de Firebase a la UI. */
const conError = async (accion, mensaje) => {
  try {
    return await accion()
  } catch (error) {
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

/**
 * Crea la orden y devuelve el id del documento.
 *
 * `estado` y `fecha` los pone el servicio, no quien llama: así una orden nunca
 * nace sin estado ni con una fecha del reloj del cliente.
 */
export const createOrder = ({ numero, buyer, items, total }) =>
  conError(async () => {
    const referencia = await addDoc(collection(db, COLECCION), {
      numero,
      buyer,
      items: items.map(aItemDeOrden),
      total,
      estado: 'pendiente',
      fecha: serverTimestamp(),
    })

    return referencia.id
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
