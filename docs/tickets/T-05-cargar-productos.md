# T-05 · Cargar los productos existentes en Firestore

| Campo | Valor |
|---|---|
| Épica | 1 · Firebase y capa de datos |
| Prioridad | P0 |
| Estimación | 1 h |
| Dependencias | T-01 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

## Objetivo

Migrar los seis productos de `public/productos.json` a la colección `productos`, conservando todos los campos, para que T-04 tenga datos reales que mostrar.

## Plan de implementación

Crear `scripts/seed-productos.mjs`:

```js
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const productos = JSON.parse(await readFile(new URL('../public/productos.json', import.meta.url), 'utf8'))
// inicializar app con process.env.VITE_FIREBASE_*
// por cada producto: setDoc(doc(db, 'productos', String(producto.id)), { ...producto, creadoEn: serverTimestamp() })
```

Ejecución:

```bash
node --env-file=.env.local scripts/seed-productos.mjs
```

Detalles:

- Usar `setDoc` con el `id` del JSON (`"1"`…`"6"`) para que el script sea idempotente y no duplique al correrlo dos veces.
- Conservar el `id` numérico-como-string evita romper enlaces existentes `/producto/1`.
- Los productos nuevos creados desde el formulario usan el ID autogenerado de Firestore.

## Criterios de aceptación

- [ ] La colección `productos` tiene los seis documentos.
- [x] Cada documento conserva todos los campos del JSON (incluidos `notas`, `metodo` y `rinde`).
- [x] Correr el script dos veces no duplica documentos (usa `setDoc` con id fijo).
- [ ] El catálogo público muestra los seis productos desde Firestore.
- [x] Se decide y documenta si `public/productos.json` queda como respaldo o se elimina.

## Verificación manual

1. Ejecutar el script.
2. Revisar la colección en la consola de Firebase.
3. Abrir `/` y contar seis productos.
4. Abrir `/producto/1` directo: debe seguir funcionando.

## Notas

- El script es una herramienta de una sola vez, no parte del bundle. No importarlo desde `src/`.
- **Decisión:** `public/productos.json` se conserva como fuente del seed y respaldo de desarrollo. No se elimina.
- `node --env-file` requiere Node 20.6 o superior. El entorno tiene Node 24.
