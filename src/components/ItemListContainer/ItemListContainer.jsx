import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemList from '../ItemList/ItemList'

const obtenerCategorias = (productos) => {
  const set = new Set(productos.map((p) => p.categoria))
  return Array.from(set)
}

const ItemListContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const categoriaActiva = searchParams.get('categoria') || ''

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

  const categorias = useMemo(
    () => ['', ...obtenerCategorias(productos)],
    [productos]
  )

  const productosFiltrados = categoriaActiva
    ? productos.filter((p) => p.categoria === categoriaActiva)
    : productos

  const cambiarCategoria = (categoria) => {
    if (categoria) {
      setSearchParams({ categoria })
    } else {
      setSearchParams({})
    }
  }

  const titulo = categoriaActiva || 'Nuestros productos'

  return (
    <>
      <section className="hero">
        <img className="hero-bg" src="/img/hero.jpg" alt="" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <span className="hero-eyebrow">Especialidad en grano</span>
          <h1 className="hero-title">
            El café que <em>despierta</em> tus sentidos
          </h1>
          <p className="hero-subtitle">
            Granos seleccionados, tostados artesanalmente y preparados por
            baristas apasionados. Del campo directo a tu taza.
          </p>
          <a className="hero-cta" href="#catalogo">Ver catálogo</a>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="catalog-heading">
          <h2>{titulo}</h2>
          <span className="dot">•</span>
        </div>

        {!cargando && (
          <div className="catalog-chips" role="group" aria-label="Filtrar por categoría">
            {categorias.map((categoria) => {
              const etiqueta = categoria || 'Todos'
              return (
                <button
                  key={etiqueta}
                  className={`chip${categoriaActiva === categoria ? ' active' : ''}`}
                  onClick={() => cambiarCategoria(categoria)}
                >
                  {etiqueta}
                </button>
              )
            })}
          </div>
        )}

        {cargando ? (
          <div className="productos-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton-card" key={index}>
                <div className="skeleton-media" />
                <div className="skeleton-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line" style={{ width: '90%' }} />
                  <div className="skeleton-line" style={{ width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="estado">
            <h2>No hay productos</h2>
            <p>No encontramos productos en esta categoría.</p>
          </div>
        ) : (
          <ItemList productos={productosFiltrados} />
        )}
      </section>
    </>
  )
}

export default ItemListContainer