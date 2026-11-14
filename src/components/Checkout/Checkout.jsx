import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Checkout.
 *
 * No hay pasarela de pago: el alcance es dejar el pedido bien formado y decir con
 * claridad qué pasa después. El número de pedido se genera al confirmar y el
 * carrito se vacía recién entonces, así que un error de red no borra la compra.
 */
const Checkout = () => {
  const { items, subtotal, vaciar } = useCarrito()
  const [datos, setDatos] = useState({ nombre: '', email: '' })
  const [orden, setOrden] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useTitulo(orden ? `Pedido ${orden.numero}` : 'Checkout')

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos((previas) => ({ ...previas, [name]: value }))
  }

  const confirmar = (evento) => {
    evento.preventDefault()
    setEnviando(true)
    const numero = `CDO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    setOrden({ numero, nombre: datos.nombre.trim(), email: datos.email.trim(), total: subtotal })
    vaciar()
    setEnviando(false)
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
                required
              />
              <span className="campo-ayuda">Ahí te mandamos la confirmación y el seguimiento.</span>
            </label>

            <button type="submit" className="boton boton-primario" disabled={enviando}>
              Confirmar pedido
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
