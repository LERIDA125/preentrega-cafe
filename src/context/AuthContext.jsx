import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

/**
 * Sesión del administrador.
 *
 * Firebase ya persiste la sesión (localStorage por defecto): no hay que guardar
 * nada a mano ni en el contexto ni en `localStorage`.
 *
 * `cargando` arranca en `true` y baja con el primer evento de auth. Ese detalle
 * es el que evita que `ProtectedRoute` expulse a un usuario legítimo durante un
 * refresh: el primer render siempre tiene `user: null`.
 *
 * `login` escribe el usuario del credential antes de resolver. Si quien llama
 * navega apenas vuelve la promesa, el guard ya ve la sesión y no rebota a
 * `/login` por una carrera con `onAuthStateChanged`.
 */
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const desuscribir = onAuthStateChanged(
      auth,
      (usuario) => {
        setUser(usuario)
        setCargando(false)
      },
      (error) => {
        console.error('Falló la escucha de la sesión:', error)
        setCargando(false)
      }
    )

    return desuscribir
  }, [])

  const login = useCallback(async (email, password) => {
    const credencial = await signInWithEmailAndPassword(auth, email, password)
    setUser(credencial.user)
    setCargando(false)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setCargando(false)
  }, [])

  const valor = useMemo(
    () => ({ user, cargando, login, logout }),
    [user, cargando, login, logout]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const valor = useContext(AuthContext)
  if (!valor) {
    throw new Error('useAuth necesita un AuthProvider arriba en el árbol.')
  }
  return valor
}
