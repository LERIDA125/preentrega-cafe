# T-12 · `ProtectedRoute`

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 2 h |
| Dependencias | T-10 |
| Estado | ⬜ Pendiente |

## Objetivo

Impedir que alguien sin sesión llegue al panel o al formulario de alta, sin expulsar al usuario legítimo durante el arranque.

## Plan de implementación

Crear `src/components/auth/ProtectedRoute.jsx`:

```jsx
const { user, cargando } = useAuth()
const location = useLocation()

if (cargando) return <p role="status">Verificando sesión…</p>
if (!user) return <Navigate to="/login" replace state={{ from: location }} />
return <Outlet />
```

Uso en `App.jsx`:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    {/* rutas del panel */}
  </Route>
</Route>
```

## Criterios de aceptación

- [ ] Sin sesión, `/admin` redirige a `/login`.
- [ ] Al loguearse, vuelve a la ruta original (`state.from`).
- [ ] Mientras `cargando`, muestra espera y **no** redirige.
- [ ] Con sesión, renderiza el contenido.
- [ ] Protege alta, edición y órdenes.
- [ ] Un usuario logueado que entra a `/login` es redirigido al panel.

## Verificación manual

1. Sin sesión, entrar directo a `/admin/nuevo` → `/login`.
2. Loguearse → debe volver a `/admin/nuevo`, no a `/admin`.
3. Recargar estando logueado → no debe pasar por `/login`.
4. Cerrar sesión y volver atrás → no debe mostrar el panel.

## Notas

- El `cargando` del contexto es obligatorio acá. Sin él, el primer render siempre tiene `user: null` y el guard expulsa a todos.
- Esto protege la UI, no los datos. La protección real son las reglas de Firestore (T-19).
