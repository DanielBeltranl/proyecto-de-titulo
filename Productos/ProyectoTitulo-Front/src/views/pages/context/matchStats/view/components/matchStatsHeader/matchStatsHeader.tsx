import { useNavigate } from 'react-router';
import type { StatsPlayer, MatchDetail } from '../../../model/matchStatsModel';
import styles from './matchStatsHeader.module.css';

const SURFACE_LABELS: Record<string, string> = {
  Clay: 'Arcilla',
  Hard: 'Dura',
  Grass: 'Césped',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });

interface Props {
  player1: StatsPlayer;
  player2: StatsPlayer;
  onExport: () => void;
  exporting: boolean;
  detail: MatchDetail | null;
}

export const MatchStatsHeader = ({ player1, player2, onExport, exporting, detail }: Props) => {
  const navigate = useNavigate();
  const p1Won = detail?.winnerId != null && detail.winnerId === player1.id;
  const p2Won = detail?.winnerId != null && detail.winnerId === player2.id;

  return (
    <section className={styles.section}>
      <div>
        <span className={styles.label}>Resumen de Rendimiento</span>
        <h1 className={styles.title}>ANÁLISIS DE PARTIDO</h1>

        <div className={styles.vsCard}>
          <div className={styles.playerCol}>
            <div className={styles.playerRow}>
              <div className={styles.avatar}>
                {player1.avatar
                  ? <img src={player1.avatar} alt={player1.name} />
                  : <span className="material-symbols-outlined">person</span>}
              </div>
              <div>
                <p className={styles.playerLabel}>Local</p>
                <p className={styles.playerName}>{player1.name.toUpperCase()}</p>
                {p1Won && (
                  <span className={styles.winnerBadge}>
                    <span className="material-symbols-outlined">emoji_events</span>
                    Ganador
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.vsCenter}>
            <div className={styles.vs}>VS</div>
            {detail && detail.sets.length > 0 && (
              <div className={styles.setsStrip}>
                {detail.sets.map((s, i) => (
                  <span key={i} className={styles.setChip}>{s.p1}–{s.p2}</span>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.playerCol} ${styles.playerColRight}`}>
            <div className={`${styles.playerRow} ${styles.playerRowRight}`}>
              <div className={styles.playerRightText}>
                <p className={styles.playerLabel}>Oponente</p>
                <p className={styles.playerName}>{player2.name.toUpperCase()}</p>
                {p2Won && (
                  <span className={`${styles.winnerBadge} ${styles.winnerBadgeRight}`}>
                    <span className="material-symbols-outlined">emoji_events</span>
                    Ganador
                  </span>
                )}
              </div>
              <div className={`${styles.avatar} ${styles.avatarDim}`}>
                {player2.avatar
                  ? <img src={player2.avatar} alt={player2.name} />
                  : <span className="material-symbols-outlined">person</span>}
              </div>
            </div>
          </div>
        </div>

        {detail && (
          <div className={styles.matchMeta}>
            {detail.location && (
              <span className={styles.metaChip}>
                <span className="material-symbols-outlined">location_on</span>
                {detail.location}
              </span>
            )}
            <span className={styles.metaChip}>
              <span className="material-symbols-outlined">sports_tennis</span>
              {SURFACE_LABELS[detail.surface] ?? detail.surface}
            </span>
            <span className={styles.metaChip}>
              <span className="material-symbols-outlined">format_list_numbered</span>
              Bo{detail.bestOf}
            </span>
            {detail.scheduledAt && (
              <span className={styles.metaChip}>
                <span className="material-symbols-outlined">calendar_today</span>
                {formatDate(detail.scheduledAt)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onExport} disabled={exporting}>
          {exporting ? 'EXPORTANDO...' : 'EXPORTAR PDF'}
        </button>
        <button className={styles.btnBack} onClick={() => navigate('/vista')}>
          <span className="material-symbols-outlined">arrow_back</span>
          DASHBOARD
        </button>
      </div>
    </section>
  );
};
