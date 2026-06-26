import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Partidos.module.css';
import { usePartidos } from './controller/usePartidos';
import MatchCard from './components/matchCard/MatchCard';
import { getUsuario } from '../../../../../services/usuarioService';
import type { MatchItem } from './model/partidosModel';
import type { CoachTab } from './controller/usePartidos';

type PlayerTab = 'creados' | 'invitados';

const getPlayerRivalLabel = (match: MatchItem, tab: PlayerTab): string => {
  const player = tab === 'creados' ? match.invited : match.creator;
  if (!player) return 'Jugador';
  return `${player.nombre} ${player.apellidoPaterno}`.trim();
};

const getCoachRivalLabel = (match: MatchItem, tab: CoachTab): string => {
  if (tab === 'agendados') {
    return `${match.creator.nombre} ${match.creator.apellidoPaterno}`.trim();
  }
  const invited = match.invited;
  if (!invited) return 'Jugador';
  return `${invited.nombre} ${invited.apellidoPaterno}`.trim();
};

const Partidos: React.FC = () => {
  const {
    creados,
    invitados,
    agendados,
    invitacionesJugadores,
    coachTab,
    setCoachTab,
    loading,
    error,
    acceptingId,
    acceptInvitation,
  } = usePartidos();

  const [playerTab, setPlayerTab] = useState<PlayerTab>('creados');
  const navigate = useNavigate();
  const isEntrenador = useMemo(() => getUsuario()?.rol === 'Entrenador', []);

  const lista = isEntrenador
    ? (coachTab === 'agendados' ? agendados : invitacionesJugadores)
    : (playerTab === 'creados' ? creados : invitados);

  const emptyMessage = isEntrenador
    ? (coachTab === 'agendados' ? 'No hay partidos agendados aún.' : 'No hay invitaciones pendientes para tus jugadores.')
    : (playerTab === 'creados' ? 'No tienes partidos creados aún.' : 'No tienes invitaciones pendientes.');

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Partidos</h1>
            <p className={styles.pageSubtitle}>
              {isEntrenador ? 'Gestión de partidos' : 'Tus partidos agendados'}
            </p>
          </div>

          {!isEntrenador && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${playerTab === 'creados' ? styles.tabActive : ''}`}
                onClick={() => setPlayerTab('creados')}
              >
                Mis partidos
                {creados.length > 0 && (
                  <span className={styles.tabBadge}>{creados.length}</span>
                )}
              </button>
              <button
                className={`${styles.tab} ${playerTab === 'invitados' ? styles.tabActive : ''}`}
                onClick={() => setPlayerTab('invitados')}
              >
                Invitaciones
                {invitados.length > 0 && (
                  <span className={styles.tabBadge}>{invitados.length}</span>
                )}
              </button>
            </div>
          )}

          {isEntrenador && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${coachTab === 'agendados' ? styles.tabActive : ''}`}
                onClick={() => setCoachTab('agendados')}
              >
                Mis partidos
                {agendados.length > 0 && (
                  <span className={styles.tabBadge}>{agendados.length}</span>
                )}
              </button>
              <button
                className={`${styles.tab} ${coachTab === 'invitaciones' ? styles.tabActive : ''}`}
                onClick={() => setCoachTab('invitaciones')}
              >
                Invitaciones
                {invitacionesJugadores.length > 0 && (
                  <span className={styles.tabBadge}>{invitacionesJugadores.length}</span>
                )}
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.feedback}>
            <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
            <span>Cargando partidos...</span>
          </div>
        )}

        {!loading && error && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && lista.length === 0 && (
          <div className={`${styles.feedback} ${styles.feedbackEmpty}`}>
            <span className="material-symbols-outlined">sports_tennis</span>
            <span>{emptyMessage}</span>
          </div>
        )}

        {!loading && !error && lista.length > 0 && (
          <div className={styles.list}>
            {lista.map((match) => {
              const rivalLabel = isEntrenador
                ? getCoachRivalLabel(match, coachTab)
                : getPlayerRivalLabel(match, playerTab);

              const rivalRoleLabel = isEntrenador ? 'Alumno' : 'Rival';

              const showAccept = isEntrenador
                && coachTab === 'invitaciones'
                && match.match_state === 'PENDIENTE';

              const showStartCta = isEntrenador
                && coachTab === 'agendados'
                && match.match_state === 'ACEPTADO';

              const showWaitingCta = isEntrenador
                && coachTab === 'invitaciones'
                && match.match_state === 'ACEPTADO';

              const showScoreCta = isEntrenador
                && coachTab === 'invitaciones'
                && match.match_state === 'INICIADO';

              const showContinueCta = isEntrenador
                && coachTab === 'agendados'
                && (match.match_state === 'INICIADO' || match.match_state === 'PAUSADO');

              const cardOnClick = showContinueCta
                ? () => navigate(`/marcador/${match.id_match}`)
                : () => navigate(`/match/${match.id_match}`);

              return (
                <MatchCard
                  key={match.id_match}
                  match={match}
                  rivalLabel={rivalLabel}
                  rivalRoleLabel={rivalRoleLabel}
                  onClick={cardOnClick}
                  onAccept={showAccept ? () => acceptInvitation(match.id_match) : undefined}
                  showStartCta={showStartCta}
                  showWaitingCta={showWaitingCta}
                  showScoreCta={showScoreCta}
                  showContinueCta={showContinueCta}
                  actionLoading={acceptingId === match.id_match}
                />
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
};

export default Partidos;
