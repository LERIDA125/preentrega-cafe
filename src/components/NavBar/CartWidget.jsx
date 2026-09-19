import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

const CartWidget = () => {
  const { cartQuantity } = useContext(CartContext)

  return <Link to="/carrito">Carrito ({cartQuantity()})</Link>
}

export default CartWidget