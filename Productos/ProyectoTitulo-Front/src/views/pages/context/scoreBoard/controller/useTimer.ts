import { useRef, useCallback, useState, useEffect } from 'react';

export const useTimer = (live = false, isRunning = true, persistKey?: string) => {
    const accumulatedRef = useRef<number>(0);   // segundos efectivos acumulados antes de la pausa actual
    const startRef = useRef<number | null>(null); // momento en que arrancó el tramo actual, null si pausado
    const isRunningRef = useRef(isRunning);
    const hydratedRef = useRef(false);
    const [elapsed, setElapsed] = useState(0);

    // Si hay persistKey, recupera el acumulado guardado antes de que corra cualquier otro efecto
    // (sobrevive a reloads/remounts del componente — sin esto el timer total vuelve a 0 cada vez)
    useEffect(() => {
        if (!persistKey || hydratedRef.current) return;
        hydratedRef.current = true;
        const stored = sessionStorage.getItem(persistKey);
        const seconds = stored !== null ? parseInt(stored, 10) : NaN;
        if (!Number.isNaN(seconds)) {
            accumulatedRef.current = seconds;
            setElapsed(seconds);
        }
    }, [persistKey]);

    // Mantiene el ref sincronizado para que reset() lea el valor actual
    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    // Al pausar: congela el acumulado. Al reanudar: marca el inicio del nuevo tramo
    useEffect(() => {
        if (isRunning) {
            startRef.current = Date.now();
        } else {
            if (startRef.current !== null) {
                accumulatedRef.current += Math.floor((Date.now() - startRef.current) / 1000);
                startRef.current = null;
                if (persistKey) sessionStorage.setItem(persistKey, String(accumulatedRef.current));
            }
        }
    }, [isRunning, persistKey]);

    // Intervalo visual: solo activo cuando live && isRunning
    useEffect(() => {
        if (!live || !isRunning) return;
        const id = setInterval(() => {
            if (startRef.current !== null) {
                const current = accumulatedRef.current + Math.floor((Date.now() - startRef.current) / 1000);
                setElapsed(current);
                if (persistKey) sessionStorage.setItem(persistKey, String(current));
            }
        }, 1000);
        return () => clearInterval(id);
    }, [live, isRunning, persistKey]);

    // Tiempo efectivo: acumulado + tramo actual (si está corriendo)
    const getElapsed = useCallback((): number => {
        if (startRef.current === null) return accumulatedRef.current;
        return accumulatedRef.current + Math.floor((Date.now() - startRef.current) / 1000);
    }, []);

    // Resetea el timer (por ejemplo, al iniciar un nuevo game)
    const reset = useCallback(() => {
        accumulatedRef.current = 0;
        startRef.current = isRunningRef.current ? Date.now() : null;
        setElapsed(0);
        if (persistKey) sessionStorage.removeItem(persistKey);
    }, [persistKey]);

    return { getElapsed, reset, elapsed };
};
