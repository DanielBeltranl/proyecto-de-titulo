import styles from './gamePointsColumn.module.css';

interface GamePointsColumnProps {
    p1Points: string | number;
    p2Points: string | number;
    p1IsWinner?: boolean;
    p2IsWinner?: boolean;
    p1BreakChance?: boolean;
    p2BreakChance?: boolean;
}

export const GamePointsColumn = ({
                                     p1Points,
                                     p2Points,
                                     p1IsWinner = false,
                                     p2IsWinner = false,
                                     p1BreakChance = false,
                                     p2BreakChance = false,
                                 }: GamePointsColumnProps) => {
    return (
        <div className={styles.container}>
            <div className={`${styles.pointsCell} ${styles.bgTop} ${styles.roundedTopRight}`}>
                {p1BreakChance && <span className={styles.breakBadge}>BP</span>}
                <span key={p1Points} className={`${styles.scoreValue} ${p1IsWinner ? styles.highlight : styles.dimmed}`}>
                    {p1Points}
                </span>
            </div>

            <div className={`${styles.pointsCell} ${styles.bgBottom} ${styles.roundedBottomRight}`}>
                {p2BreakChance && <span className={styles.breakBadge}>BP</span>}
                <span key={p2Points} className={`${styles.scoreValue} ${p2IsWinner ? styles.highlight : styles.dimmed}`}>
                    {p2Points}
                </span>
            </div>
        </div>
    );
};
