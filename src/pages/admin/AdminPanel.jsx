import { Link } from 'react-router-dom'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Punto de entrada del panel. Por ahora es un estado vacío honesto: T-07 lo
 * reemplaza por el listado de productos con acceso al alta.
 */
const AdminPanel = () => {
  useTitulo('Panel')

  return (
    <div className="hoja">
      <div className="columna">
        <div className="seccion-cabecera">
          <h1 className="seccion-titulo">Panel</h1>
          <p className="seccion-conteo">Administración</p>
        </div>

        <div className="vacio">
          <h2 className="vacio-titulo">Todavía no hay secciones</h2>
          <p className="vacio-texto">
            El alta de productos y la lista de órdenes se suman en los próximos tickets.
          </p>
          <Link to="/" className="boton boton-primario">
            Ver el sitio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
