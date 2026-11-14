const precio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const decimal = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const entero = new Intl.NumberFormat('es-AR')

const fechaHora = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const formatPrice = (valor) => precio.format(valor)

export const formatGramos = (valor) => `${entero.format(valor)} g`

export const formatDecimal = (valor) => decimal.format(valor)

export const formatAltura = (msnm) => `${entero.format(msnm)} msnm`

/**
 * Fecha legible a partir de un `Timestamp` de Firestore, un `Date` o `null`.
 *
 * Un documento recién escrito por el cliente llega sin `fecha` hasta que el
 * servidor responde: se muestra "—" en vez de "Invalid Date".
 */
export const formatFecha = (valor) => {
  const fecha = valor?.toDate?.() ?? (valor instanceof Date ? valor : null)
  if (!fecha || Number.isNaN(fecha.getTime())) return '—'
  return fechaHora.format(fecha)
}
