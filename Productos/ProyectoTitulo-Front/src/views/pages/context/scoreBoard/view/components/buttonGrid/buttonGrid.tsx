import type { Player } from '../../../model/scoreTypes';
import { PointButton } from './addPointButton/PointButton.tsx';
import styles from './buttonGrid.module.css';

interface ButtonGridProps {
    player1Label: string;
    player2Label: string;
    onScoreUp: (player: Player) => void;
    onUndo: () => void;
    canUndo: boolean;
    disabled?: boolean;
}

export const ButtonGrid = ({ player1Label, player2Label, onScoreUp, onUndo, canUndo, disabled }: ButtonGridProps) => {
    return (
        <div className={styles.buttonsContainer}>
            <PointButton playerLabel={player1Label} variant="primary" text="sumar punto" onClick={() => onScoreUp('p1')} disabled={disabled} />
            <button className={styles.undoButton} onClick={onUndo} disabled={!canUndo || disabled}>
                deshacer
            </button>
            <PointButton playerLabel={player2Label} variant="primary" text="sumar punto" onClick={() => onScoreUp('p2')} disabled={disabled} />
        </div>
    );
};
