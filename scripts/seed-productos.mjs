#!/usr/bin/env node
/**
 * Carga los productos de public/productos.json en Firestore.
 *
 * Uso:
 *   node --env-file=.env.local scripts/seed-productos.mjs
 *   npm run seed
 *
 * Es idempotente: usa setDoc con el id del JSON, así que correrlo dos veces
 * actualiza los mismos documentos y no duplica nada.
 */

import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

const COLECCION = 'productos'
const RUTA_JSON = new URL('../public/productos.json', import.meta.url)

const VARIABLES = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

const leerConfiguracion = () => {
  const config = Object.fromEntries(
    Object.keys(VARIABLES).map((clave) => [clave, process.env[VARIABLES[clave]]])
  )

  const faltantes = Object.entries(VARIABLES)
    .filter(([clave]) => !config[clave])
    .map(([, variable]) => variable)

  if (faltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno: ${faltantes.join(', ')}. ` +
        'Copiá .env.example a .env.local y completá las claves.'
    )
  }

  return config
}

const leerProductos = async () => {
  const crudo = await readFile(RUTA_JSON, 'utf8')
  const productos = JSON.parse(crudo)

  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('public/productos.json no contiene una lista de productos.')
  }

  return productos
}

/**
 * Firestore exige sesión para escribir en `productos` (ver `firestore.rules`).
 * El seed corre sin sesión salvo que se le pasen credenciales:
 *
 *   SEED_EMAIL=admin@admin.com SEED_PASSWORD=admin123 npm run seed
 *
 * Si las variables no están, intenta escribir como visitante anónimo: eso sólo
 * funciona antes de publicar las reglas de T-19.
 */
const autenticar = async (app) => {
  const email = process.env.SEED_EMAIL
  const password = process.env.SEED_PASSWORD

  if (!email || !password) return false

  await signInWithEmailAndPassword(getAuth(app), email, password)
  return true
}

const main = async () => {
  const app = initializeApp(leerConfiguracion())
  const db = getFirestore(app)
  const productos = await leerProductos()

  const conSesion = await autenticar(app)
  console.log(
    conSesion
      ? `Sembrando ${productos.length} productos en "${COLECCION}" con sesión iniciada...`
      : `Sembrando ${productos.length} productos en "${COLECCION}" sin sesión...`
  )

  for (const [indice, producto] of productos.entries()) {
    const { id, ...campos } = producto

    if (id === undefined || id === null || id === '') {
      throw new Error(`El producto en la posición ${indice} no tiene id.`)
    }

    await setDoc(doc(db, COLECCION, String(id)), {
      ...campos,
      creadoEn: serverTimestamp(),
    })

    console.log(`  ${indice + 1}/${productos.length} · ${campos.nombre ?? id}`)
  }

  const snapshot = await getDocs(collection(db, COLECCION))
  console.log(`Listo. La colección "${COLECCION}" tiene ${snapshot.size} documentos.`)
}

main().catch((error) => {
  console.error(`Falló el seed: ${error.message}`)
  if (error.cause?.message) console.error(error.cause.message)

  if (error.code === 'permission-denied' || error.cause?.code === 'permission-denied') {
    console.error(
      'Pista: las reglas de Firestore exigen sesión para escribir en "productos". ' +
        'Corré el seed con SEED_EMAIL y SEED_PASSWORD de una cuenta administradora, ' +
        'o hacelo antes de publicar las reglas.'
    )
  }

  process.exitCode = 1
})
