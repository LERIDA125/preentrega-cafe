import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

/**
 * Configuración de Firebase.
 *
 * Las claves salen de .env.local (variables VITE_FIREBASE_*). Copiá .env.example
 * y completá los valores de tu proyecto: consola de Firebase > Configuración del
 * proyecto > Tus apps > Configuración del SDK.
 *
 * Ninguna clave se escribe en el repositorio. Si falta una variable, el módulo
 * falla al importarse con un mensaje que dice cuál falta, en vez de romper más
 * tarde en una consulta.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const VARIABLES = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

const faltantes = Object.entries(VARIABLES)
  .filter(([clave]) => !firebaseConfig[clave])
  .map(([, variable]) => variable)

if (faltantes.length > 0) {
  throw new Error(
    `Falta configuración de Firebase. Definí ${faltantes.join(', ')} en .env.local (mirá .env.example).`
  )
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
