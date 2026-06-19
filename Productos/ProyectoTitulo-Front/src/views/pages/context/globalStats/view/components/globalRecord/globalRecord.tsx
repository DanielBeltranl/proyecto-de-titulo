import type { GlobalStatsData } from '../../../model/globalStatsModel';
import styles from './globalRecord.module.css';

interface Props {
  record: GlobalStatsData['record'];
  lastResult: GlobalStatsData['lastResult'];
  pointsWinLoss: GlobalStatsData['pointsWinLoss'];
}

const CIRC = 339.29; // 2π × 54

export const GlobalRecord = ({ record, lastResult, pointsWinLoss }: Props) => {
  const wonArc = (record.win_pct / 100) * CIRC;
  const dasharray = `${wonArc.toFixed(1)} ${(CIRC - wonArc).toFixed(1)}`;
  const dashoffset = (CIRC * 0.25).toFixed(1);

  const opponentName = lastResult
    ? `${lastResult.opponent.nombre} ${lastResult.opponent.apellidoPaterno}`
    : null;

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>
        <span className={styles.dot} />
        Efectividad Global
      </h3>

      <div className={styles.donutWrap}>
        <div className={styles.donutContainer}>
          <svg className={styles.donutSvg} viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#2a2a2a" strokeWidth="14" />
            <circle
              cx="70" cy="70" r="54" fill="none" stroke="#f59e0b" strokeWidth="14"
              strokeDasharray={dasharray} strokeDashoffset={dashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className={styles.donutLabel}>
            <span className={styles.donutPct}>{record.win_pct.toFixed(1)}%</span>
            <span className={styles.donutCaption}>Win Rate</span>
          </div>
        </div>

        <div className={styles.recordRow}>
          <div className={styles.recordItem}>
            <p className={styles.recordValue} style={{ color: '#22c55e' }}>{record.wins}</p>
            <p className={styles.recordLabel}>Victorias</p>
          </div>
          <div className={styles.recordDivider} />
          <div className={styles.recordItem}>
            <p className={styles.recordValue} style={{ color: '#e2e2e2' }}>{record.total}</p>
            <p className={styles.recordLabel}>Partidos</p>
          </div>
          <div className={styles.recordDivider} />
          <div className={styles.recordItem}>
            <p className={styles.recordValue} style={{ color: '#ef4444' }}>{record.losses}</p>
            <p className={styles.recordLabel}>Derrotas</p>
          </div>
        </div>
      </div>

      <div className={styles.pointsRow}>
        <div className={styles.pointsItem}>
          <span className={styles.pointsValue}>{pointsWinLoss.won_pct.toFixed(1)}%</span>
          <span className={styles.pointsLabel}>Puntos Ganados</span>
        </div>
        <div className={styles.pointsBar}>
          <div className={styles.pointsBarFill} style={{ width: `${pointsWinLoss.won_pct}%` }} />
        </div>
        <div className={styles.pointsCounts}>
          <span>{pointsWinLoss.won}G</span>
          <span>{pointsWinLoss.lost}P</span>
        </div>
      </div>

      {lastResult && (
        <div className={styles.lastResult}>
          <span className={`${styles.resultChip} ${lastResult.won ? styles.chipWin : styles.chipLoss}`}>
            {lastResult.won ? 'V' : 'D'}
          </span>
          <div>
            <p className={styles.lastResultOpponent}>{opponentName}</p>
            <p className={styles.lastResultMeta}>{lastResult.location} · {lastResult.surface}</p>
          </div>
          <span className={styles.lastResultTag}>Último</span>
        </div>
      )}
    </div>
  );
};
