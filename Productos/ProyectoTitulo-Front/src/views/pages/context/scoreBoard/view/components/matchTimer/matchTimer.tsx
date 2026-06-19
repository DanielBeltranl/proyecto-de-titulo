import { useEffect } from 'react';
import styles from './matchTimer.module.css';
import { useTimer } from '../../../controller/useTimer.ts';
import { useMatchStatus } from '../../../model/matchStatusContext.tsx';

const toMMSS = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

interface MatchTimerProps {
    sessionId?: string;
    gameId: string;
    setId: string;
    matchEnded?: boolean;
}

export const MatchTimer = ({
    sessionId = "DT-8829",
    gameId,
    setId,
    matchEnded = false,
}: MatchTimerProps) => {
    const { status } = useMatchStatus();
    const isRunning = status === 'started' && !matchEnded;

    const { elapsed: matchElapsed } = useTimer(true, isRunning);
    const { elapsed: setElapsed, reset: resetSet } = useTimer(true, isRunning);
    const { elapsed: gameElapsed, reset: resetGame } = useTimer(true, isRunning);

    useEffect(() => {
        resetSet();
    }, [setId]);

    useEffect(() => {
        resetGame();
    }, [gameId]);

    return (
        <div className={styles.container}>
            <div className={styles.leftGroup}>
                <div className={styles.sessionBadge}>
                    <span className={styles.sessionLabel}>Sesión Activa</span>
                    <span className={styles.sessionId}>{sessionId}</span>
                </div>
                <div>
                    <p className={styles.totalMatchLabel}>Total Match</p>
                    <p className={styles.totalMatchTime}>{toMMSS(matchElapsed)}</p>
                </div>
            </div>

            <div className={styles.rightGroup}>
                <div className={styles.timerBlock}>
                    <p className={styles.timerLabel}>Set Timer</p>
                    <p className={styles.timerTime}>{toMMSS(setElapsed)}</p>
                </div>
                <div className={styles.timerBlock}>
                    <p className={styles.timerLabel}>Game Timer</p>
                    <p className={`${styles.timerTime} ${styles.gameTimeHighlight}`}>
                        {toMMSS(gameElapsed)}
                    </p>
                </div>
            </div>
        </div>
    );
};
