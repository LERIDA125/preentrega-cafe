import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { createProduct } from '../../services/productService'
import { deleteProductImage, uploadProductImage } from '../../services/imageService'
import { useTitulo } from '../../hooks/useTitulo'

/**
 * Alta de producto.
 *
 * Primero sube la imagen y recién después crea el documento: si la imagen falla,
 * no queda un producto a medias. Si el documento falla después de subir, borra
 * la imagen subida para no dejar basura en Storage.
 */
const AdminNuevoProducto = () => {
  useTitulo('Panel · Nuevo producto')

  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)

  const guardar = async (datos, imagen) => {
    if (!imagen) throw new Error('Elegí una imagen para el producto.')

    setEnviando(true)

    try {
      const url = await uploadProductImage(imagen)

      try {
        await createProduct({ ...datos, imagen: url, ancho: 900, alto: 900 })
      } catch (error) {
        await deleteProductImage(url).catch(() => {})
        throw error
      }

      navigate('/admin', { state: { creado: true } })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="hoja">
      <div className="columna">
        <div className="admin-cabecera">
          <div className="admin-cabecera-texto">
            <h1 className="seccion-titulo">Nuevo producto</h1>
            <p className="admin-cabecera-ayuda">
              La imagen se sube primero. Si algo falla, no se publica nada.
            </p>
          </div>

          <Link to="/admin" className="boton boton-plano">
            Volver al listado
          </Link>
        </div>

        <ProductForm onSubmit={guardar} submitLabel="Publicar producto" isSubmitting={enviando} />
      </div>
    </div>
  )
}

export default AdminNuevoProducto
