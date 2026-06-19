import styles from './currentSetScoreBoard.module.css';
import type { SetScore } from '../../../model/scoreTypes';

interface CurrentGameColumnProps {
    completedSets: SetScore[];
    p1Games: number;
    p2Games: number;
}

export const CurrentGameColumn = ({ completedSets, p1Games, p2Games }: CurrentGameColumnProps) => {
    return (
        <div className={styles.setsWrapper}>
            {completedSets.map((set, i) => (
                <div key={i} className={`${styles.setColumn} ${styles.completedColumn}`}>
                    <div className={`${styles.gameCell} ${styles.bgTop}`}>{set.p1}</div>
                    <div className={`${styles.gameCell} ${styles.bgBottom}`}>{set.p2}</div>
                </div>
            ))}
            <div className={styles.setColumn}>
                <div className={`${styles.gameCell} ${styles.bgTop}`}>
                    <span key={p1Games} className={styles.gameValue}>{p1Games}</span>
                </div>
                <div className={`${styles.gameCell} ${styles.bgBottom}`}>
                    <span key={p2Games} className={styles.gameValue}>{p2Games}</span>
                </div>
            </div>
        </div>
    );
};
