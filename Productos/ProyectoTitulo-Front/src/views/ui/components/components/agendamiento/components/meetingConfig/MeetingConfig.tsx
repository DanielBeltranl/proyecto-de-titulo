import React, { useState } from 'react';
import styles from './MeetingConfig.module.css';
import ModalitySelector from './components/modalitySelector/ModalitySelector';
import LocationInput from './components/locationInput/LocationInput';
import CourtSurface from './components/courtSurface/CourtSurface';
import type { Surface, BestOf } from '../../../model/agendamientoModel';

export interface MeetingConfigData {
  best_of: BestOf;
  location: string;
  surface: Surface;
  scheduled_date: string;
  scheduled_time: string;
}

interface MeetingConfigProps {
  onChange?: (data: MeetingConfigData) => void;
}

const MeetingConfig: React.FC<MeetingConfigProps> = ({ onChange }) => {
  const [config, setConfig] = useState<MeetingConfigData>({
    best_of: 3,
    location: '',
    surface: 'Hard',
    scheduled_date: '',
    scheduled_time: '',
  });

  const update = (patch: Partial<MeetingConfigData>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    onChange?.(next);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <span className="material-symbols-outlined">sports_tennis</span>
          Configuración del Encuentro
        </h2>
        <div className={styles.formGroup}>
          <ModalitySelector
            selectedModality={String(config.best_of) as '1' | '3' | '5'}
            onSelect={(v) => update({ best_of: parseInt(v) as BestOf })}
          />
          <LocationInput
            value={config.location}
            onChange={(location) => update({ location })}
          />
          <CourtSurface
            selectedSurface={config.surface}
            onSelect={(surface) => update({ surface })}
          />
          <div className={styles.dateTimeRow}>
            <div className={styles.dateField}>
              <label className={styles.fieldLabel}>Fecha</label>
              <input
                type="date"
                className={styles.dateInput}
                value={config.scheduled_date}
                onChange={e => update({ scheduled_date: e.target.value })}
              />
            </div>
            <div className={styles.dateField}>
              <label className={styles.fieldLabel}>Hora</label>
              <input
                type="time"
                className={styles.dateInput}
                value={config.scheduled_time}
                onChange={e => update({ scheduled_time: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingConfig;
