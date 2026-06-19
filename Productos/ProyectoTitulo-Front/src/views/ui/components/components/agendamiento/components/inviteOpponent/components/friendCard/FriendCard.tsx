import React from 'react';
import styles from './FriendCard.module.css';

export interface Friend {
  id: number;
  nombre: string;
  nivel: string;
  avatar?: string;
  isSelected?: boolean;
}

interface FriendCardProps {
  friend: Friend;
  isSelected?: boolean;
  onSelect?: (friendId: number) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, isSelected = false, onSelect }) => {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect?.(friend.id)}
    >
      <div className={styles.avatarContainer}>
        {friend.avatar ? (
          <img
            src={friend.avatar}
            alt={friend.nombre}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <span className="material-symbols-outlined">person</span>
          </div>
        )}
      </div>

      <div className={styles.infoContainer}>
        <p className={styles.nombre}>{friend.nombre}</p>
        <p className={`${styles.nivel} ${styles[friend.nivel.toLowerCase().replace('-', '')]}`}>
          Nivel: {friend.nivel}
        </p>
      </div>

      <span className={`material-symbols-outlined ${styles.actionIcon}`}>
        {isSelected ? 'check_circle' : 'add_circle'}
      </span>
    </div>
  );
};

export default FriendCard;
