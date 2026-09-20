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
      <div className="card-body card-ticket">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-desc">{descripcion}</p>
        <div className="card-row">
          <span className="product-price">{formatPrice(precio)}</span>
          <Link to={`/producto/${id}`} className="product-link">Ver detalle</Link>
        </div>
      </div>
    </article>
  )
}

export default Item