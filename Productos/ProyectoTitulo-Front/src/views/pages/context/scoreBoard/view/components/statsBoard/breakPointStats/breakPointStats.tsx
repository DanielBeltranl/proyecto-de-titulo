import type { PlayerPerformanceData } from '../performanceWidget';
import styles from "./breakPointsStats.module.css"

interface BreakPointsStatProps {
    p1: PlayerPerformanceData;
    p2: PlayerPerformanceData;
}

export const BreakPointsStat = ({ p1, p2 }: BreakPointsStatProps) => (
    <div className={styles.statBlock}>
        <div className={styles.statTitleContainer}>
            <span className={styles.statTitle}>Break Points (WON/SV)</span>
        </div>
        <div className={styles.flexBetweenCentered}>
            <div className={styles.flex1Left}>
                <div className={styles.breakBadgeP1}>
                    <p className={styles.breakTextP1}>
                        {p1.breakPoints} <span className={styles.breakSub}>{p1.breakPointsSub}</span>
                    </p>
                </div>
            </div>
            <div className={styles.flex1Right}>
                <div className={styles.breakBadgeP2}>
                    <p className={styles.breakTextP2}>
                        {p2.breakPoints} <span className={styles.breakSub}>{p2.breakPointsSub}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
);