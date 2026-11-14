# T-04 · Migrar `DatosContext` a Firestore en tiempo real

| Campo | Valor |
|---|---|
| Épica | 1 · Firebase y capa de datos |
| Prioridad | P0 |
| Estimación | 3 h |
| Dependencias | T-02, T-05 |
| Estado | ⬜ Pendiente |

## Objetivo

Que el catálogo se lea de Firestore y se actualice solo cuando se crea, edita o elimina un producto. Este es el ticket que convierte la app de catálogo estático en catálogo en tiempo real.

## Plan de implementación

Editar `src/context/DatosContext.jsx`:

1. Borrar `URL_CATALOGO`, `promesaCache` y `pedirCatalogo`.
2. Reemplazar el `useEffect` de `fetch` por `subscribeProducts`.
3. Conservar el contrato actual del contexto:

```js
{
  productos,   // Producto[]
  porId,       // Map<string, Producto>
  categorias,  // { nombre, cantidad }[]
  cargando,
  error,
  reintentar,
}
```

4. Cancelar la suscripción en el cleanup.
5. `reintentar` puede volver a suscribir (cambiar una clave de intento) o limpiar el error. No hace falta más.

## Criterios de aceptación

- [ ] Al crear un documento en Firestore, el producto aparece sin recargar.
- [ ] Al editarlo, la ficha cambia sin recargar.
- [ ] Al borrarlo, desaparece del catálogo.
- [ ] `{ productos, porId, categorias, cargando, error, reintentar }` sigue disponible.
- [ ] La suscripción se cancela al desmontar (sin warnings ni fugas).
- [ ] `ItemListContainer` e `ItemDetailContainer` **no se modifican**.
- [ ] El carrito sigue funcionando: `CartContext` depende de `porId`.

## Verificación manual

1. `npm run dev` y abrir `/`.
2. En la consola de Firebase, crear un producto de prueba.
3. Verlo aparecer en la grilla sin tocar el navegador.
4. Abrir su ficha y verificar los datos.
5. Borrarlo y confirmar que desaparece.

## Notas

- Este ticket es barato justamente porque la UI no conoce el origen de los datos. Si aparece la tentación de tocar los contenedores, revisar el diseño: algo se está filtrando mal.
- Al hidratar el carrito, `CartContext` reconcilia contra `porId`. Si Firestore tarda en llegar, `cargando` debe seguir en `true` hasta el primer snapshot para no vaciar carritos válidos.
- `public/productos.json` deja de usarse en runtime. Decidir si se conserva como respaldo (T-05).
