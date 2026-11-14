# T-18 · Lista de órdenes en el panel

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-09, T-17 |
| Estado | ⬜ Pendiente |

## Objetivo

Que el administrador vea los pedidos recibidos sin entrar a la consola de Firebase.

## Plan de implementación

1. Crear `src/pages/admin/AdminOrdenes.jsx`.
2. Suscripción en tiempo real:
   ```js
   onSnapshot(query(collection(db, 'orders'), orderBy('fecha', 'desc')), ...)
   ```
3. Tabla o lista con: fecha, número, comprador (`nombre` / `email`), cantidad de ítems, total y estado.
4. Ruta `/admin/ordenes` dentro de `AdminLayout` + enlace en la navegación (T-13).
5. Estado vacío: "Todavía no hay órdenes".

## Criterios de aceptación

- [ ] `/admin/ordenes` lista las órdenes por fecha descendente.
- [ ] Muestra comprador, cantidad de ítems, total y fecha.
- [ ] Se actualiza en tiempo real cuando entra una orden nueva.
- [ ] Estado vacío claro cuando no hay órdenes.
- [ ] Formato de precio y fecha consistente con el resto del sitio (`formatPrice`).
- [ ] La ruta está protegida por `ProtectedRoute`.

## Verificación manual

1. Confirmar una compra desde una ventana incógnita.
2. Ver la orden aparecer en `/admin/ordenes` sin recargar.
3. Verificar que el detalle de ítems coincide con lo comprado.

## Notas

- Si `orderBy('fecha')` requiere un índice compuesto, Firestore devuelve un enlace para crearlo. Es normal.
- No hace falta detalle de orden en un modal para la entrega; alcanza con los ítems visibles o un desplegable.
- No mostrar datos personales en el catálogo público: esta vista es solo para el panel.
