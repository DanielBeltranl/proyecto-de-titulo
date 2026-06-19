import React from 'react';
import styles from './FriendsList.module.css';
import FriendCard from '../friendCard/FriendCard';
import type { Friend } from '../friendCard/FriendCard';

interface FriendsListProps {
  friends: Friend[];
  selectedFriendId?: number;
  onSelectFriend?: (friendId: number) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  selectedFriendId,
  onSelectFriend,
}) => {
  return (
    <div className={styles.listContainer}>
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          isSelected={selectedFriendId === friend.id}
          onSelect={onSelectFriend}
        />
      ))}
    </div>
  );
};

export default FriendsList;
