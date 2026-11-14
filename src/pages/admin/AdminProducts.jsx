import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { deleteProduct, subscribeProducts } from '../../services/productService'
import { deleteProductImage } from '../../services/imageService'
import { useTitulo } from '../../hooks/useTitulo'
import { formatPrice } from '../../utils/format'

/**
 * Listado de productos del panel.
 *
 * Escucha la colección en tiempo real: lo que se da de alta en `/admin/nuevo`
 * aparece acá sin recargar, y lo que se elimina desaparece solo. Cada fila
 * ofrece editar, ver en el sitio y eliminar (con confirmación en dos pasos).
 */
const AdminProducts = () => {
  useTitulo('Panel · Productos')

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  // Confirmación en dos pasos por fila y estado del borrado en curso.
  const [confirmando, setConfirmando] = useState(null)
  const [borrando, setBorrando] = useState(null)
  const [errorAccion, setErrorAccion] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  // Se captura al montar: el efecto de abajo limpia el state del historial y no
  // queremos que eso apague la confirmación recién mostrada.
  const [aviso, setAviso] = useState(() => {
    if (location.state?.creado) {
      return 'Producto creado. Ya está disponible en el catálogo.'
    }
    if (location.state?.actualizado) {
      return 'Producto actualizado. Los cambios ya se ven en el catálogo.'
    }
    return null
  })

  useEffect(() => {
    setCargando(true)

    const desuscribir = subscribeProducts(
      (datos) => {
        setProductos(datos)
        setError(null)
        setCargando(false)
      },
      (fallo) => {
        setError(fallo.message)
        setCargando(false)
      }
    )

    return desuscribir
  }, [intento])

  // La confirmación se muestra una sola vez: se limpia del historial para que
  // un F5 no la repita.
  useEffect(() => {
    if (!location.state) return
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  /**
   * Borra el documento primero y la imagen después, en best-effort.
   *
   * El orden importa: si se borrara la imagen y fallara el documento, el
   * catálogo quedaría mostrando un producto con la imagen rota. Al revés, un
   * fallo de Storage deja un archivo huérfano, que es inofensivo.
   */
  const eliminar = async (producto) => {
    setBorrando(producto.id)
    setErrorAccion(null)

    try {
      await deleteProduct(producto.id)

      if (producto.imagen) {
        await deleteProductImage(producto.imagen).catch(() => {})
      }

      setConfirmando(null)
      setAviso(`Eliminamos ${producto.nombre} del catálogo.`)
    } catch (fallo) {
      setErrorAccion(fallo.message)
    } finally {
      setBorrando(null)
    }
  }

  const pedirBorrado = (producto) => {
    if (borrando) return
    if (confirmando === producto.id) {
      eliminar(producto)
      return
    }
    setErrorAccion(null)
    setConfirmando(producto.id)
  }

  return (
    <div className="hoja">
      <div className="columna">
        <div className="sr" role="status">
          {aviso ?? ''}
        </div>

        {aviso && (
          <div className="aviso aviso-ok admin-aviso aviso-descartable">
            <p>{aviso}</p>
            <button
              type="button"
              className="aviso-cerrar"
              onClick={() => setAviso(null)}
              aria-label="Cerrar la confirmación"
            >
              Cerrar
            </button>
          </div>
        )}

        {errorAccion && (
          <div className="aviso aviso-aviso admin-aviso aviso-descartable" role="alert">
            <p>{errorAccion}</p>
            <button
              type="button"
              className="aviso-cerrar"
              onClick={() => setErrorAccion(null)}
              aria-label="Cerrar el aviso de error"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="admin-cabecera">
          <div className="admin-cabecera-texto">
            <h1 className="seccion-titulo">Productos</h1>
            {!cargando && !error && (
              <p className="seccion-conteo">
                {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>

          <Link to="/admin/nuevo" className="boton boton-primario">
            Nuevo producto
          </Link>
        </div>

        {cargando && (
          <p className="recargando" role="status">
            Cargando productos
          </p>
        )}

        {!cargando && error && (
          <div className="vacio" role="alert">
            <h2 className="vacio-titulo">No pudimos cargar los productos</h2>
            <p className="vacio-texto">{error}</p>
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => setIntento((previo) => previo + 1)}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <div className="vacio">
            <h2 className="vacio-titulo">Todavía no hay productos</h2>
            <p className="vacio-texto">
              Cargá el primero para que aparezca en el catálogo público.
            </p>
            <Link to="/admin/nuevo" className="boton boton-primario">
              Nuevo producto
            </Link>
          </div>
        )}

        {!cargando && !error && productos.length > 0 && (
          <ul className="admin-lista">
            {productos.map((producto) => (
              <li key={producto.id} className="admin-fila">
                <span className="admin-miniatura">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt="" width="56" height="56" loading="lazy" />
                  ) : (
                    <span className="admin-miniatura-vacia">Sin imagen</span>
                  )}
                </span>

                <div className="admin-fila-cuerpo">
                  <p className="admin-fila-nombre">{producto.nombre}</p>
                  <p className="admin-fila-meta">
                    {producto.categoria} · {formatPrice(producto.precio)} · Stock{' '}
                    {producto.stock}
                  </p>
                </div>

                <div className="admin-fila-acciones">
                  <Link
                    to={`/admin/editar/${producto.id}`}
                    className="admin-fila-accion"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    Editar
                  </Link>

                  <Link
                    to={`/producto/${producto.id}`}
                    className="admin-fila-accion"
                    aria-label={`Ver ${producto.nombre} en el sitio`}
                  >
                    Ver
                  </Link>

                  <button
                    type="button"
                    className={`admin-fila-accion${
                      confirmando === producto.id ? ' admin-fila-accion-peligro' : ''
                    }`}
                    onClick={() => pedirBorrado(producto)}
                    onBlur={() =>
                      setConfirmando((actual) =>
                        actual === producto.id ? null : actual
                      )
                    }
                    onKeyDown={(evento) => {
                      if (evento.key === 'Escape') setConfirmando(null)
                    }}
                    disabled={borrando === producto.id}
                    aria-label={
                      confirmando === producto.id
                        ? `Confirmar eliminación de ${producto.nombre}`
                        : `Eliminar ${producto.nombre}`
                    }
                  >
                    {borrando === producto.id
                      ? 'Eliminando…'
                      : confirmando === producto.id
                        ? 'Confirmar borrado'
                        : 'Eliminar'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
