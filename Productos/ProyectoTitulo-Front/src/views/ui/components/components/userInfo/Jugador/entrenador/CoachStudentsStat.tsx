import { useEffect, useState } from "react";
import { obtenerJugadoresDelEntrenador } from "../../../../../../../services/usuarioService";

export const CoachStudentsStat = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    obtenerJugadoresDelEntrenador()
      .then((res) => setCount(res.data.length))
      .catch(() => setCount(null));
  }, []);

  return (
    <div className="stat">
      <span className="stat__value">{count ?? "–"}</span>
      <span className="stat__label">ALUMNOS</span>
    </div>
  );
};

export default CoachStudentsStat;
