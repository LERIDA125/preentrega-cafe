# Café de Origen

Catálogo y tienda de café de especialidad. SPA en React con Firebase (Firestore, Auth y
Storage), panel de administración protegido y gestión de pedidos en tiempo real.

- **Sitio en producción:** https://preentrega-cafe.vercel.app
- **Panel de administración:** https://preentrega-cafe.vercel.app/login

## Acceso al panel

```
Usuario:    admin@admin.com
Contraseña: admin123
```

El usuario tiene que existir en **Firebase Authentication** del proyecto. El enlace al panel
está en el pie del sitio, en "Acceso".

## Correrlo local

```bash
npm install
cp .env.example .env.local   # completar con las claves de Firebase
npm run dev
```

`npm run dev` levanta Vite en `http://localhost:5173`.

### Variables de entorno

Todas salen de la consola de Firebase → Configuración del proyecto → Tus apps → Configuración
del SDK. Sin ellas la app no arranca: `src/config/firebase.js` falla al importarse y dice
cuál falta.

| Variable | Uso |
|---|---|
| `VITE_FIREBASE_API_KEY` | SDK web |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth |
| `VITE_FIREBASE_PROJECT_ID` | Firestore |
| `VITE_FIREBASE_STORAGE_BUCKET` | Imágenes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | SDK web |
| `VITE_FIREBASE_APP_ID` | SDK web |
| `SEED_EMAIL` / `SEED_PASSWORD` | Solo para `npm run seed` |

`.env.local` está ignorado por git. La plantilla versionada es `.env.example`.

## Cargar el catálogo inicial

```bash
npm run seed
```

El script carga los productos de `public/productos.json` en la colección `productos`. Usa
`SEED_EMAIL` / `SEED_PASSWORD` para autenticarse, porque escribir en `productos` requiere
sesión iniciada (ver `firestore.rules`). Es idempotente: se puede volver a correr.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run seed` | Carga el catálogo inicial en Firestore |

## Stack

React 18.3 · React Router 6.26 · Vite 5.4 · Firebase 13.3 (Firestore, Auth, Storage) · CSS plano
con tokens. Sin TypeScript, sin librería de estado, sin librería de UI.

## Cómo está organizado

```
src/
├── App.jsx                    Rutas, providers y layouts
├── config/firebase.js         Inicialización del SDK y validación de variables
├── services/                  Único lugar que importa `firebase/*`
│   ├── productService.js      Suscripción realtime, alta, edición, baja
│   ├── orderService.js        Órdenes y descuento de stock
│   └── imageService.js        Subida y borrado de imágenes en Storage
├── context/
│   ├── DatosContext.jsx       Catálogo (onSnapshot)
│   ├── CartContext.jsx        Carrito con stock real y persistencia
│   └── AuthContext.jsx        Sesión del administrador
├── components/
│   ├── layouts/               PublicLayout y AdminLayout
│   ├── auth/                  AuthBoundary y ProtectedRoute
│   └── ...                    Catálogo, ficha, carrito, checkout
├── pages/
│   ├── Login.jsx
│   └── admin/                 Productos, alta, edición y órdenes
└── hooks/ utils/              Título por ruta, foco, formato
```

Reglas de Firestore y Storage en `firestore.rules` / `storage.rules`, desplegables con
`firebase deploy --only firestore:rules,storage`.

## Rutas

| Ruta | Qué muestra |
|---|---|
| `/` | Portada y catálogo, con filtro por categoría en la URL (`/?categoria=Calientes`) |
| `/producto/:id` | Ficha con stock, notas de cata y selector de cantidad |
| `/receta` | Calculadora de receta de la casa |
| `/carrito` | Carrito editable con confirmación de vaciado |
| `/checkout` | Datos del comprador y creación de la orden |
| `/login` | Acceso del administrador |
| `/admin` | Panel: listado de productos (protegido) |
| `/admin/nuevo` | Alta de producto (protegido) |
| `/admin/editar/:id` | Edición de producto (protegido) |
| `/admin/ordenes` | Pedidos recibidos (protegido) |

`vercel.json` reescribe todas las rutas a `index.html` para que las rutas profundas y el F5
funcionen en producción.

## Notas de implementación

- **El stock se descuenta al confirmar el pedido**, dentro de una transacción de Firestore que
  lee y valida cada producto antes de escribir. Si no alcanza, la orden no se crea y el
  carrito se conserva.
- El carrito guarda solo `id` y `cantidad`; precio y stock se leen del catálogo, así que nunca
  queda un precio viejo. Persiste en `localStorage` y se reconcilia contra el stock actual.
- La orden guarda un snapshot del nombre y el precio del momento de la compra.
- La UI protege pantallas; las reglas de Firestore protegen los datos.

## Documentación

- `docs/ENTREGA.md` — alcance, matriz de cumplimiento y decisiones.
- `docs/tickets/` — plan de implementación por ticket.
