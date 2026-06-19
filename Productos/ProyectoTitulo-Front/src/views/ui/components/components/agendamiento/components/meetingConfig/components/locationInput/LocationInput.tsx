import React from 'react';
import styles from './LocationInput.module.css';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Ubicación</label>
      <div className={styles.inputWrapper}>
        <span className={`material-symbols-outlined ${styles.icon}`}>location_on</span>
        <input
          type="text"
          className={styles.input}
          placeholder="Nombre (ej: Club de Tenis)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LocationInput;
