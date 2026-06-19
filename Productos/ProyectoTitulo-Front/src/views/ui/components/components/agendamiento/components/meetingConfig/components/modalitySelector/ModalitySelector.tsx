import React from 'react';
import styles from './ModalitySelector.module.css';

interface ModalitySelectorProps {
  selectedModality: '1' | '3' | '5';
  onSelect: (modality: '1' | '3' | '5') => void;
}

const ModalitySelector: React.FC<ModalitySelectorProps> = ({ selectedModality, onSelect }) => {
  const options: Array<{ value: '1' | '3' | '5'; label: string }> = [
    { value: '1', label: '1 SET' },
    { value: '3', label: '3 SETS' },
    { value: '5', label: '5 SETS' },
  ];

  return (
    <div className={styles.container}>
      <label className={styles.label}>Modalidad de Juego</label>
      <div className={styles.buttonGroup}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.button} ${selectedModality === option.value ? styles.active : ''}`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalitySelector;
