import { Link } from 'react-router-dom'
import { useTitulo } from '../../hooks/useTitulo'

const NoEncontrado = () => {
  useTitulo('Página no encontrada')

  return (
    <div className="hoja">
      <div className="columna">
        <div className="vacio">
          <p className="vacio-codigo">404</p>
          <h1 className="vacio-titulo">Esta página no existe</h1>
          <p className="vacio-texto">
            El enlace puede estar viejo o mal escrito. El catálogo y la calculadora de receta siguen
            en pie.
          </p>
          <Link to="/" className="boton boton-primario">
            Ir al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NoEncontrado
