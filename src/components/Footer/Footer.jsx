import { Link } from 'react-router-dom'

const EQUIPO = [
  { nombre: 'Valentina Ríos', rol: 'Fundadora y maestra tostadora' },
  { nombre: 'Matías Fernández', rol: 'Barista y control de calidad' },
  { nombre: 'Sofía Herrera', rol: 'Logística y abastecimiento' },
]

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .map((palabra) => palabra[0])
    .join('')

const Footer = () => {
  return (
    <footer className="pie">
      <div className="hoja pie-hoja">
        <div className="columna">
          <div className="pie-cuerpo">
            <div className="pie-marca">
              <p className="pie-nombre">Café de Origen</p>
              <p className="pie-texto">
                Compramos por origen y tostamos en lotes de un kilo. Cualquier consulta escribinos a
                contacto@cafedeorigen.com
              </p>
            </div>

            <nav className="pie-links" aria-label="Del sitio">
              <Link to="/">Catálogo</Link>
              <Link to="/receta">Calculadora de receta</Link>
              <Link to="/carrito">Carrito</Link>
            </nav>

            <ul className="pie-equipo">
              {EQUIPO.map((persona) => (
                <li key={persona.nombre} className="pie-persona">
                  <span className="pie-iniciales" aria-hidden="true">
                    {iniciales(persona.nombre)}
                  </span>
                  <span>
                    <span className="pie-persona-nombre">{persona.nombre}</span>
                    <span className="pie-persona-rol">{persona.rol}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
