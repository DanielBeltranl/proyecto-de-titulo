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

  const [hourStr, setHourStr] = useState('');
  const [minuteStr, setMinuteStr] = useState('');

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const isToday = config.scheduled_date === todayStr;
  const selectedHour = hourStr ? parseInt(hourStr, 10) : null;

  const hours = Array.from({ length: 24 }, (_, h) => pad(h));
  const minutes = ['00', '15', '30', '45'];

  const handleHourChange = (h: string) => {
    setHourStr(h);
    update({ scheduled_time: h && minuteStr ? `${h}:${minuteStr}` : '' });
  };

  const handleMinuteChange = (m: string) => {
    setMinuteStr(m);
    update({ scheduled_time: hourStr && m ? `${hourStr}:${m}` : '' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <span className="material-symbols-outlined">sports_tennis</span>
          Configuración del Encuentro
        </h2>
        <p className={styles.hint}>Define la modalidad, lugar, superficie, fecha y hora del partido.</p>
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
                min={todayStr}
                onChange={e => update({ scheduled_date: e.target.value })}
              />
            </div>
            <div className={styles.dateField}>
              <label className={styles.fieldLabel}>Hora</label>
              <div className={styles.timeRow}>
                <select
                  className={styles.timeSelect}
                  value={hourStr}
                  onChange={e => handleHourChange(e.target.value)}
                >
                  <option value="">Hora</option>
                  {hours.map(h => (
                    <option key={h} value={h} disabled={isToday && parseInt(h, 10) < now.getHours()}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  className={styles.timeSelect}
                  value={minuteStr}
                  onChange={e => handleMinuteChange(e.target.value)}
                >
                  <option value="">Min</option>
                  {minutes.map(m => (
                    <option
                      key={m}
                      value={m}
                      disabled={isToday && selectedHour === now.getHours() && parseInt(m, 10) < now.getMinutes()}
                    >
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingConfig;
