import { useEffect, useRef, useState } from 'react'
import { MAX_BYTES, TIPOS_ACEPTADOS, validarImagen } from '../../services/imageService'

/**
 * Formulario de producto, reutilizable para alta y edición.
 *
 * Valida en el submit y entrega datos ya normalizados: números como número y
 * `notas` como array. La imagen viaja aparte como `File` para que la página
 * decida cuándo subirla. Un error del `onSubmit` conserva todo lo cargado.
 */

const CATEGORIAS = ['Calientes', 'Filtrados', 'Fríos', 'Para llevar']

const aFormulario = (producto) => ({
  nombre: producto?.nombre ?? '',
  descripcion: producto?.descripcion ?? '',
  precio: producto?.precio ?? '',
  stock: producto?.stock ?? '',
  categoria: producto?.categoria ?? '',
  lote: producto?.lote ?? '',
  origen: producto?.origen ?? '',
  altura: producto?.altura ?? '',
  variedad: producto?.variedad ?? '',
  proceso: producto?.proceso ?? '',
  punto: producto?.punto ?? '',
  notas: Array.isArray(producto?.notas) ? producto.notas.join(', ') : (producto?.notas ?? ''),
  metodo: producto?.metodo ?? '',
  rinde: producto?.rinde ?? '',
})

const esPositivo = (valor) =>
  valor !== '' && Number.isFinite(Number(valor)) && Number(valor) > 0

const esEnteroNoNegativo = (valor) =>
  valor !== '' && Number.isInteger(Number(valor)) && Number(valor) >= 0

const validar = (valores) => {
  const errores = {}

  if (valores.nombre.trim().length < 3) {
    errores.nombre = 'Ingresá un nombre de al menos 3 caracteres.'
  }
  if (valores.descripcion.trim().length < 10) {
    errores.descripcion = 'Ingresá una descripción de al menos 10 caracteres.'
  }
  if (!esPositivo(valores.precio)) {
    errores.precio = 'El precio tiene que ser mayor a 0.'
  }
  if (!esEnteroNoNegativo(valores.stock)) {
    errores.stock = 'El stock tiene que ser un entero de 0 o más.'
  }
  if (!esPositivo(valores.altura)) {
    errores.altura = 'La altitud tiene que ser mayor a 0.'
  }

  for (const campo of ['categoria', 'lote', 'origen', 'variedad', 'proceso', 'punto']) {
    if (!valores[campo].trim()) errores[campo] = 'Este campo es obligatorio.'
  }

  const notas = valores.notas.split(',').map((nota) => nota.trim()).filter(Boolean)
  if (notas.length === 0) {
    errores.notas = 'Ingresá al menos una nota, separadas por coma.'
  }

  return errores
}

const aDatos = (valores) => {
  const datos = {
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    precio: Number(valores.precio),
    stock: Number(valores.stock),
    categoria: valores.categoria.trim(),
    lote: valores.lote.trim(),
    origen: valores.origen.trim(),
    altura: Number(valores.altura),
    variedad: valores.variedad.trim(),
    proceso: valores.proceso.trim(),
    punto: valores.punto.trim(),
    notas: valores.notas.split(',').map((nota) => nota.trim()).filter(Boolean),
  }

  const metodo = valores.metodo.trim()
  const rinde = valores.rinde.trim()
  if (metodo) datos.metodo = metodo
  if (rinde) datos.rinde = rinde

  return datos
}

