const precio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const decimal = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const entero = new Intl.NumberFormat('es-AR')

export const formatPrice = (valor) => precio.format(valor)

export const formatGramos = (valor) => `${entero.format(valor)} g`

export const formatDecimal = (valor) => decimal.format(valor)

export const formatAltura = (msnm) => `${entero.format(msnm)} msnm`
