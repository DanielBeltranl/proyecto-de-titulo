import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  open: boolean;
}

export const SuccessModal = ({ open }: SuccessModalProps) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!open) return;
    setCount(5);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.card}>
        <span className={`material-symbols-outlined ${styles.icon}`}>check_circle</span>
        <h2 className={styles.title}>Registro exitoso</h2>
        <p className={styles.subtitle}>Redirigiendo al login...</p>
        <div className={styles.countdown}>{count}</div>
      </div>
    </div>,
    document.body,
  );
};
