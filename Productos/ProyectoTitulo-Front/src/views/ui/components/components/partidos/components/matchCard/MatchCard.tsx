import React from 'react';
import styles from './MatchCard.module.css';
import type { MatchItem, MatchState, Surface } from '../../model/partidosModel';

const STATE_LABELS: Record<MatchState, string> = {
  PENDIENTE: 'Pendiente',
  ACEPTADO: 'Aceptado',
  INICIADO: 'En curso',
  PAUSADO: 'Pausado',
  FINALIZADA: 'Finalizado',
};

const STATE_STYLE: Record<MatchState, string> = {
  PENDIENTE: styles.statePENDIENTE,
  ACEPTADO: styles.stateACEPTADO,
  INICIADO: styles.stateINICIADO,
  PAUSADO: styles.statePAUSADO,
  FINALIZADA: styles.stateFINALIZADA,
};

const SURFACE_LABELS: Record<Surface, string> = {
  Clay: 'Arcilla',
  Hard: 'Dura',
  Grass: 'Césped',
};

const SURFACE_STYLE: Record<Surface, string> = {
  Clay: styles.surfaceClay,
  Hard: styles.surfaceHard,
  Grass: styles.surfaceGrass,
};

const SURFACE_COLORS: Record<Surface, string> = {
  Clay: '#c9622a',
  Hard: '#4a90d9',
  Grass: '#5a9c5a',
};

const DEFAULT_CARD_BACKGROUND = '#1f1f1f';

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getSurfaceBackground = (surface: Surface): string => {
  const color = SURFACE_COLORS[surface];
  if (!color) return DEFAULT_CARD_BACKGROUND;
  const tint = hexToRgba(color, 0.22);
  return `linear-gradient(${tint}, ${tint}), ${DEFAULT_CARD_BACKGROUND}`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

interface MatchCardProps {
  match: MatchItem;
  rivalLabel: string;
  rivalRoleLabel: string;
  onClick: () => void;
  onAccept?: () => void;
  showStartCta?: boolean;
  showWaitingCta?: boolean;
  showScoreCta?: boolean;
  showContinueCta?: boolean;
  actionLoading?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  rivalLabel,
  rivalRoleLabel,
  onClick,
  onAccept,
  showStartCta,
  showWaitingCta,
  showScoreCta,
  showContinueCta,
  actionLoading,
}) => {
  const hasActions = Boolean(onAccept || showStartCta || showWaitingCta || showScoreCta || showContinueCta);

  return (
    <article className={styles.card} style={{ background: getSurfaceBackground(match.surface) }}>
      <div
        className={styles.cardBody}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      >
        <div className={styles.cardTop}>
          <div className={styles.rival}>
            <div className={styles.rivalAvatar}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className={styles.rivalInfo}>
              <span className={styles.rivalLabel}>{rivalRoleLabel}</span>
              <span className={styles.rivalName}>{rivalLabel}</span>
            </div>
          </div>
          <span className={`${styles.stateBadge} ${STATE_STYLE[match.match_state]}`}>
            {STATE_LABELS[match.match_state]}
          </span>
        </div>

        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <span className="material-symbols-outlined">location_on</span>
            <span>{match.location}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={`${styles.surfaceChip} ${SURFACE_STYLE[match.surface]}`}>
              {SURFACE_LABELS[match.surface]}
            </span>
            <span className={styles.bestOf}>Bo{match.best_of}</span>
            <span className={styles.date}>{formatDate(match.created_at)}</span>
          </div>
        </div>

        {!hasActions && (
          <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
        )}
      </div>

      {hasActions && (
        <div className={styles.cardActions}>
          {onAccept && (
            <button
              className={styles.btnAccept}
              onClick={onAccept}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
              ) : (
                <span className="material-symbols-outlined">check_circle</span>
              )}
              <span>Aceptar</span>
            </button>
          )}
          {showStartCta && (
            <button className={styles.btnStart} onClick={onClick}>
              <span className="material-symbols-outlined">play_circle</span>
              <span>Comenzar partido</span>
            </button>
          )}
          {showWaitingCta && (
            <button className={styles.btnWaiting} disabled>
              <span className="material-symbols-outlined">hourglass_empty</span>
              <span>Esperando inicio</span>
            </button>
          )}
          {showScoreCta && (
            <button className={styles.btnScore} onClick={onClick}>
              <span className="material-symbols-outlined">scoreboard</span>
              <span>Ver marcador</span>
            </button>
          )}
          {showContinueCta && (
            <button className={styles.btnContinue} onClick={onClick}>
              <span className="material-symbols-outlined">play_circle</span>
              <span>Continuar partido</span>
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default MatchCard;
