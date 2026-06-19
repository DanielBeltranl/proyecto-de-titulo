import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MatchResult.module.css';

interface MatchPlayer {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
}

interface MatchSet {
  score_p1: number;
  score_p2: number;
  games: { p1_game_final_score: number; p2_game_final_score: number }[];
}

export interface MatchSummary {
  id_match: string;
  local_player: MatchPlayer;
  invited: MatchPlayer | null;
  guest_name: string | null;
  location: string;
  surface: string;
  best_of: number;
  match_state: string;
  winner: MatchPlayer | null;
  duration: number | null;
  sets: MatchSet[];
  created_at: string;
}

interface MatchResultProps {
  match: MatchSummary;
  tag?: string;
}

const SURFACE_COLORS: Record<string, string> = {
  clay: '#c9622a',
  hard: '#4a90d9',
  grass: '#5a9c5a',
};

const DEFAULT_CARD_BACKGROUND = '#121212';

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getSurfaceBackground = (surface: string): string => {
  if (!surface) return DEFAULT_CARD_BACKGROUND;
  const color = SURFACE_COLORS[surface.toLowerCase()];
  if (!color) return DEFAULT_CARD_BACKGROUND;
  const tint = hexToRgba(color, 0.22);
  return `linear-gradient(${tint}, ${tint}), ${DEFAULT_CARD_BACKGROUND}`;
};

const SURFACE_LABELS: Record<string, string> = {
  clay: 'Arcilla',
  hard: 'Dura',
  grass: 'Césped',
};

export const getSurfaceLabel = (surface: string): string => {
  if (!surface) return surface;
  return SURFACE_LABELS[surface.toLowerCase()] ?? surface;
};

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const MatchResult: React.FC<MatchResultProps> = ({ match, tag = 'ÚLTIMO PARTIDO' }) => {
  const navigate = useNavigate();
  const { local_player, invited, guest_name, winner, sets, duration, location, surface } = match;

  const p1Name = `${local_player.nombre} ${local_player.apellidoPaterno}`.trim();
  const p2Name = invited
    ? `${invited.nombre} ${invited.apellidoPaterno}`.trim()
    : (guest_name ?? 'Invitado');

  const setsWonP1 = sets.filter(s => s.score_p1 > s.score_p2).length;
  const setsWonP2 = sets.filter(s => s.score_p2 > s.score_p1).length;
  const p1Won = winner !== null && winner.id === local_player.id;

  return (
    <section
      className={styles.container}
      onClick={() => navigate(`/match-stats/${match.id_match}`)}
      style={{ cursor: 'pointer', background: getSurfaceBackground(surface) }}
    >
      <div className={styles.badgeContainer}>
        <span className={styles.badge}>{tag}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainGrid}>

          <div className={`${styles.playerInfo} ${styles.player1}`}>
            <div className={styles.spacer}></div>
            <h2 className={styles.playerName}>{p1Name}</h2>
            <span className={styles.playerStatus}>{p1Won ? 'GANADOR' : 'PERDEDOR'}</span>
          </div>

          <div className={styles.scoreCenter}>
            <div className={styles.mainScore}>
              <span className={p1Won ? styles.scoreWinner : styles.scoreLoser}>{setsWonP1}</span>
              <span className={styles.scoreDivider}>—</span>
              <span className={!p1Won ? styles.scoreWinner : styles.scoreLoser}>{setsWonP2}</span>
            </div>
            <div className={styles.setResults}>
              {sets.map((s, i) => (
                <span key={i} className={styles.setBadge}>{s.score_p1}–{s.score_p2}</span>
              ))}
            </div>
          </div>

          <div className={`${styles.playerInfo} ${styles.player2}`}>
            <h3 className={styles.opponentLabel}>Rival</h3>
            <h2 className={styles.opponentName}>{p2Name}</h2>
            <span className={styles.opponentStatus}>{!p1Won ? 'GANADOR' : 'PERDEDOR'}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.metaItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{formatDuration(duration)}</span>
          </div>
          <div className={styles.metaItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 9C18 13.7462 14.2456 18.4924 12.6765 20.2688C12.3109 20.6827 11.6891 20.6827 11.3235 20.2688C9.75444 18.4924 6 13.7462 6 9C6 7 7.5 3 12 3C16.5 3 18 7 18 9Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="2" stroke="currentColor" />
            </svg>
            <span>{location}</span>
          </div>
          <div className={styles.metaItem}>
            <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none"
              stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="256" cy="256" r="220" />
              <path d="M80 250 Q256 90 432 250" />
              <path d="M80 300 Q256 150 440 300" />
            </svg>
            <span>{getSurfaceLabel(surface)}</span>
          </div>
          <span className={styles.affordance}>Ver estadísticas ›</span>
        </div>
      </div>
    </section>
  );
};

export default MatchResult;
