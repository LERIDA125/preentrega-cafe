# T-15 · Editar producto

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-06, T-07 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

## Objetivo

Permitir corregir un producto publicado sin borrarlo y volver a crearlo.

## Plan de implementación

1. Crear `src/pages/admin/AdminEditarProducto.jsx`.
2. Ruta `/admin/editar/:id` dentro de `AdminLayout`.
3. Cargar el producto con `getProductById(id)` y pasarlo como `initialValues` a `ProductForm`.
4. Al guardar:
   ```js
   let imagen = producto.imagen
   if (file) imagen = await uploadProductImage(file)
   await updateProduct(id, { ...datos, imagen })
   navigate('/admin', { state: { actualizado: true } })
   ```
5. Agregar el botón "Editar" en cada fila del listado.

## Criterios de aceptación

- [x] La ruta existe y el formulario viene precargado.
- [x] Guardar actualiza el documento y el catálogo público.
- [x] Si no se sube imagen nueva, se conserva la anterior.
- [x] Si el `id` no existe, se muestra un estado vacío claro.
- [x] El formulario avisa si no hubo cambios o si el guardado falló.

## Verificación manual

Editar el precio de un producto, guardar y verificar en `/` y en `/producto/:id` que se actualizó sin recargar.

## Notas

- `ProductForm` se reutiliza tal cual: si en T-06 quedó acoplado al alta, este ticket va a doler. Revisar que `initialValues` y `submitLabel` sean props reales.
- No permitir editar el `id`.
- Evaluar si borrar la imagen vieja al reemplazarla. No es obligatorio; si se hace, usar `deleteProductImage` y no romper la edición si falla el borrado.
- **Implementado:** `AdminEditarProducto` carga con `getProductById` y sólo renderiza `ProductForm` cuando el producto llegó. Motivo: `ProductForm` toma `initialValues` en el inicializador de `useState`, así que montarlo antes de tener los datos dejaría el formulario vacío para siempre.
- **Sin cambios:** la página compara los 14 campos del formulario contra el producto original (arrays por `JSON.stringify`) y, si nada cambió y no hay imagen nueva, lanza un error que `ProductForm` muestra como aviso general. No se escribe en Firestore al pedo.
- **Imagen:** se conserva la actual si no se elige archivo. Si se reemplaza, se sube la nueva, se actualiza el documento y **después** se borra la vieja con `deleteProductImage(...).catch(() => {})`: un fallo en Storage deja un archivo huérfano, no una edición rota.
- **Payload:** si el producto original no tiene imagen y tampoco se eligió una, `imagen` se omite del update para no escribir `undefined` (Firestore lo rechaza).
- **Estados:** carga (`.recargando`), error con reintento, producto inexistente con salida al listado.
- **Listado:** cada fila tiene ahora "Editar" y "Ver" dentro de `.admin-fila-acciones`; el aviso de confirmación pasó a manejar dos variantes (`creado` / `actualizado`) desde el mismo `location.state`.
- **Nota:** la ruta queda protegida por herencia porque cuelga del prefijo `/admin` que envuelve `ProtectedRoute`.
