/**
 * Curva de tueste del lote 063.
 *
 * La curva no son puntos dibujados a mano: se integra un modelo de tasa de
 * ascenso (RoR) para obtener temperatura y tiempo. Todo lo que muestra la
 * pagina (punto de giro, primer craquel, caída, DTR) sale de acá, asi que las
 * cifras que lee la persona coinciden con la curva que ve.
 *
 * Constantes calibradas sobre el perfil de referencia: washed de Huila,
 * tueste claro, tambor de 1 kg a 60 °C de giro.
 */

const CARGA_T = 200

const PUNTO_GIRO = { t: 105, T: 93 }
const PRIMER_CRAQUEL_T = 196
const CAIDA_T = 208.5
const DTR_OBJETIVO = 0.22

/**
 * Tramo previo al craquel. La RoR arranca alta y decae.
 * El promedio de esta curva sobre el tramo es
 *   R_final + (R_inicial - R_final) * (1 - e^-k) / k
 * y esta calibrado para llevar los 93 °C del punto de giro a los 196 °C del
 * primer craquel en 410 s, que es un promedio de 15,1 °C/min.
 */
const ROR_INICIAL = 24
const ROR_FINAL = 8.5
const DECAIMIENTO = 2.06
const TRAMO_PRE = 410

/**
 * Tramo posterior al craquel: la curva se hunde y después recupera, como pasa
 * en cualquier tueste claro. Se guarda normalizado (u = fracción del tiempo de
 * desarrollo, f = fracción del ascenso) y después se escala a la caída real.
 */
const POST_CRAQUEL = [
  { u: 0, f: 0 },
  { u: 0.12, f: -0.16 },
  { u: 0.26, f: -0.05 },
  { u: 0.45, f: 0.17 },
  { u: 0.65, f: 0.4 },
  { u: 0.82, f: 0.66 },
  { u: 1, f: 1 },
]

/**
 * Carga. La sonda todavía está fría, así que la caída inicial es empinada: es
 * un artefacto de la sonda, no del grano. Por eso `leerCurva` no devuelve RoR
 * antes del punto de giro.
 */
const CARGA = [
  { t: 0, T: 200 },
  { t: 15, T: 172 },
  { t: 30, T: 149 },
  { t: 45, T: 130 },
  { t: 60, T: 115 },
  { t: 75, T: 104 },
  { t: 90, T: 97 },
  { t: 105, T: 93 },
]

const rorPreCraquel = (t) => {
  const x = (t - PUNTO_GIRO.t) / TRAMO_PRE
  return ROR_FINAL + (ROR_INICIAL - ROR_FINAL) * Math.exp(-DECAIMIENTO * x)
}

const interpolar = (puntos, x, campoX, campoY) => {
  if (x <= puntos[0][campoX]) return puntos[0][campoY]
  const ultimo = puntos[puntos.length - 1]
  if (x >= ultimo[campoX]) return ultimo[campoY]

  for (let i = 1; i < puntos.length; i += 1) {
    const anterior = puntos[i - 1]
    const actual = puntos[i]
    if (x <= actual[campoX]) {
      const tramo = actual[campoX] - anterior[campoX]
      const avance = tramo === 0 ? 0 : (x - anterior[campoX]) / tramo
      return anterior[campoY] + (actual[campoY] - anterior[campoY]) * avance
    }
  }
  return ultimo[campoY]
}

const formaPostCraquel = (u) => interpolar(POST_CRAQUEL, u, 'u', 'f')

const construir = () => {
  // 1. Tramo previo al craquel, integrando la RoR.
  const pre = [{ t: PUNTO_GIRO.t, T: PUNTO_GIRO.T }]
  let T = PUNTO_GIRO.T
  for (let t = PUNTO_GIRO.t + 5; t <= PUNTO_GIRO.t + TRAMO_PRE; t += 5) {
    const ror = rorPreCraquel(t - 2.5)
    T += (ror * 5) / 60
    pre.push({ t, T })
  }

  const tCraquel = pre.find((muestra) => muestra.T >= PRIMER_CRAQUEL_T)?.t ?? PUNTO_GIRO.t + TRAMO_PRE

  // 2. El tiempo de desarrollo sale del DTR objetivo, no al revés: así el
  //    porcentaje impreso es exactamente el de la curva dibujada.
  const duracionDesarrollo = (tCraquel * DTR_OBJETIVO) / (1 - DTR_OBJETIVO)
  const tCaida = tCraquel + duracionDesarrollo

  // 3. Se descarta del tramo previo lo que pasa del craquel, para que la curva
  //    no vuelva hacia atrás en el tiempo.
  const preRecortado = pre.filter((muestra) => muestra.t <= tCraquel)
  preRecortado[preRecortado.length - 1] = { t: tCraquel, T: PRIMER_CRAQUEL_T }

  // 4. Tramo posterior, escalado a la temperatura real de caída.
  const post = []
  for (let t = tCraquel + 5; t < tCaida; t += 5) {
    const u = (t - tCraquel) / duracionDesarrollo
    post.push({
      t,
      T: PRIMER_CRAQUEL_T + (CAIDA_T - PRIMER_CRAQUEL_T) * formaPostCraquel(u),
    })
  }
  post.push({ t: tCaida, T: CAIDA_T })

  return {
    serie: [...CARGA.slice(0, -1), ...preRecortado, ...post],
    eventos: {
      carga: { t: 0, T: CARGA_T },
      giro: { ...PUNTO_GIRO },
      craquel: { t: tCraquel, T: PRIMER_CRAQUEL_T },
      caida: { t: tCaida, T: CAIDA_T },
    },
    dtr: duracionDesarrollo / tCaida,
  }
}

const modelo = construir()

export const SERIE = modelo.serie
export const EVENTOS = modelo.eventos
export const DTR = modelo.dtr

/** Dominio del gráfico: aire arriba de la caída y un poco después. */
export const DOMINIO = {
  tMin: 0,
  tMax: Math.ceil((modelo.eventos.caida.t + 50) / 60) * 60,
  tMinGrafico: 70,
  tMaxGrafico: 220,
}

export const MARCAS_TIEMPO = Array.from(
  { length: Math.floor(DOMINIO.tMax / 120) },
  (_, i) => (i + 1) * 120
)
export const MARCAS_TEMP = [100, 150, 200]

/**
 * Temperatura y tasa de ascenso en un instante de la curva.
 * `ror` es null durante la carga: antes del punto de giro la sonda marca la
 * temperatura del tambor, no la del grano, así que el valor no significa nada.
 */
export const leerCurva = (t) => {
  if (t < PUNTO_GIRO.t) {
    return { T: interpolar(CARGA, t, 't', 'T'), ror: null }
  }
  const T = interpolar(modelo.serie, t, 't', 'T')
  const previa = interpolar(modelo.serie, Math.max(PUNTO_GIRO.t, t - 5), 't', 'T')
  const paso = Math.max(1, t - Math.max(PUNTO_GIRO.t, t - 5))
  return { T, ror: ((T - previa) / paso) * 60 }
}

export const reloj = (segundos) => {
  const total = Math.round(segundos)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
