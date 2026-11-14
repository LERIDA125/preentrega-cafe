# T-19 · Reglas de seguridad de Firestore y Storage

| Campo | Valor |
|---|---|
| Épica | 4 · Extra opcional (recomendado) |
| Prioridad | P2 |
| Estimación | 1 h |
| Dependencias | T-01 |
| Estado | ⬜ Pendiente |

## Objetivo

Que la protección del panel no dependa solo de la UI. Sin reglas, cualquiera con la config del cliente puede escribir en `productos`.

> No está en la consigna, pero es lo primero que mira un evaluador técnico: `ProtectedRoute` protege la pantalla, no los datos.

## Plan de implementación

**Firestore > Reglas:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /orders/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

**Storage > Reglas:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /productos/{archivo} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

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

- Las reglas se publican desde la consola de Firebase o con `firebase deploy --only firestore:rules`.
- Si se agrega Analytics o cualquier otro servicio, revisar que sus reglas no abran escritura.
- No usar `allow write: if true` "para probar y después lo cambio". Ese "después" nunca llega.
