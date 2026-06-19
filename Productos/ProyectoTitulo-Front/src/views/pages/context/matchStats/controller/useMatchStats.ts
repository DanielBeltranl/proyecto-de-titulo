import { useState, useEffect, useCallback } from 'react';
import { fetchMatchStatsData, fetchMatchDetail } from '../model/matchStatsModel';
import type { MatchStatsData, MatchDetail } from '../model/matchStatsModel';

const ERROR_MAP: Record<number, string> = {
  400: 'Las estadísticas solo están disponibles al finalizar el partido.',
  403: 'No tenés acceso a estas estadísticas.',
  404: 'Partido no encontrado.',
};

export const useMatchStats = (uuid: string) => {
  const [items, setItems] = useState<MatchStatsData[]>([]);
  const [isCoachView, setIsCoachView] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [result, detailResult] = await Promise.all([
        fetchMatchStatsData(uuid),
        fetchMatchDetail(uuid),
      ]);
      setItems(result.items);
      setIsCoachView(result.isCoachView);
      setDetail(detailResult);
      setPlayerIndex(0);
    } catch (err: any) {
      const status: number | undefined = err.response?.status;
      setError(status ? (ERROR_MAP[status] ?? 'Error al cargar estadísticas.') : 'Error al cargar estadísticas.');
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => { load(); }, [load]);

  const data = items[playerIndex] ?? null;
  const playerCount = items.length;
  const playerNames = items.map(item => item.player1.name);

  return { data, loading, error, isCoachView, playerIndex, playerCount, playerNames, setPlayerIndex, detail };
};
