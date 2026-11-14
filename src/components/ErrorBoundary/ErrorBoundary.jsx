import { Component } from 'react'

/**
 * Red de seguridad para errores de render.
 *
 * No intenta adivinar qué se rompió: dice qué pasó y ofrece recargar, que es lo
 * único que una persona puede hacer desde acá.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { fallo: null }
  }

  static getDerivedStateFromError(fallo) {
    return { fallo }
  }

  componentDidCatch(fallo, info) {
    // En un proyecto real esto iría al reporte de errores del entorno.
    console.error('Error de render:', fallo, info?.componentStack)
  }

  render() {
    const { fallo } = this.state
    if (!fallo) return this.props.children

    return (
      <div className="falla" role="alert">
        <div className="falla-caja">
          <h1 className="falla-titulo">La página se rompió</h1>
          <p className="falla-texto">
            {fallo.message || 'Un componente falló al dibujarse.'} Recargá la página para
            seguir; tu carrito queda guardado.
          </p>
          <button type="button" className="boton boton-primario" onClick={() => window.location.reload()}>
            Recargar la página
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
