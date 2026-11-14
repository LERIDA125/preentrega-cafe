import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mensajeDeError } from '../utils/firebaseErrors'

/**
 * Acceso a la colección `productos`.
 *
 * El resto de la app no importa `firebase/firestore`: si cambia la consulta o el
 * backend, se toca este archivo. Los documentos se devuelven siempre con la
 * forma `{ ...datos, id }`, usando el id del documento como fuente de verdad.
 */

const COLECCION = 'productos'

const normalizarNotas = (notas) => {
  if (Array.isArray(notas)) return notas.filter((nota) => typeof nota === 'string')
  if (typeof notas === 'string') {
    return notas.split(',').map((nota) => nota.trim()).filter(Boolean)
  }
  return []
}

const aProducto = (documento) => {
  const datos = documento.data()
  return {
    ...datos,
    punto: typeof datos.punto === 'string' ? datos.punto : '',
    notas: normalizarNotas(datos.notas),
    id: documento.id,
  }
}

/** Envuelve una operación para no filtrar errores crudos de Firebase a la UI. */
const conError = async (accion, mensaje) => {
  try {
    return await accion()
  } catch (error) {
    throw new Error(mensajeDeError(error, mensaje), { cause: error })
  }
}

const consultaOrdenada = () => query(collection(db, COLECCION), orderBy('nombre'))

/**
 * Suscripción en tiempo real al catálogo.
 * Devuelve la función para cancelarla (la misma que retorna `onSnapshot`).
 */
export const subscribeProducts = (onData, onError) => {
  return onSnapshot(
    consultaOrdenada(),
    (snapshot) => onData(snapshot.docs.map(aProducto)),
    (error) => {
      const fallo = new Error('No pudimos cargar los productos.', { cause: error })
      if (onError) onError(fallo)
      else console.error(fallo)
    }
  )
}

export const getProducts = () =>
  conError(async () => {
    const snapshot = await getDocs(consultaOrdenada())
    return snapshot.docs.map(aProducto)
  }, 'No pudimos cargar los productos.')

export const getProductById = (id) =>
  conError(async () => {
    if (id === undefined || id === null || id === '') return null
    const snapshot = await getDoc(doc(db, COLECCION, String(id)))
    return snapshot.exists() ? aProducto(snapshot) : null
  }, 'No pudimos cargar el producto.')

/** Devuelve el id del documento creado. Ignora un `id` recibido: lo asigna Firestore. */
export const createProduct = (datos) =>
  conError(async () => {
    const { id: _id, ...campos } = datos
    const referencia = await addDoc(collection(db, COLECCION), {
      ...campos,
      creadoEn: serverTimestamp(),
    })
    return referencia.id
  }, 'No pudimos guardar el producto. Revisá la conexión y volvé a intentar.')

/** No permite pisar el id ni la fecha de creación. */
export const updateProduct = (id, datos) =>
  conError(async () => {
    const { id: _id, creadoEn: _creadoEn, ...campos } = datos
    await updateDoc(doc(db, COLECCION, String(id)), {
      ...campos,
      actualizadoEn: serverTimestamp(),
    })
  }, 'No pudimos actualizar el producto.')

export const deleteProduct = (id) =>
  conError(
    () => deleteDoc(doc(db, COLECCION, String(id))),
    'No pudimos eliminar el producto.'
  )
