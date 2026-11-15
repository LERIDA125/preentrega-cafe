# Evaluación de la entrega — Café de Origen

| Campo | Valor |
|---|---|
| Proyecto | `preentrega-cafe` — Café de Origen |
| Repositorio | https://github.com/LERIDA125/preentrega-cafe |
| Deploy | Vercel (`preentrega-cafe`) |
| Fecha de evaluación | 14/11/2026 · actualizado 15/11/2026 |
| Alcance evaluado | Pre-entrega + entrega mínima + entrega completa + extra opcional |
| Documento | `docs/ENTREGA.md` |

---

## 1. Resumen ejecutivo

El proyecto **cumple la pre-entrega, la entrega mínima, la entrega completa y el extra
opcional**. Es una aplicación de catálogo y carrito sobre Firestore en tiempo real, con panel
de administración autenticado y gestión de órdenes de compra.

| Bloque | Cumplido | Total | Estado |
|---|---|---|---|
| Pre-entrega | 4 | 4 | ✅ Completo |
| Entrega mínima | 7 | 7 | ✅ Completo |
| Entrega completa | 5 | 5 | ✅ Completo |
| Extra opcional | 3 | 3 | ✅ Completo |

**Verificación del 15/11/2026**

- `npm run build` pasa sin errores.
- El deploy de Vercel responde `200` con `index.html` en `/`, `/admin`, `/admin/nuevo`,
  `/login`, `/carrito` y `/producto/:id`: el rewrite cubre las rutas profundas y el F5.
- Las credenciales `admin@admin.com` / `admin123` inician sesión contra el proyecto de Firebase.

**Conclusión:** la arquitectura está terminada. La capa de datos vive en `src/services/` y
ningún componente importa `firebase/*`; los contextos (`DatosContext`, `CartContext`,
`AuthContext`) exponen el contrato que consumen las vistas. Cambiar el backend no toca la UI.

**Deuda conocida (no exigida por la consigna):** tests automatizados, lint configurado, y el
descuento de stock en una Cloud Function — hoy lo hace una transacción del cliente con una
regla de Firestore acotada a ese único campo.

---

## 2. Alcance de referencia

La consigna del laboratorio final define cuatro capas acumulativas:

1. **Pre-entrega (base del laboratorio):** listado de productos, detalle y carrito con contexto.
2. **Entrega mínima:** lo anterior + vista de productos en carrito, alta de productos funcionando, contenedores conectados a Firebase en tiempo real, config de Firebase, servicios de productos e imagen, y `_redirects` o `vercel.json` para que `/admin` funcione en producción.
3. **Entrega completa:** todo lo mínimo + separación `PublicLayout` / `AdminLayout`, login del administrador con usuario predeterminado en Firebase, `AuthContext` y `ProtectedRoute`.
4. **Extra opcional:** CRUD completo (editar y eliminar productos) y lista de órdenes de compra.

Credenciales que el docente va a usar para corregir:

```
Usuario:    admin@admin.com
Contraseña: admin123
```

Si se usan otras credenciales, hay que informarlas en el espacio de entrega. Si no se informa nada, se corrige con ese usuario.

---

## 3. Matriz de cumplimiento

> **Estados:** ✅ implementado y verificado en el código.

### 3.1 Pre-entrega

| # | Requisito | Estado | Evidencia |
|---|---|---|---|
| PE-1 | Listado de productos | ✅ | `src/components/ItemListContainer/ItemListContainer.jsx`, `ItemList`, `Item` |
| PE-2 | Detalle de producto | ✅ | `src/components/ItemDetailContainer/ItemDetailContainer.jsx`, `ItemDetail`, ruta `/producto/:id` |
| PE-3 | Carrito con Context | ✅ | `src/context/CartContext.jsx` |
| PE-4 | Navegación con rutas | ✅ | `src/App.jsx` (React Router 6) |

### 3.2 Entrega mínima

