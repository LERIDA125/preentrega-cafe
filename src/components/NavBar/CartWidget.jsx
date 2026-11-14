import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CartContext'

const CartWidget = () => {
  const { cantidadTotal } = useCarrito()

  return (
    <Link to="/carrito" className="carrito-boton">
      <span className="carrito-boton-texto">Carrito</span>
      <span className={`carrito-cuenta${cantidadTotal === 0 ? ' carrito-cuenta-vacia' : ''}`}>
        {cantidadTotal}
      </span>
    </Link>
  )
}

export default CartWidget
