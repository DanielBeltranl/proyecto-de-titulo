import {
  obtenerPartidosCreados,
  obtenerPartidosInvitado,
  obtenerPartidosAgendados,
  obtenerPartidosCoachCreados,
  obtenerInvitacionesJugadoresCoach,
  aceptarInvitacionPartido,
} from '../../../../../../services/usuarioService';

export type MatchState = 'PENDIENTE' | 'ACEPTADO' | 'INICIADO' | 'PAUSADO' | 'FINALIZADA';
export type Surface = 'Clay' | 'Hard' | 'Grass';

export interface MatchPlayer {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
}

export interface MatchItem {
  id_match: string;
  creator: MatchPlayer;
  invited: MatchPlayer;
  location: string;
  surface: Surface;
  best_of: 1 | 3 | 5;
  match_state: MatchState;
  score: null | object;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id_match: string;
  entrenador: MatchPlayer;
  local_player: MatchPlayer;
  invited: MatchPlayer | null;
  scheduled_at: string;
  guest_name: string | null;
  location: string;
  surface: Surface;
  best_of: 1 | 3 | 5;
  match_state: 'PENDIENTE' | 'ACEPTADO';
  created_at: string;
}

const mapScheduleToMatchItem = (s: ScheduleItem): MatchItem => ({
  id_match: s.id_match,
  creator: s.local_player,
  invited: s.invited ?? {
    id: 0,
    nombre: s.guest_name ?? 'Invitado externo',
    apellidoPaterno: '',
    correo: '',
  },
  location: s.location,
  surface: s.surface,
  best_of: s.best_of,
  match_state: s.match_state,
  score: null,
  created_at: s.scheduled_at,
  updated_at: s.created_at,
});

export const fetchPartidosCreados = async (): Promise<MatchItem[]> => {
  const response = await obtenerPartidosCreados();
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchPartidosInvitado = async (): Promise<MatchItem[]> => {
  const response = await obtenerPartidosInvitado();
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchPartidosAgendados = async (): Promise<MatchItem[]> => {
  const response = await obtenerPartidosAgendados();
  const data: ScheduleItem[] = Array.isArray(response.data) ? response.data : [];
  return data.map(mapScheduleToMatchItem);
};

export interface CoachCreatedItem {
  id_match: string;
  entrenador: MatchPlayer | null;
  local_player: MatchPlayer;
  invited: MatchPlayer | null;
  guest_name: string | null;
  location: string;
  surface: Surface;
  best_of: 1 | 3 | 5;
  match_state: MatchState;
  scheduled_at: string;
  score: null | object;
  created_at: string;
  updated_at: string;
}

const mapCoachCreatedToMatchItem = (item: CoachCreatedItem): MatchItem => ({
  id_match: item.id_match,
  creator: item.local_player,
  invited: item.invited ?? {
    id: 0,
    nombre: item.guest_name ?? 'Invitado externo',
    apellidoPaterno: '',
    correo: '',
  },
  location: item.location,
  surface: item.surface,
  best_of: item.best_of,
  match_state: item.match_state,
  score: item.score,
  created_at: item.scheduled_at,
  updated_at: item.updated_at,
});

export const fetchPartidosCoachCreados = async (): Promise<MatchItem[]> => {
  const response = await obtenerPartidosCoachCreados();
  const data: CoachCreatedItem[] = Array.isArray(response.data) ? response.data : [];
  return data
    .map(mapCoachCreatedToMatchItem)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export interface CoachInvitationItem {
  id_match: string;
  entrenador: MatchPlayer | null;
  local_player: MatchPlayer;
  invited: MatchPlayer | null;
  guest_name: string | null;
  location: string;
  surface: Surface;
  best_of: 1 | 3 | 5;
  match_state: MatchState;
  scheduled_at: string;
  score: null | object;
  created_at: string;
  updated_at: string;
}

const mapCoachInvitationToMatchItem = (item: CoachInvitationItem): MatchItem => ({
  id_match: item.id_match,
  creator: item.local_player,
  invited: item.invited ?? {
    id: 0,
    nombre: item.guest_name ?? 'Invitado externo',
    apellidoPaterno: '',
    correo: '',
  },
  location: item.location,
  surface: item.surface,
  best_of: item.best_of,
  match_state: item.match_state,
  score: item.score,
  created_at: item.scheduled_at,
  updated_at: item.updated_at,
});

export const fetchInvitacionesJugadores = async (): Promise<MatchItem[]> => {
  const response = await obtenerInvitacionesJugadoresCoach();
  const data: CoachInvitationItem[] = Array.isArray(response.data) ? response.data : [];
  return data
    .filter(item => item.match_state !== 'FINALIZADA')
    .map(mapCoachInvitationToMatchItem);
};

export const acceptarInvitacionJugador = async (uuid: string): Promise<void> => {
  await aceptarInvitacionPartido(uuid);
};
