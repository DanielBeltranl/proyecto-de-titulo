import styles from './PointButton.module.css';

interface AddPointButtonProps {
    playerLabel: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    text: string;
    disabled?: boolean;
}

export const PointButton = ({ playerLabel, variant, onClick, text, disabled }: AddPointButtonProps) => {
    const buttonClass = variant === 'primary' ? styles.primary : styles.secondary;

    return (
        <button className={`${styles.button} ${buttonClass}`} onClick={onClick} disabled={disabled}>
            <span className={styles.topLabel}>{text}</span>
            <span className={styles.mainLabel}>{playerLabel}</span>
        </button>
    );
};
