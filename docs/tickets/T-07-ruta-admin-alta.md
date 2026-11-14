# T-07 · Ruta `/admin` y alta de producto

| Campo | Valor |
|---|---|
| Épica | 2 · Alta de productos |
| Prioridad | P0 |
| Estimación | 3 h |
| Dependencias | T-06, T-09 |
| Estado | ⬜ Pendiente |

## Objetivo

Que exista una ruta real de administración donde se pueda dar de alta un producto con imagen, y que funcione entrando directo en producción.

## Plan de implementación

1. Crear `src/pages/admin/AdminProducts.jsx`: listado de productos con botón "Nuevo producto".
2. Crear `src/pages/admin/AdminNuevoProducto.jsx`: usa `ProductForm`.
3. Flujo del submit:
   ```js
   if (file) imagen = await uploadProductImage(file)
   await createProduct({ ...datos, imagen, ancho: 900, alto: 900 })
   navigate('/admin', { state: { creado: true } })
   ```
4. Registrar las rutas dentro de `AdminLayout` (T-09):

| Ruta | Vista |
|---|---|
| `/admin` | Listado + acceso al alta |
| `/admin/nuevo` | Formulario de alta |

5. Verificar el deep link en Vercel. El rewrite de `vercel.json` ya existe:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Criterios de aceptación

- [ ] `/admin` existe y renderiza el panel.
- [ ] `/admin/nuevo` muestra el formulario.
- [ ] Al guardar: sube imagen → crea producto → vuelve al listado con confirmación.
- [ ] Si falla la imagen, no se crea el producto a medias.
- [ ] El deep link `https://<deploy>/admin` devuelve la app, no un 404 de Vercel.
- [ ] El producto nuevo aparece en el catálogo público sin recargar (gracias a T-04).

## Verificación manual

1. Entrar directo a `/admin` en el deploy.
2. Crear un producto con imagen.
3. Abrir `/` en otra pestaña: debe aparecer solo.
4. Recargar `/admin` con F5: no debe romperse.

## Notas

- **Dependencia real:** sin T-09 no hay dónde colgar la ruta sin arrastrar el header público. Si se quiere adelantar, se puede montar `/admin` temporalmente bajo el `Layout` actual y moverlo después.
- `ancho` y `alto` se usan para evitar saltos de layout. Si no se leen las dimensiones reales de la imagen, usar un valor fijo y anotarlo como deuda.
- El rewrite es genérico, no específico de `/admin`: no hay que tocarlo por cada ruta nueva.
