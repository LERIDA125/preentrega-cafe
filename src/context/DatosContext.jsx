import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Carga del catalogo.
 *
 * El catalogo se pide una sola vez por sesion. La promesa queda cacheada a nivel
 * de modulo, asi que los dobles montajes de StrictMode en desarrollo, el montar
 * de una ruta y luego volver a la misma ruta no generan trafico repetido.
 *
 * La peticion en vuelo se aborta si el componente se desmonta antes de
 * resolver, y el estado solo se escribe si la peticion sigue viva.
 */

const URL_CATALOGO = '/productos.json'

let promesaCache = null

const pedirCatalogo = () => {
  if (!promesaCache) {
    promesaCache = fetch(URL_CATALOGO, { cache: 'force-cache' })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió ${respuesta.status} al pedir el catálogo.`)
        }
        return respuesta.json()
      })
      .then((datos) => {
        if (!Array.isArray(datos)) {
          throw new Error('El catálogo no tiene el formato esperado.')
        }
        return datos
      })
      .catch((error) => {
        promesaCache = null
        throw error
      })
  }
  return promesaCache
}

const DatosContext = createContext(null)

export const DatosProvider = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)
  const controlador = useRef(null)

  useEffect(() => {
    const actual = new AbortController()
    controlador.current = actual
    let vivo = true

    setCargando(true)
    setError(null)

    pedirCatalogo()
      .then((datos) => {
        if (!vivo || actual.signal.aborted) return
        setProductos(datos)
        setCargando(false)
      })
      .catch((fallo) => {
        if (!vivo || actual.signal.aborted) return
        setError(fallo instanceof Error ? fallo.message : 'No se pudo cargar el catálogo.')
        setCargando(false)
      })

    return () => {
      vivo = false
      actual.abort()
    }
  }, [intento])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  const porId = useMemo(() => {
    const mapa = new Map()
    for (const producto of productos) mapa.set(String(producto.id), producto)
    return mapa
  }, [productos])

  const categorias = useMemo(() => {
    const conteo = new Map()
    for (const producto of productos) {
      conteo.set(producto.categoria, (conteo.get(producto.categoria) ?? 0) + 1)
    }
    return Array.from(conteo, ([nombre, cantidad]) => ({ nombre, cantidad }))
  }, [productos])

  const valor = useMemo(
    () => ({ productos, porId, categorias, cargando, error, reintentar }),
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
