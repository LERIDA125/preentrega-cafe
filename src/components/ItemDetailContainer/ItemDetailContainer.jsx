import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ItemDetail from '../ItemDetail/ItemDetail'

const ItemDetailContainer = () => {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/productos.json')
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        const encontrado = datos.find((item) => String(item.id) === String(id))
        setProducto(encontrado || null)
        setCargando(false)
      })
      .catch((error) => {
        console.error('Error al cargar el producto:', error)
        setCargando(false)
      })
  }, [id])

  if (cargando) {
    return <div className="estado">Cargando producto...</div>
  }

  if (!producto) {
    return <div className="estado">Producto no encontrado</div>
  }

  return <ItemDetail producto={producto} />
}

export default ItemDetailContainer