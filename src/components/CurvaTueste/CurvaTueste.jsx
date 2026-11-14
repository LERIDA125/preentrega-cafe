import { useCallback, useMemo, useRef, useState } from 'react'
import { DTR, DOMINIO, EVENTOS, MARCAS_TEMP, MARCAS_TIEMPO, SERIE, leerCurva, reloj } from '../../utils/roast'
import { formatDecimal } from '../../utils/format'

/**
 * La curva de tueste del lote 063.
 *
 * Es lo que sostiene la pagina, asi que es lo unico que se anima sin que nadie
 * lo pida: el trazo se dibuja una vez al entrar y despues queda quieto. Todo
 * lo demas que se mueve en el sitio responde a una accion.
 *
 * Reparto de responsabilidades: el SVG dibuja solo geometria que puede estirarse
 * (rejilla, zona de desarrollo, trazo, cursor) con `preserveAspectRatio="none"`
 * y `non-scaling-stroke`, para que el filete sea de 1 px real en cualquier
 * pantalla. Los puntos y los textos van en HTML superpuesto, posicionados en
 * porcentaje, para que no se deformen ni se vuelvan ilegibles en el movil.
 *
 * Al recorrer la curva con el puntero o con las flechas, la lectura de abajo
 * nombra el evento que estas tocando: el grafico informa, no decora.
 */

const UNIDADES = 1000
const ALTO_UNIDADES = 336

const redondear = (n) => Math.round(n * 100) / 100

const xUnidad = (t) => (t / DOMINIO.tMax) * UNIDADES
const yUnidad = (T) =>
  ALTO_UNIDADES - ((T - DOMINIO.tMinGrafico) / (DOMINIO.tMaxGrafico - DOMINIO.tMinGrafico)) * ALTO_UNIDADES

const posX = (t) => (xUnidad(t) / UNIDADES) * 100
const posY = (T) => (yUnidad(T) / ALTO_UNIDADES) * 100

const TRAZO = SERIE.map(
  (muestra, i) => `${i === 0 ? 'M' : 'L'}${redondear(xUnidad(muestra.t))} ${redondear(yUnidad(muestra.T))}`
).join(' ')

const EVENTOS_NOMBRES = [
  { t: EVENTOS.carga.t, nombre: 'carga' },
  { t: EVENTOS.giro.t, nombre: 'punto de giro' },
  { t: EVENTOS.craquel.t, nombre: 'primer craquel' },
  { t: EVENTOS.caida.t, nombre: 'caída' },
]

const nombreEvento = (t) => EVENTOS_NOMBRES.find((evento) => Math.abs(evento.t - t) <= 12)?.nombre

