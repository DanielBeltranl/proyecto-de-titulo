import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VistaHistorial.css';
import Background from '../../components/background/Background';
import HistorialCard from './HistorialCard';
import type { MatchSummary } from '../../components/matchResult/MatchResult';
import { obtenerResumenPartidos } from '../../../../../services/usuarioService';

const VistaHistorial = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerResumenPartidos()
      .then(res => setMatches(res.data as MatchSummary[]))
      .catch(err => console.error('[VistaHistorial] error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Background>
      <section className="historial-container">
        <div className="historial-header">
          <button className="historial-back" onClick={() => navigate(-1)}>
            ← Ver Perfil
          </button>
          <div>
            <h1 className="historial-title">Historial de Partidos</h1>
            <p className="historial-subtitle">Todos tus partidos finalizados</p>
          </div>
        </div>

        {loading && <p className="historial-state">Cargando partidos...</p>}

        {!loading && matches.length === 0 && (
          <p className="historial-state">No hay partidos finalizados aún.</p>
        )}

        {!loading && matches.length > 0 && (
          <div className="historial-list">
            {matches.map(m => (
              <HistorialCard key={m.id_match} match={m} />
            ))}
          </div>
        )}
      </section>
    </Background>
  );
};

export default VistaHistorial;
