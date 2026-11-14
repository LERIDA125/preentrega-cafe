import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../config/firebase'

/**
 * Imágenes de producto en Firebase Storage.
 *
 * El formulario entrega un File y recibe una URL pública lista para guardar en
 * el documento del producto. La validación vive acá y no en el formulario para
 * que cualquier pantalla que suba una imagen aplique las mismas reglas.
 */

const PREFIJO = 'productos'

export const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_BYTES = 2 * 1024 * 1024

const idUnico = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

const limpiarNombre = (nombre) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/** Devuelve el mensaje de error, o `null` si la imagen es válida. */
export const validarImagen = (file) => {
  if (!file) return 'Elegí una imagen para el producto.'
  if (!(file instanceof Blob)) return 'El archivo no es una imagen válida.'
  if (!TIPOS_ACEPTADOS.includes(file.type)) return 'La imagen tiene que ser JPG, PNG o WebP.'
  if (file.size > MAX_BYTES) return 'La imagen no puede superar los 2 MB.'
  return null
}

/** Sube la imagen y devuelve su URL pública. */
export const uploadProductImage = async (file) => {
  const invalido = validarImagen(file)
  if (invalido) throw new Error(invalido)

  const nombre = `${idUnico()}-${limpiarNombre(file.name) || 'imagen'}`
  const referencia = ref(storage, `${PREFIJO}/${nombre}`)

  try {
    await uploadBytes(referencia, file, { contentType: file.type })
    return await getDownloadURL(referencia)
  } catch (error) {
    throw new Error('No pudimos subir la imagen. Probá de nuevo.', { cause: error })
  }
}

/** Recupera el path de Storage a partir de una URL de descarga. */
const pathDesdeUrl = (url) => {
  if (typeof url !== 'string') return null

  const marca = '/o/'
  const inicio = url.indexOf(marca)
  if (inicio === -1) return null

  const resto = url.slice(inicio + marca.length)
  const fin = resto.indexOf('?')
  const path = fin === -1 ? resto : resto.slice(0, fin)
  if (!path) return null

  try {
    return decodeURIComponent(path)
  } catch {
    return null
  }
}

/**
 * Borra una imagen a partir de su URL. Si la URL no es de Storage o el archivo
 * ya no existe, no hace nada: borrar la imagen es best-effort, nunca debe
 * bloquear el borrado del producto.
 */
export const deleteProductImage = async (url) => {
  const path = pathDesdeUrl(url)
  if (!path) return

  try {
    await deleteObject(ref(storage, path))
  } catch (error) {
    if (error?.code === 'storage/object-not-found') return
    throw new Error('No pudimos borrar la imagen anterior.', { cause: error })
  }
}
