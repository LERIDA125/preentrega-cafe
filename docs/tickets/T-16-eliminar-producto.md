# T-16 · Eliminar producto

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 2 h |
| Dependencias | T-07 |
| Estado | ⬜ Pendiente |

## Objetivo

Poder retirar del catálogo un producto agotado o cargado por error, sin dejar datos huérfanos.

## Plan de implementación

1. Botón "Eliminar" en cada fila del listado de administración.
2. Confirmación en dos pasos, reutilizando el patrón de "Vaciar carrito" de `Carrito.jsx` o un `window.confirm` si se prioriza rapidez.
3. `await deleteProduct(id)`.
4. Opcional: `await deleteProductImage(producto.imagen)` después de borrar el documento.

## Criterios de aceptación

- [ ] Se pide confirmación explícita antes de borrar.
- [ ] El producto desaparece del catálogo público en tiempo real.
- [ ] Un carrito que tenía ese producto se reconcilia sin romperse (aviso de `CartContext`).
- [ ] Si el borrado falla, el producto sigue visible y se muestra el error.
- [ ] No se borra nada sin sesión.

## Verificación manual

1. Agregar el producto al carrito desde `/`.
2. Borrarlo desde `/admin`.
3. Abrir `/carrito`: debe haberse quitado con el aviso de ajuste.

## Notas

- **Cuidado con el orden:** borrar el documento primero y la imagen después. Si se borra la imagen y falla el documento, queda un producto con imagen rota.
- `CartContext` ya reconcilia productos fuera de catálogo; este ticket es la mejor forma de verificarlo.
- La confirmación no debe depender de un `alert` bloqueante si se puede reutilizar el patrón de dos pasos existente.
