import React from 'react';
import styles from './ServerSelector.module.css';
import type { MatchPlayer } from '../../model/matchDetailModel';

interface ServerSelectorProps {
  creator: MatchPlayer;
  invited: MatchPlayer;
  onSelect: (playerId: number) => void;
  onCancel: () => void;
  loading: boolean;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({
  creator,
  invited,
  onSelect,
  onCancel,
  loading,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.question}>¿Quién saca primero?</p>
      <div className={styles.players}>
        <button
          className={styles.playerOption}
          onClick={() => onSelect(creator.id)}
          disabled={loading}
        >
          <span className="material-symbols-outlined">sports_tennis</span>
          <span className={styles.playerName}>
            {creator.nombre} {creator.apellidoPaterno}
          </span>
        </button>
        <button
          className={styles.playerOption}
          onClick={() => onSelect(invited.id)}
          disabled={loading}
        >
          <span className="material-symbols-outlined">sports_tennis</span>
          <span className={styles.playerName}>
            {invited.nombre} {invited.apellidoPaterno}
          </span>
        </button>
      </div>
      <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
        Cancelar
      </button>
    </div>
  );
};

export default ServerSelector;
