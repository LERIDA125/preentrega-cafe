import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mensajeDeError } from '../utils/firebaseErrors'
import { useTitulo } from '../hooks/useTitulo'

/**
 * Acceso al panel.
 *
 * Vive fuera de `PublicLayout` y de `AdminLayout` a propósito: no muestra la
 * navegación pública ni la de administración, solo el formulario y la salida al
 * sitio.
 *
 * Si ya hay sesión redirige al destino original (`state.from`) o a `/admin`.
 * Mientras `cargando` está en curso no se muestra el formulario, para no
 * parpadear el login a alguien que ya está logueado.
 */

const Login = () => {
  useTitulo('Ingresar')

  const { user, cargando, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const desde = location.state?.from
  const destino = desde ? `${desde.pathname}${desde.search ?? ''}` : '/admin'

  if (cargando) {
    return (
      <div className="acceso">
        <p className="recargando" role="status">
          Verificando sesión
        </p>
      </div>
    )
  }

  if (user) return <Navigate to={destino} replace />

  const enviar = async (evento) => {
    evento.preventDefault()
    if (enviando) return

    if (!email.trim() || !password) {
      setError('Completá el correo y la contraseña.')
      return
    }

    setEnviando(true)
    setError(null)

    try {
      await login(email.trim(), password)
      navigate(destino, { replace: true })
    } catch (fallo) {
      setError(mensajeDeError(fallo, 'No pudimos iniciar sesión. Probá de nuevo.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="acceso">
      <main id="contenido" className="acceso-caja">
        <Link to="/" className="marca">
          Café de Origen
        </Link>

        <div>
          <h1 className="acceso-titulo">Panel</h1>
          <p className="acceso-intro">Ingresá con tu cuenta de administración.</p>
        </div>

        <form className="acceso-form" onSubmit={enviar} noValidate>
          <div className="campo">
            <label className="campo-etiqueta" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value)
                setError(null)
              }}
              disabled={enviando}
              autoFocus
            />
          </div>

          <div className="campo">
            <label className="campo-etiqueta" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(evento) => {
                setPassword(evento.target.value)
                setError(null)
              }}
              disabled={enviando}
            />
          </div>

          {error && (
            <p className="aviso aviso-aviso" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="boton boton-primario" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link to="/" className="acceso-volver">
          Volver al sitio
        </Link>
      </main>
    </div>
  )
}

export default Login
