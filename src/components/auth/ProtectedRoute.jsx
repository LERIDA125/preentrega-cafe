import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Guard de las rutas de administración.
 *
 * El orden importa: primero `cargando`, después `user`. Al recargar, el primer
 * render siempre tiene `user: null`; si se redirigiera antes de que Firebase
 * responda, un usuario legítimo terminaría en `/login` en cada F5.
 *
 * Guarda la ubicación original en `state.from` para que el login devuelva a la
 * persona al lugar exacto que pidió (por ejemplo `/admin/nuevo`).
 *
 * Esto protege la interfaz, no los datos: la protección real son las reglas de
 * Firestore (T-19).
 */
const ProtectedRoute = () => {
  const { user, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="hoja">
        <div className="columna">
          <p className="recargando" role="status">
            Verificando sesión
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
