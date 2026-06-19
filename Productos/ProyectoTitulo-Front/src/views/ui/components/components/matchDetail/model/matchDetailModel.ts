import {
  obtenerDatosPartido,
  aceptarInvitacionPartido,
  rechazarInvitacionPartido,
  iniciarPartido,
  pausarPartido,
  reanudarPartido,
} from '../../../../../../services/usuarioService';

export type MatchState = 'PENDIENTE' | 'ACEPTADO' | 'INICIADO' | 'PAUSADO' | 'FINALIZADA';
export type Surface = 'Clay' | 'Hard' | 'Grass';
export type BestOf = 1 | 3 | 5;
export type UserRole = 'creator' | 'invited' | 'spectator' | 'entrenador';

export interface MatchPlayer {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
}

export interface MatchData {
  id_match: string;
  entrenador: MatchPlayer | null;
  local_player: MatchPlayer | null;
  invited: MatchPlayer | null;
  guest_name: string | null;
  location: string;
  surface: Surface;
  best_of: BestOf;
  match_state: MatchState;
  score: null | object;
  scheduled_at: string;
  created_at: string;
  updated_at: string;
}

export const fetchMatchData = async (uuid: string): Promise<MatchData> => {
  const response = await obtenerDatosPartido(uuid);
  return response.data;
};

export const acceptMatch = async (uuid: string): Promise<MatchData> => {
  const response = await aceptarInvitacionPartido(uuid);
  return response.data;
};

export const rejectMatch = async (uuid: string): Promise<void> => {
  await rechazarInvitacionPartido(uuid);
};

export const startMatch = async (uuid: string, firstServerId: number): Promise<MatchData> => {
  const response = await iniciarPartido(uuid, firstServerId);
  return response.data;
};

export const pauseMatch = async (uuid: string): Promise<MatchData> => {
  const response = await pausarPartido(uuid);
  return response.data;
};

export const resumeMatch = async (uuid: string): Promise<MatchData> => {
  const response = await reanudarPartido(uuid);
  return response.data;
};
