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
    lastUpdated?: Date | null;
}

const formatLastUpdated = (date: Date): string =>
    date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const PerformanceWidget = ({ player1, player2, lastUpdated }: PerformanceWidgetProps) => {
    return (
        <div className={styles.widgetContainer}>
            <div className={styles.headerSection}>
                <h3 className={styles.headerTitle}>RENDIMIENTO (VS)</h3>
                <div className={styles.headerRight}>
                    <span className={styles.badge}>REAL-TIME DATA</span>
                    {lastUpdated && (
                        <span className={styles.lastUpdated}>
                            Última actualización: {formatLastUpdated(lastUpdated)}
                        </span>
                    )}
                </div>
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