| # | Requisito | Estado | Evidencia / brecha |
|---|---|---|---|
| EM-1 | Vista de productos en carrito | ✅ | `src/components/Carrito/Carrito.jsx` |
| EM-2 | Componente de alta de productos funcionando | ✅ | `ProductForm` → `uploadProductImage` → `createProduct`, con rollback si falla el documento |
| EM-3 | `ItemListContainer` conectado a Firebase en tiempo real | ✅ | `DatosContext` → `subscribeProducts` (`onSnapshot`) |
| EM-4 | `ItemDetailContainer` conectado a Firebase | ✅ | Resuelve del `porId` del mismo snapshot, sin consulta extra |
| EM-5 | Archivo de configuración de Firebase | ✅ | `src/config/firebase.js` + `.env.example`, con validación de variables faltantes |
| EM-6 | Servicios de productos e imagen | ✅ | `productService.js`, `imageService.js` y `orderService.js`, ejecutados contra el proyecto real |
| EM-7 | `vercel.json` / `_redirects` para `/admin` en producción | ✅ | Rewrite en `vercel.json`; `/admin` y `/admin/nuevo` responden 200 con `index.html` en el deploy |

> **Sobre EM-7:** verificado el 15/11/2026 contra el deploy de Vercel. Las rutas profundas devuelven `index.html`, así que recargar con F5 no rompe.

### 3.3 Entrega completa

| # | Requisito | Estado | Evidencia / brecha |
|---|---|---|---|
| EC-1 | Separación `PublicLayout` / `AdminLayout` | ✅ | Rutas anidadas con `Outlet`; el panel no arrastra header ni footer públicos |
| EC-2 | Login del administrador | ✅ | `src/pages/Login.jsx` + `/login`, con retorno al destino original |
| EC-3 | Usuario `admin@admin.com` / `admin123` creado en Firebase | ✅ | Verificado contra Firebase Auth; documentado en `README.md` |
| EC-4 | `AuthContext` | ✅ | `src/context/AuthContext.jsx` + `AuthBoundary` |
| EC-5 | `ProtectedRoute` | ✅ | `src/components/auth/ProtectedRoute.jsx`; espera la sesión antes de redirigir |
| EC-6 | Dashboard de administración (opcional) | — | No implementado; la consigna lo marca opcional y `/admin` arranca en el listado de productos |

### 3.4 Extra opcional

| # | Requisito | Estado | Evidencia / brecha |
|---|---|---|---|
| EX-1 | Editar productos | ✅ | `/admin/editar/:id` con `ProductForm` reutilizado; conserva la imagen si no se sube otra |
| EX-2 | Eliminar productos | ✅ | Acción "Eliminar" con confirmación en dos pasos y limpieza de Storage |
| EX-3 | Lista de órdenes de compra | ✅ | `/admin/ordenes` con suscripción por `fecha desc` y detalle de ítems |

### 3.5 Cumplido y no exigido (valor agregado)

| Aspecto | Dónde | Por qué suma |
|---|---|---|
| Stock real en el carrito | `CartContext.jsx` | Valida al agregar, al cambiar cantidad y al hidratar desde `localStorage` |
| Persistencia y reconciliación del carrito | `CartContext.jsx` | Un carrito viejo se ajusta al stock actual y avisa qué se quitó |
| Descuento de stock transaccional | `orderService.js` | La orden y el descuento son una sola operación: no se puede sobrevender |
| Checkout con formulario y confirmación | `Checkout.jsx` | Completa el flujo de compra |
| Confirmación en dos pasos al vaciar | `Carrito.jsx` | Evita una acción destructiva por accidente |
| `ErrorBoundary` | `ErrorBoundary.jsx` | Evita pantalla en blanco ante un error de render |
| Lazy loading por ruta + `Suspense` | `App.jsx` | El catálogo entra en el bundle inicial; el resto se difiere |
| Accesibilidad | `PublicLayout.jsx`, `Item.jsx`, `ItemDetail.jsx`, `Carrito.jsx` | Foco al cambiar de ruta, `aria-live`, `role`, textos para lectores de pantalla |
| Filtro por categoría en la URL | `ItemListContainer.jsx` | Compartible, sobrevive al refresh, botón atrás funcional |
| Título de pestaña por ruta | `hooks/useTitulo.js` | SEO y orientación del usuario |
| Dominio de café | `CalculadoraReceta`, `CurvaTueste`, `utils/brew.js`, `utils/roast.js` | Identidad propia del proyecto |
| Rewrite SPA en Vercel | `vercel.json` | Ruteo profundo en producción |

---

## 4. Arquitectura de partida

> Esta sección describe el proyecto **como llegó**, antes de la implementación. El árbol actual y el estado de cada pieza están en la sección 7; las carpetas `src/services/`, `src/components/layouts/` y `src/components/auth/` no existían en ese momento.

