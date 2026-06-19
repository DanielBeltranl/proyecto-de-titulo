import {
  agendarPartido,
  obtenerJugadoresDelEntrenador,
  buscarJugadorPorNombre,
} from '../../../../../../services/usuarioService';

export type Surface = 'Clay' | 'Hard';
export type BestOf = 1 | 3 | 5;

export interface ScheduleMatchPayload {
  id_local_player: number;
  id_invited_player: number | null;
  guest_name: string | null;
  location: string;
  surface: Surface;
  best_of: BestOf;
  scheduled_at: string;
}

export interface ScheduleMatchResponse {
  message: string;
  error: string | null;
}

export interface FriendOption {
  id: number;
  nombre: string;
  nivel: string;
}

export interface ExternalPlayerResult {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  entrenador_nombre: string | null;
}

export type InvitedType = 'registered' | 'guest' | 'none';

export interface InvitedPlayerData {
  type: InvitedType;
  id_invited_player?: number;
  guest_name?: string;
}

export const scheduleMatch = async (payload: ScheduleMatchPayload): Promise<ScheduleMatchResponse> => {
  const response = await agendarPartido(payload);
  return response.data;
};

export const fetchJugadoresDelEntrenador = async (): Promise<FriendOption[]> => {
  const response = await obtenerJugadoresDelEntrenador();
  return response.data.map((p) => ({
    id: p.id,
    nombre: `${p.nombre} ${p.apellidoPaterno}`.trim(),
    nivel: p.nivelUsuario,
  }));
};

export const buscarJugadorExterno = async (q: string): Promise<ExternalPlayerResult[]> => {
  const response = await buscarJugadorPorNombre(q);
  return response.data;
};
