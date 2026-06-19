import type { PlayerPerformanceData } from '../performanceWidget';
import styles from "./effectivenessStats.module.css"

interface EffectivenessStatProps {
    p1: PlayerPerformanceData;
    p2: PlayerPerformanceData;
}

export const EffectivenessStat = ({ p1, p2 }: EffectivenessStatProps) => (
    <div className={styles.statBlock}>
        <div className={styles.statTitleContainer}>
            <span className={styles.statTitle}>Efectividad (W/L %)</span>
        </div>
        <div className={styles.flexBetweenCentered}>
            <div className={styles.flex1Left}>
                <p className={styles.winRatePct}>{p1.winRatePct}</p>
                <p className={styles.winRateFrac}>{p1.winRateFrac}</p>
            </div>
            <div className={styles.flex1Right}>
                <p className={styles.winRatePctP2}>{p2.winRatePct}</p>
                <p className={styles.winRateFracP2}>{p2.winRateFrac}</p>
            </div>
        </div>
    </div>
);