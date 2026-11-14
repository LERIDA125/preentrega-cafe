import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { useFocoRuta } from '../../hooks/useFocoRuta'

/** Chrome del sitio público: header, contenido y footer. */
const PublicLayout = () => {
  const mainRef = useFocoRuta()

  return (
    <div className="app">
      <Header />
      <main id="contenido" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
