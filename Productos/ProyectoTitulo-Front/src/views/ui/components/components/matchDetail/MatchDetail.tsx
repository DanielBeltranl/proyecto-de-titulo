import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MatchDetail.module.css';
import { useMatchDetail } from './controller/useMatchDetail';
import ServerSelector from './components/serverSelector/ServerSelector';
import type { MatchState, Surface, BestOf, UserRole } from './model/matchDetailModel';

const STATE_LABELS: Record<MatchState, string> = {
  PENDIENTE: 'Pendiente',
  ACEPTADO: 'Aceptado',
  INICIADO: 'En curso',
  PAUSADO: 'Pausado',
  FINALIZADA: 'Finalizado',
};

const SURFACE_LABELS: Record<Surface, string> = {
  Clay: 'Arcilla',
  Hard: 'Dura',
  Grass: 'Césped',
};

const SURFACE_ICONS: Record<Surface, string> = {
  Clay: '🟤',
  Hard: '🔵',
  Grass: '🟢',
};

const BEST_OF_LABELS: Record<BestOf, string> = {
  1: 'Al mejor de 1 set',
  3: 'Al mejor de 3 sets',
  5: 'Al mejor de 5 sets',
};

const SURFACE_COLORS: Record<Surface, string> = {
  Clay: '#c9622a',
  Hard: '#4a90d9',
  Grass: '#5a9c5a',
};

const DEFAULT_HERO_BACKGROUND = '#1f1f1f';

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getSurfaceBackground = (surface: Surface): string => {
  const color = SURFACE_COLORS[surface];
  if (!color) return DEFAULT_HERO_BACKGROUND;
  const tint = hexToRgba(color, 0.22);
  return `linear-gradient(${tint}, ${tint}), ${DEFAULT_HERO_BACKGROUND}`;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

interface ActionButtonsProps {
  state: MatchState;
  role: UserRole;
  hasCoach: boolean;
  loading: boolean;
  showServerSelector: boolean;
  onAccept: () => void;
  onReject: () => void;
  onRequestStart: () => void;
  onGoToGame: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  state,
  role,
  hasCoach,
  loading,
  showServerSelector,
  onAccept,
  onReject,
  onRequestStart,
  onGoToGame,
}) => {
  if (showServerSelector) return null;

  if (role === 'spectator') {
    return (
      <div className={styles.spectatorNote}>
        <span className="material-symbols-outlined">visibility</span>
        <span>Solo puedes observar este partido</span>
      </div>
    );
  }

  if (state === 'PENDIENTE' && (role === 'creator' || role === 'entrenador')) {
    return (
      <button className={styles.btnDisabled} disabled>
        <span className="material-symbols-outlined">schedule</span>
        <span>Esperando aceptación del jugador</span>
      </button>
    );
  }

  if (state === 'PENDIENTE' && role === 'invited') {
    return (
      <div className={styles.actionRow}>
        <button className={styles.btnAccept} onClick={onAccept} disabled={loading}>
          <span className="material-symbols-outlined">check_circle</span>
          <span>Aceptar</span>
        </button>
        <button className={styles.btnReject} onClick={onReject} disabled={loading}>
          <span className="material-symbols-outlined">cancel</span>
          <span>Rechazar</span>
        </button>
      </div>
    );
  }

  if (state === 'ACEPTADO' && role === 'entrenador') {
    return (
      <button className={styles.btnPrimary} onClick={onRequestStart} disabled={loading}>
        <span className="material-symbols-outlined">play_circle</span>
        <span>Comenzar partido</span>
      </button>
    );
  }

  if (state === 'ACEPTADO' && hasCoach && (role === 'creator' || role === 'invited')) {
    return (
      <button className={styles.btnDisabled} disabled>
        <span className="material-symbols-outlined">hourglass_empty</span>
        <span>Esperando inicio del entrenador</span>
      </button>
    );
  }

  if (state === 'ACEPTADO') {
    return (
      <button className={styles.btnPrimary} onClick={onRequestStart} disabled={loading}>
        <span className="material-symbols-outlined">play_circle</span>
        <span>Comenzar partido</span>
      </button>
    );
  }

  if (state === 'INICIADO') {
    return (
      <button className={styles.btnContinue} onClick={onGoToGame} disabled={loading}>
        <span className="material-symbols-outlined">sports_tennis</span>
        <span>Continuar partido</span>
      </button>
    );
  }

  if (state === 'PAUSADO') {
    return (
      <button className={styles.btnContinue} onClick={onGoToGame} disabled={loading}>
        <span className="material-symbols-outlined">play_arrow</span>
        <span>Reanudar partido</span>
      </button>
    );
  }

  if (state === 'FINALIZADA') {
    return (
      <button className={styles.btnResult} onClick={onGoToGame} disabled={loading}>
        <span className="material-symbols-outlined">emoji_events</span>
        <span>Ver resultado</span>
      </button>
    );
  }

  return null;
};

const MatchDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const {
    match,
    loading,
    error,
    role,
    actionLoading,
    showServerSelector,
    handleAccept,
    handleReject,
    handleRequestStart,
    handleCancelStart,
    handleStart,
    handleGoToGame,
  } = useMatchDetail(uuid ?? '');

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.centered}>
          <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
          <p className={styles.loadingText}>Cargando partido...</p>
        </div>
      </main>
    );
  }

  if (error || !match) {
    return (
      <main className={styles.main}>
        <div className={styles.centered}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#ffb4ab' }}>
            error
          </span>
          <p className={styles.errorText}>{error ?? 'Partido no encontrado.'}</p>
          <button className={styles.btnBack} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </main>
    );
  }

  const STATE_STYLE: Record<MatchState, string> = {
    PENDIENTE: styles.statePENDIENTE,
    ACEPTADO: styles.stateACEPTADO,
    INICIADO: styles.stateINICIADO,
    PAUSADO: styles.statePAUSADO,
    FINALIZADA: styles.stateFINALIZADA,
  };
  const stateClass = STATE_STYLE[match.match_state] ?? '';

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </button>
          <span className={`${styles.stateBadge} ${stateClass}`}>
            {STATE_LABELS[match.match_state]}
          </span>
        </div>

        {/* Hero: players vs */}
        <div className={styles.heroSection} style={{ background: getSurfaceBackground(match.surface) }}>
          <div className={styles.playerSide}>
            <div className={styles.playerAvatar}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className={styles.playerInfo}>
              <span className={styles.playerRole}>Jugador</span>
              <h2 className={styles.playerName}>
                {match.local_player?.nombre ?? '—'}
                <br />
                {match.local_player?.apellidoPaterno ?? ''}
              </h2>
            </div>
          </div>

          <div className={styles.vsSection}>
            <div className={styles.vsCircle}>
              <span className={styles.vsText}>VS</span>
            </div>
            <div className={styles.courtLine} />
          </div>

          <div className={`${styles.playerSide} ${styles.playerSideRight}`}>
            <div className={`${styles.playerAvatar} ${styles.playerAvatarInvited}`}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className={styles.playerInfo}>
              <span className={styles.playerRole}>Invitado</span>
              <h2 className={styles.playerName}>
                {match.invited
                  ? `${match.invited.nombre} ${match.invited.apellidoPaterno}`
                  : (match.guest_name ?? '—')}
              </h2>
            </div>
          </div>
        </div>

        {/* Match details */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <span className="material-symbols-outlined">location_on</span>
            <div>
              <span className={styles.detailLabel}>Lugar</span>
              <span className={styles.detailValue}>{match.location}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <span className={styles.surfaceIcon}>
              {SURFACE_ICONS[match.surface]}
            </span>
            <div>
              <span className={styles.detailLabel}>Superficie</span>
              <span className={styles.detailValue}>{SURFACE_LABELS[match.surface]}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <span className="material-symbols-outlined">trophy</span>
            <div>
              <span className={styles.detailLabel}>Formato</span>
              <span className={styles.detailValue}>{BEST_OF_LABELS[match.best_of]}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <span className="material-symbols-outlined">calendar_today</span>
            <div>
              <span className={styles.detailLabel}>Agendado</span>
              <span className={styles.detailValue}>{formatDate(match.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsSection}>
          {showServerSelector && match.local_player && match.invited ? (
            <ServerSelector
              creator={match.local_player}
              invited={match.invited}
              onSelect={handleStart}
              onCancel={handleCancelStart}
              loading={actionLoading}
            />
          ) : (
            <ActionButtons
              state={match.match_state}
              role={role}
              hasCoach={match.entrenador !== null}
              loading={actionLoading}
              showServerSelector={showServerSelector}
              onAccept={handleAccept}
              onReject={handleReject}
              onRequestStart={handleRequestStart}
              onGoToGame={handleGoToGame}
            />
          )}

          {actionLoading && !showServerSelector && (
            <div className={styles.actionLoading}>
              <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default MatchDetail;
