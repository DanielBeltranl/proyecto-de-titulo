import { useState, useEffect, useMemo } from 'react';
import { fetchAmigos, fetchAlumnos } from '../model/amigosModel';
import type { Friend, FriendUser } from '../model/amigosModel';

interface UseAmigosReturn {
  amigos: Friend[];
  alumnos: FriendUser[];
  isCoach: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useAmigos = (): UseAmigosReturn => {
  const isCoach = useMemo(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem('usuario') || 'null');
      return u?.rol === 'Entrenador';
    } catch { return false; }
  }, []);

  const [amigos, setAmigos] = useState<Friend[]>([]);
  const [alumnos, setAlumnos] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      if (isCoach) {
        const data = await fetchAlumnos();
        setAlumnos(data);
      } else {
        const data = await fetchAmigos();
        setAmigos(data);
      }
    } catch (err) {
      console.error('[useAmigos] error:', err);
      setError('Error al cargar la lista');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { amigos, alumnos, isCoach, loading, error, refresh: cargar };
};
