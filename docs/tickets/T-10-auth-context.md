# T-10 · `AuthContext`

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 3 h |
| Dependencias | T-01 |
| Estado | ⬜ Pendiente |

## Objetivo

Centralizar el estado de sesión para que login, logout y rutas protegidas lean la misma fuente.

## Plan de implementación

Crear `src/context/AuthContext.jsx`:

```js
{
  user,       // User | null
  cargando,   // true hasta el primer onAuthStateChanged
  login,      // (email, password) => Promise<void>
  logout,     // () => Promise<void>
}
```

Detalles:

- `useEffect` con `onAuthStateChanged(auth, setUser)` y cleanup de la suscripción.
- `login` usa `signInWithEmailAndPassword`; `logout` usa `signOut`.
- `useMemo` para el valor del contexto.
- Exportar `useAuth` con error explícito si falta el provider (mismo patrón que `useDatos` y `useCarrito`).
- Montar `AuthProvider` en `App.jsx`, por encima de `BrowserRouter`.

## Criterios de aceptación

- [ ] `user` se actualiza al iniciar y cerrar sesión.
- [ ] `cargando` es `true` hasta el primer evento de auth.
- [ ] La sesión sobrevive a un refresh.
- [ ] La suscripción se limpia al desmontar.
- [ ] `useAuth` lanza un error claro fuera del provider.
- [ ] No hay parpadeo de "no logueado" mientras carga.

## Verificación manual

Iniciar sesión, recargar la página y verificar que sigue logueado. Cerrar sesión y recargar: debe quedar deslogueado.

## Notas

- No guardar el usuario en `localStorage`: Firebase ya persiste la sesión.
- `cargando` es la pieza que evita que `ProtectedRoute` expulse al usuario en cada refresh. Si se ignora, T-12 va a fallar de forma intermitente.
- El mapa de errores de credenciales vive en T-11, no acá: el contexto no debe decidir textos de UI.
