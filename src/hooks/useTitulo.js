import { useEffect } from 'react'

const SUFIJO = ' · Café de Origen'
const BASE = 'Café de Origen'

/** Cada ruta deja su nombre real en la pestaña del navegador. */
export const useTitulo = (titulo) => {
  useEffect(() => {
    document.title = titulo ? `${titulo}${SUFIJO}` : BASE
  }, [titulo])
}
