import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CartContext'
import { formatAltura, formatPrice } from '../../utils/format'
import CalculadoraReceta from '../CalculadoraReceta/CalculadoraReceta'

/**
 * Ficha de producto.
 *
 * El limite del selector no es el stock del producto sino lo que queda después
 * de lo que ya está en el carrito, y el botón dice por qué está bloqueado en vez
 * de simplemente estar apagado.
 */
const ItemDetail = ({ producto }) => {
  const {
    id,
    nombre,
    descripcion,
    precio,
    imagen,
    ancho,
    alto,
    categoria,
    stock,
    lote,
    origen,
    altura,
    variedad,
    proceso,
    punto,
    notas,
  } = producto

  const { agregar, disponible } = useCarrito()
  const lugar = disponible(id)
  const [cantidad, setCantidad] = useState(1)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    setCantidad(1)
    setAviso(null)
  }, [id])

  const cambiarCantidad = (delta) => {
    setAviso(null)
    setCantidad((previo) => Math.min(Math.max(1, previo + delta), Math.max(1, lugar)))
  }

  const confirmarAlCarrito = () => {
    const { agregados, omitidos, nombre: nombreProducto } = agregar(producto, cantidad)
    if (agregados === 0) {
      setAviso({
        tono: 'aviso',
        texto: `Ya tenés los ${stock} disponibles de ${nombreProducto} en el carrito.`,
      })
      return
    }
    setAviso({
      tono: omitidos > 0 ? 'aviso' : 'ok',
      texto:
        omitidos > 0
          ? `Agregamos ${agregados} de ${nombreProducto}. Solo quedaban ${lugar} disponibles.`
          : `Agregamos ${agregados} ${agregados === 1 ? 'unidad' : 'unidades'} de ${nombreProducto} al carrito.`,
    })
  }

  const sinStock = lugar === 0
  const quedaUno = lugar === 1

  return (
    <>
      <div className="hoja">
        <div className="columna">
          <article className="ficha-producto">
            <div className="ficha-producto-media">
              <img src={imagen} alt={nombre} width={ancho} height={alto} decoding="async" />
            </div>

            <div className="ficha-producto-info">
              <p className="ficha-producto-categoria">
                {categoria}
                <span className="ficha-producto-lote">{`Lote ${lote}`}</span>
              </p>

              <h1 className="ficha-producto-titulo">{nombre}</h1>
              <p className="ficha-producto-descripcion">{descripcion}</p>

              <dl className="ficha">
                <div className="ficha-par">
                  <dt>Origen</dt>
                  <dd>{origen}</dd>
                </div>
                <div className="ficha-par">
                  <dt>Altitud</dt>
                  <dd>{formatAltura(altura)}</dd>
                </div>
                <div className="ficha-par">
                  <dt>Variedad</dt>
                  <dd>{variedad}</dd>
                </div>
                <div className="ficha-par">
                  <dt>Proceso</dt>
                  <dd>{proceso}</dd>
                </div>
                <div className="ficha-par">
                  <dt>Punto de tueste</dt>
                  <dd>{punto}</dd>
                </div>
                <div className="ficha-par">
                  <dt>Notas de cata</dt>
                  <dd>{notas.join(', ')}</dd>
                </div>
              </dl>

              <div className="compra">
                <p className="compra-precio">{formatPrice(precio)}</p>

                <div className="compra-controles">
                  <div className="selector">
                    <button
                      type="button"
                      className="selector-boton"
                      onClick={() => cambiarCantidad(-1)}
                      disabled={cantidad <= 1}
                    >
                      <span aria-hidden="true">−</span>
                      <span className="sr">Menos unidades</span>
                    </button>
                    <output className="selector-valor" aria-live="polite">
                      {cantidad}
                    </output>
                    <button
                      type="button"
                      className="selector-boton"
                      onClick={() => cambiarCantidad(1)}
                      disabled={cantidad >= lugar}
                    >
                      <span aria-hidden="true">+</span>
                      <span className="sr">Más unidades</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="boton boton-primario compra-boton"
                    onClick={confirmarAlCarrito}
                    disabled={sinStock}
                  >
                    {sinStock ? 'Sin stock' : `Agregar al carrito`}
                  </button>
                </div>

                <p className="compra-stock">
                  {sinStock
                    ? 'No queda stock de este lote. Escribinos y te avisamos cuando vuelva.'
                    : `Quedan ${lugar} ${lugar === 1 ? 'unidad' : 'unidades'} disponibles`}
                </p>

                {aviso && (
                  <p className={`aviso aviso-${aviso.tono}`} role="status" aria-live="polite">
                    {aviso.texto}
                  </p>
                )}

                {quedaUno && <p className="compra-ultimo">Queda una sola unidad.</p>}
              </div>

              <Link to="/#catalogo" className="volver">
                Volver al catálogo
              </Link>
            </div>
          </article>
        </div>
      </div>

      <div className="hoja">
        <div className="columna">
          <CalculadoraReceta producto={producto} compacto />
        </div>
      </div>
    </>
  )
}

export default ItemDetail
