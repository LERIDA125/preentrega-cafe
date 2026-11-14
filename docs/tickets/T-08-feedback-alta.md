# T-08 · Estados de carga, error y éxito

| Campo | Valor |
|---|---|
| Épica | 2 · Alta de productos |
| Prioridad | P0 |
| Estimación | 1 h |
| Dependencias | T-07 |
| Estado | 🟡 Escrito — falta ejecutar con credenciales |

## Objetivo

Que el alta nunca deje al usuario sin saber qué pasó: ni con el botón colgado, ni con un error críptico de Firebase, ni con un éxito silencioso.

## Plan de implementación

1. Estado `enviando` en la página de alta.
2. Botón: `{enviando ? 'Guardando…' : 'Publicar producto'}` + `disabled={enviando}`.
3. Errores por etapa, con mensajes distintos:
   - Imagen: `No pudimos subir la imagen. Probá con otra o con un archivo más chico.`
   - Producto: `No pudimos guardar el producto. Revisá la conexión y volvé a intentar.`
   - Permisos: `Tu sesión no tiene permiso para publicar. Volvé a iniciar sesión.`
4. Éxito: al volver a `/admin`, leer `location.state.creado` y mostrar un aviso `role="status"`, descartable.
5. Nunca limpiar el formulario ante un error.

## Criterios de aceptación

- [x] Botón deshabilitado y con texto de progreso durante el envío.
- [x] Error de imagen y error de guardado se distinguen.
- [x] Confirmación visible y anunciada a lectores de pantalla.
- [x] Un error conserva los datos cargados.
- [x] No se puede enviar dos veces el mismo producto.

## Verificación manual

- Cortar la red antes de guardar: debe aparecer el error y el formulario debe conservar los datos.
- Subir un archivo de 10 MB: debe rechazarse con el mensaje de tamaño.
- Guardar bien: debe volver al listado con confirmación.

## Notas

- Firebase devuelve códigos como `storage/unauthorized` o `permission-denied`. Traducirlos a español en un mapa chico, no mostrar el código crudo.
- Si se agrega un `toast` global, reutilizarlo en T-15 y T-16 en vez de duplicar avisos.
- **Implementado:**
  - `src/utils/firebaseErrors.js` traduce `permission-denied`, `unauthenticated`, `unavailable`, `failed-precondition` y los códigos de Storage. `codigoDeError` recorre hasta tres causas porque los servicios envuelven el error original.
  - El mensaje de permisos es genérico ("esta acción") a propósito: T-15 y T-16 lo van a reutilizar tal cual.
  - La confirmación usa una región viva persistente (`<div class="sr" role="status">`) además del aviso visible descartable. Insertar el `role="status"` junto con el texto funciona en la mayoría de los lectores, pero una región ya montada es más confiable.
  - Doble submit: además de `isSubmitting`, `ProductForm` usa un ref para cortar dos envíos en el mismo tick antes de que React vuelva a renderizar.
  - Se alinearon los textos por defecto: imagen (`No pudimos subir la imagen...`) y producto (`No pudimos guardar el producto...`).
