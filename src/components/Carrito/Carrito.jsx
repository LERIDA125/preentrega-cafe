import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CartContext'
import { useDatos } from '../../context/DatosContext'
import { formatPrice } from '../../utils/format'
import { useTitulo } from '../../hooks/useTitulo'

const Carrito = () => {
  const { loading } = useDatos()
  const {
    items,
    cantidadTotal,
    subtotal,
    cambiarCantidad,
    quitar,
    vaciar,
    ajuste,
    descartarAjuste,
  } = useCarrito()

  const [armado, setArmado] = useState(false)
  useTitulo('Carrito')

  // Si el carrito cambia por otra vía, el pedido de vaciado deja de tener sentido.
  useEffect(() => {
    setArmado(false)
  }, [items.length])

  if (loading) {
    return (
      <div className="hoja">
        <div className="columna">
          <p className="recargando" role="status">
            Cargando catálogo…
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="vacio">
            <h1 className="vacio-titulo">Tu carrito está vacío</h1>
            <p className="vacio-texto">
              Todavía no agregaste nada. Mirá el catálogo y empezá por el lote 063.
            </p>
            <Link to="/#catalogo" className="boton boton-primario">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Vaciar es destructivo, así que pide confirmación en dos pasos.
  const pedirVaciado = () => {
    if (!armado) {
      setArmado(true)
      return
    }
    vaciar()
    setArmado(false)
  }

  return (
    <div className="hoja">
      <div className="columna">
        <div className="seccion-cabecera">
          <h1 className="seccion-titulo">Carrito</h1>
          <p className="seccion-conteo">
            {cantidadTotal} {cantidadTotal === 1 ? 'unidad' : 'unidades'}
          </p>
        </div>

        {ajuste && (
          <div className="aviso aviso-ajuste" role="status">
            <p>{ajuste}</p>
            <button type="button" className="boton boton-plano" onClick={descartarAjuste}>
              Entendido
            </button>
          </div>
        )}

        <ul className="lineas">
          {items.map((item) => {
            const quedan = item.stock - item.cantidad
            return (
              <li key={item.id} className="linea">
                <img
                  src={item.imagen}
                  alt=""
                  width={item.ancho}
                  height={item.alto}
                  loading="lazy"
                  decoding="async"
                  className="linea-media"
                />

                <div className="linea-cuerpo">
                  <h2 className="linea-nombre">
                    <Link to={`/producto/${item.id}`} className="linea-enlace">
                      {item.nombre}
                    </Link>
                  </h2>
                  <p className="linea-dato">{formatPrice(item.precio)} cada uno</p>
                  {quedan <= 5 && (
                    <p className="linea-stock">Quedan {quedan} de este lote</p>
                  )}
                </div>

                <div className="linea-controles">
                  <div className="selector selector-chico">
                    <button
                      type="button"
                      className="selector-boton"
                      onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                    >
                      <span aria-hidden="true">−</span>
                      <span className="sr">Menos unidades de {item.nombre}</span>
                    </button>
                    <output className="selector-valor" aria-live="polite">
                      {item.cantidad}
                    </output>
                    <button
                      type="button"
                      className="selector-boton"
                      onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                    >
                      <span aria-hidden="true">+</span>
                      <span className="sr">Más unidades de {item.nombre}</span>
                    </button>
                  </div>

                  <p className="linea-subtotal">{formatPrice(item.subtotal)}</p>

                  <button
                    type="button"
                    className="linea-quitar"
                    onClick={() => quitar(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="cierre">
          <div className="cierre-total">
            <span>Total</span>
            <span className="cierre-cifra">{formatPrice(subtotal)}</span>
          </div>

          <p className="cierre-nota">Envío calculado al confirmar el pedido.</p>

          <div className="cierre-acciones">
            <button
              type="button"
              className={`boton boton-plano${armado ? ' boton-peligro' : ''}`}
              onClick={pedirVaciado}
              onBlur={() => setArmado(false)}
            >
              {armado ? 'Confirmar vaciado' : 'Vaciar carrito'}
            </button>

            <Link to="/checkout" className="boton boton-primario">
              Ir al checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito
