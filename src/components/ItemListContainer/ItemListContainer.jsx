import { useEffect, useState } from 'react'
import ItemList from '../ItemList/ItemList'

const ItemListContainer = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/productos.json')
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos)
        setCargando(false)
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error)
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return <div>Cargando productos...</div>
  }

  return (
    <section>
      <ItemList productos={productos} />
    </section>
  )
}

export default ItemListContainer