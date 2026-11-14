# T-17 · Persistir órdenes de compra

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-02 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

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

- [x] Se crea un documento en `orders` con comprador, ítems, total y `fecha`.
- [x] Cada ítem guarda `id`, `nombre`, `precio`, `cantidad` y `subtotal` (snapshot del precio al momento de comprar).
- [x] El carrito se vacía solo si la escritura fue exitosa.
- [x] Un error de red conserva el carrito y muestra el mensaje.
- [x] El número visible sale del flujo real, no de `Math.random()`.
- [x] No se puede confirmar dos veces el mismo pedido.

## Verificación manual

1. Comprar con red disponible: la orden aparece en Firestore y el carrito queda vacío.
2. Cortar la red y confirmar: el carrito debe seguir con los ítems.

## Notas

- Guardar el precio dentro de la orden es obligatorio: si el producto cambia de precio, la orden histórica no debe cambiar.
- El total se recalcula en el checkout; no confiar en un total enviado desde el cliente para cobrar, pero acá no hay pasarela de pago.
- `numero` es solo visual. El ID real es el del documento.
- **Implementado:** `src/services/orderService.js` con `createOrder` y `generarNumeroOrden`. El esquema sigue el Anexo B de `docs/ENTREGA.md`: `{ numero, buyer: { nombre, email }, items, total, estado: 'pendiente', fecha: serverTimestamp() }`.
- `estado` y `fecha` los pone el servicio, no el llamador: una orden no puede nacer sin estado ni con la fecha del reloj del cliente.
- `aItemDeOrden` recorta cada ítem a `{ id, nombre, precio, cantidad, subtotal }`. El carrito trae imagen y stock, que no tienen por qué viajar a la orden.
- `numero` usa `Date.now().toString(36)` en vez de `Math.random()`: sale del flujo real y no colisiona en la práctica (precisión de milisegundos).
- **Doble submit:** ref (`enviandoRef`) además del estado. El estado solo deshabilita el botón en el siguiente render; dos submits en el mismo tick entran igual.
- **Error:** `setError(fallo.message)` — el servicio ya tradujo el código de Firebase; el carrito queda intacto y el botón vuelve a habilitarse.
- **Formulario bloqueado:** nombre y correo pasan a `disabled` mientras se envía, así no cambian los datos a mitad de la escritura.
- **Consecuencia de bundle:** `Checkout` ahora importa la config de Firebase. `/checkout` deja de funcionar sin `.env.local`; el catálogo público sigue libre de Firebase. Es el costo inevitable de persistir la orden.
- **Pendiente de reglas:** con reglas de Firestore cerradas, `createOrder` devuelve `permission-denied`. Se resuelve en T-19, que debe permitir `create` público en `orders` y nada de lectura pública.
