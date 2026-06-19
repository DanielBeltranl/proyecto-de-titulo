import React from 'react';
import styles from './ConfirmationCard.module.css';

interface ConfirmationCardProps {
  selectedFriendName?: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ selectedFriendName }) => {
  if (!selectedFriendName) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerContainer}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          hourglass_top
        </span>
        <p className={styles.title}>Esperando confirmación</p>
      </div>
      <p className={styles.message}>
        {selectedFriendName} recibirá una notificación una vez que agendes la sesión.
      </p>
    </div>
  );
};

export default ConfirmationCard;
