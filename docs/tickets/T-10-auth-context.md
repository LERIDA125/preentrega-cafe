# T-10 · `AuthContext`

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 3 h |
| Dependencias | T-01 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

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

- [x] `user` se actualiza al iniciar y cerrar sesión.
- [x] `cargando` es `true` hasta el primer evento de auth.
- [x] La sesión sobrevive a un refresh.
- [x] La suscripción se limpia al desmontar.
- [x] `useAuth` lanza un error claro fuera del provider.
- [x] No hay parpadeo de "no logueado" mientras carga.

## Verificación manual

Iniciar sesión, recargar la página y verificar que sigue logueado. Cerrar sesión y recargar: debe quedar deslogueado.

## Notas

- No guardar el usuario en `localStorage`: Firebase ya persiste la sesión.
- `cargando` es la pieza que evita que `ProtectedRoute` expulse al usuario en cada refresh. Si se ignora, T-12 va a fallar de forma intermitente.
- El mapa de errores de credenciales vive en T-11, no acá: el contexto no debe decidir textos de UI.
- **Desvío consciente del plan:** en vez de montar `AuthProvider` arriba de `BrowserRouter`, se monta dentro de `src/components/auth/AuthBoundary.jsx`, una frontera lazy que envuelve login y panel. Motivo: el sitio público no necesita el SDK de auth y no debe cargar ~50 kB gzip ni depender de las variables de Firebase para arrancar. La suscripción, el contrato y la semántica son los mismos; solo cambia dónde vive el provider.
- `login` escribe `credencial.user` antes de resolver. Sin eso, T-11 navega a `/admin` y `ProtectedRoute` puede leer `user: null` por la carrera con `onAuthStateChanged`, rebotando al login.
- La persistencia es la de Firebase por defecto (`localStorage` en web). No se guarda nada a mano.
- `AuthBoundary` todavía no tiene consumidores: T-11 monta `/login` y T-12 agrega el guard dentro de la misma frontera.
