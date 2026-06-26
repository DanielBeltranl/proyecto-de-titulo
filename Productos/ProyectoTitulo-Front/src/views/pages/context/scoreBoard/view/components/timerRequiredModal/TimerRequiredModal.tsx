import { createPortal } from 'react-dom';
import styles from './TimerRequiredModal.module.css';

interface TimerRequiredModalProps {
  onStart: () => void;
}

export const TimerRequiredModal = ({ onStart }: TimerRequiredModalProps) =>
  createPortal(
    <div className={styles.overlay}>
      <div className={styles.card}>
        <span className={`material-symbols-outlined ${styles.icon}`}>timer</span>
        <h2 className={styles.title}>Timer requerido</h2>
        <p className={styles.subtitle}>
          Inicia el timer para comenzar a registrar el marcador.
        </p>

        <button className={styles.btnStart} onClick={onStart}>
          <span className="material-symbols-outlined">play_circle</span>
          Iniciar timer
        </button>
      </div>
    </div>,
    document.body,
  );
