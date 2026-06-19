import { useState, useEffect, useRef } from 'react';
import { fetchLiveStats } from '../model/scoreBoardModel';
import type { PlayerPerformanceData } from '../view/components/statsBoard/performanceWidget';

const POLL_INTERVAL = 30_000;

interface UseLiveStatsReturn {
  p1: PlayerPerformanceData | null;
  p2: PlayerPerformanceData | null;
}

export const useLiveStats = (uuid: string): UseLiveStatsReturn => {
  const [p1, setP1] = useState<PlayerPerformanceData | null>(null);
  const [p2, setP2] = useState<PlayerPerformanceData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!uuid) return;

    const poll = async () => {
      const result = await fetchLiveStats(uuid);
      if (result) {
        setP1(result[0]);
        setP2(result[1]);
      }
    };

    poll();
    timerRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [uuid]);

  return { p1, p2 };
};
