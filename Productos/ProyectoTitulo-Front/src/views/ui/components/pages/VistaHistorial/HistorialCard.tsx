import React from 'react';
import type { MatchSummary } from '../../../components/matchResult/MatchResult';

const formatDuration = (s: number | null) => {
  if (!s) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

interface HistorialCardProps {
  match: MatchSummary;
}

const HistorialCard: React.FC<HistorialCardProps> = ({ match }) => {
  const { local_player, invited, guest_name, winner, sets, duration, location, surface, best_of, created_at } = match;

  const p2Name = invited
    ? `${invited.nombre} ${invited.apellidoPaterno}`.trim()
    : (guest_name ?? 'Invitado');

  const setsWonP1 = sets.filter(s => s.score_p1 > s.score_p2).length;
  const setsWonP2 = sets.filter(s => s.score_p2 > s.score_p1).length;
  const p1Won = winner !== null && winner.id === local_player.id;

  return (
    <article className="historial-card">
      <div className="historial-card-meta">
        <span className="historial-date">{formatDate(created_at)}</span>
        <span className="historial-meta-dot">·</span>
        <span className="historial-location">{location}</span>
        <span className="historial-meta-dot">·</span>
        <span className="historial-surface">{surface}</span>
        <span className="historial-meta-dot">·</span>
        <span className="historial-bestof">Al mejor de {best_of}</span>
      </div>

      <div className="historial-players">
        <div className="historial-player historial-player--p1">
          <span className={`historial-result-badge ${p1Won ? 'badge-win' : 'badge-loss'}`}>
            {p1Won ? 'V' : 'D'}
          </span>
          <span className="historial-player-name">
            {local_player.nombre} {local_player.apellidoPaterno}
          </span>
        </div>

        <div className="historial-score-center">
          <span className={p1Won ? 'score-win' : 'score-muted'}>{setsWonP1}</span>
          <span className="score-dash">–</span>
          <span className={!p1Won ? 'score-win' : 'score-muted'}>{setsWonP2}</span>
        </div>

        <div className="historial-player historial-player--p2">
          <span className="historial-player-name">{p2Name}</span>
          {!invited && <span className="historial-guest-tag">invitado</span>}
          <span className={`historial-result-badge ${!p1Won ? 'badge-win' : 'badge-loss'}`}>
            {!p1Won ? 'V' : 'D'}
          </span>
        </div>
      </div>

      <div className="historial-sets">
        {sets.map((s, i) => (
          <div key={i} className="historial-set">
            <span className="historial-set-label">Set {i + 1}</span>
            <span className={`historial-set-score ${s.score_p1 > s.score_p2 ? 'set-win' : 'set-loss'}`}>
              {s.score_p1}
            </span>
            <span className="set-sep">–</span>
            <span className={`historial-set-score ${s.score_p2 > s.score_p1 ? 'set-win' : 'set-loss'}`}>
              {s.score_p2}
            </span>
            {s.games.length > 0 && (
              <span className="historial-games">
                ({s.games.map((g, gi) => `${g.p1_game_final_score}-${g.p2_game_final_score}`).join(', ')})
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="historial-footer">
        <span className="historial-duration">⏱ {formatDuration(duration)}</span>
      </div>
    </article>
  );
};

export default HistorialCard;
