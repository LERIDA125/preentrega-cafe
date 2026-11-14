import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeProducts } from '../services/productService'

const DatosContext = createContext(null)

export const DatosProvider = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    setCargando(true)
    setError(null)

    const unsubscribe = subscribeProducts(
      (data) => {
        setProductos(data)
        setCargando(false)
      },
      (err) => {
        setError(err.message)
        setCargando(false)
      }
    )

    return () => unsubscribe()
  }, [intento])

  const reintentar = useCallback(() => setIntento((actual) => actual + 1), [])

  const porId = useMemo(
    () => new Map(productos.map((producto) => [String(producto.id), producto])),
    [productos]
  )

  const categorias = useMemo(() => {
    const conteo = new Map()
    for (const producto of productos) {
      conteo.set(producto.categoria, (conteo.get(producto.categoria) ?? 0) + 1)
    }
    return Array.from(conteo, ([nombre, cantidad]) => ({ nombre, cantidad }))
  }, [productos])

  const valor = useMemo(
    () => ({ productos, porId, categorias, cargando, loading: cargando, error, reintentar }),
    [productos, porId, categorias, cargando, error, reintentar]
  )

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>
}

export const useDatos = () => {
  const valor = useContext(DatosContext)
  if (!valor) {
    throw new Error('useDatos necesita un DatosProvider arriba en el arbol.')
  }
  return valor
}
