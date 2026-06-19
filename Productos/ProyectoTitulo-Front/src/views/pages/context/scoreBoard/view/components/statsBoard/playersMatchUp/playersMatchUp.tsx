import type { PlayerPerformanceData } from '../performanceWidget';
import styles from "./playersMatchUp.module.css"

interface PlayerMatchupProps {
    p1: PlayerPerformanceData;
    p2: PlayerPerformanceData;
}

export const PlayerMatchup = ({ p1, p2 }: PlayerMatchupProps) => (
    <div className={styles.vsSection}>
        <div className={styles.playerCol}>
            <div className={styles.avatarContainerP1}>
                <img src={p1.image} alt="P1" className={styles.avatarImg} />
            </div>
            <span className={styles.playerName}>{p1.name}</span>
        </div>

        <div className={styles.vsText}>VS</div>

        <div className={styles.playerCol}>
            <div className={styles.avatarContainerP2}>
                <img src={p2.image} alt="P2" className={styles.avatarImg} />
            </div>
            <span className={styles.playerNameP2}>{p2.name}</span>
        </div>
    </div>
);