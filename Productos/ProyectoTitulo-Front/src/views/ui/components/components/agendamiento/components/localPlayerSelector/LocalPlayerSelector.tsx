import React from 'react';
import styles from './LocalPlayerSelector.module.css';
import type { FriendOption } from '../../model/agendamientoModel';

interface LocalPlayerSelectorProps {
  players: FriendOption[];
  loading: boolean;
  selectedId: number | undefined;
  onSelect: (id: number) => void;
}

const LocalPlayerSelector: React.FC<LocalPlayerSelectorProps> = ({ players, loading, selectedId, onSelect }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className="material-symbols-outlined">person</span>
        <h2 className={styles.title}>Jugador Local</h2>
        <span className={styles.required}>Requerido</span>
      </div>

      {loading ? (
        <p className={styles.hint}>Cargando jugadores...</p>
      ) : players.length === 0 ? (
        <p className={styles.hint}>No tenés jugadores asociados aún.</p>
      ) : (
        <div className={styles.list}>
          {players.map(p => (
            <button
              key={p.id}
              type="button"
              className={`${styles.card} ${selectedId === p.id ? styles.selected : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <span className={styles.avatar}>
                {p.nombre.charAt(0).toUpperCase()}
              </span>
              <div className={styles.info}>
                <span className={styles.name}>{p.nombre}</span>
                <span className={styles.level}>{p.nivel}</span>
              </div>
              {selectedId === p.id && (
                <span className={`material-symbols-outlined ${styles.check}`}>check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default LocalPlayerSelector;
