# T-14 · Crear el usuario administrador

| Campo | Valor |
|---|---|
| Épica | 3 · Layouts y autenticación |
| Prioridad | P1 |
| Estimación | 1 h |
| Dependencias | T-01 |
| Estado | ⬜ Pendiente |

## Objetivo

Que el docente pueda entrar a corregir con las credenciales acordadas.

## Plan de implementación

1. En la consola de Firebase, habilitar **Authentication > Sign-in method > Correo electrónico/contraseña**.
2. Crear el usuario:

```
Correo:     admin@admin.com
Contraseña: admin123
```

3. Verificar que el usuario aparezca como habilitado.
4. Documentar las credenciales en `docs/ENTREGA.md` y en el espacio de entrega.

Alternativa por script (opcional), con `node --env-file=.env.local`:

```js
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
// ...
await createUserWithEmailAndPassword(auth, 'admin@admin.com', 'admin123')
```

## Criterios de aceptación

- [ ] El usuario `admin@admin.com` existe y puede iniciar sesión.
- [ ] La contraseña es `admin123`.
- [ ] Las credenciales están informadas en la entrega.
- [ ] Si se crearon otros usuarios, también están informados.
- [ ] El login funciona en el deploy, no solo en local.

## Verificación manual

Cerrar sesión, entrar con las credenciales en el deploy y completar un alta de producto de punta a punta.

## Notas

- Firebase exige contraseña de al menos 6 caracteres; `admin123` cumple.
- Si se usa la alternativa por script y el usuario ya existe, va a fallar con `auth/email-already-in-use`: eso confirma que ya está creado.
- No commitear credenciales de otros usuarios reales. El usuario de corrección es una excepción acordada con el docente.
- Si el proyecto usa un proveedor distinto (por ejemplo Google), hay que avisarlo en la entrega: el docente no va a poder entrar con correo y contraseña.
