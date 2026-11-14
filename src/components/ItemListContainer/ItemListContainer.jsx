import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDatos } from '../../context/DatosContext'
import Portada from '../Portada/Portada'
import ItemList from '../ItemList/ItemList'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Portada + catalogo.
 *
 * El filtro vive en la URL, no en el estado: se puede compartir, sobrevive a un
 * refresh y el boton de atras funciona. El riel izquierdo es un indice con la
 * cantidad de cada categoria, para saber cuantos productos vas a ver antes de
 * tocar nada.
 */
const ItemListContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { productos, categorias, cargando, error, reintentar } = useDatos()

  const categoriaActiva = searchParams.get('categoria') ?? ''
  useTitulo(categoriaActiva || null)

  const productosFiltrados = useMemo(
    () => (categoriaActiva ? productos.filter((p) => p.categoria === categoriaActiva) : productos),
    [productos, categoriaActiva]
  )

  const cambiarCategoria = (categoria) => {
    setSearchParams(categoria ? { categoria } : {}, { replace: true })
  }

  return (
    <>
      <div className="hoja">
        <aside className="riel riel-portada" aria-label="Registro del lote">
          <dl className="ficha">
            <div className="ficha-par">
              <dt>Lote</dt>
              <dd>063</dd>
            </div>
            <div className="ficha-par">
              <dt>Origen</dt>
              <dd>Huila, Colombia</dd>
            </div>
            <div className="ficha-par">
              <dt>Altitud</dt>
              <dd>1.750 msnm</dd>
            </div>
            <div className="ficha-par">
              <dt>Variedad</dt>
              <dd>Caturra, Castillo</dd>
            </div>
            <div className="ficha-par">
              <dt>Proceso</dt>
              <dd>Lavado</dd>
            </div>
            <div className="ficha-par">
              <dt>Peso</dt>
              <dd>1 kg</dd>
            </div>
          </dl>
        </aside>

        <div className="columna">
          <Portada />
        </div>
      </div>

      <div className="hoja" id="catalogo">
        <aside className="riel riel-catalogo">
          <h2 className="riel-titulo">Filtrar</h2>
          <div className="indice" role="group" aria-label="Filtrar por categoría">
            <button
              type="button"
              className={`indice-fila${categoriaActiva === '' ? ' indice-fila-activa' : ''}`}
              aria-pressed={categoriaActiva === ''}
              onClick={() => cambiarCategoria('')}
            >
              <span>Todos</span>
              <span className="indice-cuenta">{productos.length}</span>
            </button>

            {categorias.map((categoria) => (
              <button
                key={categoria.nombre}
                type="button"
                className={`indice-fila${categoriaActiva === categoria.nombre ? ' indice-fila-activa' : ''}`}
                aria-pressed={categoriaActiva === categoria.nombre}
                onClick={() => cambiarCategoria(categoria.nombre)}
              >
                <span>{categoria.nombre}</span>
                <span className="indice-cuenta">{categoria.cantidad}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="columna">
          <div className="seccion-cabecera">
            <h2 className="seccion-titulo">{categoriaActiva || 'Catálogo'}</h2>
            {!cargando && !error && (
              <p className="seccion-conteo">
                {productosFiltrados.length}{' '}
                {productosFiltrados.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>

          {cargando && (
            <ul className="esqueleto" aria-hidden="true">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="esqueleto-celda">
                  <span className="esqueleto-media" />
                  <span className="esqueleto-linea" />
                  <span className="esqueleto-linea esqueleto-linea-corta" />
                </li>
              ))}
            </ul>
          )}

          {!cargando && error && (
            <div className="vacio" role="alert">
              <h3 className="vacio-titulo">No pudimos cargar el catálogo</h3>
              <p className="vacio-texto">{error}</p>
              <button type="button" className="boton boton-primario" onClick={reintentar}>
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && productosFiltrados.length === 0 && (
            <div className="vacio">
              <h3 className="vacio-titulo">No hay productos en {categoriaActiva}</h3>
              <p className="vacio-texto">Probá con otra categoría o mirá todo el catálogo.</p>
              <button
                type="button"
                className="boton boton-primario"
                onClick={() => cambiarCategoria('')}
              >
                Ver todo el catálogo
              </button>
            </div>
          )}

          {!cargando && !error && productosFiltrados.length > 0 && (
            <ItemList productos={productosFiltrados} />
          )}
        </div>
      </div>
    </>
  )
}

export default ItemListContainer
