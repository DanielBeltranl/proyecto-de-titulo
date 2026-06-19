import { createPortal } from 'react-dom';
import styles from './MatchScheduledModal.module.css';

interface MatchScheduledModalProps {
  open: boolean;
  onConfirm: () => void;
}

export const MatchScheduledModal = ({ open, onConfirm }: MatchScheduledModalProps) => {
  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.card}>
        <span className={`material-symbols-outlined ${styles.icon}`}>sports_tennis</span>
        <h2 className={styles.title}>¡Partido agendado!</h2>
        <p className={styles.subtitle}>Tu partido quedó registrado correctamente.</p>
        <button className={styles.btn} onClick={onConfirm}>
          <span className="material-symbols-outlined">arrow_forward</span>
          Ver mis partidos
        </button>
      </div>
    </div>,
    document.body,
  );
};
