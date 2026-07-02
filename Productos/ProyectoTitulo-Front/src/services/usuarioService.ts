// services/usuarioService.ts

import api from '../api/axios.ts'; 

// Función para decodificar JWT
const decodeToken = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
    }
}; 

export interface UsuarioData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    password: string;
    rol: "Jugador" | "Entrenador";
    fecha_nacimiento: string; // YYYY-MM-DD
    sexo?: string;
    altura?: number;
    peso?: number;
}

export interface LoginData {
    correo: string;
    password: string;
}

export interface UsuarioAuth {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    rol: "Jugador" | "Entrenador";
    nivelUsuario?: string | null;
    fecha_nacimiento?: string;
    altura?: number | null;
    peso?: number | null;
    sexo?: string | null;
}

export interface TokenResponse {
    access: string;
    refresh: string;
    usuario: UsuarioAuth;
    mensaje?: string;
}

export interface RegistroResponse extends UsuarioData {
    id: number;
}

// REGISTRO
export const registrarUsuario = async (datos: UsuarioData) => {
    return await api.post<TokenResponse>('/usuarios/registro/', datos);
};

// LOGIN
export const loginUsuario = async (datos: LoginData) => {
    const response = await api.post<TokenResponse>('/login/', datos);
    
    // Guardar tokens en sessionStorage
    sessionStorage.setItem('access_token', response.data.access);
    sessionStorage.setItem('refresh_token', response.data.refresh);
    
    // Si el backend devuelve usuario, usarlo
    if (response.data.usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    } else {
        // Si no, decodificar el token y extraer usuario
        const decodedToken = decodeToken(response.data.access);
        if (decodedToken) {
            const usuarioFromToken: UsuarioAuth = {
                id: decodedToken.user_id ? parseInt(decodedToken.user_id) : 0,
                nombre: decodedToken.nombre || '',
                correo: decodedToken.correo || '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                rol: decodedToken.rol || 'Jugador',
                nivelUsuario: decodedToken.nivelUsuario || null,
                fecha_nacimiento: '',
                altura: null,
                peso: null,
                sexo: decodedToken.sexo || null,
            };
            
            sessionStorage.setItem('usuario', JSON.stringify(usuarioFromToken));
        }
    }
    
    return response;
};

// LOGOUT
export const logoutUsuario = async () => {
    try {
        await api.post('/usuarios/logout/');
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('usuario');
    }
};

// OBTENER TOKEN GUARDADO
export const getAccessToken = (): string | null => {
    return sessionStorage.getItem('access_token');
};

// OBTENER USUARIO GUARDADO
export const getUsuario = (): UsuarioAuth | null => {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
        try {
            return JSON.parse(usuario);
        } catch {
            return null;
        }
    }
    return null;
};

// VERIFICAR SI ESTÁ AUTENTICADO
export const isAuthenticated = (): boolean => {
    return !!sessionStorage.getItem('access_token');
};

// REFRESCAR TOKEN (cuando expira)
export const refrescarToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    
    if (!refreshToken) {
        throw new Error('No refresh token disponible');
    }
    
    const response = await api.post<{ access: string }>('/token/refresh/', {
        refresh: refreshToken
    });
    
    sessionStorage.setItem('access_token', response.data.access);
    
    return response;
};

// GESTIÓN DE AMIGOS - Según API Reference
export const buscarJugadores = async (term: string) => {
    return await api.get('/players/search/', { params: { term } });
};

export const obtenerListaAmigos = async () => {
    return await api.get('/friends/');
};

export const enviarSolicitudAmistad = async (friendId: number) => {
    return await api.post('/friends/request/', { friend_id: friendId });
};

export const obtenerSolicitudesAmistad = async () => {
    return await api.get('/friends/requests/');
};

export const obtenerSolicitudesEnviadas = async () => {
    return await api.get('/friends/requests/sent/');
};

export const aceptarSolicitudAmistad = async (solicitudId: number) => {
    return await api.patch(`/friends/request/${solicitudId}/accept/`);
};

export const rechazarSolicitudAmistad = async (solicitudId: number) => {
    return await api.delete(`/friends/request/${solicitudId}/reject/`);
};

export const eliminarAmigo = async (amigoId: number) => {
    return await api.delete(`/friends/${amigoId}/`);
};

// PARTIDOS
export interface CoachPlayer {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    nivelUsuario: string;
}

export const obtenerJugadoresDelEntrenador = async () => {
    return await api.get<CoachPlayer[]>('/coaching/jugadores/');
};

export interface ExternalPlayerSearchResult {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    entrenador_nombre: string | null;
}

