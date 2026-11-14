/**
 * Matematica de la calculadora de receta.
 *
 * La fuerza no cambia la cantidad de cafe sino la proporcion cafe/agua, asi
 * que el ratio que se muestra se mueve de verdad: 1:18, 1:16, 1:14. El tiempo
 * se deriva de esa proporcion porque mas agua significa mas extraccion.
 */

export const METODOS = [
  {
    id: 'chemex',
    nombre: 'Chemex',
    ratio: 16,
    dosisBase: 20,
    tiempoBase: 240,
    molienda: 'Media gruesa',
    temperatura: 94,
    etiquetaAgua: 'Agua',
    nota: 'Enjuaga el filtro con agua caliente y descarta esa agua antes de cargar el café.',
  },
  {
    id: 'v60',
    nombre: 'V60',
    ratio: 16,
    dosisBase: 18,
    tiempoBase: 165,
    molienda: 'Media',
    temperatura: 94,
    etiquetaAgua: 'Agua',
    nota: 'Tres agas de agua y una de developmental. El total no puede pasar los 4 minutos.',
  },
  {
    id: 'prensa',
    nombre: 'Prensa francesa',
    ratio: 15,
    dosisBase: 30,
    tiempoBase: 240,
    molienda: 'Gruesa',
    temperatura: 94,
    etiquetaAgua: 'Agua',
    nota: 'Esperá los cuatro minutos completos antes de bajar el émbolo. Si apurás, sale astringente.',
  },
  {
    id: 'aero',
    nombre: 'Aeropress',
    ratio: 13,
    dosisBase: 15,
    tiempoBase: 120,
    molienda: 'Fina a media',
    temperatura: 85,
    etiquetaAgua: 'Agua',
    nota: 'Agua a 85 °C y presión suave al final. El AeroPress rinde como si el filtro fuera de papel grueso.',
  },
  {
    id: 'espresso',
    nombre: 'Espresso',
    ratio: 2,
    dosisBase: 18,
    tiempoBase: 30,
    molienda: 'Fina',
    temperatura: 93,
    etiquetaAgua: 'Rinde en taza',
    nota: '18 g de café, 36 g en la taza, 28 segundos. Si tarda más de 32, subí el calor.',
  },
  {
    id: 'moka',
    nombre: 'Moka',
    ratio: 10,
    dosisBase: 18,
    tiempoBase: 240,
    molienda: 'Media fina',
    temperatura: 90,
    etiquetaAgua: 'Agua',
    nota: 'Llená la cámara de agua hasta la válvula y dejá el fuego bajo. Si hierve fuerte, el café queda amargo.',
  },
]

export const FUERZAS = [
  { id: 'suave', nombre: 'Suave', factor: 1.12 },
  { id: 'natural', nombre: 'Natural', factor: 1 },
  { id: 'concentrado', nombre: 'Concentrado', factor: 0.88 },
]

export const PORCIONES_MAX = 4

const redondearCinco = (n) => Math.round(n / 5) * 5

export const metodoPorId = (id) => METODOS.find((m) => m.id === id) ?? METODOS[0]
export const fuerzaPorId = (id) => FUERZAS.find((f) => f.id === id) ?? FUERZAS[1]

export const calcularReceta = ({ metodo, porciones, fuerza }) => {
  const met = metodoPorId(metodo)
  const fue = fuerzaPorId(fuerza)
  const ratioEfectivo = met.ratio * fue.factor

  const dosisG = met.dosisBase * porciones
  const aguaG = Math.round(dosisG * ratioEfectivo)
  const tiempo = redondearCinco(Math.max(15, met.tiempoBase * fue.factor))

  return {
    metodo: met,
    fuerza: fue,
    dosisG,
    aguaG,
    ratio: `${ratioEfectivo.toFixed(0)}`,
    tiempo,
    molienda: met.molienda,
    temperatura: met.temperatura,
    etiquetaAgua: met.etiquetaAgua,
    nota: met.nota,
  }
}

export const reloj = (segundos) => {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
