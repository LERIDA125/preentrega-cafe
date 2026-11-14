import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'

const claseEnlace = ({ isActive }) => `barra-link${isActive ? ' activo' : ''}`

const NavBar = () => {
  return (
    <nav className="barra" aria-label="Principal">
      <div className="barra-inner">
        <Link to="/" className="marca">
          <span className="marca-nombre">Café de Origen</span>
        </Link>

        <ul className="barra-links">
          <li>
            <NavLink to="/" end className={claseEnlace}>
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink to="/receta" className={claseEnlace}>
              Receta
            </NavLink>
          </li>
        </ul>

        <CartWidget />
      </div>
    </nav>
  )
}

export default NavBar
