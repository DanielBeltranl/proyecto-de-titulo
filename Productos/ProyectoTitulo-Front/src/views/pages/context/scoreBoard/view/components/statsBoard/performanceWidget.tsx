import {PlayerMatchup} from "./playersMatchUp/playersMatchUp.tsx";
import {DistanceStat} from "./distanceStat/distanceStats.tsx";
import {EffectivenessStat} from "./effectivenessStats/effectivenessStats.tsx";
import {BreakPointsStat} from "./breakPointStats/breakPointStats.tsx";
import {DurationGrid} from "./durationGrid/durationGrid.tsx";
import styles from "./performanceWidget.module.css"

export interface PlayerPerformanceData {
    name: string;
    image: string;
    distance: string;
    distanceWidth: string;
    winRatePct: string;
    winRateFrac: string;
    breakPoints: string;
    breakPointsSub: string;
    avgDuration: string;
}

interface PerformanceWidgetProps {
    player1: PlayerPerformanceData;
    player2: PlayerPerformanceData;
}

export const PerformanceWidget = ({ player1, player2 }: PerformanceWidgetProps) => {
    return (
        <div className={styles.widgetContainer}>
            <div className={styles.headerSection}>
                <h3 className={styles.headerTitle}>RENDIMIENTO (VS)</h3>
                <span className={styles.badge}>REAL-TIME DATA</span>
            </div>
            <div className={styles.contentSection}>
                <PlayerMatchup p1={player1} p2={player2} />
                <DistanceStat p1={player1} p2={player2} />
                <EffectivenessStat p1={player1} p2={player2} />
                <BreakPointsStat p1={player1} p2={player2} />
                <DurationGrid p1={player1} p2={player2} />
            </div>
        </div>
    );
};