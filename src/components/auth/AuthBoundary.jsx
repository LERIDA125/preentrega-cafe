import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

/**
 * Frontera de autenticación.
 *
 * Login y panel comparten este `AuthProvider`, pero el sitio público queda
 * afuera: no necesita el SDK de auth y no paga su peso en el bundle inicial.
 * Por eso esta frontera se carga de forma lazy, junto con las rutas que la usan.
 */
const AuthBoundary = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
)

export default AuthBoundary
