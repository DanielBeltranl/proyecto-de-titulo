import type { PlayerPerformanceData } from '../performanceWidget';
import styles from "./distanceStats.module.css"

interface DistanceStatProps {
    p1: PlayerPerformanceData;
    p2: PlayerPerformanceData;
}

export const DistanceStat = ({ p1, p2 }: DistanceStatProps) => (
    <div className={styles.statBlock}>
        <div className={styles.statTitleContainer}>
            <span className={styles.statTitle}>Distancia Media (M)</span>
        </div>
        <div className={styles.flexBetween}>
            <div className={styles.flex1Left}>
                <p className={styles.distanceNumP1}>{p1.distance}</p>
                <div className={styles.barContainer}>
                    <div className={styles.barFillP1} style={{ width: p1.distanceWidth }}></div>
                </div>
            </div>
            <div className={styles.flex1Right}>
                <p className={styles.distanceNumP2}>{p2.distance}</p>
                <div className={styles.barContainer}>
                    <div className={styles.barFillP2} style={{ width: p2.distanceWidth }}></div>
                </div>
            </div>
        </div>
    </div>
);