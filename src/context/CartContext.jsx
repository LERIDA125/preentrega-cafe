import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDatos } from './DatosContext'

/**
 * Carrito con stock real.
 *
 * El carrito guarda solo id y cantidad. El precio, el nombre y el stock se
 * leen siempre del catalogo, asi que no hay datos duplicados que puedan quedar
 * viejos despues de un despliegue.
 *
 * El stock se respeta en tres momentos: al agregar, al cambiar cantidad y al
 * hidratar de localStorage, donde un carrito guardado de una sesion anterior
 * puede pedir mas de lo que queda.
 */

const CLAVE_ALMACEN = 'carrito-cafe-de-origen'

const leerAlmacen = () => {
  try {
    const crudo = localStorage.getItem(CLAVE_ALMACEN)
    if (!crudo) return []
    const datos = JSON.parse(crudo)
    if (!Array.isArray(datos)) return []
    return datos
      .map((fila) => ({ id: String(fila.id), cantidad: Math.floor(Number(fila.cantidad)) }))
      .filter((fila) => fila.id && Number.isFinite(fila.cantidad) && fila.cantidad > 0)
  } catch {
    return []
  }
}

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { porId, cargando } = useDatos()
  const [lineas, setLineas] = useState(leerAlmacen)
  const [ajuste, setAjuste] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lineas))
    } catch {
      /* modo privado o cuota llena: el carrito sigue vivo en memoria */
    }
  }, [lineas])

  /** Cuanto se puede pedir todavia de un producto, contando lo que ya esta en el carrito. */
  const disponible = useCallback(
    (id) => {
      const producto = porId.get(String(id))
      if (!producto) return 0
      const enCarrito = lineas.find((linea) => linea.id === String(id))?.cantidad ?? 0
      return Math.max(0, (producto.stock ?? 0) - enCarrito)
    },
    [porId, lineas]
  )

  // Repara lo que quedo guardado de una sesion anterior.
  useEffect(() => {
    if (cargando || porId.size === 0) return

    const fueraDeCatalogo = []
    const ajustadas = []
    let cambio = false

    lineas.forEach((linea) => {
      const producto = porId.get(linea.id)
      if (!producto) {
        fueraDeCatalogo.push(linea)
        cambio = true
        return
      }
      const stock = producto.stock ?? 0
      if (linea.cantidad > stock) {
        ajustadas.push(stock > 0 ? { ...linea, cantidad: stock } : linea)
        cambio = true
      } else {
        ajustadas.push(linea)
      }
    })

    if (!cambio) return

    const conservadas = ajustadas.filter((linea) => linea.cantidad > 0)
    setLineas(conservadas)

    const nombres = fueraDeCatalogo.map((linea) => porId.get(linea.id)?.nombre ?? linea.id)
    const reducidas = lineas.length - fueraDeCatalogo.length - conservadas.length

    const partes = []
    if (nombres.length > 0) {
      partes.push(
        `Quitamos ${nombres.join(', ')} del carrito: ${
          nombres.length === 1 ? 'ya no está disponible' : 'ya no están disponibles'
        }`
      )
    }
    if (reducidas > 0) {
      partes.push(
        `y ajustamos la cantidad de ${
          reducidas === 1 ? 'un producto' : `${reducidas} productos`
        } al stock que queda`
      )
    }
    setAjuste(`${partes.join(', ')}.`)
  }, [cargando, porId, lineas])

  const items = useMemo(
    () =>
      lineas
        .map((linea) => {
          const producto = porId.get(linea.id)
          if (!producto) return null
          return {
            ...producto,
            id: String(producto.id),
            cantidad: linea.cantidad,
            subtotal: producto.precio * linea.cantidad,
          }
        })
        .filter(Boolean),
    [lineas, porId]
  )

  const cantidadTotal = useMemo(
    () => items.reduce((suma, item) => suma + item.cantidad, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((suma, item) => suma + item.subtotal, 0),
    [items]
  )

  const hayStock = useCallback((id) => (porId.get(String(id))?.stock ?? 0) > 0, [porId])

  const cambiarCantidad = useCallback(
    (id, cantidad) => {
      const clave = String(id)
      const stock = porId.get(clave)?.stock ?? 0
      const pedido = Math.min(Math.max(0, Math.floor(cantidad)), stock)
      setLineas((previas) =>
        previas.flatMap((linea) =>
          linea.id === clave
            ? pedido > 0
              ? [{ ...linea, cantidad: pedido }]
              : []
            : [linea]
        )
      )
      return pedido
    },
    [porId]
  )

  const agregar = useCallback(
    (producto, cantidad) => {
      const clave = String(producto.id)
      const stock = producto.stock ?? 0
      const pedido = Math.max(0, Math.floor(cantidad))
      const enCarrito = lineas.find((linea) => linea.id === clave)?.cantidad ?? 0
      const lugar = Math.max(0, stock - enCarrito)
      const agregados = Math.min(pedido, lugar)

      if (agregados > 0) {
        setLineas((previas) => {
          const existe = previas.some((linea) => linea.id === clave)
          if (existe) {
            return previas.map((linea) =>
              linea.id === clave
                ? { ...linea, cantidad: Math.min(linea.cantidad + agregados, stock) }
                : linea
            )
          }
          return [...previas, { id: clave, cantidad: agregados }]
        })
      }

      const omitidos = pedido - agregados
      return { agregados, omitidos, nombre: producto.nombre, stock }
    },
    [lineas]
  )

  const quitar = useCallback((id) => {
    const clave = String(id)
    setLineas((previas) => previas.filter((linea) => linea.id !== clave))
  }, [])

  const vaciar = useCallback(() => setLineas([]), [])

  const descartarAjuste = useCallback(() => setAjuste(null), [])

  const valor = useMemo(
    () => ({
      items,
      cantidadTotal,
      subtotal,
      hayStock,
      disponible,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      ajuste,
      descartarAjuste,
    }),
    [items, cantidadTotal, subtotal, hayStock, disponible, agregar, cambiarCantidad, quitar, vaciar, ajuste, descartarAjuste]
  )

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export const useCarrito = () => {
  const valor = useContext(CartContext)
  if (!valor) {
    throw new Error('useCarrito necesita un CartProvider arriba en el arbol.')
  }
  return valor
}
