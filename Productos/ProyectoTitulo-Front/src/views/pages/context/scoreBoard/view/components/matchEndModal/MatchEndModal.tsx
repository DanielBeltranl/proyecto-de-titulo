import { createPortal } from 'react-dom';
import styles from './MatchEndModal.module.css';

interface MatchEndModalProps {
  onFinish: () => void;
  onUndo: () => void;
  canUndo: boolean;
  loading: boolean;
}

export const MatchEndModal = ({ onFinish, onUndo, canUndo, loading }: MatchEndModalProps) =>
  createPortal(
    <div className={styles.overlay}>
      <div className={styles.card}>
        <span className={`material-symbols-outlined ${styles.trophy}`}>emoji_events</span>
        <h2 className={styles.title}>Partido terminado</h2>
        <p className={styles.subtitle}>¿Confirmás el resultado o deshacés el último punto?</p>

        <div className={styles.actions}>
          <button
            className={styles.btnFinish}
            onClick={onFinish}
            disabled={loading}
          >
            {loading
              ? <span className={`material-symbols-outlined ${styles.spin}`}>autorenew</span>
              : <span className="material-symbols-outlined">check_circle</span>
            }
            Terminar partido
          </button>

          <button
            className={styles.btnUndo}
            onClick={onUndo}
            disabled={!canUndo || loading}
          >
            <span className="material-symbols-outlined">undo</span>
            Deshacer último punto
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
