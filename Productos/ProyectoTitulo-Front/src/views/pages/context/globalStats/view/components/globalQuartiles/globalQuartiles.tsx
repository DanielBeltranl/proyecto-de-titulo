import type { QuartileStat } from '../../../model/globalStatsModel';
import styles from './globalQuartiles.module.css';

interface Props {
  quartiles: QuartileStat[];
}

const QUARTILE_META = [
  { label: 'Cortos',   color: '#22c55e' },
  { label: 'Medios',   color: '#eab308' },
  { label: 'Largos',   color: '#f97316' },
  { label: 'Extremos', color: '#ef4444' },
];

export const GlobalQuartiles = ({ quartiles }: Props) => (
  <div className={styles.card}>
    <h3 className={styles.heading}>
      <span className={styles.dot} />
      Duración de Puntos
      <span className={styles.headingSub}>(Distribución global de puntos ganados por duración)</span>
    </h3>
    <div className={styles.grid}>
      {quartiles.map((q, i) => (
        <div key={i} className={styles.categoryCard}>
          <span className={styles.bar} style={{ background: QUARTILE_META[i].color }} />
          <p className={styles.pct}>{q.pct.toFixed(1)}%</p>
          <p className={styles.label}>
            {QUARTILE_META[i].label}
            <br />
            <span>{q.minSec}–{q.maxSec} seg</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);
