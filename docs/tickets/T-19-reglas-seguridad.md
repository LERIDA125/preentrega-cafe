# T-19 · Reglas de seguridad de Firestore y Storage

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional (recomendado) |
| Prioridad | P2 |
| Estimación | 1 h |
| Dependencias | T-01 |
| Estado | 🟡 Escrito — falta publicar en la consola |

## Objetivo

Que la protección del panel no dependa solo de la UI. Sin reglas, cualquiera con la config del cliente puede escribir en `productos`.

> No está en la consigna, pero es lo primero que mira un evaluador técnico: `ProtectedRoute` protege la pantalla, no los datos.

## Implementación

- `firestore.rules` permite lectura pública del catálogo y escritura solo con
  sesión. En `orders`, permite crear órdenes anónimas solo si tienen la forma
  esperada, estado `pendiente` y fecha del servidor; leer, actualizar o borrar
  requiere sesión. No hay lectura pública de datos de compradores.
- `storage.rules` permite leer imágenes de productos públicamente. Crear o
  actualizar imágenes requiere sesión, limita el tamaño a 2 MiB y acepta solo
  JPEG, PNG o WebP; borrar requiere sesión.
- `firebase.json` apunta a ambos archivos para publicarlos con Firebase CLI.

La creación de órdenes valida la estructura mínima, pero no puede validar que
los precios sean legítimos: el proyecto no integra una pasarela de pago y los
datos provienen del cliente.

## Criterios de aceptación

- [ ] Un visitante anónimo puede leer `productos`.
- [ ] Un visitante anónimo **no** puede escribir en `productos`.
- [ ] Un visitante anónimo puede crear una orden.
- [ ] Un visitante anónimo **no** puede leer `orders`.
- [ ] El panel sigue funcionando con la sesión del administrador.
- [ ] La subida de imágenes exige autenticación.

## Verificación manual

1. Sin sesión, intentar crear un producto desde la consola del navegador: debe fallar con `permission-denied`.
2. Sin sesión, intentar leer `orders`: debe fallar.
3. Con sesión de admin, crear y editar: debe funcionar.
4. Sin sesión, confirmar una compra: debe funcionar.

## Notas

- Las reglas están implementadas en el repositorio, pero todavía deben
  publicarse en el proyecto Firebase. Se pueden publicar desde la consola o
  con `firebase deploy --only firestore:rules,storage`.
- Hasta publicarlas, Firestore conserva las reglas activas del proyecto y las
  operaciones de T-17/T-18 pueden seguir devolviendo `permission-denied`.
- Después de publicar, completar la verificación manual con el proyecto y las
  credenciales reales; el build de Vite no valida reglas de Firebase.
- Si se agrega Analytics o cualquier otro servicio, revisar que sus reglas no abran escritura.
- No usar `allow write: if true` "para probar y después lo cambio". Ese "después" nunca llega.
