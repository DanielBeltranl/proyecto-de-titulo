import {
  recuperarPartido,
  registrarPunto,
  deshacerPunto,
  pausarPartido,
  finalizarPartido,
  obtenerEstadisticasLive,
} from '../../../../../services/usuarioService';
import type { PlayerPerformanceData } from '../view/components/statsBoard/performanceWidget';

export interface RecoveryPlayer {
  id: number;
  nombre: string;
  apellidoPaterno: string;
}

export interface RecoverySet {
  id_set: string;
  set_number: number;
  score_p1: number;
  score_p2: number;
  winner_id: number;
}

export interface RecoveryGame {
  id_game: string;
  game_number: number;
  is_serving: RecoveryPlayer;
  is_tiebreak: boolean;
}

export interface RecoveryResponse {
  match: {
    id_match: string;
    best_of: 1 | 3 | 5;
    match_state: string;
    local_player: RecoveryPlayer;
    invited: RecoveryPlayer | null;
    guest_name?: string;
  };
  sets_p1: number;
  sets_p2: number;
  sets: RecoverySet[];
  current_set: { id_set: string; set_number: number; score_p1: number; score_p2: number } | null;
  current_game: RecoveryGame | null;
  current_score: { score_p1: string; score_p2: string };
  last_point: { id_point: string; winner_id: number; duration: number } | null;
}

export interface PointApiResponse {
  game_closed: boolean;
  set_closed: boolean;
  match_closed: boolean;
  tiebreak_required: boolean;
  point: { id_point: string };
  current_score: { score_p1: string; score_p2: string };
  current_game: { id_game: string; is_serving_id: number; is_tiebreak: boolean } | null;
  current_set: { score_p1: number; score_p2: number } | null;
  winner?: { id: number; nombre: string; apellidoPaterno: string };
}

interface LiveStatsApiItem {
  player: { id: number | null; nombre: string; apellidoPaterno: string };
  points_win_loss: { won: number; lost: number; total: number; won_pct: number; lost_pct: number };
  avg_duration_won: string;
  avg_duration_lost: string;
  break_points: {
    generated: number; converted: number; conversion_pct: number;
    faced: number; saved: number; save_pct: number;
  };
  total_distance: number | null;
}

const mapLiveItem = (item: LiveStatsApiItem, sub: 'WON' | 'SAVED'): PlayerPerformanceData => {
  const bp = item.break_points;
  const breakPoints = sub === 'WON'
    ? `${bp.converted}/${bp.generated}`
    : `${bp.saved}/${bp.faced}`;

  return {
    name: `${item.player.nombre} ${item.player.apellidoPaterno}`.trim(),
    image: '',
    distance: item.total_distance != null ? item.total_distance.toFixed(1) : 'N/A',
    distanceWidth: '50%',
    winRatePct: `${item.points_win_loss.won_pct.toFixed(1)}%`,
    winRateFrac: `${item.points_win_loss.won}/${item.points_win_loss.total}`,
    breakPoints,
    breakPointsSub: sub,
    avgDuration: item.avg_duration_won,
  };
};

const calcDistanceWidths = (
  p1: PlayerPerformanceData,
  d1: number | null,
  d2: number | null,
): void => {
  if (d1 == null || d2 == null || (d1 === 0 && d2 === 0)) return;
  const max = Math.max(d1, d2);
  p1.distanceWidth = `${((d1 / max) * 100).toFixed(0)}%`;
};

export const fetchLiveStats = async (
  uuid: string,
): Promise<[PlayerPerformanceData, PlayerPerformanceData] | null> => {
  try {
    const res = await obtenerEstadisticasLive(uuid);
    const data: LiveStatsApiItem[] = res.data;
    if (!Array.isArray(data) || data.length < 2) return null;

    const p1 = mapLiveItem(data[0], 'WON');
    const p2 = mapLiveItem(data[1], 'SAVED');
    calcDistanceWidths(p1, data[0].total_distance, data[1].total_distance);
    p2.distanceWidth = data[1].total_distance != null && data[0].total_distance != null
      ? `${((data[1].total_distance / Math.max(data[0].total_distance, data[1].total_distance)) * 100).toFixed(0)}%`
      : '50%';

    return [p1, p2];
  } catch {
    return null;
  }
};

export const fetchRecovery = async (uuid: string): Promise<RecoveryResponse> => {
  const res = await recuperarPartido(uuid);
  return res.data;
};

export const postPoint = async (
  uuid: string,
  winnerId: number | null,
  duration: number
): Promise<PointApiResponse> => {
  const res = await registrarPunto(uuid, winnerId, duration);
  return res.data;
};

export const deleteUndo = async (uuid: string): Promise<void> => {
  await deshacerPunto(uuid);
};

export const pauseMatchApi = async (uuid: string): Promise<void> => {
  await pausarPartido(uuid);
};

export const finishMatchApi = async (uuid: string, winnerId: number | null): Promise<void> => {
  await finalizarPartido(uuid, winnerId);
};
