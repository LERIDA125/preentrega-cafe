import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'

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
    <article className="detail-card">
      <div className="detail-media">
        <img src={imagen} alt={nombre} />
      </div>
      <div className="detail-info">
        <span className="detail-cat">{categoria}</span>
        <h2 className="detail-title">{nombre}</h2>
        <p className="detail-desc">{descripcion}</p>

        <dl className="ficha-lote">
          <div>
            <dt>Precio</dt>
            <dd>{formatPrice(precio)}</dd>
          </div>
          <div>
            <dt>Stock disponible</dt>
            <dd>
              <span className="ok">{stock}</span> unidades
            </dd>
          </div>
        </dl>

        <div className="qty-group">
          <button onClick={restar} className="qty-btn" aria-label="Restar cantidad">−</button>
          <span className="qty-value">{cantidad}</span>
          <button onClick={sumar} className="qty-btn" aria-label="Sumar cantidad">+</button>
        </div>

        <button onClick={handleAgregar} className="btn-primary">Agregar al Carrito</button>

        <Link to="/" className="btn-back">← Volver al catálogo</Link>
      </div>
    </article>
  )
}

export default ItemDetail