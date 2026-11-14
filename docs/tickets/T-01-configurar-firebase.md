# T-01 · Configurar Firebase y variables de entorno

| Campo | Valor |
|---|---|
| Épica | 1 · Firebase y capa de datos |
| Prioridad | P0 |
| Estimación | 2 h |
| Dependencias | — |
| Estado | ✅ Hecho — 14/11/2026 |

## Objetivo

Dejar el proyecto conectado a Firebase con credenciales fuera del repositorio, para que el resto de los tickets pueda importar `db`, `auth` y `storage` sin repetir inicialización.

## Plan de implementación

1. Instalar `firebase` (`npm install firebase`).
2. Crear `src/config/firebase.js`:
   - Leer `VITE_FIREBASE_*` desde `import.meta.env`.
   - Validar que las seis variables estén presentes.
   - Inicializar `app` y exportar `db`, `auth`, `storage`.
3. Crear `.env.example` con las seis variables vacías y el instructivo.
4. Ajustar `.gitignore` para que `.env.example` sí se versione.

## Criterios de aceptación

- [x] `firebase` instalado y el build compila.
- [x] El módulo exporta `app`, `db`, `auth` y `storage`.
- [x] Las claves se leen de `import.meta.env.VITE_FIREBASE_*`, nunca hardcodeadas.
- [x] `.env.example` documenta las seis variables requeridas.
- [x] `.env.local` sigue ignorado por git y `.env.example` no.
- [x] Si falta una variable, el error dice cuál.

## Verificación manual

```bash
npm run build          # debe terminar sin errores
git status .env.example  # debe aparecer como untracked, no ignorado
```

Con el proyecto de Firebase creado y `.env.local` completo, importar `src/config/firebase.js` desde la consola del navegador no debe lanzar errores.

## Notas

- **Gotcha corregido:** `.gitignore` tenía `.env*`, que también ignoraba `.env.example`. Se agregó `!.env.example`.
- Este ticket no cambia el comportamiento de la app: nada importa todavía `firebase.js`, así que el catálogo sigue leyendo `public/productos.json` hasta T-04.
- **Pendiente del usuario:** crear el proyecto en la consola de Firebase, habilitar Firestore, Authentication (correo/contraseña) y Storage, y pegar las claves en `.env.local`.
- Las claves de Firebase son públicas por diseño (viajan al cliente). La seguridad real vive en las reglas de Firestore y Storage (T-19). Igual no se versionan para no mezclar entornos.
- `npm audit` reporta vulnerabilidades transitivas dentro del árbol de Firebase. No afectan el build ni la entrega; no ejecutar `npm audit fix --force`.
