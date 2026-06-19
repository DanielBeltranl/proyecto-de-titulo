import api from '../../../../../api/axios';

// ── Raw API types ──────────────────────────────────────────────────────────

interface ApiRecord {
  wins: number;
  losses: number;
  total: number;
  win_pct: number;
  loss_pct: number;
}

interface ApiLastResult {
  match_id: string;
  won: boolean;
  opponent: { id: number; nombre: string; apellidoPaterno: string };
  location: string;
  surface: string;
}

interface ApiPointsWinLoss {
  won: number;
  lost: number;
  total: number;
  won_pct: number;
  lost_pct: number;
}

interface ApiBreakPoints {
  generated: number;
  converted: number;
  conversion_pct: number;
  faced: number;
  saved: number;
  save_pct: number;
}

interface ApiQuartile {
  quartile: number;
  min_duration: number;
  max_duration: number;
  count: number;
  pct: number;
}

export interface ApiInterval {
  interval: number;
  points_won_avg: number;
}

interface ApiResponse {
  message?: string;
  record?: ApiRecord;
  last_result?: ApiLastResult;
  points_win_loss?: ApiPointsWinLoss;
  avg_duration_won?: string;
  avg_duration_lost?: string;
  break_points?: ApiBreakPoints;
  quartiles?: ApiQuartile[];
  points_per_interval?: ApiInterval[];
}

// ── Internal model ─────────────────────────────────────────────────────────

export interface QuartileStat { pct: number; minSec: number; maxSec: number }

export interface GlobalStatsData {
  record: ApiRecord;
  lastResult: ApiLastResult | null;
  pointsWinLoss: ApiPointsWinLoss;
  avgDurationWon: string;
  avgDurationLost: string;
  breakPoints: ApiBreakPoints;
  quartiles: QuartileStat[];
  pointsPerInterval: ApiInterval[];
}

// ── Fetch ──────────────────────────────────────────────────────────────────

export const fetchGlobalStats = async (playerId?: number): Promise<GlobalStatsData | null> => {
  const url = playerId
    ? `/statistics/global/?player_id=${playerId}`
    : '/statistics/global/';

  const res = await api.get<ApiResponse>(url);
  const data = res.data;

  if (data.message || !data.record) return null;

  return {
    record: data.record,
    lastResult: data.last_result ?? null,
    pointsWinLoss: data.points_win_loss!,
    avgDurationWon: data.avg_duration_won ?? '—',
    avgDurationLost: data.avg_duration_lost ?? '—',
    breakPoints: data.break_points!,
    quartiles: [1, 2, 3, 4].map(n => {
      const q = data.quartiles?.find(q => q.quartile === n);
      return {
        pct: q?.pct ?? 0,
        minSec: q?.min_duration ?? 0,
        maxSec: q?.max_duration ?? 0,
      };
    }),
    pointsPerInterval: data.points_per_interval ?? [],
  };
};
