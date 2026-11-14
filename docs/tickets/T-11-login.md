# T-11 · Pantalla de login

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 2 h |
| Dependencias | T-09, T-10 |
| Estado | ⬜ Pendiente |

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

- [ ] Login exitoso redirige a `/admin`.
- [ ] Error genérico para credenciales inválidas (no revela cuál campo falló).
- [ ] Si ya hay sesión, redirige a `/admin`.
- [ ] Respeta `location.state.from`.
- [ ] Botón deshabilitado mientras envía.
- [ ] Accesible por teclado, con `autoComplete` correcto.

## Verificación manual

1. Entrar a `/admin` sin sesión → debe redirigir a `/login`.
2. Ingresar mal la contraseña → mensaje claro.
3. Ingresar `admin@admin.com` / `admin123` → panel.
4. Recargar en `/admin` → sigue logueado.

## Notas

- La pantalla de login puede vivir dentro de `PublicLayout` o en un layout mínimo sin chrome. Lo importante es que no muestre la navegación de administración.
- No mostrar el usuario/contraseña de ejemplo en la UI del deploy. Va documentado en la entrega, no en pantalla.
