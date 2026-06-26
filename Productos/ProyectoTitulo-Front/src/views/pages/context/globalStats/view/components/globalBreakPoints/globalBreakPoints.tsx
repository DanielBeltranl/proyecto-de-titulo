import type { GlobalStatsData } from '../../../model/globalStatsModel';
import styles from './globalBreakPoints.module.css';

interface Props {
  bp: GlobalStatsData['breakPoints'];
  mp: GlobalStatsData['matchPoints'];
  avgDurationWon: string;
  avgDurationLost: string;
}

interface BarItemProps {
  label: string;
  pct: number;
  detail: string;
  color: 'green' | 'amber' | 'red';
}

const BarItem = ({ label, pct, detail, color }: BarItemProps) => (
  <div className={styles.barItem}>
    <div className={styles.barHeader}>
      <span className={styles.barLabel}>{label}</span>
      <span className={styles.barPct}>{pct.toFixed(1)}%</span>
    </div>
    <div className={styles.barTrack}>
      <div className={`${styles.barFill} ${styles[color]}`} style={{ width: `${pct}%` }} />
    </div>
    <span className={styles.barDetail}>{detail}</span>
  </div>
);

export const GlobalBreakPoints = ({ bp, mp, avgDurationWon, avgDurationLost }: Props) => (
  <div className={styles.card}>
    <span className="material-symbols-outlined" style={{
      position: 'absolute', top: '1rem', right: '1rem',
      fontSize: '6rem', color: '#e2e2e2', opacity: 0.05, pointerEvents: 'none',
    }}>bolt</span>

    <h3 className={styles.heading}>
      <span className={styles.dot} />
      Break Points
    </h3>

    <div className={styles.bars}>
      <BarItem
        label="Conversión (Restador)"
        pct={bp.conversion_pct}
        detail={`${bp.converted} de ${bp.generated} generados`}
        color="amber"
      />
      <BarItem
        label="Salvados (Servidor)"
        pct={bp.save_pct}
        detail={`${bp.saved} de ${bp.faced} enfrentados`}
        color="green"
      />
      {mp && (
        <>
          <BarItem
            label="Puntos de Partido Generados"
            pct={mp.conversion_pct}
            detail={`${mp.converted} de ${mp.generated} generados`}
            color="amber"
          />
          <BarItem
            label="Puntos de Partido Salvados"
            pct={mp.save_pct}
            detail={`${mp.saved} de ${mp.faced} enfrentados`}
            color="red"
          />
        </>
      )}
    </div>

    <div className={styles.timers}>
      <div className={styles.timerCard}>
        <div className={styles.timerIcon}>
          <span className="material-symbols-outlined">timer</span>
        </div>
        <div>
          <p className={styles.timerLabel}>Media Punto Ganado</p>
          <p className={styles.timerValue}>{avgDurationWon}</p>
        </div>
      </div>
      <div className={styles.timerCard}>
        <div className={`${styles.timerIcon} ${styles.timerIconBad}`}>
          <span className="material-symbols-outlined">timer_off</span>
        </div>
        <div>
          <p className={styles.timerLabel}>Media Punto Perdido</p>
          <p className={styles.timerValue}>{avgDurationLost}</p>
        </div>
      </div>
    </div>
  </div>
);
