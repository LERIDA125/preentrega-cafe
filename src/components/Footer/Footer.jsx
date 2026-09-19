const Footer = () => {
  const equipo = [
    { nombre: 'Valentina Ríos', rol: 'Fundadora y Maestra Tostadora' },
    { nombre: 'Matías Fernández', rol: 'Barista y Control de Calidad' },
    { nombre: 'Sofía Herrera', rol: 'Logística y Abastecimiento' },
  ]

  const iniciales = (nombre) =>
    nombre
      .split(' ')
      .map((palabra) => palabra[0])
      .join('')

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <h3>
          Café de <span>Origen</span>
        </h3>
        <p>Granos seleccionados, tostados artesanalmente y enviados a toda la región.</p>
        <p>contacto@cafedeorigen.com</p>
      </div>
      <div className="footer-team">
        {equipo.map((persona, index) => (
          <article className="team-card" key={index}>
            <span className="avatar" aria-hidden="true">
              {iniciales(persona.nombre)}
            </span>
            <h4>{persona.nombre}</h4>
            <p>{persona.rol}</p>
          </article>
        ))}
      </div>
    </footer>
  )
}

export default Footer