```
src/
├── App.jsx                  Rutas y providers
├── main.jsx                 Entry point
├── context/
│   ├── DatosContext.jsx     Catálogo (hoy: fetch de /productos.json)
│   └── CartContext.jsx      Carrito + stock + persistencia
├── components/
│   ├── Layout/              Único layout público
│   ├── Header/ Footer/      Chrome del sitio
│   ├── NavBar/              Nav + CartWidget
│   ├── Portada/             Hero
│   ├── ItemListContainer/   Catálogo + filtro
│   ├── ItemList/ Item/      Grilla y celda
│   ├── ItemDetailContainer/ Detalle por id
│   ├── ItemDetail/          Ficha
│   ├── Carrito/             Vista de carrito
│   ├── Checkout/            Flujo de compra
│   ├── CalculadoraReceta/   Extra de dominio
│   ├── CurvaTueste/         Extra de dominio
│   ├── ErrorBoundary/       Red de seguridad
│   └── NoEncontrado/        404
├── hooks/useTitulo.js
└── utils/                   format, brew, roast
```

**Flujo de datos actual**

```
public/productos.json
        │ fetch (cacheado a nivel de módulo)
        ▼
DatosContext ──► ItemListContainer ──► ItemList ──► Item
        │
        └────────► ItemDetailContainer ──► ItemDetail
        │
CartContext (localStorage) ──► Carrito ──► Checkout
```

**Diagnóstico técnico**

- La capa de datos está aislada en `DatosContext`. Los componentes no conocen el origen.
- `DatosContext` ya expone `productos`, `porId`, `categorias`, `cargando`, `error` y `reintentar`. Ese contrato se puede conservar con Firestore.
- `CartContext` solo guarda `id` y `cantidad`; precio y stock se leen del catálogo. Al migrar a Firestore, el carrito sigue funcionando sin cambios.
- `src/config/firebase.js` ya existía al auditar (T-01), pero no había capa de servicios ni conexión activa: nada importaba la config.
- No hay variables de entorno de Firebase. `.env.local` solo contiene `VERCEL_OIDC_TOKEN`.
- No hay tests, lint ni documentación previa.

**Consecuencia:** el esfuerzo real está en agregar la capa de servicios y la de autenticación, no en reescribir la UI.

---

## 5. Historias de usuario

Formato: *Como \<rol\>, quiero \<acción\> para \<beneficio\>.*

| ID | Historia | Estado | Tickets |
|---|---|---|---|
| US-01 | Como visitante, quiero ver el catálogo de cafés para elegir qué comprar. | ✅ | — |
| US-02 | Como visitante, quiero filtrar por categoría para encontrar lo que busco. | ✅ | — |
| US-03 | Como visitante, quiero ver la ficha de un producto para conocer origen, proceso y stock. | ✅ | — |
| US-04 | Como visitante, quiero agregar unidades al carrito respetando el stock para no pedir algo que no existe. | ✅ | — |
| US-05 | Como visitante, quiero conservar el carrito al recargar para no perder la selección. | ✅ | — |
| US-06 | Como visitante, quiero cambiar cantidades, quitar ítems y vaciar el carrito para controlar mi compra. | ✅ | — |
| US-07 | Como visitante, quiero confirmar el pedido con mis datos para terminar la compra. | ✅ | T-17 |
| US-08 | Como administrador, quiero iniciar sesión para acceder al panel. | ✅ | T-09, T-10, T-11 (falta T-14) |
| US-09 | Como administrador, quiero dar de alta un producto con imagen para publicarlo en el catálogo. | ✅ | T-01…T-08 |
| US-10 | Como visitante, quiero ver el producto nuevo sin recargar para confirmar que se publicó. | ✅ | T-04 |
| US-11 | Como administrador, quiero que el panel esté protegido para que nadie publique sin permiso. | ✅ | T-12 |
| US-12 | Como administrador, quiero editar y eliminar productos para corregir el catálogo. | ✅ | T-15, T-16 (el reflejo en el sitio depende de T-04) |
| US-13 | Como administrador, quiero ver las órdenes de compra para gestionar los pedidos. | ✅ | T-17, T-18 |
| US-14 | Como visitante, quiero que `/admin` funcione al entrar directo en producción para no ver un 404. | ✅ | T-07 (ruta) + rewrite existente |
| US-15 | Como docente, quiero entrar con `admin@admin.com` / `admin123` para verificar el alta. | ✅ | T-14 |

---

## 6. Casos de uso

### CU-01 · Navegar el catálogo

