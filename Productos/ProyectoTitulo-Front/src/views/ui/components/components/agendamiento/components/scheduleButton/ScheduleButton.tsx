import React from 'react';
import styles from './ScheduleButton.module.css';

interface ScheduleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ScheduleButton: React.FC<ScheduleButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''} ${loading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <div className={styles.gradient}></div>
      <span className={styles.content}>
        Agendar Partido
        <span className="material-symbols-outlined">arrow_forward</span>
      </span>
    </button>
  );
};

export default ScheduleButton;
