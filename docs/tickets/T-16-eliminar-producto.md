# T-16 · Eliminar producto

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 2 h |
| Dependencias | T-07 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

## Objetivo

Poder retirar del catálogo un producto agotado o cargado por error, sin dejar datos huérfanos.

## Plan de implementación

1. Botón "Eliminar" en cada fila del listado de administración.
2. Confirmación en dos pasos, reutilizando el patrón de "Vaciar carrito" de `Carrito.jsx` o un `window.confirm` si se prioriza rapidez.
3. `await deleteProduct(id)`.
4. Opcional: `await deleteProductImage(producto.imagen)` después de borrar el documento.

## Criterios de aceptación

- [x] Se pide confirmación explícita antes de borrar.
- [x] El producto desaparece del catálogo público en tiempo real.
- [x] Un carrito que tenía ese producto se reconcilia sin romperse (aviso de `CartContext`).
- [x] Si el borrado falla, el producto sigue visible y se muestra el error.
- [x] No se borra nada sin sesión.

## Verificación manual

1. Agregar el producto al carrito desde `/`.
2. Borrarlo desde `/admin`.
3. Abrir `/carrito`: debe haberse quitado con el aviso de ajuste.

## Notas

- **Cuidado con el orden:** borrar el documento primero y la imagen después. Si se borra la imagen y falla el documento, queda un producto con imagen rota.
- `CartContext` ya reconcilia productos fuera de catálogo; este ticket es la mejor forma de verificarlo.
- La confirmación no debe depender de un `alert` bloqueante si se puede reutilizar el patrón de dos pasos existente.
- **Implementado:** confirmación en dos pasos en la misma fila, reutilizando el patrón de `Carrito.jsx` (primer clic arma, segundo confirma, `blur` y `Escape` desarman). El botón pasa a "Confirmar borrado" con `.admin-fila-accion-peligro` y su `aria-label` cambia a "Confirmar eliminación de X".
- **Orden del borrado:** `deleteProduct(id)` y sólo después `deleteProductImage(imagen).catch(() => {})`. Un archivo huérfano en Storage es inofensivo; un producto con imagen rota no.
- **Fallo:** el aviso `role="alert"` aparece arriba del listado, la fila sigue visible (la suscripción no cambió) y el estado de borrado se libera.
- **Sin sesión:** la pantalla cuelga de `ProtectedRoute`, así que no se puede ni renderizar sin sesión. La protección real de los datos son las reglas de Firestore (T-19).
- **Dependencia real:** el criterio "desaparece del catálogo en tiempo real" y la reconciliación del carrito se verifican cuando `DatosContext` lea Firestore (T-04). Hoy el catálogo público sigue saliendo de `public/productos.json`, así que borrar en el panel no cambia el sitio hasta T-04.
- **Detalle conocido:** el aviso de `CartContext` nombra el producto quitado con su `id` cuando ya no está en el catálogo, porque el carrito guarda sólo `id` y `cantidad` a propósito. No rompe nada; si molesta, se puede guardar un `nombre` de respaldo.
