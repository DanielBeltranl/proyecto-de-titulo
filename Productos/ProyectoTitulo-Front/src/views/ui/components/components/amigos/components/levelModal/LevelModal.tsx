import React, { useState } from 'react';
import styles from './LevelModal.module.css';

type NivelOption = 'Amateur' | 'Semi-Pro' | 'Profesional';

interface LevelOption {
  value: NivelOption;
  label: string;
  description: string;
  svg: React.ReactNode;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    value: 'Amateur',
    label: 'Amateur',
    description: 'Practica tenis de manera recreativa, sin formación técnica formal.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="24" rx="14" ry="18" stroke="currentColor" strokeWidth="3"/>
        <line x1="32" y1="6" x2="32" y2="42" stroke="currentColor" strokeWidth="2"/>
        <line x1="18" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="2"/>
        <line x1="19" y1="14" x2="45" y2="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="19" y1="34" x2="45" y2="34" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="32" y1="42" x2="32" y2="58" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <line x1="26" y1="58" x2="38" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: 'Semi-Pro',
    label: 'Semi-Pro',
    description: 'Formación técnica regular y participación en torneos locales.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="32,5 38,22 57,22 43,33 48,50 32,40 16,50 21,33 7,22 26,22"
          stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: 'Profesional',
    label: 'Profesional',
    description: 'Alto rendimiento con trayectoria competitiva sólida y constante.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8h24v18a12 12 0 01-24 0V8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M20 18H10a8 8 0 008 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 18h10a8 8 0 01-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 38v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M22 46h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 54h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface LevelModalProps {
  isOpen: boolean;
  jugadorNombre: string;
  onConfirm: (nivel: NivelOption) => Promise<void>;
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ isOpen, jugadorNombre, onConfirm, onClose }) => {
  const [selected, setSelected] = useState<NivelOption | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (nivel: NivelOption) => {
    setSelected(nivel);
    setConfirming(true);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    try {
      setLoading(true);
      await onConfirm(selected);
    } finally {
      setLoading(false);
      setConfirming(false);
      setSelected(null);
    }
  };

  const handleBack = () => {
    setConfirming(false);
    setSelected(null);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {!confirming ? (
          <>
            <h2 className={styles.title}>Elige el nivel de tu jugador</h2>
            <p className={styles.subtitle}>{jugadorNombre}</p>
            <div className={styles.optionsGrid}>
              {LEVEL_OPTIONS.map(opt => (
                <div key={opt.value} className={styles.card}>
                  <div className={styles.svgWrapper}>{opt.svg}</div>
                  <h3 className={styles.levelName}>{opt.label}</h3>
                  <p className={styles.levelDesc}>{opt.description}</p>
                  <button
                    type="button"
                    className={styles.selectBtn}
                    onClick={() => handleSelect(opt.value)}
                  >
                    Elegir
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              Cancelar
            </button>
          </>
        ) : (
          <div className={styles.confirm}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#ffc174' }}>
              help
            </span>
            <h2 className={styles.title}>¿Confirmar nivel?</h2>
            <p className={styles.subtitle}>
              Asignarás a <strong>{jugadorNombre}</strong> el nivel <strong>{selected}</strong>
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={handleBack} disabled={loading}>
                Volver
              </button>
              <button type="button" className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
                {loading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelModal;
