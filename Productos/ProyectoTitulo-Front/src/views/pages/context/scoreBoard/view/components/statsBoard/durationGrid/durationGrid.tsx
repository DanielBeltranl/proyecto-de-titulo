import type { PlayerPerformanceData } from '../performanceWidget';
import styles from "./durationGrid.module.css"

interface DurationGridProps {
    p1: PlayerPerformanceData;
    p2: PlayerPerformanceData;
}

export const DurationGrid = ({ p1, p2 }: DurationGridProps) => (
    <div className={styles.statBlock}>
        <div className={styles.statTitleContainer}>
            <span className={styles.statTitle}>Dur. media pt. ganado (mm:ss)</span>
        </div>
        <div className={styles.gridContainer}>
            <div className={styles.durationCell}>
                <p className={styles.durationLabelP1}>{p1.name}</p>
                <p className={styles.durationTime}>{p1.avgDuration}</p>
            </div>
            <div className={styles.durationCell}>
                <p className={styles.durationLabelP2}>{p2.name}</p>
                <p className={styles.durationTimeP2}>{p2.avgDuration}</p>
            </div>
        </div>
    </div>
);