import { Link } from 'react-router-dom'
import CurvaTueste from '../CurvaTueste/CurvaTueste'

/**
 * Portada.
 *
 * Arriba el registro del lote, abajo la curva. No hay foto: la curva es la
 * imagen, y una foto de café sobre papel no le agrega nada.
 */
const Portada = () => {
  return (
    <section className="portada" aria-labelledby="portada-titulo">
      <div className="portada-texto">
        <h1 id="portada-titulo" className="portada-titulo">
          Cada grano tiene un registro
        </h1>
        <p className="portada-bajada">
          Compramos café de especialidad por origen y tostamos en lotes de un kilo. Cada lote lleva
          su curva, que podés recorrer acá abajo.
        </p>
        <p className="portada-enlace">
          <Link to="/#catalogo">Ver el catálogo</Link>
        </p>
      </div>

      <CurvaTueste />
    </section>
  )
}

export default Portada
