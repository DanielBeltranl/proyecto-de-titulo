import type { ApiInterval } from '../../../model/globalStatsModel';
import styles from './globalTrend.module.css';

interface Props {
  intervals: ApiInterval[];
}

const W = 1200;
const H = 192;
const PAD = 8;

const buildPath = (data: ApiInterval[]): string => {
  if (data.length === 0) return '';
  const maxInterval = data[data.length - 1].interval || 1;
  const maxAvg = Math.max(...data.map(d => d.points_won_avg), 1);
  const pts = data.map(d => ({
    x: PAD + (d.interval / maxInterval) * (W - PAD * 2),
    y: H - PAD - (d.points_won_avg / maxAvg) * (H - PAD * 2),
  }));
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
};

export const GlobalTrend = ({ intervals }: Props) => (
  <div className={styles.card}>
    <h3 className={styles.heading}>
      <span className={styles.dot} />
      Tendencia de Puntos
      <span className={styles.headingSub}>(Promedio de puntos ganados por intervalo de 5 min)</span>
    </h3>
    <div className={styles.chartArea}>
      <div className={styles.gridLines}>
        <span /><span /><span /><span />
      </div>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        <path
          d={buildPath(intervals)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={styles.xLabels}>
        {intervals
          .filter((_, i) => i % Math.max(1, Math.floor(intervals.length / 8)) === 0)
          .map(d => (
            <span key={d.interval}>{d.interval}'</span>
          ))}
      </div>
    </div>
  </div>
);
