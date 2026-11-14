# T-03 · Servicio de imágenes

| Campo | Valor |
|---|---|
| Épica | 1 · Firebase y capa de datos |
| Prioridad | P0 |
| Estimación | 2 h |
| Dependencias | T-01 |
| Estado | ✅ Hecho — 14/11/2026 |

## Objetivo

Resolver la subida de la imagen del producto a Firebase Storage y devolver una URL pública que se guarde en el documento de Firestore.

## Plan de implementación

Crear `src/services/imageService.js`:

```js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../config/firebase'
```

API:

| Función | Firma | Devuelve |
|---|---|---|
| `uploadProductImage` | `(file)` | `downloadURL` |
| `deleteProductImage` | `(url)` | `void` |

Detalles:

- Validar tipo: `image/jpeg`, `image/png`, `image/webp`.
- Validar tamaño: máximo 2 MB.
- Nombre único: `productos/${crypto.randomUUID()}-${nombreLimpio}`.
- `deleteProductImage` recibe la URL, extrae el path después de `/o/` y borra con `deleteObject(ref(storage, path))`. Si la URL no es de Storage, no hace nada.

## Criterios de aceptación

- [x] Rechaza archivos que no son imagen con un mensaje claro.
- [x] Rechaza archivos de más de 2 MB.
- [x] Devuelve `downloadURL` usable en `<img src>`.
- [x] El nombre del archivo es único (subir dos veces la misma imagen no pisa la anterior).
- [x] Error controlado si falla la subida, sin dejar el formulario colgado.

## Verificación manual

Subir una imagen desde el formulario, copiar la URL y abrirla en una pestaña nueva. Repetir con un PDF: debe rechazarse antes de tocar la red.

## Notas

- Subir la imagen **antes** de crear el documento del producto. Si la imagen falla, no se crea nada y no quedan productos con `imagen: ""`.
- Si se borra un producto (T-16), evaluar si conviene borrar también su imagen. No es obligatorio para la entrega.
- Las reglas de Storage (T-19) deben permitir lectura pública y escritura autenticada.
