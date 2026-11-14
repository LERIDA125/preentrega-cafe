/**
 * Traducción de errores de Firebase a mensajes para la interfaz.
 *
 * Firebase devuelve códigos como `permission-denied` o `storage/unauthorized`.
 * Mostrar el código crudo no le sirve a nadie: acá se traducen los casos que el
 * usuario puede provocar o encontrar, y el resto cae en el mensaje de contexto
 * que pasa cada servicio.
 */

const MENSAJES = {
  'permission-denied': 'Tu sesión no tiene permiso para esta acción. Volvé a iniciar sesión.',
  unauthenticated: 'Tu sesión venció. Volvé a iniciar sesión.',
  'storage/unauthorized': 'Tu sesión no tiene permiso para subir archivos. Volvé a iniciar sesión.',
  'storage/unauthenticated': 'Tu sesión venció. Volvé a iniciar sesión.',
  'storage/retry-limit-exceeded': 'La subida tardó demasiado. Probá de nuevo.',
  'storage/quota-exceeded': 'No hay espacio de almacenamiento disponible. Probá más tarde.',
  'storage/canceled': 'La subida se canceló. Probá de nuevo.',
  unavailable: 'No pudimos conectar con el servidor. Revisá la conexión y volvé a intentar.',
  'failed-precondition': 'La base de datos todavía no está lista. Probá en unos segundos.',

  // Auth: las credenciales inválidas comparten mensaje para no revelar cuál
  // campo falló ni si el correo existe.
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/missing-password': 'Ingresá la contraseña.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y volvé a probar.',
  'auth/network-request-failed': 'No pudimos conectar. Revisá la conexión.',
}

/**
 * Busca el código en la cadena de causas: los servicios envuelven el error
 * original en un `Error` propio para no filtrar detalles de Firebase.
 */
export const codigoDeError = (error) => {
  let actual = error

  for (let salto = 0; salto < 3 && actual; salto += 1) {
    if (typeof actual.code === 'string') return actual.code
    actual = actual.cause
  }

  return null
}

export const mensajeDeError = (error, porDefecto) => {
  const codigo = codigoDeError(error)
  return (codigo && MENSAJES[codigo]) || porDefecto
}
