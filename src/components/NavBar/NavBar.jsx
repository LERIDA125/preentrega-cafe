import { Link } from 'react-router-dom'
import CartWidget from './CartWidget'

const NavBar = () => {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <CartWidget />
    </nav>
  )
}

export default NavBar