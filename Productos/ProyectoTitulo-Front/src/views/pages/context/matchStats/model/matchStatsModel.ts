import { obtenerEstadisticasPartido, obtenerDatosPartido, obtenerDetallePartido } from '../../../../../services/usuarioService';

// --- Raw API types ---
interface ApiBreakPoints {
  generated: number;
  converted: number;
  conversion_pct: number;
  faced: number;
  saved: number;
  save_pct: number;
}

interface ApiMatchStats {
  match_duration: string | null;
  points_win_loss: { won: number; lost: number; total: number; lost_pct: number };
  avg_duration_won: string | null;
  avg_duration_lost: string | null;
  break_points: ApiBreakPoints;
  match_points: ApiBreakPoints;
  total_distance: number;
  quartiles: Array<{ quartile: number; color: string; min_duration: number; max_duration: number; count: number; pct: number }>;
  points_per_interval: Array<{ interval: number; points_won: number }>;
  distance_per_interval: Array<{ interval: number; distance: number }>;
}

interface ApiCoachStatsItem extends ApiMatchStats {
  player_id: string;
  nombre: string;
  apellidoPaterno: string;
}

interface ApiMatchPlayer { id: number; nombre: string; apellidoPaterno: string }

interface ApiMatchData {
  id_match: string;
  match_state: string;
  local_player: ApiMatchPlayer;
  invited: ApiMatchPlayer;
}

export interface MatchStatsFetchResult {
  items: MatchStatsData[];
  isCoachView: boolean;
}

// --- View types ---
export interface StatsPlayer { id: number; name: string; avatar?: string }
export interface BreakPoints { won: number; total: number }
export interface TrendInterval { minute: number; pointsWon: number }
export interface QuartileStat { pct: number; minSec: number; maxSec: number }
export interface PointDurationStats {
  quartiles: QuartileStat[];
  avgWonSeconds: number;
  avgLostSeconds: number;
}

export interface MatchStatsData {
  matchId: string;
  player1: StatsPlayer;
  player2: StatsPlayer;
  matchDuration: string;
  distanceKm: number;
  pointsWon: number;
  pointsLost: number;
  effectivenessPct: number;
  breakPointsFavorable: BreakPoints;
  breakPointsAgainst: BreakPoints;
  matchPointsFavorable: BreakPoints;
  matchPointsAgainst: BreakPoints;
  trend: TrendInterval[];
  pointDuration: PointDurationStats;
}

// --- Helpers ---
const mmssToSeconds = (mmss: string | null): number => {
  if (!mmss) return 0;
  const parts = mmss.split(':').map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + (parts[1] ?? 0);
};

const transform = (stats: ApiMatchStats, match: ApiMatchData): MatchStatsData => ({
  matchId: match.id_match,
  player1: { id: match.local_player.id, name: `${match.local_player.nombre} ${match.local_player.apellidoPaterno}` },
  player2: match.invited
    ? { id: match.invited.id, name: `${match.invited.nombre} ${match.invited.apellidoPaterno}` }
    : { id: 0, name: 'Invitado externo' },
  matchDuration: stats.match_duration ?? '--:--:--',
  distanceKm: stats.total_distance / 1000,
  pointsWon: stats.points_win_loss.won,
  pointsLost: stats.points_win_loss.lost,
  effectivenessPct: Math.round(100 - stats.points_win_loss.lost_pct),
  breakPointsFavorable: { won: stats.break_points.converted, total: stats.break_points.generated },
  breakPointsAgainst: { won: stats.break_points.saved, total: stats.break_points.faced },
  matchPointsFavorable: { won: stats.match_points.converted, total: stats.match_points.generated },
  matchPointsAgainst: { won: stats.match_points.saved, total: stats.match_points.faced },
  trend: stats.points_per_interval.map(p => ({ minute: p.interval, pointsWon: p.points_won })),
  pointDuration: {
    quartiles: [1, 2, 3, 4].map(n => {
      const q = stats.quartiles.find(q => q.quartile === n);
      return { pct: q?.pct ?? 0, minSec: q?.min_duration ?? 0, maxSec: q?.max_duration ?? 0 };
    }),
    avgWonSeconds: mmssToSeconds(stats.avg_duration_won),
    avgLostSeconds: mmssToSeconds(stats.avg_duration_lost),
  },
});

