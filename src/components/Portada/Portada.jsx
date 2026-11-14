import { Link } from "react-router-dom";
import CurvaTueste from "../CurvaTueste/CurvaTueste";

const Portada = () => {
  return (
    <>
      <section className="hero-portada" aria-labelledby="portada-titulo">
        <div className="hero-overlay">
          <h1 id="portada-titulo" className="portada-titulo">
            Cada grano tiene un registro
          </h1>
          <p className="portada-bajada">
            Compramos café de especialidad por origen y tostamos en lotes de un
            kilo. Cada lote lleva su curva, que podés recorrer acá abajo.
          </p>
          <Link to="/#catalogo" className="boton boton-primario hero-boton">
            Ver el catálogo
          </Link>
        </div>
      </section>

      <section className="seccion-curva">
        <CurvaTueste />
      </section>
    </>
  );
};

export default Portada;
