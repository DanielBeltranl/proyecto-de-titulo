import styles from "./playerNames.module.css"

interface PlayerData {
    name: string;
    isServing?: boolean;
    isActive?: boolean;
}

interface PlayersColumnProps {
    player1: PlayerData;
    player2: PlayerData;
}

export const PlayersNames = ({ player1, player2 }: PlayersColumnProps) => {
    return (
        <div className={styles.container}>
            <div className={`${styles.playerRow} ${styles.bgDark}`}>
                <div className={styles.infoWrapper}>
                    <span className={`${styles.serverLabel} ${player1.isServing ? styles.visible : styles.hidden}`}>
                        SERVIDOR
                    </span>
                    <h2 className={`${styles.playerName} ${player1.isActive ? styles.textActive : styles.textDimmed}`}>
                        {player1.name}
                    </h2>
                </div>
            </div>

            <div className={`${styles.playerRow} ${styles.bgLight}`}>
                <div className={styles.infoWrapper}>
                    <span className={`${styles.serverLabel} ${player2.isServing ? styles.visible : styles.hidden}`}>
                        SERVIDOR
                    </span>
                    <h2 className={`${styles.playerName} ${player2.isActive ? styles.textActive : styles.textDimmed}`}>
                        {player2.name}
                    </h2>
                </div>
            </div>
        </div>
    );
};