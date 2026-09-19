import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'

const Item = ({ producto }) => {
  const { id, nombre, descripcion, precio, imagen, categoria } = producto

  return (
    <article className="product-card">
      <div className="card-media">
        <span className="card-badge">{categoria}</span>
        <img src={imagen} alt={nombre} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-desc">{descripcion}</p>
        <p className="product-price">
          <small>Precio:</small> {formatPrice(precio)}
        </p>
        <Link to={`/producto/${id}`} className="product-link">Ver Detalle</Link>
      </div>
    </article>
  )
}

export default Item