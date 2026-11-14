import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useFocoRuta } from '../../hooks/useFocoRuta'
import { useAuth } from '../../context/AuthContext'

/**
 * Chrome del panel de administración.
 *
 * No arrastra el header ni el footer públicos: acá solo viven las herramientas
 * de gestión y la salida al sitio.
 */

const claseEnlace = ({ isActive }) => `barra-link${isActive ? ' activo' : ''}`

const AdminLayout = () => {
  const mainRef = useFocoRuta()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [saliendo, setSaliendo] = useState(false)
  const [error, setError] = useState(null)

  const salir = async () => {
    if (saliendo) return

    setSaliendo(true)
    setError(null)

    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      setError('No pudimos cerrar la sesión. Probá de nuevo.')
    } finally {
      setSaliendo(false)
    }
  }

  return (
    <div className="app app-admin">
      <header className="sitio-cabecera">
        <nav className="barra" aria-label="Administración">
          <div className="barra-inner">
            <Link to="/admin" className="marca">
              <span className="marca-nombre">
                Café de Origen<span className="marca-panel"> · Panel</span>
              </span>
            </Link>

            <ul className="barra-links">
              <li>
                <NavLink to="/admin" end className={claseEnlace}>
                  Productos
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/nuevo" className={claseEnlace}>
                  Nuevo producto
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ordenes" className={claseEnlace}>
                  Órdenes
                </NavLink>
              </li>
            </ul>

            <div className="barra-admin">
              {user?.email && <span className="barra-usuario">{user.email}</span>}

              <Link to="/" className="barra-link">
                Ver el sitio
              </Link>

              <button
                type="button"
                className="barra-salir"
                onClick={salir}
                disabled={saliendo}
              >
                {saliendo ? 'Saliendo…' : 'Salir'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {error && (
        <p className="aviso aviso-aviso barra-error" role="alert">
          {error}
        </p>
      )}

      <main id="contenido" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