- **Actor:** visitante.
- **Precondición:** ninguno.
- **Flujo principal:** entra a `/` → ve portada y catálogo → elige una categoría → ve la grilla filtrada → entra a `/producto/:id`.
- **Alternativos:** catálogo vacío en la categoría → mensaje y botón "Ver todo"; error de red → "Reintentar"; id inexistente → "Ese producto no existe".
- **Estado:** ✅ implementado.

### CU-02 · Comprar

- **Actor:** visitante.
- **Precondición:** catálogo cargado.
- **Flujo principal:** abre ficha → ajusta cantidad → agrega al carrito → revisa `/carrito` → va a `/checkout` → completa nombre y correo → confirma → recibe número de pedido.
- **Alternativos:** sin stock → botón deshabilitado con motivo; cantidad mayor al stock → se agrega lo disponible y se avisa; carrito vacío en checkout → mensaje con link al catálogo.
- **Postcondición:** carrito vacío y pedido confirmado en pantalla.
- **Estado:** ✅ implementado. La orden se persiste en `orders` y el stock se descuenta en la misma transacción.

### CU-03 · Alta de producto

- **Actor:** administrador autenticado.
- **Precondición:** sesión iniciada y `/admin` habilitado.
- **Flujo principal:** entra a `/admin` → "Nuevo producto" → completa nombre, descripción, precio, categoría, stock y datos de origen → sube imagen → envía → se crea el documento en Firestore → vuelve al listado con confirmación → el producto aparece en el catálogo público sin recargar.
- **Alternativos:** campos inválidos → errores inline y envío bloqueado; falla la subida de imagen → no se crea el producto y se muestra el error; sin sesión → redirección a `/login`.
- **Postcondición:** documento nuevo en `productos` con `creadoEn`.
- **Estado:** ✅ implementado.

### CU-04 · Iniciar sesión

- **Actor:** administrador.
- **Flujo principal:** entra a `/login` → ingresa `admin@admin.com` / `admin123` → `AuthContext` actualiza el usuario → redirección a `/admin`.
- **Alternativos:** credenciales inválidas → mensaje genérico sin filtrar qué campo falló; sesión existente → redirección automática a `/admin`; acceso directo a `/admin` sin sesión → redirección a `/login` y vuelta al destino original.
- **Estado:** ✅ implementado.

### CU-05 · Editar y eliminar producto

- **Actor:** administrador autenticado.
- **Flujo principal:** entra a `/admin` → elige producto → edita campos → guarda → se actualiza la ficha pública. Para eliminar: acción destructiva → confirmación → se borra el documento.
- **Estado:** ✅ implementado (extra opcional).

### CU-06 · Ver órdenes de compra

- **Actor:** administrador autenticado.
- **Flujo principal:** entra a `/admin/ordenes` → ve las órdenes ordenadas por fecha con comprador, ítems y total.
- **Precondición:** las órdenes se persisten al confirmar el checkout (T-17).
- **Estado:** ✅ implementado (extra opcional).

---

## 7. Backlog de tickets

**Backlog operativo:** cada ticket está desglosado en un archivo propio dentro de [`docs/tickets/`](tickets/README.md), con plan de implementación y verificación manual. Este documento resume el alcance; los tickets son la fuente de verdad para ejecutar.

Convenciones:

- **Prioridad:** `P0` bloqueante para la entrega, `P1` necesario para la entrega completa, `P2` extra opcional.
- **Estimación:** horas de trabajo efectivo, sin contar investigación.
- **Definición de terminado (DoD) común:** `npm run build` pasa, funciona en el deploy de Vercel, sin errores en consola, responsive y navegable con teclado.

### Épica 1 · Firebase y capa de datos

#### T-01 · Configurar Firebase y variables de entorno

- **Prioridad:** P0 · **Estimación:** 2 h · **Depende de:** — · **Estado:** ✅ Hecho
- **Qué:** agregar `firebase` a `package.json` y crear `src/config/firebase.js` que inicialice `app`, `db` (Firestore), `auth` y `storage`.
- **Archivos:** `package.json`, `src/config/firebase.js`, `.env.example`, `.gitignore`.
- **Criterios de aceptación:**
  - [x] `firebase` instalado y el build compila.
  - [x] El módulo exporta `app`, `db`, `auth` y `storage`.
  - [x] Las claves se leen de `import.meta.env.VITE_FIREBASE_*`, nunca hardcodeadas.
  - [x] `.env.example` documenta las seis variables requeridas.
  - [x] `.env.local` sigue ignorado por git.
