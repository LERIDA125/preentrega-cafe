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

const IconoCandado = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
    <path
      d="M5 7V5.5a3 3 0 0 1 6 0V7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect
      x="3.5"
      y="7"
      width="9"
      height="6.5"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

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
              <Link
                to="/login"
                className="pie-acceso"
                aria-label="Acceso al panel de administración"
              >
                <IconoCandado />
                Acceso
              </Link>
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