/** Campo con etiqueta, ayuda y error asociados por id. */
const Campo = ({ nombre, etiqueta, ayuda, error, ancho = false, children }) => {
  const idAyuda = `${nombre}-ayuda`
  const idError = `${nombre}-error`

  return (
    <div className={`campo${ancho ? ' campo-ancho' : ''}`}>
      <label className="campo-etiqueta" htmlFor={nombre}>
        {etiqueta}
      </label>
      {children({
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? idError : ayuda ? idAyuda : undefined,
      })}
      {ayuda && !error && (
        <span className="campo-ayuda" id={idAyuda}>
          {ayuda}
        </span>
      )}
      {error && (
        <span className="campo-error" id={idError} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

const ProductForm = ({ initialValues, onSubmit, submitLabel = 'Publicar producto', isSubmitting = false }) => {
  const [valores, setValores] = useState(() => aFormulario(initialValues))
  const [errores, setErrores] = useState({})
  const [imagen, setImagen] = useState(null)
  const [vista, setVista] = useState(initialValues?.imagen ?? null)
  const [errorGeneral, setErrorGeneral] = useState(null)
  const formulario = useRef(null)

  useEffect(() => {
    if (!imagen) return undefined
    const url = URL.createObjectURL(imagen)
    setVista(url)
    return () => URL.revokeObjectURL(url)
  }, [imagen])

  const quitarError = (campo) =>
    setErrores((previos) => {
      if (!previos[campo]) return previos
      const copia = { ...previos }
      delete copia[campo]
      return copia
    })

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setValores((previos) => ({ ...previos, [name]: value }))
    setErrorGeneral(null)
    quitarError(name)
  }

  const elegirImagen = (evento) => {
    const archivo = evento.target.files?.[0] ?? null

    if (!archivo) {
      setImagen(null)
      setVista(initialValues?.imagen ?? null)
      quitarError('imagen')
      return
    }

    const invalido = validarImagen(archivo)
    if (invalido) {
      setImagen(null)
      setErrores((previos) => ({ ...previos, imagen: invalido }))
      return
    }

    setImagen(archivo)
    quitarError('imagen')
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    if (isSubmitting) return

    const nuevos = validar(valores)
    const requisitoImagen = !initialValues?.imagen
    const errorImagen = imagen
      ? validarImagen(imagen)
      : requisitoImagen
        ? 'Elegí una imagen para el producto.'
        : null

    if (errorImagen) nuevos.imagen = errorImagen

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos)
      requestAnimationFrame(() => {
        formulario.current?.querySelector('[aria-invalid="true"]')?.focus()
      })
      return
    }

    setErrores({})
    setErrorGeneral(null)

    try {
      await onSubmit(aDatos(valores), imagen)
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : 'No pudimos guardar el producto.'
      )
    }
  }

  const conectar = (campo) => ({
    id: campo,
    name: campo,
    value: valores[campo],
    onChange: cambiar,
    disabled: isSubmitting,
  })

  return (
    <form className="form-producto" onSubmit={enviar} noValidate ref={formulario}>
      <fieldset className="form-grilla" disabled={isSubmitting}>
        <Campo nombre="nombre" etiqueta="Nombre" error={errores.nombre} ancho>
          {(props) => <input type="text" {...conectar('nombre')} {...props} />}
        </Campo>

        <Campo
          nombre="descripcion"
          etiqueta="Descripción"
          error={errores.descripcion}
          ayuda="Qué lo hace distinto, en una o dos frases."
          ancho
        >
          {(props) => <textarea rows={3} {...conectar('descripcion')} {...props} />}
        </Campo>

        <Campo nombre="precio" etiqueta="Precio (ARS)" error={errores.precio}>
          {(props) => <input type="number" min="0" step="1" {...conectar('precio')} {...props} />}
        </Campo>

        <Campo nombre="stock" etiqueta="Stock" error={errores.stock}>
          {(props) => <input type="number" min="0" step="1" {...conectar('stock')} {...props} />}
        </Campo>

        <Campo
          nombre="categoria"
          etiqueta="Categoría"
          error={errores.categoria}
          ayuda="Podés elegir una existente o escribir una nueva."
        >
          {(props) => (
            <>
              <input type="text" list="categorias-producto" {...conectar('categoria')} {...props} />
              <datalist id="categorias-producto">
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria} />
                ))}
              </datalist>
            </>
          )}
        </Campo>

        <Campo nombre="lote" etiqueta="Lote" error={errores.lote}>
          {(props) => <input type="text" {...conectar('lote')} {...props} />}
        </Campo>

        <Campo nombre="origen" etiqueta="Origen" error={errores.origen}>
          {(props) => <input type="text" {...conectar('origen')} {...props} />}
        </Campo>

        <Campo nombre="altura" etiqueta="Altura (msnm)" error={errores.altura}>
          {(props) => <input type="number" min="0" step="1" {...conectar('altura')} {...props} />}
        </Campo>

        <Campo nombre="variedad" etiqueta="Variedad" error={errores.variedad}>
          {(props) => <input type="text" {...conectar('variedad')} {...props} />}
        </Campo>

        <Campo nombre="proceso" etiqueta="Proceso" error={errores.proceso}>
          {(props) => <input type="text" {...conectar('proceso')} {...props} />}
        </Campo>

        <Campo nombre="punto" etiqueta="Punto de tueste" error={errores.punto}>
          {(props) => <input type="text" {...conectar('punto')} {...props} />}
        </Campo>

        <Campo
          nombre="notas"
          etiqueta="Notas de cata"
          error={errores.notas}
          ayuda="Separadas por coma. Ejemplo: Cacao, Panela, Especias."
          ancho
        >
          {(props) => <input type="text" {...conectar('notas')} {...props} />}
        </Campo>

        <Campo
          nombre="metodo"
          etiqueta="Método (opcional)"
          ayuda="Lo usa la calculadora: espresso, chemex, prensa o v60."
        >
          {(props) => <input type="text" {...conectar('metodo')} {...props} />}
        </Campo>

        <Campo nombre="rinde" etiqueta="Rinde (opcional)">
          {(props) => <input type="text" {...conectar('rinde')} {...props} />}
        </Campo>

        <div className="campo campo-ancho">
          <label className="campo-etiqueta" htmlFor="imagen">
            Imagen
          </label>

          <div className="form-imagen">
            {vista ? (
              <img src={vista} alt="" width="96" height="96" />
            ) : (
              <span className="form-imagen-vacia">Sin imagen</span>
            )}

            <div className="form-imagen-archivo">
              <input
                id="imagen"
                name="imagen"
                type="file"
                accept={TIPOS_ACEPTADOS.join(',')}
                onChange={elegirImagen}
                disabled={isSubmitting}
                aria-invalid={errores.imagen ? 'true' : undefined}
                aria-describedby={errores.imagen ? 'imagen-error' : 'imagen-ayuda'}
              />
              <span className="campo-ayuda" id="imagen-ayuda">
                JPG, PNG o WebP. Máximo {MAX_BYTES / (1024 * 1024)} MB.
                {initialValues?.imagen ? ' Si no elegís una, se mantiene la actual.' : ''}
              </span>
            </div>
          </div>

          {errores.imagen && (
            <span className="campo-error" id="imagen-error" role="alert">
              {errores.imagen}
            </span>
          )}
        </div>
      </fieldset>

      {errorGeneral && (
        <p className="aviso aviso-aviso" role="alert">
          {errorGeneral}
        </p>
      )}

      <div className="form-acciones">
        <button type="submit" className="boton boton-primario" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