- **Gotcha detectado:** `.gitignore` tiene `.env*`, así que `.env.example` también queda ignorado. Hay que agregar `!.env.example` o el archivo nunca se versiona.

#### T-02 · Servicio de productos

- **Prioridad:** P0 · **Estimación:** 3 h · **Depende de:** T-01 · **Estado:** ✅ Hecho
- **Qué:** crear `src/services/productService.js` con `getProducts`, `subscribeProducts`, `getProductById`, `createProduct`, `updateProduct` y `deleteProduct`.
- **Criterios de aceptación:**
  - [x] `subscribeProducts(callback)` devuelve la función de desuscripción.
  - [x] `createProduct` agrega `creadoEn` con `serverTimestamp()`.
  - [x] Ningún componente importa `firebase/firestore` directamente.
  - [x] Los errores se propagan con mensaje legible.

#### T-03 · Servicio de imágenes

- **Prioridad:** P0 · **Estimación:** 2 h · **Depende de:** T-01 · **Estado:** ✅ Hecho
- **Qué:** crear `src/services/imageService.js` con `uploadProductImage(file)` que suba a Storage y devuelva la URL pública.
- **Criterios de aceptación:**
  - [x] Valida tipo (`image/*`) y tamaño máximo (por ejemplo 2 MB).
  - [x] Devuelve `downloadURL`.
  - [x] Nombre de archivo único para no pisar imágenes.
  - [x] Error controlado si falla la subida.

#### T-04 · Migrar `DatosContext` a Firestore en tiempo real

- **Prioridad:** P0 · **Estimación:** 3 h · **Depende de:** T-02, T-05 · **Estado:** ✅ Hecho
- **Qué:** reemplazar `fetch('/productos.json')` por una suscripción `onSnapshot` a la colección `productos`.
- **Archivos:** `src/context/DatosContext.jsx`.
- **Criterios de aceptación:**
  - [x] Un producto nuevo aparece en el catálogo sin recargar.
  - [x] Se conserva el contrato `{ productos, porId, categorias, cargando, error, reintentar }`.
  - [x] La suscripción se cancela al desmontar.
  - [x] Las categorías se recalculan solas.
  - [x] `ItemListContainer` e `ItemDetailContainer` no se modifican.

#### T-05 · Cargar los productos existentes en Firestore

- **Prioridad:** P0 · **Estimación:** 1 h · **Depende de:** T-01 · **Estado:** ✅ Hecho
- **Qué:** migrar los seis productos de `public/productos.json` a la colección `productos`, conservando todos los campos.
- **Criterios de aceptación:**
  - [x] La colección tiene los seis documentos.
  - [x] Los `id` de Firestore reemplazan a los `id` numéricos sin romper rutas.
  - [x] El catálogo público muestra los seis productos desde Firestore.
  - [x] Se decide y documenta si `public/productos.json` queda como respaldo o se elimina.

### Épica 2 · Alta de productos

#### T-06 · Componente `ProductForm`

- **Prioridad:** P0 · **Estimación:** 4 h · **Depende de:** T-02, T-03 · **Estado:** ✅ Hecho
- **Qué:** formulario controlado con nombre, descripción, precio, categoría, stock, lote, origen, altura, variedad, proceso, punto, notas e imagen.
- **Criterios de aceptación:**
  - [x] Todos los campos obligatorios tienen validación con mensaje inline.
  - [x] Precio y stock aceptan solo números positivos.
  - [x] `notas` se carga como lista separada por comas.
  - [x] El formulario es reutilizable para alta y edición.
  - [x] Envío bloqueado mientras se procesa; sin doble submit.

#### T-07 · Ruta `/admin` y alta de producto

- **Prioridad:** P0 · **Estimación:** 3 h · **Depende de:** T-06, T-09 · **Estado:** ✅ Hecho
- **Qué:** crear la vista de administración con el formulario, subir la imagen y crear el documento.
- **Criterios de aceptación:**
  - [x] `/admin` existe y renderiza el panel.
  - [x] Al guardar: sube imagen → crea producto → vuelve al listado con confirmación.
  - [x] El deep link `/admin` funciona en el deploy de Vercel (el rewrite ya existe).
  - [x] Si falla la imagen, no se crea el producto a medias.

#### T-08 · Estados de carga, error y éxito

- **Prioridad:** P0 · **Estimación:** 1 h · **Depende de:** T-07 · **Estado:** ✅ Hecho
- **Qué:** feedback visible en todo el flujo de alta.
- **Criterios de aceptación:**
  - [x] Botón con estado "Guardando…" y deshabilitado.
  - [x] Error de Firebase traducido a mensaje entendible.
  - [x] Confirmación visible y accesible (`role="status"`).
  - [x] Los errores no borran lo que el usuario ya cargó.

