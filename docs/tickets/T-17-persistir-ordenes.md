# T-17 · Persistir órdenes de compra

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-02 |
| Estado | ⬜ Pendiente |

## Objetivo

Que una compra confirmada quede guardada en Firestore y no sea solo un número aleatorio en pantalla.

## Plan de implementación

1. Crear `src/services/orderService.js`:
   ```js
   export const createOrder = async (orden) => {
     const ref = await addDoc(collection(db, 'orders'), {
       ...orden,
       estado: 'pendiente',
       fecha: serverTimestamp(),
     })
     return ref.id
   }
   ```
2. En `Checkout.jsx`, reemplazar el número aleatorio:
   ```js
   const numero = `CDO-${Date.now().toString(36).toUpperCase().slice(-6)}`
   await createOrder({ numero, buyer: datos, items, total: subtotal })
   vaciar()
   ```
3. Vaciar el carrito **solo** después de que la escritura resuelva.
4. Manejar error: conservar carrito y mostrar mensaje.

## Criterios de aceptación

- [ ] Se crea un documento en `orders` con comprador, ítems, total y `fecha`.
- [ ] Cada ítem guarda `id`, `nombre`, `precio`, `cantidad` y `subtotal` (snapshot del precio al momento de comprar).
- [ ] El carrito se vacía solo si la escritura fue exitosa.
- [ ] Un error de red conserva el carrito y muestra el mensaje.
- [ ] El número visible sale del flujo real, no de `Math.random()`.
- [ ] No se puede confirmar dos veces el mismo pedido.

## Verificación manual

1. Comprar con red disponible: la orden aparece en Firestore y el carrito queda vacío.
2. Cortar la red y confirmar: el carrito debe seguir con los ítems.

## Notas

- Guardar el precio dentro de la orden es obligatorio: si el producto cambia de precio, la orden histórica no debe cambiar.
- El total se recalcula en el checkout; no confiar en un total enviado desde el cliente para cobrar, pero acá no hay pasarela de pago.
- `numero` es solo visual. El ID real es el del documento.