const transformCoachItem = (item: ApiCoachStatsItem, uuid: string): MatchStatsData => ({
  matchId: uuid,
  player1: { id: item.player_id, name: `${item.nombre} ${item.apellidoPaterno}` },
  player2: { id: 0, name: '' },
  matchDuration: item.match_duration ?? '--:--:--',
  distanceKm: item.total_distance / 1000,
  pointsWon: item.points_win_loss.won,
  pointsLost: item.points_win_loss.lost,
  effectivenessPct: Math.round(100 - item.points_win_loss.lost_pct),
  breakPointsFavorable: { won: item.break_points.converted, total: item.break_points.generated },
  breakPointsAgainst: { won: item.break_points.saved, total: item.break_points.faced },
  matchPointsFavorable: { won: item.match_points.converted, total: item.match_points.generated },
  matchPointsAgainst: { won: item.match_points.saved, total: item.match_points.faced },
  trend: item.points_per_interval.map(p => ({ minute: p.interval, pointsWon: p.points_won })),
  pointDuration: {
    quartiles: [1, 2, 3, 4].map(n => {
      const q = item.quartiles.find(q => q.quartile === n);
      return { pct: q?.pct ?? 0, minSec: q?.min_duration ?? 0, maxSec: q?.max_duration ?? 0 };
    }),
    avgWonSeconds: mmssToSeconds(item.avg_duration_won),
    avgLostSeconds: mmssToSeconds(item.avg_duration_lost),
  },
});

// --- Match detail ---
export interface SetScore { p1: number; p2: number }

export interface MatchDetail {
  location: string;
  surface: 'Clay' | 'Hard' | 'Grass';
  bestOf: 1 | 3 | 5;
  winnerId: number | null;
  winnerName: string | null;
  scheduledAt: string;
  sets: SetScore[];
}

export const fetchMatchDetail = async (uuid: string): Promise<MatchDetail | null> => {
  try {
    const res = await obtenerDetallePartido(uuid);
    const d = res.data;
    return {
      location: d.location ?? '',
      surface: d.surface ?? 'Hard',
      bestOf: d.best_of ?? 3,
      winnerId: d.winner?.id ?? null,
      winnerName: d.winner ? `${d.winner.nombre} ${d.winner.apellidoPaterno}` : null,
      scheduledAt: d.scheduled_at ?? d.created_at ?? '',
      sets: Array.isArray(d.sets)
        ? d.sets.map((s: any) => ({ p1: s.score_p1, p2: s.score_p2 }))
        : [],
    };
  } catch {
    return null;
  }
};

export const fetchMatchStatsData = async (uuid: string): Promise<MatchStatsFetchResult> => {
  console.log('[matchStats] fetching uuid:', uuid);
  try {
    const statsRes = await obtenerEstadisticasPartido(uuid);
    console.log('[matchStats] stats raw:', statsRes.data);

    if (Array.isArray(statsRes.data)) {
      const items = (statsRes.data as ApiCoachStatsItem[]).map(item => transformCoachItem(item, uuid));
      return { items, isCoachView: true };
    }

    const matchRes = await obtenerDatosPartido(uuid);
    console.log('[matchStats] match raw:', matchRes.data);
    const result = transform(statsRes.data as ApiMatchStats, matchRes.data);
    return { items: [result], isCoachView: false };
  } catch (fetchErr: any) {
    console.error('[matchStats] fetch error:', fetchErr?.response?.status, fetchErr?.config?.url, fetchErr?.response?.data);
    throw fetchErr;
  }
};
