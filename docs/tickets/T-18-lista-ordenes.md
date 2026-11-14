# T-18 · Lista de órdenes en el panel

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-09, T-17 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

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

- [x] `/admin/ordenes` lista las órdenes por fecha descendente.
- [x] Muestra comprador, cantidad de ítems, total y fecha.
- [x] Se actualiza en tiempo real cuando entra una orden nueva.
- [x] Estado vacío claro cuando no hay órdenes.
- [x] Formato de precio y fecha consistente con el resto del sitio (`formatPrice`).
- [x] La ruta está protegida por `ProtectedRoute`.

## Verificación manual

1. Confirmar una compra desde una ventana incógnita.
2. Ver la orden aparecer en `/admin/ordenes` sin recargar.
3. Verificar que el detalle de ítems coincide con lo comprado.

## Notas

- Si `orderBy('fecha')` requiere un índice compuesto, Firestore devuelve un enlace para crearlo. Es normal.
- No hace falta detalle de orden en un modal para la entrega; alcanza con los ítems visibles o un desplegable.
- No mostrar datos personales en el catálogo público: esta vista es solo para el panel.
- **Implementado:** `subscribeOrders` en `orderService.js` (misma forma que `subscribeProducts`) y `src/pages/admin/AdminOrdenes.jsx` en `/admin/ordenes`, lazy y dentro de `ProtectedRoute`.
- **Detalle sin estado extra:** `<details>/<summary>` nativo. Funciona con teclado y lectores de pantalla sin sumar `useState` ni manejar foco a mano.
- **Formato de fecha:** `formatFecha` en `utils/format.js` acepta `Timestamp` de Firestore, `Date` o `null`. Un documento recién escrito por el cliente llega sin `fecha` hasta que responde el servidor; muestra "—" en vez de "Invalid Date".
- **Cantidades:** el encabezado muestra unidades totales (`reduce` sobre `cantidad`); el `<summary>` muestra líneas distintas. Son dos números distintos y conviene que se lean distinto.
- **Enlace en la navegación:** "Órdenes" se agregó a `AdminLayout`, que desde T-13 lo tenía oculto a propósito para no dejar un enlace roto.
- **`orderBy`:** sólo `fecha`, orden simple. Firestore lo resuelve sin índice compuesto.
- **Ojo con las reglas (T-19):** esta vista necesita `read` autenticado en `orders`. Si las reglas quedan cerradas, la suscripción devuelve `permission-denied` y el estado de error lo muestra tal cual.
