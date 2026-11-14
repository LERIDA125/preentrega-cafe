# T-13 · Navegación de administración y logout

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 1 h |
| Dependencias | T-09, T-10 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

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

- [x] Logout cierra la sesión y redirige a `/`.
- [x] Después del logout, volver a `/admin` redirige a `/login`.
- [x] El header público no muestra enlaces de administración.
- [x] El enlace activo se distingue visualmente y con `aria-current`.
- [x] La navegación funciona con teclado.

## Verificación manual

Entrar al panel, navegar entre secciones, cerrar sesión y confirmar que no se puede volver con el botón "atrás".

## Notas

- Si `/admin/ordenes` todavía no existe (T-18), no dejar un enlace roto: ocultarlo hasta que la ruta exista.
- No hace falta un menú hamburguesa si el panel tiene dos o tres enlaces.
- **Implementado:** `AdminLayout` tiene "Productos" (`end`), "Nuevo producto", el correo del usuario como texto secundario, "Ver el sitio" y un botón "Salir". "Órdenes" queda fuera hasta T-18.
- El logout deshabilita el botón mientras corre y, si `signOut` falla, muestra un aviso `role="alert"` debajo del header sin desmontar el panel.
- `NavLink` agrega `aria-current="page"` solo; el estado visual usa la clase `.activo` con la misma función que el panel.
- **Bug corregido de paso:** `NavBar` (sitio público) pasaba `className="barra-link"` fijo, así que la regla `.barra-link.activo` nunca se aplicaba. Ahora usa la misma función `claseEnlace` que el panel.
- Responsive: bajo 48rem la barra del panel envuelve, la navegación pasa a una segunda fila y se ocultan el correo y el sufijo "· Panel" de la marca.
