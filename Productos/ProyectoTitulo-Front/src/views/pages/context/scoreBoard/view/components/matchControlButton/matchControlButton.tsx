import { useMatchStatus } from '../../../model/matchStatusContext.tsx';
import styles from './matchControlButton.module.css';

export const MatchControlButton = () => {
    const { status, toggle } = useMatchStatus();
    const label = status === 'paused' ? 'Iniciar timer' : 'Pausar timer';

    return (
        <button
            className={`${styles.button} ${status === 'started' ? styles.active : ''}`}
            onClick={toggle}
        >
            {label}
        </button>
    );
};
