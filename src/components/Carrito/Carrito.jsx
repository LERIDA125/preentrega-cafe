import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'

const Carrito = () => {
  const { carrito, removeItem, clearCart } = useContext(CartContext)

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <span className="nota" aria-hidden="true">Todavía no hay nada acá</span>
        <h2>Tu carrito está vacío</h2>
        <p>Explorá nuestro catálogo y agregá tus cafés favoritos.</p>
        <Link to="/" className="btn-ghost">← Ir al catálogo</Link>
      </div>
    )
  }

  const total = carrito.reduce(
    (acumulador, item) => acumulador + item.precio * item.cantidad,
    0
  )

  return (
    <div className="carrito-contenedor">
      <h2 className="carrito-heading">Tu carrito</h2>

      {carrito.map((item) => (
        <article className="carrito-item" key={item.id}>
          <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />
          <div className="carrito-item-body">
            <h3 className="carrito-item-nombre">{item.nombre}</h3>
            <p className="carrito-item-info">Cantidad: {item.cantidad}</p>
            <p className="carrito-item-sub">
              Subtotal: {formatPrice(item.precio * item.cantidad)}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="carrito-item-remove"
            aria-label={`Quitar ${item.nombre} del carrito`}
          >
            ✕
          </button>
        </article>
      ))}

      <div className="carrito-total">
        <span>Total a pagar</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="carrito-acciones">
        <button onClick={clearCart} className="btn-ghost">Vaciar carrito</button>
        <Link to="/checkout" className="btn-primary">Ir al checkout</Link>
      </div>
    </div>
  )
}

export default Carrito