import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'

const Checkout = () => {
  const { carrito, clearCart } = useContext(CartContext)
  const [datos, setDatos] = useState({ nombre: '', email: '' })
  const [orden, setOrden] = useState(null)

  const total = carrito.reduce(
    (acumulador, item) => acumulador + item.precio * item.cantidad,
    0
  )

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const confirmar = (e) => {
    e.preventDefault()
    setOrden({
      numero: `CDO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      nombre: datos.nombre,
      total,
    })
    clearCart()
  }

  if (orden) {
    return (
      <div className="carrito-vacio checkout-confirmacion">
        <span className="nota" aria-hidden="true">Pedido confirmado</span>
        <h2>¡Gracias{orden.nombre ? `, ${orden.nombre}` : ''}!</h2>
        <p>
          Tu pedido {orden.numero} por {formatPrice(orden.total)} está en manos
          del tostador. Te confirmamos el envío por mail.
        </p>
        <Link to="/" className="btn-ghost">← Volver al catálogo</Link>
      </div>
    )
  }

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <span className="nota" aria-hidden="true">Todavía no hay nada acá</span>
        <h2>El carrito está vacío</h2>
        <p>Agregá productos desde el catálogo antes de continuar.</p>
        <Link to="/" className="btn-ghost">← Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <section className="checkout">
      <h2 className="checkout-titulo">Checkout</h2>

      <div className="checkout-grid">
        <div>
          <h3 className="checkout-seccion">Resumen del pedido</h3>
          <ul className="checkout-items">
            {carrito.map((item) => (
              <li className="checkout-item" key={item.id}>
                <span className="checkout-item-nombre">
                  {item.nombre} <small>× {item.cantidad}</small>
                </span>
                <span className="checkout-item-precio">
                  {formatPrice(item.precio * item.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <form className="checkout-form" onSubmit={confirmar}>
          <h3 className="checkout-seccion">Datos del pedido</h3>
          <label className="checkout-label">
            Nombre
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </label>
          <label className="checkout-label">
            Email
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </label>
          <button type="submit" className="btn-primary">Confirmar pedido</button>
        </form>
      </div>
    </section>
  )
}

export default Checkout