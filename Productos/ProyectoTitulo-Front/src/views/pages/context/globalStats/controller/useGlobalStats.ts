import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchGlobalStats, type GlobalStatsData } from '../model/globalStatsModel';

export const useGlobalStats = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<GlobalStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const playerIdParam = searchParams.get('player_id');
    const playerId = playerIdParam ? Number(playerIdParam) : undefined;

    fetchGlobalStats(playerId)
      .then(result => {
        if (!result) {
          setEmpty(true);
        } else {
          setData(result);
        }
      })
      .catch(err => {
        console.error('[useGlobalStats]', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return { data, loading, empty, error };
};
