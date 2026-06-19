import React, { useState } from 'react';
import styles from './InviteOpponent.module.css';
import FriendsList from './components/friendsList/FriendsList';
import ConfirmationCard from './components/confirmationCard/ConfirmationCard';
import type { Friend } from './components/friendCard/FriendCard';
import type { FriendOption } from '../../../model/agendamientoModel';

type OpponentType = 'registered' | 'guest';

export interface InviteOpponentData {
  opponentType: OpponentType;
  selectedFriendId?: number;
  guest_name?: string;
}

interface InviteOpponentProps {
  friends: FriendOption[];
  loadingFriends: boolean;
  onChange?: (data: InviteOpponentData) => void;
}

const InviteOpponent: React.FC<InviteOpponentProps> = ({ friends, loadingFriends, onChange }) => {
  const [opponentType, setOpponentType] = useState<OpponentType>('registered');
  const [selectedFriendId, setSelectedFriendId] = useState<number>();
  const [guestName, setGuestName] = useState('');

  const handleSelectType = (type: OpponentType) => {
    setOpponentType(type);
    setSelectedFriendId(undefined);
    setGuestName('');
    onChange?.({ opponentType: type });
  };

  const handleSelectFriend = (friendId: number) => {
    const newId = selectedFriendId === friendId ? undefined : friendId;
    setSelectedFriendId(newId);
    onChange?.({ opponentType: 'registered', selectedFriendId: newId });
  };

  const handleGuestName = (name: string) => {
    setGuestName(name);
    onChange?.({ opponentType: 'guest', guest_name: name });
  };

  const friendCards: Friend[] = friends.map((f) => ({ id: f.id, nombre: f.nombre, nivel: f.nivel }));
  const selectedFriend = friends.find((f) => f.id === selectedFriendId);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <span className="material-symbols-outlined">person_add</span>
          Invitar Oponente
        </h2>

        <div className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${opponentType === 'registered' ? styles.toggleActive : ''}`}
            onClick={() => handleSelectType('registered')}
          >
            Jugador registrado
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${opponentType === 'guest' ? styles.toggleActive : ''}`}
            onClick={() => handleSelectType('guest')}
          >
            Invitado sin cuenta
          </button>
        </div>

        {opponentType === 'registered' ? (
          <>
            {loadingFriends ? (
              <p style={{ color: '#d8c3ad', fontSize: '0.875rem' }}>Cargando amigos...</p>
            ) : friends.length === 0 ? (
              <p style={{ color: '#a08e7a', fontSize: '0.875rem' }}>No tienes amigos para invitar aún.</p>
            ) : (
              <FriendsList
                friends={friendCards}
                selectedFriendId={selectedFriendId}
                onSelectFriend={handleSelectFriend}
              />
            )}
            <ConfirmationCard selectedFriendName={selectedFriend?.nombre} />
            {selectedFriendId && (
              <p className={styles.sharedDataNotice}>
                <span className="material-symbols-outlined">info</span>
                Al invitar a un jugador registrado a nombre de otro entrenador, la data quedará disponible para ambos usuarios.
              </p>
            )}
          </>
        ) : (
          <div className={styles.guestInput}>
            <label className={styles.guestLabel}>Nombre del invitado</label>
            <input
              type="text"
              className={styles.guestField}
              placeholder="Ej: Pedro Soto"
              value={guestName}
              onChange={e => handleGuestName(e.target.value)}
            />
            {guestName.trim() && (
              <p className={styles.guestConfirm}>
                Jugará contra <strong>{guestName.trim()}</strong> (sin cuenta).
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InviteOpponent;