export const buscarJugadorPorNombre = async (q: string) => {
    return await api.get<ExternalPlayerSearchResult[]>(`/coaching/jugadores/buscar/?q=${encodeURIComponent(q)}`);
};

export const agendarPartido = async (payload: {
    id_local_player: number;
    id_invited_player: number | null;
    guest_name: string | null;
    location: string;
    surface: 'Clay' | 'Hard' | 'Grass';
    best_of: 1 | 3 | 5;
    scheduled_at: string;
}) => {
    return await api.post('/matches/schedule/', payload);
};

export const recuperarPartido = async (uuid: string) => {
    return await api.get(`/matches/${uuid}/recovery/`);
};

export const registrarPunto = async (uuid: string, winnerId: number | null, duration: number) => {
    return await api.post(`/matches/${uuid}/point/`, { winner_id: winnerId, duration });
};

export const deshacerPunto = async (uuid: string) => {
    return await api.delete(`/matches/${uuid}/point/undo/`);
};

export const finalizarPartido = async (uuid: string, winnerId: number | null) => {
    return await api.patch(`/matches/${uuid}/finish/`, { winner_id: winnerId });
};

export const obtenerResumenPartidos = async () => {
    return await api.get('/matches/summary/');
};

export const obtenerPartidosAgendados = async () => {
    return await api.get('/matches/schedule/');
};

export const obtenerPartidosCreados = async () => {
    return await api.get('/matches/my-created/');
};

export const obtenerPartidosInvitado = async () => {
    return await api.get('/matches/my-invited/');
};

export const obtenerInvitacionesJugadoresCoach = async () => {
    return await api.get('/coaching/partidos-invitados/');
};

export const obtenerDatosPartido = async (uuid: string) => {
    return await api.get(`/matches/match-data/${uuid}/`);
};

export const obtenerDetallePartido = async (uuid: string) => {
    return await api.get(`/matches/${uuid}/detail/`);
};

export const aceptarInvitacionPartido = async (uuid: string) => {
    return await api.patch(`/matches/${uuid}/accept/`);
};

export const rechazarInvitacionPartido = async (uuid: string) => {
    return await api.delete(`/matches/${uuid}/reject/`);
};

export const iniciarPartido = async (uuid: string, firstServerId: number) => {
    return await api.patch(`/matches/${uuid}/start/`, { first_server_id: firstServerId });
};

export const pausarPartido = async (uuid: string) => {
    return await api.patch(`/matches/${uuid}/pause/`);
};

export const reanudarPartido = async (uuid: string) => {
    return await api.patch(`/matches/${uuid}/resume/`);
};

// ESTADÍSTICAS
export const obtenerEstadisticasPartido = async (uuid: string) => {
    return await api.get(`/statistics/match/${uuid}/`);
};

export const obtenerEstadisticasLive = async (uuid: string) => {
    return await api.post(`/statistics/match/${uuid}/live/`);
};

// DASHBOARD ENTRENADOR
export const obtenerDashboardEntrenador = async () => {
    return await api.get<{ partidos: any[] }>('/coaching/dashboard/');
};

// COACHING
export interface EntrenadorResult {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
}

export interface SolicitudCoaching {
    id: number;
    jugador: EntrenadorResult;
    entrenador: EntrenadorResult;
    status: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
    created_at: string;
    updated_at: string;
}

export const buscarEntrenadores = async (q: string) => {
    return await api.get<EntrenadorResult[]>(`/coaching/entrenadores/?q=${encodeURIComponent(q)}`);
};

export const enviarSolicitudCoaching = async (entrenador_id: number) => {
    return await api.post<SolicitudCoaching>('/coaching/solicitudes/', { entrenador_id });
};

export const obtenerSolicitudesRecibidas = async () => {
    return await api.get<SolicitudCoaching[]>('/coaching/solicitudes/recibidas/');
};

export const aceptarSolicitudCoaching = async (id: number, nivel: string) => {
    return await api.patch(`/coaching/solicitudes/${id}/aceptar/`, { nivel });
};

export const rechazarSolicitudCoaching = async (id: number) => {
    return await api.patch(`/coaching/solicitudes/${id}/rechazar/`);
};

export const obtenerSolicitudesCoachingEnviadas = async () => {
    return await api.get<SolicitudCoaching[]>('/coaching/solicitudes/enviadas/');
};

// NOTIFICACIONES
export const obtenerNotificaciones = async () =>
    api.get('/notificaciones/');

export const marcarNotificacionLeida = async (uuid: string) =>
    api.patch(`/notificaciones/${uuid}/leer/`);

export const marcarTodasNotificacionesLeidas = async () =>
    api.patch('/notificaciones/leer-todas/');