import { Link, useParams } from 'react-router-dom'
import { useDatos } from '../../context/DatosContext'
import ItemDetail from '../ItemDetail/ItemDetail'
import { useTitulo } from '../../hooks/useTitulo'

const ItemDetailContainer = () => {
  const { id } = useParams()
  const { porId, cargando, error, reintentar } = useDatos()
  const producto = porId.get(String(id))

  useTitulo(producto?.nombre)

  if (cargando) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="esqueleto-detalle" aria-hidden="true">
            <span className="esqueleto-detalle-media" />
            <span className="esqueleto-linea esqueleto-linea-corta" />
            <span className="esqueleto-linea" />
            <span className="esqueleto-linea esqueleto-linea-corta" />
          </div>
          <p className="recargando" role="status">
            Cargando la ficha
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="vacio" role="alert">
            <h1 className="vacio-titulo">No pudimos cargar la ficha</h1>
            <p className="vacio-texto">{error}</p>
            <button type="button" className="boton boton-primario" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="hoja">
        <div className="columna">
          <div className="vacio">
            <h1 className="vacio-titulo">Ese producto no existe</h1>
            <p className="vacio-texto">
              Puede que el lote se haya agotado o que el enlace esté incompleto. El catálogo
              sigue abajo.
            </p>
            <Link to="/#catalogo" className="boton boton-primario">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <ItemDetail producto={producto} />
}

export default ItemDetailContainer
