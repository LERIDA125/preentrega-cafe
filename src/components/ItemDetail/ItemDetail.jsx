import { useState } from 'react'
import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

const ItemDetail = ({ producto }) => {
  const { nombre, descripcion, precio, imagen, categoria, stock } = producto
  const { addToCart } = useContext(CartContext)
  const [cantidad, setCantidad] = useState(1)

  const restar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : prev))
  const sumar = () => setCantidad((prev) => (prev < stock ? prev + 1 : prev))

  const handleAgregar = () => {
    addToCart(producto, cantidad)
  }

  return (
    <article>
      <img src={imagen} alt={nombre} />
      <h2>{nombre}</h2>
      <p>{categoria}</p>
      <p>{descripcion}</p>
      <p>Precio: ${precio}</p>
      <p>Stock disponible: {stock}</p>
      <button onClick={restar}>-</button>
      <span>{cantidad}</span>
      <button onClick={sumar}>+</button>
      <button onClick={handleAgregar}>Agregar al Carrito</button>
    </article>
  )
}

export default ItemDetail