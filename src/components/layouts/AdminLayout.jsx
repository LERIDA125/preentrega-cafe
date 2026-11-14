import { Link, NavLink, Outlet } from 'react-router-dom'
import { useFocoRuta } from '../../hooks/useFocoRuta'

/**
 * Chrome del panel de administración.
 *
 * No arrastra el header ni el footer públicos: acá solo viven las herramientas
 * de gestión y la salida al sitio. El logout y las secciones se suman en T-13,
 * T-07 y T-18.
 */
const AdminLayout = () => {
  const mainRef = useFocoRuta()

  return (
    <div className="app app-admin">
      <header className="sitio-cabecera">
        <nav className="barra" aria-label="Administración">
          <div className="barra-inner">
            <Link to="/admin" className="marca">
              <span className="marca-nombre">Café de Origen · Panel</span>
            </Link>

            <ul className="barra-links">
              <li>
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => `barra-link${isActive ? ' activo' : ''}`}
                >
                  Productos
                </NavLink>
              </li>
            </ul>

            <Link to="/" className="barra-link">
              Ver el sitio
            </Link>
          </div>
        </nav>
      </header>

      <main id="contenido" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