const CurvaTueste = () => {
  const cajaRef = useRef(null)
  const [lectura, setLectura] = useState(null)

  const lecturaEn = useCallback((t) => {
    const recortado = Math.min(DOMINIO.tMax, Math.max(0, t))
    const { T, ror } = leerCurva(recortado)
    return { t: recortado, T, ror, evento: nombreEvento(recortado) }
  }, [])

  const manejarPuntero = useCallback(
    (evento) => {
      const caja = cajaRef.current
      if (!caja || caja.width === 0) return
      const x = evento.clientX - caja.left
      setLectura(lecturaEn((x / caja.width) * DOMINIO.tMax))
    },
    [lecturaEn]
  )

  const manejarTeclado = useCallback(
    (evento) => {
      const salto = evento.shiftKey ? 30 : 5
      const base = lectura?.t ?? EVENTOS.giro.t
      if (evento.key === 'ArrowRight') {
        evento.preventDefault()
        setLectura(lecturaEn(base + salto))
      } else if (evento.key === 'ArrowLeft') {
        evento.preventDefault()
        setLectura(lecturaEn(base - salto))
      } else if (evento.key === 'Home') {
        evento.preventDefault()
        setLectura(lecturaEn(0))
      } else if (evento.key === 'End') {
        evento.preventDefault()
        setLectura(lecturaEn(DOMINIO.tMax))
      }
    },
    [lectura, lecturaEn]
  )

  const inicioZona = posX(EVENTOS.craquel.t)
  const finZona = posX(EVENTOS.caida.t)

  const descripcion = useMemo(
    () =>
      `Curva de tueste del lote 063. Carga a ${EVENTOS.carga.T} grados, punto de giro a ${reloj(
        EVENTOS.giro.t
      )}, primer craquel a ${reloj(EVENTOS.craquel.t)} y caída a ${reloj(
        EVENTOS.caida.t
      )}, con un ${Math.round(DTR * 100)} por ciento de desarrollo.`,
    []
  )

  return (
    <figure className="curva">
      <div className="curva-rejilla-cabecera">
        <span className="curva-unidad" aria-hidden="true">
          °C
        </span>
        <div
          className="curva-zona"
          style={{ left: `${inicioZona}%`, width: `${finZona - inicioZona}%` }}
        >
          <span className="curva-zona-texto">
            {`desarrollo ${Math.round(DTR * 100)} %`}
            <small>{`${reloj(EVENTOS.craquel.t)} a ${reloj(EVENTOS.caida.t)}`}</small>
          </span>
        </div>
      </div>

      <div className="curva-cuerpo">
        <div className="curva-eje-y" aria-hidden="true">
          {MARCAS_TEMP.map((T) => (
            <span key={T} style={{ top: `${posY(T)}%` }}>
              {T}
            </span>
          ))}
        </div>

        <div
          ref={cajaRef}
          className="curva-lienzo"
          role="group"
          tabIndex={0}
          aria-label={`${descripcion} Usá las flechas izquierda y derecha para recorrer los valores.`}
          onKeyDown={manejarTeclado}
          onPointerMove={manejarPuntero}
          onPointerDown={manejarPuntero}
          onPointerLeave={() => setLectura(null)}
          onBlur={() => setLectura(null)}
        >
          <svg
            className="curva-svg"
            viewBox={`0 0 ${UNIDADES} ${ALTO_UNIDADES}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <g className="curva-lineas">
              {MARCAS_TEMP.map((T) => (
                <line key={`h${T}`} x1={0} y1={yUnidad(T)} x2={UNIDADES} y2={yUnidad(T)} vectorEffect="non-scaling-stroke" />
              ))}
              {MARCAS_TIEMPO.map((t) => (
                <line key={`v${t}`} x1={xUnidad(t)} y1={0} x2={xUnidad(t)} y2={ALTO_UNIDADES} vectorEffect="non-scaling-stroke" />
              ))}
            </g>

            <rect className="curva-zona-rect" x={xUnidad(EVENTOS.craquel.t)} y={0} width={Math.max(0, xUnidad(EVENTOS.caida.t) - xUnidad(EVENTOS.craquel.t))} height={ALTO_UNIDADES} />
            <line className="curva-craquel-linea" x1={xUnidad(EVENTOS.craquel.t)} y1={0} x2={xUnidad(EVENTOS.craquel.t)} y2={ALTO_UNIDADES} vectorEffect="non-scaling-stroke" />
            <path className="curva-linea" d={TRAZO} pathLength={1} vectorEffect="non-scaling-stroke" />
            {lectura && (
              <line className="curva-cursor-linea" x1={xUnidad(lectura.t)} y1={0} x2={xUnidad(lectura.t)} y2={ALTO_UNIDADES} vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          <span className="curva-marca curva-marca-giro" style={{ left: `${posX(EVENTOS.giro.t)}%`, top: `${posY(EVENTOS.giro.T)}%` }} aria-hidden="true" />
          <span className="curva-marca curva-marca-craquel" style={{ left: `${posX(EVENTOS.craquel.t)}%`, top: `${posY(EVENTOS.craquel.T)}%` }} aria-hidden="true" />
          <span className="curva-marca curva-marca-caida" style={{ left: `${posX(EVENTOS.caida.t)}%`, top: `${posY(EVENTOS.caida.T)}%` }} aria-hidden="true" />
          {lectura && (
            <span className="curva-marca curva-marca-cursor" style={{ left: `${posX(lectura.t)}%`, top: `${posY(lectura.T)}%` }} aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="curva-eje-x" aria-hidden="true">
        {MARCAS_TIEMPO.map((t, i) => (
          <span
            key={t}
            style={{ left: `${posX(t)}%` }}
            data-alineacion={i === 0 ? 'inicio' : i === MARCAS_TIEMPO.length - 1 ? 'fin' : 'centro'}
          >
            {reloj(t)}
          </span>
        ))}
      </div>

      <figcaption className="curva-pie">
        <output className="curva-lectura" aria-live="polite">
          {lectura ? (
            <>
              <span className="curva-lectura-tiempo">{reloj(lectura.t)}</span>
              <span className="curva-lectura-valor">{`${Math.round(lectura.T)} °C`}</span>
              <span className="curva-lectura-ror">
                {lectura.ror === null ? 'en carga' : `${formatDecimal(lectura.ror)} °C/min`}
              </span>
              <span className="curva-lectura-evento">{lectura.evento ?? 'en proceso'}</span>
            </>
          ) : (
            <>
              <span className="curva-lectura-tiempo">{reloj(EVENTOS.caida.t)}</span>
              <span className="curva-lectura-valor">{`${EVENTOS.caida.T} °C`}</span>
              <span className="curva-lectura-ror">fuera del tambor</span>
            </>
          )}
        </output>
        <p className="curva-nota">
          Lote 063, washed de Huila. Un kilo en tambor de 60 °C de giro. Pasá el puntero o usá las
          flechas para leer la curva.
        </p>
      </figcaption>
    </figure>
  )
}

export default CurvaTueste
