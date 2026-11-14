import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'

const NavBar = () => {
  return (
    <nav className="barra" aria-label="Principal">
      <div className="barra-inner">
        <Link to="/" className="marca">
          <span className="marca-nombre">Café de Origen</span>
        </Link>

        <ul className="barra-links">
          <li>
            <NavLink to="/" end className="barra-link">
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink to="/receta" className="barra-link">
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
