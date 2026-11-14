# T-11 · Pantalla de login

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 2 h |
| Dependencias | T-09, T-10 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

## Objetivo

Que el administrador pueda iniciar sesión con correo y contraseña y llegar al panel.

## Plan de implementación

1. Crear `src/pages/Login.jsx` con el formulario:

```jsx
<input type="email" name="email" autoComplete="email" required />
<input type="password" name="password" autoComplete="current-password" required />
```

2. Al enviar: `await login(email, password)` → `navigate(destino, { replace: true })`.
3. `destino` = `location.state?.from?.pathname ?? '/admin'`.
4. Si `user` ya existe, `<Navigate to="/admin" replace />` desde el principio.
5. Mapa de errores:

| Código | Mensaje |
|---|---|
| `auth/invalid-credential` | Correo o contraseña incorrectos. |
| `auth/invalid-email` | El correo no tiene un formato válido. |
| `auth/too-many-requests` | Demasiados intentos. Esperá unos minutos. |
| `auth/network-request-failed` | No pudimos conectar. Revisá la conexión. |

## Criterios de aceptación

- [x] Login exitoso redirige a `/admin`.
- [x] Error genérico para credenciales inválidas (no revela cuál campo falló).
- [x] Si ya hay sesión, redirige a `/admin`.
- [x] Respeta `location.state.from`.
- [x] Botón deshabilitado mientras envía.
- [x] Accesible por teclado, con `autoComplete` correcto.

## Verificación manual

1. Entrar a `/admin` sin sesión → debe redirigir a `/login`.
2. Ingresar mal la contraseña → mensaje claro.
3. Ingresar `admin@admin.com` / `admin123` → panel.
4. Recargar en `/admin` → sigue logueado.

## Notas

- La pantalla de login puede vivir dentro de `PublicLayout` o en un layout mínimo sin chrome. Lo importante es que no muestre la navegación de administración.
- No mostrar el usuario/contraseña de ejemplo en la UI del deploy. Va documentado en la entrega, no en pantalla.
- **Implementado:** `/login` vive dentro de `AuthBoundary` pero fuera de `PublicLayout` y `AdminLayout`: es una caja centrada con la marca y "Volver al sitio", sin chrome de ningún layout.
- **Desvío:** el mapa de errores de credenciales quedó en `src/utils/firebaseErrors.js` en vez de un mapa local de T-11. Motivo: ya existía para los errores de Firestore/Storage, y T-13 reutiliza el mismo helper. Además incluye `auth/wrong-password` y `auth/user-not-found` con el mismo texto genérico, para no filtrar si el correo existe.
- Mientras `cargando` está en curso se muestra "Verificando sesión" sin formulario: evita el parpadeo de login en un usuario que ya tiene sesión.
- `destino` conserva `pathname + search` de `state.from`. La redirección por `user` existente también usa `destino`, así el `from` se respeta sin importar qué camino gane la carrera.
