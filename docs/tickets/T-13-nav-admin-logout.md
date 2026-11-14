# T-13 · Navegación de administración y logout

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 1 h |
| Dependencias | T-09, T-10 |
| Estado | ⬜ Pendiente |

## Objetivo

Que el panel tenga navegación clara y una salida de sesión visible.

## Plan de implementación

1. En `AdminLayout`, agregar:
   - `NavLink` a `/admin` (Productos) y `/admin/ordenes` (Órdenes, T-18).
   - Botón "Salir" que llama a `logout()` y navega a `/`.
   - Correo del usuario logueado, como texto secundario.
2. Reutilizar las clases de navegación existentes donde se pueda.
3. Marcar el enlace activo con la clase de `NavLink`.

## Criterios de aceptación

- [ ] Logout cierra la sesión y redirige a `/`.
- [ ] Después del logout, volver a `/admin` redirige a `/login`.
- [ ] El header público no muestra enlaces de administración.
- [ ] El enlace activo se distingue visualmente y con `aria-current`.
- [ ] La navegación funciona con teclado.

## Verificación manual

Entrar al panel, navegar entre secciones, cerrar sesión y confirmar que no se puede volver con el botón "atrás".

## Notas

- Si `/admin/ordenes` todavía no existe (T-18), no dejar un enlace roto: ocultarlo hasta que la ruta exista.
- No hace falta un menú hamburguesa si el panel tiene dos o tres enlaces.
