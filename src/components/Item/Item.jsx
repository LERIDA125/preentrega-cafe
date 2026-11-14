import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'

const ULTIMAS_UNIDADES = 5

/**
 * Ficha de producto del catalogo.
 *
 * La celda entera es un solo enlace, sin boton "ver detalle" repetido seis
 * veces. El nombre accesible se arma a mano para que un lector de pantalla no
 * lea un enlace de cuatro lineas. El precio va a la derecha porque es un numero
 * tabular, no por decoracion.
 */
const Item = ({ producto }) => {
  const { id, nombre, descripcion, precio, imagen, ancho, alto, categoria, stock } = producto
  const quedan = stock <= ULTIMAS_UNIDADES

  return (
    <Link
      to={`/producto/${id}`}
      className="item"
      aria-label={`${nombre}, ${categoria}, ${formatPrice(precio)}. Ver la ficha`}
    >
      <span className="item-media">
        <img
          src={imagen}
          alt=""
          width={ancho}
          height={alto}
          loading="lazy"
          decoding="async"
        />
      </span>

      <span className="item-cuerpo">
        <span className="item-categoria">{categoria}</span>
        <span className="item-nombre">{nombre}</span>
        <span className="item-descripcion">{descripcion}</span>

        <span className="item-pie">
          <span className="item-precio">{formatPrice(precio)}</span>
          {quedan && <span className="item-stock">Quedan {stock}</span>}
        </span>
      </span>
    </Link>
  )
}

export default Item
