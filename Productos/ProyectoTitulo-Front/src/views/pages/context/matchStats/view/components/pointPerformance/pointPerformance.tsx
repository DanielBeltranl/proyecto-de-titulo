import type { BreakPoints } from '../../../model/matchStatsModel';
import styles from './pointPerformance.module.css';

interface Props {
  pointsWon: number;
  pointsLost: number;
  effectivenessPct: number;
  breakPointsFavorable: BreakPoints;
  breakPointsAgainst: BreakPoints;
  matchPointsFavorable: BreakPoints;
  matchPointsAgainst: BreakPoints;
}

const CIRCUMFERENCE = 2 * Math.PI * 40;

const favPct = (bp: BreakPoints) =>
  bp.total > 0 ? Math.round((bp.won / bp.total) * 100) : 0;

export const PointPerformance = ({
  pointsWon,
  pointsLost,
  effectivenessPct,
  breakPointsFavorable,
  breakPointsAgainst,
  matchPointsFavorable,
  matchPointsAgainst,
}: Props) => {
  const offset = CIRCUMFERENCE * (1 - effectivenessPct / 100);

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>
        <span className={styles.dot} />
        RENDIMIENTO DE PUNTOS
      </h3>
      <div className={styles.grid}>
        <div className={styles.donutWrapper}>
          <div className={styles.donutContainer}>
            <svg className={styles.donutSvg} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#353535" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="40"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutPct}>{effectivenessPct}%</span>
              <span className={styles.donutLabel}>Efectividad</span>
            </div>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDotWon} />
              <div>
                <p className={styles.legendLabel}>Puntos Ganados</p>
                <p className={styles.legendValue}>{pointsWon} GG</p>
              </div>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotLost} />
              <div>
                <p className={styles.legendLabel}>Puntos Perdidos</p>
                <p className={styles.legendValue}>{pointsLost} PP</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.breakPoints}>
          <div className={styles.bpCard}>
            <p className={styles.bpTitle}>Situaciones de Quiebre Favorables</p>
            <div className={styles.bpRow}>
              <p className={styles.bpFraction}>
                {breakPointsFavorable.won}/{breakPointsFavorable.total}
                <span className={styles.bpPctGood}> {favPct(breakPointsFavorable)}%</span>
              </p>
              <p className={styles.bpSub}>Ganados vs Generados</p>
            </div>
          </div>
          <div className={`${styles.bpCard} ${styles.bpCardBad}`}>
            <p className={styles.bpTitle}>Situaciones de Quiebre En Contra</p>
            <div className={styles.bpRow}>
              <p className={styles.bpFraction}>
                {breakPointsAgainst.won}/{breakPointsAgainst.total}
                <span className={styles.bpPctBad}> {favPct(breakPointsAgainst)}%</span>
              </p>
              <p className={styles.bpSub}>Concedidos vs Perdidos</p>
            </div>
          </div>
          <div className={styles.bpCard}>
            <p className={styles.bpTitle}>Puntos de Partido Generados</p>
            <div className={styles.bpRow}>
              <p className={styles.bpFraction}>
                {matchPointsFavorable.won}/{matchPointsFavorable.total}
                <span className={styles.bpPctGood}> {favPct(matchPointsFavorable)}%</span>
              </p>
              <p className={styles.bpSub}>Convertidos vs Generados</p>
            </div>
          </div>
          <div className={`${styles.bpCard} ${styles.bpCardBad}`}>
            <p className={styles.bpTitle}>Puntos de Partido En Contra</p>
            <div className={styles.bpRow}>
              <p className={styles.bpFraction}>
                {matchPointsAgainst.won}/{matchPointsAgainst.total}
                <span className={styles.bpPctBad}> {favPct(matchPointsAgainst)}%</span>
              </p>
              <p className={styles.bpSub}>Salvados vs Enfrentados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
