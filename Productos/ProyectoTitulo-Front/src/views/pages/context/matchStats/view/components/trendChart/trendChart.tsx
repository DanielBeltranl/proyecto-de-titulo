import type { TrendInterval } from '../../../model/matchStatsModel';
import styles from './trendChart.module.css';

interface Props {
  trend: TrendInterval[];
}

const W = 1200;
const H = 240;
const PAD = 8;

const buildPath = (data: TrendInterval[]): string => {
  if (data.length === 0) return '';
  const maxMin = data[data.length - 1].minute || 1;
  const maxPts = Math.max(...data.map(d => d.pointsWon), 1);
  const pts = data.map(d => ({
    x: PAD + (d.minute / maxMin) * (W - PAD * 2),
    y: H - PAD - (d.pointsWon / maxPts) * (H - PAD * 2),
  }));
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
};

export const TrendChart = ({ trend }: Props) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <h3 className={styles.heading}>
        <span className={styles.dot} />
        Tendencia del Partido
        <span className={styles.headingSub}>(Promedio de puntos ganados en intervalos de 5 minutos)</span>
      </h3>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.lineOrange} />
          <span className={styles.legendLabel}>Puntos Ganados</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.lineGray} />
          <span className={styles.legendLabel}>Minutos</span>
        </div>
      </div>
    </div>
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
          d={buildPath(trend)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={styles.xLabels}>
        {trend
          .filter((_, i) => i % Math.max(1, Math.floor(trend.length / 8)) === 0)
          .map(d => (
            <span key={d.minute}>{d.minute}'</span>
          ))}
      </div>
    </div>
  </div>
);