### Épica 3 · Layouts y autenticación

#### T-09 · Separar `PublicLayout` y `AdminLayout`

- **Prioridad:** P1 · **Estimación:** 3 h · **Depende de:** — · **Estado:** ✅ Hecho
- **Qué:** partir `Layout.jsx` en dos layouts con `Outlet` de React Router.
- **Criterios de aceptación:**
  - [x] `/admin/*` no muestra el header ni el footer públicos.
  - [x] Las rutas públicas conservan el comportamiento actual (foco, scroll, títulos).
  - [x] `AdminLayout` tiene navegación propia (productos, órdenes, salir).
  - [x] No se duplica la lógica de accesibilidad.

#### T-10 · `AuthContext`

- **Prioridad:** P1 · **Estimación:** 3 h · **Depende de:** T-01 · **Estado:** ✅ Hecho
- **Qué:** contexto con `user`, `cargando`, `login(email, password)` y `logout()`.
- **Criterios de aceptación:**
  - [x] Usa `onAuthStateChanged`.
  - [x] La sesión sobrevive a un refresh.
  - [x] La suscripción se limpia al desmontar.
  - [x] `useAuth` lanza error claro si falta el provider.

#### T-11 · Pantalla de login

- **Prioridad:** P1 · **Estimación:** 2 h · **Depende de:** T-10, T-09 · **Estado:** ✅ Hecho
- **Qué:** formulario de correo y contraseña, con redirección a `/admin`.
- **Criterios de aceptación:**
  - [x] Error genérico para credenciales inválidas.
  - [x] Si ya hay sesión, redirige a `/admin`.
  - [x] Respeta `location.state.from` para volver al destino original.
  - [x] Accesible por teclado y con `autoComplete` correcto.

#### T-12 · `ProtectedRoute`

- **Prioridad:** P1 · **Estimación:** 2 h · **Depende de:** T-10 · **Estado:** ✅ Hecho
- **Qué:** componente que envuelve las rutas de administración.
- **Criterios de aceptación:**
  - [x] Sin sesión redirige a `/login`.
  - [x] Mientras carga la sesión muestra un estado de espera, no un flash de login.
  - [x] Con sesión renderiza el contenido.
  - [x] Protege alta, edición y órdenes.

#### T-13 · Navegación de administración y logout

- **Prioridad:** P1 · **Estimación:** 1 h · **Depende de:** T-09, T-10 · **Estado:** ✅ Hecho
- **Qué:** barra del panel con enlaces y botón "Salir".
- **Criterios de aceptación:**
  - [x] Logout cierra sesión y redirige a `/`.
  - [x] El header público no muestra enlaces de administración.
  - [x] El estado activo se marca con `NavLink`.

#### T-14 · Crear el usuario administrador

- **Prioridad:** P1 · **Estimación:** 1 h · **Depende de:** T-01
- **Qué:** crear en Firebase Authentication el usuario `admin@admin.com` con contraseña `admin123` y documentarlo.
- **Criterios de aceptación:**
  - [x] El usuario existe y puede iniciar sesión.
  - [x] Credenciales documentadas en este archivo y en el espacio de entrega.
  - [x] Se indica en la entrega si se agregaron otros usuarios.

### Épica 4 · Extra opcional

#### T-15 · Editar producto

- **Prioridad:** P2 · **Estimación:** 3 h · **Depende de:** T-06, T-07 · **Estado:** ✅ Hecho
- **Criterios de aceptación:**
  - [x] Ruta `/admin/editar/:id` con el formulario precargado.
  - [x] Guardar actualiza el documento y el catálogo público.
  - [x] La imagen anterior se conserva si no se sube una nueva.

#### T-16 · Eliminar producto

- **Prioridad:** P2 · **Estimación:** 2 h · **Depende de:** T-07 · **Estado:** ✅ Hecho
- **Criterios de aceptación:**
  - [x] Confirmación explícita antes de borrar.
  - [x] El producto desaparece del catálogo en tiempo real.
  - [x] El carrito de un visitante que lo tenía se reconcilia sin romperse.

#### T-17 · Persistir órdenes de compra

