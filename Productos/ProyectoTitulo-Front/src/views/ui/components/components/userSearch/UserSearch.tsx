import React from 'react';
import styles from './UserSearch.module.css';

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Nombre de usuario o public id."
}) => {
  return (
    <div className={styles.searchContainer}>
      <span className={`material-symbols-outlined ${styles.searchIcon}`}>
        search
      </span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
