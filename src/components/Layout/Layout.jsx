import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

/**
 * Cada cambio de ruta deja la página arriba y pone el foco en el contenido, así
 * que quien navega con teclado o lector de pantalla no queda perdido.
 */
const Layout = ({ children }) => {
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

  return (
    <div className="app">
      <Header />
      <main id="contenido" ref={mainRef} tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
