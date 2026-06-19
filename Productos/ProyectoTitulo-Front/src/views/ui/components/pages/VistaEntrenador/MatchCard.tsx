import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardJugador {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  nivelUsuario: string;
}

interface DashboardOponente {
  nombre: string;
  apellidoPaterno: string;
  es_invitado: boolean;
}

interface DashboardSet {
  set_number: number;
  jugador: number;
  oponente: number;
}

export interface DashboardPartido {
  id_match: string;
  jugador: DashboardJugador;
  oponente: DashboardOponente;
  marcador_global: { jugador: number; oponente: number };
  sets: DashboardSet[];
  duration: number | null;
  location: string;
  surface: string;
  created_at: string;
}

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

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

interface MatchCardProps {
  partido: DashboardPartido;
}

const MatchCard: React.FC<MatchCardProps> = ({ partido }) => {
  const navigate = useNavigate();
  const { jugador, oponente, marcador_global, sets, duration, location, surface } = partido;

  const oponenteName = oponente.es_invitado
    ? oponente.nombre
    : `${oponente.nombre} ${oponente.apellidoPaterno}`.trim();

  const jugadorWon = marcador_global.jugador > marcador_global.oponente;

  return (
    <article
      className="match-card"
      onClick={() => navigate(`/match-stats/${partido.id_match}`)}
      style={{ cursor: 'pointer', background: getSurfaceBackground(surface) }}
    >
      <div className="match-card-header">
        <span className={`match-result-badge ${jugadorWon ? 'match-win' : 'match-loss'}`}>
          {jugadorWon ? 'V' : 'D'}
        </span>

        <div className="match-player-info">
          <span className="match-player-name">
            {jugador.nombre} {jugador.apellidoPaterno}
          </span>
          <span className="match-player-level">{jugador.nivelUsuario}</span>
        </div>

        <span className="match-vs">vs</span>

        <div className="match-opponent-info">
          <span className="match-player-name">{oponenteName}</span>
          {oponente.es_invitado && <span className="match-guest-tag">invitado</span>}
        </div>
      </div>

      <div className="match-score-section">
        <div className="match-global-score">
          <span className={jugadorWon ? 'score-win' : 'score-neutral'}>
            {marcador_global.jugador}
          </span>
          <span className="score-separator">–</span>
          <span className={!jugadorWon ? 'score-win' : 'score-neutral'}>
            {marcador_global.oponente}
          </span>
        </div>

        <div className="match-sets-detail">
          {sets.map(s => (
            <span key={s.set_number} className="set-chip">
              {s.jugador}–{s.oponente}
            </span>
          ))}
        </div>
      </div>

      <div className="match-card-footer">
        <span className="match-meta">{location}</span>
        <span className="match-meta">{getSurfaceLabel(surface)}</span>
        <span className="match-meta">{formatDuration(duration)}</span>
        <span className="match-card-affordance">Ver detalle ›</span>
      </div>
    </article>
  );
};

export default MatchCard;
