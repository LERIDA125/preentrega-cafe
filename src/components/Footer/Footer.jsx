const Footer = () => {
  const equipo = [
    { nombre: 'Valentina Ríos', rol: 'Fundadora y Maestra Tostadora' },
    { nombre: 'Matías Fernández', rol: 'Barista y Control de Calidad' },
    { nombre: 'Sofía Herrera', rol: 'Logística y Abastecimiento' },
  ]

  return (
    <footer>
      <div>
        <h3>Café de Origen</h3>
        <p>Granos seleccionados, tostados artesanalmente y enviados a toda la región.</p>
        <p>contacto@cafedeorigen.com</p>
      </div>
      <div>
        {equipo.map((persona, index) => (
          <article key={index}>
            <h4>{persona.nombre}</h4>
            <p>{persona.rol}</p>
          </article>
        ))}
      </div>
    </footer>
  )
}

export default Footer