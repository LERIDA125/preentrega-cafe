import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FUERZAS, METODOS, PORCIONES_MAX, calcularReceta, reloj } from '../../utils/brew'
import { formatGramos } from '../../utils/format'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Calculadora de receta.
 *
 * El control de fuerza no cambia la cantidad de café sino la proporción
 * café/agua, así que el ratio que se muestra se mueve de verdad: 1:18, 1:16,
 * 1:14. El tiempo se deriva de esa proporción, porque más agua significa más
 * extracción.
 *
 * En la ficha de producto se usa en modo compacto: el método viene del producto
 * y solo quedan la fuerza y las porciones.
 */

const CalculadoraReceta = ({ producto, compacto = false }) => {
  const idBase = useId()
  const [metodo, setMetodo] = useState(producto?.metodo ?? 'chemex')
  const [fuerza, setFuerza] = useState('natural')
  const [porciones, setPorciones] = useState(1)

  useTitulo(producto ? `Receta para ${producto.nombre}` : 'Calculadora de receta')

  const receta = useMemo(
    () => calcularReceta({ metodo, porciones, fuerza }),
    [metodo, porciones, fuerza]
  )

  const cambiarPorciones = (delta) => {
    setPorciones((previo) => Math.min(PORCIONES_MAX, Math.max(1, previo + delta)))
  }

  return (
    <section className={`receta${compacto ? ' receta-compacta' : ''}`} aria-labelledby={`${idBase}-titulo`}>
      <div className="receta-cabecera">
        <h2 id={`${idBase}-titulo`} className="receta-titulo">
          {producto ? `Cómo prepararlo` : 'Calculadora de receta'}
        </h2>
        <p className="receta-bajada">
          {producto
            ? `${producto.nombre}, ${producto.punto.toLowerCase()}, ${producto.notas.join(', ').toLowerCase()}.`
            : 'Elegí método y fuerza. Te decimos cuántos gramos de café y de agua, y en cuánto tiempo.'}
        </p>
      </div>

      <div className="receta-cuerpo">
        <div className="receta-controles">
          {!compacto && (
            <fieldset className="receta-grupo">
              <legend className="receta-leyenda">Método</legend>
              <div className="receta-opciones">
                {METODOS.map((opcion) => (
                  <label
                    key={opcion.id}
                    className={`receta-opcion${metodo === opcion.id ? ' receta-opcion-activa' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`${idBase}-metodo`}
                      value={opcion.id}
                      checked={metodo === opcion.id}
                      onChange={() => setMetodo(opcion.id)}
                    />
                    <span className="receta-opcion-nombre">{opcion.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="receta-grupo">
            <legend className="receta-leyenda">Fuerza</legend>
            <div className="receta-opciones">
              {FUERZAS.map((opcion) => (
                <label
                  key={opcion.id}
                  className={`receta-opcion${fuerza === opcion.id ? ' receta-opcion-activa' : ''}`}
                >
                  <input
                    type="radio"
                    name={`${idBase}-fuerza`}
                    value={opcion.id}
                    checked={fuerza === opcion.id}
                    onChange={() => setFuerza(opcion.id)}
                  />
                  <span className="receta-opcion-nombre">{opcion.nombre}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="receta-grupo">
            <legend className="receta-leyenda">Porciones</legend>
            <div className="receta-porter">
              <button
                type="button"
                className="receta-menos"
                onClick={() => cambiarPorciones(-1)}
                disabled={porciones === 1}
              >
                <span aria-hidden="true">−</span>
                <span className="receta-sr">Menos porciones</span>
              </button>
              <output className="receta-valor" aria-live="polite">
                {porciones}
              </output>
              <button
                type="button"
                className="receta-menos"
                onClick={() => cambiarPorciones(1)}
                disabled={porciones === PORCIONES_MAX}
              >
                <span aria-hidden="true">+</span>
                <span className="receta-sr">Más porciones</span>
              </button>
            </div>
          </fieldset>
        </div>

        <div className="receta-ficha">
          <p className="receta-metodo-nombre">{receta.metodo.nombre}</p>

          <dl className="receta-datos">
            <div className="receta-dato receta-dato-dosis">
              <dt>Café</dt>
              <dd>{formatGramos(receta.dosisG)}</dd>
            </div>
            <div className="receta-dato">
              <dt>{receta.etiquetaAgua}</dt>
              <dd>{formatGramos(receta.aguaG)}</dd>
            </div>
            <div className="receta-dato receta-dato-ratio">
              <dt>Proporción</dt>
              <dd>{`1 : ${receta.ratio}`}</dd>
            </div>
            <div className="receta-dato">
              <dt>Tiempo</dt>
              <dd>{reloj(receta.tiempo)}</dd>
            </div>
            <div className="receta-dato">
              <dt>Molienda</dt>
              <dd>{receta.molienda}</dd>
            </div>
            <div className="receta-dato">
              <dt>Agua</dt>
              <dd>{`${receta.temperatura} °C`}</dd>
            </div>
          </dl>

          <p className="receta-nota">{receta.nota}</p>

          {producto?.rinde && (
            <p className="receta-rinde">
              <span>Rinde</span>
              {producto.rinde}
            </p>
          )}

          {!compacto && (
            <p className="receta-enlace">
              ¿Preferís otro café? <Link to="/#catalogo">Mirá el catálogo</Link>.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default CalculadoraReceta
