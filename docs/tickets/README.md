# Backlog de tickets — Entrega final

Índice operativo del backlog. Cada ticket vive en su propio archivo y se marca acá cuando cambia de estado.

- **Documento base:** [`../ENTREGA.md`](../ENTREGA.md) — evaluación, alcance, historias de usuario y casos de uso.
- **Convenciones:** `P0` bloqueante · `P1` necesario para la entrega completa · `P2` extra opcional.
- **Estados:** ✅ hecho · 🟡 escrito, falta ejecutar con credenciales · ⬜ pendiente.
- **DoD común:** `npm run build` pasa, funciona en el deploy, sin errores en consola, responsive y navegable con teclado.

## Estado

| ID | Ticket | Épica | Prioridad | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| [T-01](T-01-configurar-firebase.md) | Configurar Firebase y variables de entorno | 1 | P0 | 2 h | — | ✅ Hecho |
| [T-02](T-02-servicio-productos.md) | Servicio de productos | 1 | P0 | 3 h | T-01 | ✅ Hecho |
| [T-03](T-03-servicio-imagenes.md) | Servicio de imágenes | 1 | P0 | 2 h | T-01 | ✅ Hecho |
| [T-04](T-04-migrar-datoscontext.md) | Migrar `DatosContext` a Firestore | 1 | P0 | 3 h | T-02, T-05 | ⬜ Pendiente |
| [T-05](T-05-cargar-productos.md) | Cargar los productos existentes | 1 | P0 | 1 h | T-01 | 🟡 Escrito |
| [T-06](T-06-product-form.md) | Componente `ProductForm` | 2 | P0 | 4 h | T-02, T-03 | ⬜ Pendiente |
| [T-07](T-07-ruta-admin-alta.md) | Ruta `/admin` y alta de producto | 2 | P0 | 3 h | T-06, T-09 | ⬜ Pendiente |
| [T-08](T-08-feedback-alta.md) | Estados de carga, error y éxito | 2 | P0 | 1 h | T-07 | ⬜ Pendiente |
| [T-09](T-09-layouts.md) | Separar `PublicLayout` y `AdminLayout` | 3 | P1 | 3 h | — | ⬜ Pendiente |
| [T-10](T-10-auth-context.md) | `AuthContext` | 3 | P1 | 3 h | T-01 | ⬜ Pendiente |
| [T-11](T-11-login.md) | Pantalla de login | 3 | P1 | 2 h | T-09, T-10 | ⬜ Pendiente |
| [T-12](T-12-protected-route.md) | `ProtectedRoute` | 3 | P1 | 2 h | T-10 | ⬜ Pendiente |
| [T-13](T-13-nav-admin-logout.md) | Navegación de administración y logout | 3 | P1 | 1 h | T-09, T-10 | ⬜ Pendiente |
| [T-14](T-14-usuario-admin.md) | Crear el usuario administrador | 3 | P1 | 1 h | T-01 | ⬜ Pendiente |
| [T-15](T-15-editar-producto.md) | Editar producto | 4 | P2 | 3 h | T-06, T-07 | ⬜ Pendiente |
| [T-16](T-16-eliminar-producto.md) | Eliminar producto | 4 | P2 | 2 h | T-07 | ⬜ Pendiente |
| [T-17](T-17-persistir-ordenes.md) | Persistir órdenes de compra | 4 | P2 | 3 h | T-02 | ⬜ Pendiente |
| [T-18](T-18-lista-ordenes.md) | Lista de órdenes en el panel | 4 | P2 | 3 h | T-09, T-17 | ⬜ Pendiente |
| [T-19](T-19-reglas-seguridad.md) | Reglas de seguridad de Firestore | 4 | P2 | 1 h | T-01 | ⬜ Pendiente |

## Orden de implementación

| Etapa | Tickets | Resultado |
|---|---|---|
| 1 · Base de datos | T-01 → T-02 → T-03 → T-05 → T-04 | Catálogo leído de Firestore en tiempo real |
| 2 · Alta | T-06 → T-07 → T-08 | Entrega mínima completa |
| 3 · Acceso | T-09 → T-10 → T-11 → T-12 → T-13 → T-14 | Entrega completa |
| 4 · Extras | T-17 → T-18 → T-15 → T-16 | CRUD y órdenes |
| 5 · Cierre | T-19 + checklist de `ENTREGA.md` | Entrega verificada en producción |

**Ruta crítica:** `T-01 → T-02 → T-05 → T-04 → T-06 → T-07`.

## Cómo usar estos archivos

1. Tomá el primer ticket pendiente cuya dependencia esté cerrada.
2. Leé "Plan de implementación" y "Criterios de aceptación".
3. Implementá, corré la verificación manual y actualizá el estado acá y en el archivo del ticket.
4. Si aparece una decisión nueva, anotala en "Decisiones" del ticket, no en el chat.
