# T-15 · Editar producto

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional |
| Prioridad | P2 |
| Estimación | 3 h |
| Dependencias | T-06, T-07 |
| Estado | ⬜ Pendiente |

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

- [ ] La ruta existe y el formulario viene precargado.
- [ ] Guardar actualiza el documento y el catálogo público.
- [ ] Si no se sube imagen nueva, se conserva la anterior.
- [ ] Si el `id` no existe, se muestra un estado vacío claro.
- [ ] El formulario avisa si no hubo cambios o si el guardado falló.

## Verificación manual

Editar el precio de un producto, guardar y verificar en `/` y en `/producto/:id` que se actualizó sin recargar.

## Notas

- `ProductForm` se reutiliza tal cual: si en T-06 quedó acoplado al alta, este ticket va a doler. Revisar que `initialValues` y `submitLabel` sean props reales.
- No permitir editar el `id`.
- Evaluar si borrar la imagen vieja al reemplazarla. No es obligatorio; si se hace, usar `deleteProductImage` y no romper la edición si falla el borrado.
