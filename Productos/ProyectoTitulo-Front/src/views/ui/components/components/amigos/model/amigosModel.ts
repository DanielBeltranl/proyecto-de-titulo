import { obtenerListaAmigos, obtenerJugadoresDelEntrenador } from '../../../../../../services/usuarioService';

export interface FriendUser {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
  nivelUsuario: string;
}

export interface Friend {
  id: number;
  user: FriendUser;
  friend: FriendUser;
  status: 'ACEPTADO';
  created_at: string;
}

export const fetchAmigos = async (): Promise<Friend[]> => {
  const response = await obtenerListaAmigos();
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchAlumnos = async (): Promise<FriendUser[]> => {
  const response = await obtenerJugadoresDelEntrenador();
  return response.data;
};
