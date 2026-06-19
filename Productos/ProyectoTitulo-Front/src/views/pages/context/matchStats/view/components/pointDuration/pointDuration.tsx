import type { PointDurationStats } from '../../../model/matchStatsModel';
import styles from './pointDuration.module.css';

interface Props {
  stats: PointDurationStats;
}

const QUARTILE_META = [
  { label: 'Cortos',   color: '#22c55e' },
  { label: 'Medios',   color: '#eab308' },
  { label: 'Largos',   color: '#f97316' },
  { label: 'Extremos', color: '#ef4444' },
];

export const PointDuration = ({ stats }: Props) => (
  <div className={styles.card}>
    <h3 className={styles.heading}>
      <span className={styles.dot} />
      Análisis de Duración de Puntos
      <span className={styles.headingSub}>(Intervalos de tiempo donde se distribuyen los puntos ganados por el jugador)</span>
    </h3>
    <div className={styles.categories}>
      {stats.quartiles.map((q, i) => (
        <div key={i} className={styles.categoryCard}>
          <span className={styles.categoryBar} style={{ background: QUARTILE_META[i].color }} />
          <p className={styles.categoryPct}>{q.pct.toFixed(1)}%</p>
          <p className={styles.categoryLabel}>
            {QUARTILE_META[i].label}
            <br />
            <span>{q.minSec}–{q.maxSec} seg</span>
          </p>
        </div>
      ))}
    </div>
    <div className={styles.timers}>
      <div className={styles.timerCard}>
        <div className={styles.timerIcon}>
          <span className="material-symbols-outlined">timer</span>
        </div>
        <div>
          <p className={styles.timerLabel}>Media Punto Ganado</p>
          <p className={styles.timerValue}>{stats.avgWonSeconds.toFixed(1)}s</p>
        </div>
      </div>
      <div className={styles.timerCard}>
        <div className={`${styles.timerIcon} ${styles.timerIconBad}`}>
          <span className="material-symbols-outlined">timer_off</span>
        </div>
        <div>
          <p className={styles.timerLabel}>Media Punto Perdido</p>
          <p className={styles.timerValue}>{stats.avgLostSeconds.toFixed(1)}s</p>
        </div>
      </div>
    </div>
  </div>
);
