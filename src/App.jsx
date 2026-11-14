import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DatosProvider } from './context/DatosContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout/Layout'
import ItemListContainer from './components/ItemListContainer/ItemListContainer'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import CalculadoraReceta from './components/CalculadoraReceta/CalculadoraReceta'

/**
 * El catálogo entra en el bundle inicial porque es la landing. El resto se
 * carga por ruta: la ficha, la calculadora, el carrito y el checkout no le
 * hacen falta a quien solo quiere mirar precios.
 */
const ItemDetailContainer = lazy(() =>
  import('./components/ItemDetailContainer/ItemDetailContainer')
    .then((m) => ({ default: m.default }))
)
const Carrito = lazy(() =>
  import('./components/Carrito/Carrito').then((m) => ({ default: m.default }))
)
const Checkout = lazy(() =>
  import('./components/Checkout/Checkout').then((m) => ({ default: m.default }))
)
const NoEncontrado = lazy(() =>
  import('./components/NoEncontrado/NoEncontrado').then((m) => ({ default: m.default }))
)

const esperando = (
  <div className="hoja">
    <div className="columna">
      <p className="recargando" role="status">
        Cargando
      </p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <DatosProvider>
        <CartProvider>
          <BrowserRouter>
            <Layout>
              <Suspense fallback={esperando}>
                <Routes>
                  <Route path="/" element={<ItemListContainer />} />
                  <Route path="/receta" element={<CalculadoraReceta />} />
                  <Route path="/producto/:id" element={<ItemDetailContainer />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<NoEncontrado />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </DatosProvider>
    </ErrorBoundary>
  )
}

export default App
