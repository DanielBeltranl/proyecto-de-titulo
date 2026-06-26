import React, { useState, useRef, useCallback } from 'react';
import styles from './InvitedPlayerSearch.module.css';
import { buscarJugadorExterno } from '../../model/agendamientoModel';
import type { ExternalPlayerResult, InvitedPlayerData, InvitedType } from '../../model/agendamientoModel';

interface InvitedPlayerSearchProps {
  onChange: (data: InvitedPlayerData) => void;
  excludeId?: number;
}

const TAB_LABELS: Record<InvitedType, string> = {
  registered: 'Registrado',
  guest: 'Invitado',
  none: 'Sin oponente',
};

const InvitedPlayerSearch: React.FC<InvitedPlayerSearchProps> = ({ onChange, excludeId }) => {
  const [type, setType] = useState<InvitedType>('none');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalPlayerResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<ExternalPlayerResult | null>(null);
  const [guestName, setGuestName] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleTypeChange = (newType: InvitedType) => {
    setType(newType);
    setQuery('');
    setResults([]);
    setSelected(null);
    setGuestName('');
    onChange({ type: newType });
  };

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setSelected(null);
    onChange({ type: 'registered' });
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const data = await buscarJugadorExterno(value.trim());
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [onChange]);

  const handleSelectPlayer = (player: ExternalPlayerResult) => {
    setSelected(player);
    setQuery(`${player.nombre} ${player.apellidoPaterno}`);
    setResults([]);
    onChange({ type: 'registered', id_invited_player: player.id });
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    setResults([]);
    onChange({ type: 'registered' });
  };

  const handleGuestName = (name: string) => {
    setGuestName(name);
    onChange({ type: 'guest', guest_name: name });
  };

  const visibleResults = results.filter(r => r.id !== excludeId);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="material-symbols-outlined">group_add</span>
          <h2 className={styles.title}>Oponente</h2>
          <span className={styles.optional}>Opcional</span>
        </div>

        <p className={styles.hint}>Ingresa los datos del oponente.</p>

        <div className={styles.tabs}>
          {(Object.keys(TAB_LABELS) as InvitedType[]).map(t => (
            <button
              key={t}
              type="button"
              className={`${styles.tab} ${type === t ? styles.tabActive : ''}`}
              onClick={() => handleTypeChange(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {type === 'registered' && (
          <div className={styles.searchWrapper}>
            <div className={styles.dataNotice}>
              <span className="material-symbols-outlined">info</span>
              <p>Al elegir un jugador registrado, la información quedará disponible para todos los entrenadores involucrados.</p>
            </div>

            <div className={styles.inputRow}>
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                className={styles.input}
                placeholder="Buscar por nombre..."
                value={query}
                onChange={e => handleSearch(e.target.value)}
                disabled={!!selected}
              />
              {searching && <span className={styles.spinner} />}
              {selected && (
                <button type="button" className={styles.clearBtn} onClick={handleClear}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            {visibleResults.length > 0 && !selected && (
              <ul className={styles.results}>
                {visibleResults.map(r => (
                  <li key={r.id} className={styles.resultItem} onClick={() => handleSelectPlayer(r)}>
                    <div className={styles.resultMain}>
                      <span className={styles.resultName}>{r.nombre} {r.apellidoPaterno}</span>
                      {r.entrenador_nombre && (
                        <span className={styles.resultCoach}>
                          <span className="material-symbols-outlined">sports</span>
                          {r.entrenador_nombre}
                        </span>
                      )}
                    </div>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </li>
                ))}
              </ul>
            )}

            {selected && (
              <div className={styles.selectedCard}>
                <span className="material-symbols-outlined">check_circle</span>
                <div>
                  <span className={styles.selectedName}>{selected.nombre} {selected.apellidoPaterno}</span>
                  {selected.entrenador_nombre && (
                    <span className={styles.selectedCoach}>Entrenador: {selected.entrenador_nombre}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {type === 'guest' && (
          <>
            <p className={styles.hint}>Indica el nombre de tu rival. No se guardarán estadísticas.</p>
            <div className={styles.guestWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Nombre completo del invitado"
                value={guestName}
                onChange={e => handleGuestName(e.target.value)}
              />
              {guestName.trim() && (
                <p className={styles.guestConfirm}>
                  Jugará como invitado: <strong>{guestName.trim()}</strong>
                </p>
              )}
            </div>
          </>
        )}

        {type === 'none' && (
          <p className={styles.hint}>El partido se registrará sin oponente asignado.</p>
        )}
      </div>
    </section>
  );
};

export default InvitedPlayerSearch;