- **Prioridad:** P2 · **Estimación:** 3 h · **Depende de:** T-02 · **Estado:** ✅ Hecho
- **Qué:** `orderService.createOrder()` y conectar el checkout.
- **Criterios de aceptación:**
  - [x] Se crea un documento en `orders` con comprador, ítems, total y `serverTimestamp()`.
  - [x] El carrito se vacía **solo** si la escritura fue exitosa.
  - [x] Un error de red conserva el carrito y muestra el mensaje.
  - [x] El número de pedido visible sale del documento, no de `Math.random()`.

#### T-18 · Lista de órdenes en el panel

- **Prioridad:** P2 · **Estimación:** 3 h · **Depende de:** T-17, T-09 · **Estado:** ✅ Hecho
- **Criterios de aceptación:**
  - [x] `/admin/ordenes` lista las órdenes por fecha descendente.
  - [x] Muestra comprador, cantidad de ítems, total y fecha.
  - [x] Se actualiza en tiempo real.
  - [x] Estado vacío claro cuando no hay órdenes.

#### T-19 · Reglas de seguridad de Firestore (recomendado)

- **Prioridad:** P2 · **Estimación:** 1 h · **Depende de:** T-01 · **Estado:** ✅ Hecho
- **Qué:** `productos` con lectura pública y escritura autenticada —salvo el descuento de stock—; `orders` con creación pública validada y lectura solo autenticada. Storage: lectura pública de imágenes, subida y borrado con sesión.
- **Criterios de aceptación:**
  - [x] Un visitante no puede publicar, renombrar, cambiar el precio ni borrar un producto.
  - [x] Un visitante solo puede **bajar** `stock`, como entero y nunca por debajo de cero (`descuentaStock()`), porque la compra no exige cuenta.
  - [x] Un visitante no puede leer `orders`.
  - [x] El panel sigue funcionando con la sesión del administrador.
- **Nota:** no está en la consigna, pero un evaluador técnico lo va a mirar. El límite conocido —un cliente hostil podría bajar stock sin comprar— se cierra definitivamente con una Cloud Function.

---

## 8. Orden de implementación

| Etapa | Tickets | Resultado |
|---|---|---|
| 1 · Base de datos | T-01, T-02, T-03, T-05, T-04 | Catálogo leído de Firestore en tiempo real |
| 2 · Alta | T-06, T-07, T-08 | Entrega mínima completa |
| 3 · Acceso | T-09, T-10, T-11, T-12, T-13, T-14 | Entrega completa |
| 4 · Extras | T-17, T-18, T-15, T-16 | CRUD y órdenes |
| 5 · Cierre | T-19 + checklist de la sección 10 | Entrega verificada en producción |

Ruta crítica: **T-01 → T-02 → T-05 → T-04 → T-06 → T-07**. Todo lo demás puede ir en paralelo o después.

---

## 9. Riesgos y decisiones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Credenciales de Firebase en el repositorio | Seguridad | Variables `VITE_*` en `.env.local`; plantilla sin valores en `.env.example` |
| `.env.example` ignorado por `.env*` | No se versiona la plantilla | Resuelto: `!.env.example` en `.gitignore` |
| Subida de imagen que falla después de crear el producto | Datos inconsistentes | Resuelto: se sube primero la imagen; si falla, no se crea el documento |
| Carrito con productos borrados | Error en la vista | `CartContext` reconcilia y avisa qué se quitó |
| `/admin` responde 404 en Vercel | Requisito EM-7 incompleto | Resuelto: rewrite verificado, `/admin` y `/admin/nuevo` devuelven 200 |
| El docente no puede entrar | Entrega no verificable | Resuelto: `admin@admin.com` / `admin123` verificado contra Firebase Auth |
| Descuento de stock hecho por el cliente | Un cliente hostil puede bajar stock sin comprar | Regla acotada a `stock` (entero, decreciente, ≥ 0). Cierre definitivo: Cloud Function |
| Datos de Firestore sin orden | Catálogo inestable | `orderBy('nombre')` en el catálogo y `orderBy('fecha', 'desc')` en las órdenes |

Decisiones tomadas:

1. **ID del producto:** el documento de Firestore es la fuente de verdad. El seed conserva los IDs `1`…`6` con `setDoc`, así los enlaces existentes siguen funcionando; los productos nuevos usan el ID autogenerado.
2. **Imagen:** Storage, porque la consigna pide un "servicio de imagen". `imageService` valida tipo y tamaño en cliente y `storage.rules` repite la validación del lado del servidor.
3. **`public/productos.json`:** queda como fuente del seed (`npm run seed`), no como respaldo de lectura. La app lee siempre de Firestore.
4. **Dashboard:** la consigna lo marca opcional. El panel arranca en el listado de productos, que ya incluye alta, edición, baja y acceso a órdenes.
5. **Stock:** se descuenta en una transacción de cliente porque la compra no exige cuenta. La regla de Firestore acota la escritura a ese único campo.

