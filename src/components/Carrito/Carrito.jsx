import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

const Carrito = () => {
  const { carrito } = useContext(CartContext)

  if (carrito.length === 0) {
    return <div>Tu carrito está vacío</div>
  }

  const total = carrito.reduce(
    (acumulador, item) => acumulador + item.precio * item.cantidad,
    0
  )

  return (
    <div>
      {carrito.map((item) => (
        <article key={item.id}>
          <img src={item.imagen} alt={item.nombre} width="80" />
          <h3>{item.nombre}</h3>
          <p>Cantidad: {item.cantidad}</p>
          <p>Subtotal: ${item.precio * item.cantidad}</p>
        </article>
      ))}
      <p>Total a pagar: ${total}</p>
    </div>
  )
}

export default Carrito