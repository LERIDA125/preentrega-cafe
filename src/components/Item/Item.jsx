import { Link } from 'react-router-dom'

const Item = ({ producto }) => {
  const { id, nombre, descripcion, precio, imagen, categoria } = producto

  return (
    <article>
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p>{categoria}</p>
      <p>Precio: ${precio}</p>
      <Link to={`/producto/${id}`}>Ver Detalle</Link>
    </article>
  )
}

export default Item