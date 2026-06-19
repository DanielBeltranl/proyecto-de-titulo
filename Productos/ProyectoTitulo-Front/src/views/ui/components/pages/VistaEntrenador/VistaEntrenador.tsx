import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VistaEntrenador.css';
import Background from '../../components/background/Background';
import MatchCard, { type DashboardPartido } from './MatchCard';
import FeaturedMatch from './FeaturedMatch';
import { obtenerDashboardEntrenador } from '../../../../../services/usuarioService';

const VistaEntrenador = () => {
  const navigate = useNavigate();

  const usuario = useMemo(() => {
    try {
      const str = sessionStorage.getItem('usuario');
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }, []);

  const [partidos, setPartidos] = useState<DashboardPartido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDashboardEntrenador()
      .then(res => setPartidos(res.data.partidos as DashboardPartido[]))
      .catch(err => console.error('Error cargando dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredMatch = partidos[0] ?? null;
  const restMatches = partidos.slice(1);

  return (
    <Background>
      <section className="vista-entrenador-container">
        <div className="trainer-title-section">
          <h3 className="section-title">Últimos partidos de tus jugadores</h3>
        </div>

        <div className="trainer-grid">
          <div className="trainer-matches-section">
            {loading && (
              <p className="dashboard-loading">Cargando partidos...</p>
            )}

            {!loading && partidos.length === 0 && (
              <p className="dashboard-empty">
                Ninguno de tus jugadores ha disputado partidos aún.
              </p>
            )}

            {!loading && partidos.length > 0 && featuredMatch && (
              <>
                <FeaturedMatch partido={featuredMatch} />

                {restMatches.length > 0 && (
                  <div className="matches-list">
                    {restMatches.map(p => (
                      <MatchCard key={p.id_match} partido={p} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="trainer-side-column">
            <div className="trainer-info-card">
              <h2>Bienvenido, <strong>{usuario?.nombre || 'Entrenador'}</strong></h2>
              <p>Panel de control para entrenadores profesionales</p>
            </div>

            <div className="trainer-cta">
              <button
                type="button"
                className="trainer-cta-button"
                onClick={() => navigate('/agendamiento')}
              >
                Agenda un partido
              </button>
              <p className="trainer-cta-message">
                Crea una sesión de juego. Elige la modalidad, lugar, superficie y rival.
              </p>
            </div>

            <div className="trainer-cta">
              <button
                type="button"
                className="trainer-cta-button"
                onClick={() => navigate('/partidos')}
              >
                Mis partidos
              </button>
              <p className="trainer-cta-message">
                Ve los partidos que has agendado tú y a los que tus alumnos han sido invitados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Background>
  );
};

export default VistaEntrenador;
