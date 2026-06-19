import { useState, useEffect, useRef } from 'react';
import { buscarEntrenadores } from '../../../../../../services/usuarioService.ts';
import type { EntrenadorResult } from '../../../../../../services/usuarioService.ts';
import styles from './EntrenadorSearch.module.css';

interface Props {
    onSelect: (entrenador: EntrenadorResult) => void;
    selectedEntrenador: EntrenadorResult | null;
    onClear: () => void;
}

export const EntrenadorSearch = ({ onSelect, selectedEntrenador, onClear }: Props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EntrenadorResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await buscarEntrenadores(query);
                setResults(Array.isArray(res.data) ? res.data : []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handleSelect = (entrenador: EntrenadorResult) => {
        onSelect(entrenador);
        setQuery('');
        setResults([]);
    };

    if (selectedEntrenador) {
        return (
            <div className={styles.container}>
                <label className={styles.label}>Entrenador seleccionado</label>
                <div className={styles.selectedCard}>
                    <div className={styles.selectedInfo}>
                        <span className={styles.selectedName}>
                            {selectedEntrenador.nombre} {selectedEntrenador.apellidoPaterno} {selectedEntrenador.apellidoMaterno}
                        </span>
                        <span className={styles.selectedCorreo}>{selectedEntrenador.correo}</span>
                    </div>
                    <button type="button" className={styles.clearBtn} onClick={onClear}>✕</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Buscar entrenador <span className={styles.optional}>(opcional)</span>
            </label>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Nombre, apellido o correo"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                />
                {loading && <span className={styles.spinner} />}
            </div>
            {results.length > 0 && (
                <ul className={styles.resultsList}>
                    {results.map(e => (
                        <li
                            key={e.id}
                            className={styles.resultItem}
                            onClick={() => handleSelect(e)}
                        >
                            <span className={styles.resultName}>
                                {e.nombre} {e.apellidoPaterno} {e.apellidoMaterno}
                            </span>
                            <span className={styles.resultCorreo}>{e.correo}</span>
                        </li>
                    ))}
                </ul>
            )}
            {query.length >= 2 && !loading && results.length === 0 && (
                <p className={styles.noResults}>Sin resultados para "{query}"</p>
            )}
        </div>
    );
};
