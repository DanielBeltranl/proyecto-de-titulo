import React from 'react';
import styles from './CourtSurface.module.css';
import type { Surface } from '../../../../../model/agendamientoModel';

export type { Surface as SurfaceType };

interface SurfaceOption {
  id: Surface;
  label: string;
  icon: string;
}

interface CourtSurfaceProps {
  selectedSurface: Surface;
  onSelect: (surface: Surface) => void;
}

const SURFACES: SurfaceOption[] = [
  { id: 'Clay', label: 'Arcilla', icon: 'terrain' },
  { id: 'Hard', label: 'Dura',    icon: 'layers'  },
];

const CourtSurface: React.FC<CourtSurfaceProps> = ({ selectedSurface, onSelect }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Tipo de Cancha</label>
      <div className={styles.grid}>
        {SURFACES.map((surface) => (
          <button
            key={surface.id}
            className={`${styles.surfaceButton} ${selectedSurface === surface.id ? styles.active : ''}`}
            onClick={() => onSelect(surface.id)}
            title={surface.label}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {surface.icon}
            </span>
            <span className={styles.label}>{surface.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourtSurface;