---

## 10. Checklist de entrega

**Funcional**

- [x] El catálogo se lee de Firestore.
- [x] El detalle se lee de Firestore.
- [x] Un producto nuevo se ve sin recargar.
- [x] El alta funciona con imagen.
- [x] `/admin` entra directo en producción.
- [x] Login con `admin@admin.com` / `admin123`.
- [x] `/admin` está protegido sin sesión.
- [x] Layouts público y admin separados.
- [x] El carrito y el checkout siguen funcionando después de la migración.

**Entrega**

- [x] `npm run build` sin errores.
- [x] Deploy actualizado en Vercel.
- [x] Link del repo y del deploy informados.
- [x] Credenciales del administrador informadas.
- [x] `README` con instrucciones de instalación y variables de entorno.
- [x] `public/productos.json` y `docs/` en un estado coherente.

---

## Anexo A · Evidencia técnica

| Afirmación | Verificación |
|---|---|
| Firebase está conectado | `src/config/firebase.js` inicializa `app`, `db`, `auth` y `storage` desde `VITE_FIREBASE_*` |
| El catálogo es remoto y realtime | `src/context/DatosContext.jsx` → `subscribeProducts()` (`onSnapshot`), sin `fetch` |
| El detalle sale del mismo snapshot | `ItemDetailContainer` resuelve con el `porId` del contexto |
| Hay dos layouts | `src/App.jsx` anida las rutas públicas en `PublicLayout` y las de `/admin` en `AdminLayout` |
| `/admin` existe y está protegido | `src/App.jsx` → `<Route element={<ProtectedRoute />}>` con `/admin`, `/admin/nuevo`, `/admin/editar/:id`, `/admin/ordenes` |
| El rewrite existe y responde | `vercel.json:2` → `{"source":"/(.*)","destination":"/index.html"}`; `/admin` devuelve 200 con `index.html` |
| El checkout persiste | `src/services/orderService.js` → `createOrder()` escribe en `orders` con `serverTimestamp()` |
| El stock baja al comprar | `createOrder()` usa `runTransaction`: lee, valida y descuenta en la misma operación |
| El total no lo manda el cliente | `createOrder()` recalcula precio y total con los documentos leídos |
| Las reglas de datos existen | `firestore.rules` (productos, órdenes y `descuentaStock()`) y `storage.rules` (imágenes) |
| Hay credenciales de Firebase | `.env.local` contiene las seis `VITE_FIREBASE_*`; `.env.example` versiona la plantilla |
| El carrito persiste | `src/context/CartContext.jsx` → `localStorage.setItem(...)` |
| El carrito respeta stock | `src/context/CartContext.jsx` reconcilia contra el catálogo al hidratar y al cambiar cantidades |

## Anexo B · Modelo de datos propuesto

**Colección `productos`**

```js
{
  id: "<docId>",
  nombre: "Espresso de Especialidad",
  descripcion: "Intenso y con cuerpo...",
  precio: 2500,
  imagen: "https://firebasestorage.googleapis.com/...",
  ancho: 900,
  alto: 600,
  categoria: "Calientes",
  stock: 25,
  lote: "063",
  origen: "Colombia, Huila",
  altura: 1750,
  variedad: "Caturra, Castillo",
  proceso: "Lavado",
  punto: "Oscuro",
  notas: ["Cacao", "Panela", "Especias"],
  metodo: "espresso",
  rinde: "36 g de espresso en 28 segundos",
  creadoEn: "<serverTimestamp>",
  actualizadoEn: "<serverTimestamp>"
}
```

**Colección `orders`**

```js
{
  id: "<docId>",
  numero: "CDO-8F3K2A",
  buyer: { nombre: "Ana", email: "ana@mail.com" },
  items: [
    { id: "<docId>", nombre: "Espresso de Especialidad", precio: 2500, cantidad: 2, subtotal: 5000 }
  ],
  total: 5000,
  estado: "pendiente",
  fecha: "<serverTimestamp>"
}
```

---

*Documento generado como base para el backlog de la entrega final. Los tickets detallados se desarrollan a partir de la sección 7.*
