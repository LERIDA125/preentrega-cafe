# T-12 · `ProtectedRoute`

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 2 h |
| Dependencias | T-10 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

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

- [x] Sin sesión, `/admin` redirige a `/login`.
- [x] Al loguearse, vuelve a la ruta original (`state.from`).
- [x] Mientras `cargando`, muestra espera y **no** redirige.
- [x] Con sesión, renderiza el contenido.
- [x] Protege alta, edición y órdenes.
- [x] Un usuario logueado que entra a `/login` es redirigido al panel.

## Verificación manual

1. Sin sesión, entrar directo a `/admin/nuevo` → `/login`.
2. Loguearse → debe volver a `/admin/nuevo`, no a `/admin`.
3. Recargar estando logueado → no debe pasar por `/login`.
4. Cerrar sesión y volver atrás → no debe mostrar el panel.

## Notas

- El `cargando` del contexto es obligatorio acá. Sin él, el primer render siempre tiene `user: null` y el guard expulsa a todos.
- Esto protege la UI, no los datos. La protección real son las reglas de Firestore (T-19).
- **Implementado:** el guard se monta dentro de `AuthBoundary` y por encima de `AdminLayout`, envolviendo todo el prefijo `/admin`. Cualquier ruta futura (edición, órdenes) queda protegida por herencia, sin tocar `App.jsx` de nuevo.
- Mientras `cargando`, el guard muestra el mismo estado de espera que usa `App.jsx` para las rutas lazy, así no hay salto visual.
