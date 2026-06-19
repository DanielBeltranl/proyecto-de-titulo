import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MatchHistory.module.css';
import type { MatchSummary } from '../matchResult/MatchResult';
import { getSurfaceBackground, getSurfaceLabel } from '../matchResult/MatchResult';

const deriveRow = (match: MatchSummary) => {
  const opponentName = match.invited
    ? `${match.invited.nombre} ${match.invited.apellidoPaterno}`.trim()
    : (match.guest_name ?? 'Invitado');

  const setsWonP1 = match.sets.filter(s => s.score_p1 > s.score_p2).length;
  const setsWonP2 = match.sets.filter(s => s.score_p2 > s.score_p1).length;
  const p1Won = match.winner !== null && match.winner.id === match.local_player.id;

  return {
    opponentName,
    location: match.location,
    surface: getSurfaceLabel(match.surface),
    result: `${p1Won ? 'G' : 'P'} ${setsWonP1}–${setsWonP2}`,
  };
};

const MatchHistoryRow: React.FC<{ match: MatchSummary }> = ({ match }) => {
  const navigate = useNavigate();
  const { opponentName, location, surface, result } = deriveRow(match);

  return (
    <div
      className={styles.row}
      onClick={() => navigate(`/match-stats/${match.id_match}`)}
      style={{ cursor: 'pointer', background: getSurfaceBackground(match.surface) }}
    >
      <div className={styles.playerInfo}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarPlaceholder}>
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
        <div className={styles.playerText}>
          <div className={styles.opponentName}>{opponentName}</div>
          <div className={styles.tournamentName}>{location}</div>
        </div>
      </div>

      <div className={styles.matchStats}>
        <div className={styles.surfaceInfo}>
          <div className={styles.label}>SUPERFICIE</div>
          <div className={styles.surfaceValue}>{surface}</div>
        </div>
        <div className={styles.resultBox}>{result}</div>
        <span className={styles.affordance} aria-hidden="true">›</span>
      </div>
    </div>
  );
};

interface MatchHistoryProps {
  matches: MatchSummary[];
  season?: string;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches, season = '2026' }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className={styles.season}>TEMPORADA {season}</span>
      </div>

      <div className={styles.list}>
        {matches.length === 0 ? (
          <p className={styles.empty}>No hay partidos en el historial aún.</p>
        ) : (
          matches.map(match => (
            <MatchHistoryRow key={match.id_match} match={match} />
          ))
        )}
      </div>

      <button className={styles.viewMoreBtn} onClick={() => navigate('/historial')}>
        Ver Historial Completo
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};

export default MatchHistory;
