# T-06 · Componente `ProductForm`

| Campo | Valor |
|---|---|
| Épica | 2 · Alta de productos |
| Prioridad | P0 |
| Estimación | 4 h |
| Dependencias | T-02, T-03 |
| Estado | ✅ Hecho — 14/11/2026 |

## Objetivo

Un formulario controlado y reutilizable que sirva tanto para dar de alta como para editar un producto.

## Plan de implementación

Crear `src/components/admin/ProductForm.jsx` con props:

```js
<ProductForm
  initialValues={producto | undefined}
  onSubmit={(datos, file) => Promise<void>}
  submitLabel="Publicar producto"
  isSubmitting={false}
/>
```

Campos:

| Campo | Tipo | Validación |
|---|---|---|
| `nombre` | texto | obligatorio, mínimo 3 caracteres |
| `descripcion` | textarea | obligatoria, mínimo 10 caracteres |
| `precio` | número | obligatorio, mayor a 0 |
| `stock` | número | obligatorio, entero, mayor o igual a 0 |
| `categoria` | texto o select | obligatoria |
| `lote` | texto | obligatorio |
| `origen` | texto | obligatorio |
| `altura` | número | obligatorio, mayor a 0 |
| `variedad` | texto | obligatorio |
| `proceso` | texto | obligatorio |
| `punto` | texto | obligatorio |
| `notas` | texto | obligatorio, lista separada por comas |
| `metodo`, `rinde` | texto | opcionales (los usa la calculadora) |
| `imagen` | archivo | obligatoria solo en alta; opcional en edición |

Detalles:

- Estado local `valores` y `errores`. Validar en submit y limpiar el error del campo al escribir.
- Convertir `precio`, `stock` y `altura` a número antes de llamar a `onSubmit`.
- Convertir `notas` a array: `texto.split(',').map(n => n.trim()).filter(Boolean)`.
- Reutilizar las clases existentes de `index.css` (`.campo`, `.campo-etiqueta`, `.campo-ayuda`, `.boton`).
- No subir la imagen acá: el formulario entrega el `File` y la página decide.

## Criterios de aceptación

- [x] Todos los campos obligatorios muestran error inline.
- [x] Precio, stock y altura aceptan solo números válidos.
- [x] `notas` se entrega como array.
- [x] El formulario sirve para alta y edición con `initialValues`.
- [x] Envío bloqueado mientras `isSubmitting`; sin doble submit.
- [x] Los errores no borran lo que el usuario cargó.
- [x] Navegable con teclado, con `<label>` asociado a cada input.

## Verificación manual

Abrir el formulario, intentar enviar vacío y ver todos los errores. Completar, enviar y confirmar que `onSubmit` recibe números y arrays, no strings.

## Notas

- Es el ticket más largo de la épica. Si el tiempo aprieta, priorizar los campos que el catálogo realmente usa al renderizar (`nombre`, `descripcion`, `precio`, `imagen`, `categoria`, `stock`) y dejar los de dominio con valores por defecto.
- No inventar un sistema de formularios: con `useState` alcanza y el proyecto no tiene dependencias de ese tipo.
