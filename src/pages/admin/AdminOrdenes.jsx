import { useEffect, useState } from 'react'
import { subscribeOrders } from '../../services/orderService'
import { useTitulo } from '../../hooks/useTitulo'
import { formatFecha, formatPrice } from '../../utils/format'

/**
 * Órdenes recibidas.
 *
 * Suscripción en tiempo real: una compra confirmada en otra pestaña aparece acá
 * sin recargar. El detalle de ítems vive en un `<details>` nativo, así funciona
 * con teclado y con lectores de pantalla sin estado extra.
 *
 * Los importes salen de la orden, no del catálogo: son el snapshot del momento
 * de la compra y no deben cambiar si un producto cambia de precio.
 */

const unidadesDe = (orden) =>
  Array.isArray(orden.items)
    ? orden.items.reduce((suma, item) => suma + (Number(item.cantidad) || 0), 0)
    : 0

const AdminOrdenes = () => {
  useTitulo('Panel · Órdenes')

  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    setCargando(true)

    const desuscribir = subscribeOrders(
      (datos) => {
        setOrdenes(datos)
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

  return (
    <div className="hoja">
      <div className="columna">
        <div className="admin-cabecera">
          <div className="admin-cabecera-texto">
            <h1 className="seccion-titulo">Órdenes</h1>
            {!cargando && !error && (
              <p className="seccion-conteo">
                {ordenes.length} {ordenes.length === 1 ? 'orden' : 'órdenes'}
              </p>
            )}
          </div>
        </div>

        {cargando && (
          <p className="recargando" role="status">
            Cargando órdenes
          </p>
        )}

        {!cargando && error && (
          <div className="vacio" role="alert">
            <h2 className="vacio-titulo">No pudimos cargar las órdenes</h2>
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

        {!cargando && !error && ordenes.length === 0 && (
          <div className="vacio">
            <h2 className="vacio-titulo">Todavía no hay órdenes</h2>
            <p className="vacio-texto">
              Cuando alguien confirme una compra, el pedido aparece acá sin recargar.
            </p>
          </div>
        )}

        {!cargando && !error && ordenes.length > 0 && (
          <ul className="admin-lista admin-ordenes">
            {ordenes.map((orden) => {
              const unidades = unidadesDe(orden)
              const items = Array.isArray(orden.items) ? orden.items : []

              return (
                <li key={orden.id} className="admin-orden">
                  <div className="admin-orden-cabecera">
                    <div className="admin-orden-datos">
                      <p className="admin-orden-numero">
                        {orden.numero || orden.id}
                        <span className="admin-orden-estado">
                          {orden.estado || 'pendiente'}
                        </span>
                      </p>

                      <p className="admin-fila-meta">
                        {formatFecha(orden.fecha)}
                        {orden.buyer?.nombre ? ` · ${orden.buyer.nombre}` : ''}
                        {orden.buyer?.email ? ` · ${orden.buyer.email}` : ''}
                      </p>
                    </div>

                    <div className="admin-orden-importe">
                      <p className="admin-orden-total">{formatPrice(orden.total ?? 0)}</p>
                      <p className="admin-fila-meta">
                        {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
                      </p>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <details className="admin-orden-detalle">
                      <summary>
                        Ver el detalle de{' '}
                        {items.length === 1 ? '1 producto' : `${items.length} productos`}
                      </summary>

                      <ul className="admin-orden-items">
                        {items.map((item) => (
                          <li key={`${orden.id}-${item.id}`} className="admin-orden-item">
                            <span>
                              {item.nombre}
                              <small>{`${item.cantidad} × ${formatPrice(item.precio)}`}</small>
                            </span>
                            <span>{formatPrice(item.subtotal)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AdminOrdenes
