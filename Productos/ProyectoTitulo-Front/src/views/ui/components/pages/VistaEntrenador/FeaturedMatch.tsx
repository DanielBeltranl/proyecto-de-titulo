import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSurfaceBackground, getSurfaceLabel, type DashboardPartido } from './MatchCard';

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

interface FeaturedMatchProps {
  partido: DashboardPartido;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ partido }) => {
  const navigate = useNavigate();
  const { jugador, oponente, marcador_global, sets, duration, location, surface } = partido;

  const oponenteName = oponente.es_invitado
    ? oponente.nombre
    : `${oponente.nombre} ${oponente.apellidoPaterno}`.trim();

  const jugadorWon = marcador_global.jugador > marcador_global.oponente;

  return (
    <section
      className="featured-match"
      onClick={() => navigate(`/match-stats/${partido.id_match}`)}
      style={{ cursor: 'pointer', background: getSurfaceBackground(surface) }}
    >
      <div className="featured-match-badge-wrap">
        <span className="featured-match-badge">ÚLTIMO PARTIDO</span>
      </div>

      <div className="featured-match-content">
        <div className="featured-match-grid">
          <div className="featured-match-player featured-match-player-left">
            <h2 className="featured-match-player-name">
              {jugador.nombre} {jugador.apellidoPaterno}
            </h2>
            <span className={jugadorWon ? 'featured-match-status-win' : 'featured-match-status-loss'}>
              {jugadorWon ? 'GANADOR' : 'PERDEDOR'}
            </span>
          </div>

          <div className="featured-match-score-center">
            <div className="featured-match-score">
              <span className={jugadorWon ? 'featured-score-winner' : 'featured-score-loser'}>
                {marcador_global.jugador}
              </span>
              <span className="featured-score-divider">—</span>
              <span className={!jugadorWon ? 'featured-score-winner' : 'featured-score-loser'}>
                {marcador_global.oponente}
              </span>
            </div>
            <div className="featured-match-sets">
              {sets.map(s => (
                <span key={s.set_number} className="featured-set-chip">
                  {s.jugador}–{s.oponente}
                </span>
              ))}
            </div>
          </div>

          <div className="featured-match-player featured-match-player-right">
            <h3 className="featured-match-opponent-label">Oponente</h3>
            <h2 className="featured-match-opponent-name">{oponenteName}</h2>
            <span className={!jugadorWon ? 'featured-match-status-win' : 'featured-match-status-loss'}>
              {!jugadorWon ? 'GANADOR' : 'PERDEDOR'}
            </span>
          </div>
        </div>

        <div className="featured-match-footer">
          <span className="featured-match-meta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {formatDuration(duration)}
          </span>
          <span className="featured-match-meta">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 9C18 13.7462 14.2456 18.4924 12.6765 20.2688C12.3109 20.6827 11.6891 20.6827 11.3235 20.2688C9.75444 18.4924 6 13.7462 6 9C6 7 7.5 3 12 3C16.5 3 18 7 18 9Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="2" stroke="currentColor" />
            </svg>
            {location}
          </span>
          <span className="featured-match-meta">
            <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none"
              stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="256" cy="256" r="220" />
              <path d="M80 250 Q256 90 432 250" />
              <path d="M80 300 Q256 150 440 300" />
            </svg>
            {getSurfaceLabel(surface)}
          </span>
          <span className="featured-match-affordance">Ver estadísticas ›</span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMatch;
