import UserInfo from '../../components/userInfo/Jugador/UserInfo';
import StatsCTA from '../../components/statsComponents/StatsCTA';
import MatchResult, { type MatchSummary } from '../../components/matchResult/MatchResult';
import MatchHistory from '../../components/matchistory/MatchHistory';
import './VistaJugador.css';
import Background from '../../components/background/Background';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerResumenPartidos } from '../../../../../services/usuarioService';


const VistaJugador = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const lastMatch = matches[0] ?? null;

  useEffect(() => {
    obtenerResumenPartidos()
      .then(res => setMatches(res.data as MatchSummary[]))
      .catch(err => console.error('[VistaJugador] error cargando partidos:', err));
  }, []);

  return (
    <Background>
    <div className="vista-jugador-title-section">
      <h2 className="vista-jugador-title">Historial de Partidos Recientes</h2>
    </div>

    <section className="vista-jugador-container">
    <div className="match-result">

        {lastMatch
          ? <MatchResult match={lastMatch} />
          : <p className="no-match-message">No hay partidos registrados aún.</p>
        }

        <MatchHistory matches={matches} />
    </div>

    <div className="user-info-and-stats">
      <div className="user-info">
        <UserInfo />
      </div>

        <StatsCTA
            title="Estadísticas Globales"
            subtitle="Acá podrás ver tus estadísticas de los últimos 14 partidos."
            buttonText="Ver estadísticas detalladas"
            onClick={() => navigate('/estadisticas-globales')}
        />
    </div>


    </section>
    </Background>
  );

}

export default VistaJugador;