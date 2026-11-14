# T-02 · Servicio de productos

| Campo | Valor |
|---|---|
| Épica | 1 · Firebase y capa de datos |
| Prioridad | P0 |
| Estimación | 3 h |
| Dependencias | T-01 |
| Estado | ✅ Hecho — 14/11/2026 |

## Objetivo

Concentrar todo el acceso a la colección `productos` en un módulo. Ningún componente debe importar `firebase/firestore` directamente: si mañana cambia la consulta o el backend, se toca un solo archivo.

## Plan de implementación

Crear `src/services/productService.js`:

```js
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const COLECCION = 'productos'
```

API mínima:

| Función | Firma | Devuelve |
|---|---|---|
| `subscribeProducts` | `(onData, onError)` | función para desuscribirse |
| `getProducts` | `()` | `Producto[]` |
| `getProductById` | `(id)` | `Producto \| null` |
| `createProduct` | `(datos)` | `id` del documento creado |
| `updateProduct` | `(id, datos)` | `void` |
| `deleteProduct` | `(id)` | `void` |

Detalles:

- Ordenar por `nombre` (o `creadoEn`) en la consulta, no en el componente.
- `createProduct` y `updateProduct` agregan `creadoEn` / `actualizadoEn` con `serverTimestamp()`.
- Mapear el documento a `{ ...data, id: doc.id }`.
- Propagar errores con un mensaje legible: `throw new Error('No se pudieron cargar los productos.')` conservando `cause` si hace falta.

## Criterios de aceptación

- [x] `subscribeProducts` devuelve la función de desuscripción y la llama `onSnapshot`.
- [x] `getProductById` devuelve `null` si el documento no existe.
- [x] `createProduct` agrega `creadoEn` con `serverTimestamp()`.
- [x] `updateProduct` no pisa `creadoEn`.
- [x] Ningún componente importa `firebase/firestore` directamente.
- [x] Los errores llegan con mensaje legible.

## Verificación manual

Desde una consola de Node o un test manual temporal: crear un producto, leerlo con `getProductById`, actualizarlo y borrarlo. La colección no debe quedar con basura.

## Notas

- **Decisión abierta:** IDs. Los productos actuales usan `"1"`…`"6"`. El seed de T-05 puede conservar esos IDs con `setDoc`, y los productos nuevos usar el ID autogenerado. Así no se rompen los enlaces `/producto/1` existentes.
- No agregar lógica de negocio acá (stock, precios): el servicio solo transporta datos.
