import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { getProductById, updateProduct } from '../../services/productService'
import { deleteProductImage, uploadProductImage } from '../../services/imageService'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Edición de un producto publicado.
 *
 * Reutiliza `ProductForm` con `initialValues`: el formulario ya sabe precargar
 * números, el array de notas y la vista previa de la imagen. Si no se elige una
 * imagen nueva, se conserva la anterior; si se reemplaza, la vieja se borra de
 * Storage en modo best-effort (un fallo ahí no rompe la edición).
 */

const CAMPOS = [
  'nombre',
  'descripcion',
  'precio',
  'stock',
  'categoria',
  'lote',
  'origen',
  'altura',
  'variedad',
  'proceso',
  'punto',
  'notas',
  'metodo',
  'rinde',
]

const mismoValor = (a, b) => {
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a ?? []) === JSON.stringify(b ?? [])
  }
  return String(a ?? '') === String(b ?? '')
}

const sinCambios = (datos, original, archivo) =>
  !archivo && CAMPOS.every((campo) => mismoValor(datos[campo], original[campo]))

const AdminEditarProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)
  const [guardando, setGuardando] = useState(false)

  useTitulo(producto?.nombre ? `Panel · ${producto.nombre}` : 'Panel · Editar producto')

  useEffect(() => {
    let vivo = true

    setCargando(true)
    setError(null)

    getProductById(id)
      .then((dato) => {
        if (!vivo) return
        setProducto(dato)
        setCargando(false)
      })
      .catch((fallo) => {
        if (!vivo) return
        setError(fallo.message)
        setCargando(false)
      })

    return () => {
      vivo = false
    }
  }, [id, intento])

  const guardar = async (datos, archivo) => {
    if (sinCambios(datos, producto, archivo)) {
      throw new Error('No hay cambios para guardar.')
    }

    setGuardando(true)

    try {
      let imagen = producto.imagen
      let nueva = null

      if (archivo) {
        nueva = await uploadProductImage(archivo)
        imagen = nueva
      }

      const cambios = { ...datos }
      if (imagen !== undefined) cambios.imagen = imagen

      await updateProduct(id, cambios)

      if (nueva && producto.imagen) {
        await deleteProductImage(producto.imagen).catch(() => {})
      }

      navigate('/admin', { state: { actualizado: true } })
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="hoja">
        <div className="columna">
          <p className="recargando" role="status">
            Cargando producto
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
            <h1 className="vacio-titulo">No pudimos cargar el producto</h1>
            <p className="vacio-texto">{error}</p>
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => setIntento((previo) => previo + 1)}
            >
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
            <h1 className="vacio-titulo">No encontramos ese producto</h1>
            <p className="vacio-texto">
              Puede que se haya eliminado o que el enlace esté mal.
            </p>
            <Link to="/admin" className="boton boton-primario">
              Volver al listado
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hoja">
      <div className="columna">
        <div className="admin-cabecera">
          <div className="admin-cabecera-texto">
            <h1 className="seccion-titulo">{producto.nombre}</h1>
            <p className="admin-cabecera-ayuda">
              Los cambios se ven en el catálogo apenas se guardan.
            </p>
          </div>

          <Link to="/admin" className="boton boton-plano">
            Volver al listado
          </Link>
        </div>

        <ProductForm
          initialValues={producto}
          onSubmit={guardar}
          submitLabel="Guardar cambios"
          isSubmitting={guardando}
        />
      </div>
    </div>
  )
}

export default AdminEditarProducto
