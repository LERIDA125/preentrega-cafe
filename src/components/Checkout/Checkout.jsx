import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CartContext'
import { createOrder, generarNumeroOrden } from '../../services/orderService'
import { formatPrice } from '../../utils/format'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Checkout.
 *
 * No hay pasarela de pago: el alcance es dejar el pedido guardado en Firestore
 * y decir con claridad qué pasa después. El carrito se vacía **sólo** cuando la
 * escritura resolvió: si falla la red, la compra sigue en pantalla y se puede
 * reintentar.
 */
const Checkout = () => {
  const { items, subtotal, vaciar } = useCarrito()
  const [datos, setDatos] = useState({ nombre: '', email: '' })
  const [orden, setOrden] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const enviandoRef = useRef(false)

  useTitulo(orden ? `Pedido ${orden.numero}` : 'Checkout')

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos((previas) => ({ ...previas, [name]: value }))
    setError(null)
  }

  const confirmar = async (evento) => {
    evento.preventDefault()

    // Doble protección: el estado deshabilita el botón, el ref corta dos
    // submits en el mismo tick, antes de que React vuelva a renderizar.
    if (enviandoRef.current) return
    enviandoRef.current = true
    setEnviando(true)
    setError(null)

    const numero = generarNumeroOrden()
    const comprador = { nombre: datos.nombre.trim(), email: datos.email.trim() }
    const total = subtotal

    try {
      await createOrder({ numero, buyer: comprador, items, total })
      vaciar()
      setOrden({ numero, ...comprador, total })
    } catch (fallo) {
      setError(fallo.message || 'No pudimos registrar el pedido. Probá de nuevo.')
    } finally {
      enviandoRef.current = false
      setEnviando(false)
    }
  }

  if (orden) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="confirmacion">
            <p className="confirmacion-sello">{orden.numero}</p>
            <h1 className="confirmacion-titulo">Pedido confirmado</h1>
            <p className="confirmacion-texto">
              Gracias{orden.nombre ? `, ${orden.nombre}` : ''}. Tu pedido por{' '}
              {formatPrice(orden.total)} ya está en el tostador. Te escribimos a{' '}
              {orden.email || 'tu correo'} con la fecha de envío.
            </p>
            <Link to="/" className="boton boton-primario">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="vacio">
            <h1 className="vacio-titulo">No hay nada que confirmar</h1>
            <p className="vacio-texto">Tu carrito está vacío. Agregá algo antes de seguir.</p>
            <Link to="/#catalogo" className="boton boton-primario">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hoja">
      <div className="columna">
        <div className="seccion-cabecera">
          <h1 className="seccion-titulo">Checkout</h1>
          <p className="seccion-conteo">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <div className="checkout">
          <section className="checkout-resumen" aria-labelledby="checkout-resumen-titulo">
            <h2 id="checkout-resumen-titulo" className="checkout-subtitulo">
              Resumen
            </h2>
            <ul className="checkout-lista">
              {items.map((item) => (
                <li key={item.id} className="checkout-fila">
                  <span className="checkout-nombre">
                    {item.nombre}
                    <small>{`${item.cantidad} × ${formatPrice(item.precio)}`}</small>
                  </span>
                  <span className="checkout-precio">{formatPrice(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <span>Total</span>
              <span className="cierre-cifra">{formatPrice(subtotal)}</span>
            </div>
          </section>

          <form className="checkout-formulario" onSubmit={confirmar}>
            <h2 className="checkout-subtitulo">Tus datos</h2>

            <label className="campo">
              <span className="campo-etiqueta">Nombre</span>
              <input
                type="text"
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                autoComplete="name"
                disabled={enviando}
                required
              />
            </label>

            <label className="campo">
              <span className="campo-etiqueta">Correo</span>
              <input
                type="email"
                name="email"
                value={datos.email}
                onChange={cambiar}
                autoComplete="email"
                disabled={enviando}
                required
              />
              <span className="campo-ayuda">Ahí te mandamos la confirmación y el seguimiento.</span>
            </label>

            {error && (
              <p className="aviso aviso-aviso" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="boton boton-primario" disabled={enviando}>
              {enviando ? 'Confirmando…' : 'Confirmar pedido'}
            </button>

            <Link to="/carrito" className="volver">
              Volver al carrito
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout
