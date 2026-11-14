import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Comportamiento de navegación compartido por los layouts.
 *
 * Al cambiar de ruta respeta el hash si existe; si no, vuelve arriba y lleva el
 * foco al contenido, para que quien navega con teclado o lector de pantalla no
 * quede perdido en el lugar anterior.
 */
export const useFocoRuta = () => {
  const { pathname, hash } = useLocation()
  const mainRef = useRef(null)
  const primera = useRef(true)

  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }

    if (hash) {
      const destino = document.querySelector(hash)
      if (destino) {
        destino.scrollIntoView({ block: 'start' })
        return
      }
    }

    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  return mainRef
}
