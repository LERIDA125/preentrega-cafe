# T-09 · Separar `PublicLayout` y `AdminLayout`

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 3 h |
| Dependencias | — |
| Estado | ⬜ Pendiente |

## Objetivo

Que el panel de administración tenga su propio chrome y no arrastre el header y el footer públicos.

## Plan de implementación

1. Convertir `src/components/Layout/Layout.jsx` en `src/components/layouts/PublicLayout.jsx`, conservando la lógica de foco, scroll y hash.
2. Crear `src/components/layouts/AdminLayout.jsx`:
   - Barra superior con marca, enlaces (Productos, Órdenes) y botón "Salir".
   - `<main>` con `Outlet`.
3. Reestructurar `src/App.jsx` con rutas anidadas:

```jsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route index element={<ItemListContainer />} />
    <Route path="receta" element={<CalculadoraReceta />} />
    <Route path="producto/:id" element={<ItemDetailContainer />} />
    <Route path="carrito" element={<Carrito />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="*" element={<NoEncontrado />} />
  </Route>

  <Route path="/admin" element={<AdminLayout />}>
    {/* se completa en T-07, T-11 y T-18 */}
  </Route>
</Routes>
```

4. Mantener `BrowserRouter` por encima de los layouts (usan `useLocation`).
5. Conservar `DatosProvider`, `CartProvider`, `ErrorBoundary` y el `Suspense` donde ya están.

## Criterios de aceptación

- [ ] `/admin/*` no muestra el header ni el footer públicos.
- [ ] Las rutas públicas conservan foco, scroll y títulos.
- [ ] `AdminLayout` tiene navegación propia y `Outlet`.
- [ ] No se duplica la lógica de accesibilidad entre layouts.
- [ ] El 404 público sigue funcionando.

## Verificación manual

Navegar entre `/`, `/carrito` y `/admin`: el chrome cambia según la zona y el foco sigue yendo al contenido al cambiar de ruta.

## Notas

- Este ticket es puramente estructural: no agrega funcionalidad visible salvo el chrome del panel.
- Si `AdminLayout` se hace antes que T-10, el botón "Salir" puede quedar deshabilitado o comentado hasta tener `logout`.
- No mover `CartProvider` al layout público: el carrito se usa en checkout y en la ficha, y separarlo complica el estado sin beneficio.
