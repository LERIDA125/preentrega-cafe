import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DatosProvider } from './context/DatosContext'
import { CartProvider } from './context/CartContext'
import PublicLayout from './components/layouts/PublicLayout'
import ItemListContainer from './components/ItemListContainer/ItemListContainer'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import CalculadoraReceta from './components/CalculadoraReceta/CalculadoraReceta'

/**
 * El catálogo entra en el bundle inicial porque es la landing. El resto se
 * carga por ruta: la ficha, la calculadora, el carrito, el checkout y todo el
 * panel de administración no le hacen falta a quien solo quiere mirar precios.
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
const AuthBoundary = lazy(() =>
  import('./components/auth/AuthBoundary').then((m) => ({ default: m.default }))
)
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.default })))
const ProtectedRoute = lazy(() =>
  import('./components/auth/ProtectedRoute').then((m) => ({ default: m.default }))
)
const AdminLayout = lazy(() =>
  import('./components/layouts/AdminLayout').then((m) => ({ default: m.default }))
)
const AdminProducts = lazy(() =>
  import('./pages/admin/AdminProducts').then((m) => ({ default: m.default }))
)
const AdminNuevoProducto = lazy(() =>
  import('./pages/admin/AdminNuevoProducto').then((m) => ({ default: m.default }))
)
const AdminEditarProducto = lazy(() =>
  import('./pages/admin/AdminEditarProducto').then((m) => ({ default: m.default }))
)
const AdminOrdenes = lazy(() =>
  import('./pages/admin/AdminOrdenes').then((m) => ({ default: m.default }))
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
            <Suspense fallback={esperando}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<ItemListContainer />} />
                  <Route path="receta" element={<CalculadoraReceta />} />
                  <Route path="producto/:id" element={<ItemDetailContainer />} />
                  <Route path="carrito" element={<Carrito />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="*" element={<NoEncontrado />} />
                </Route>

                <Route element={<AuthBoundary />}>
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminProducts />} />
                      <Route path="nuevo" element={<AdminNuevoProducto />} />
                      <Route path="editar/:id" element={<AdminEditarProducto />} />
                      <Route path="ordenes" element={<AdminOrdenes />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </DatosProvider>
    </ErrorBoundary>
  )
}

export default App
