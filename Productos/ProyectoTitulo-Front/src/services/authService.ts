import api from '../api/axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user?: {
        id: number;
        email: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
    };
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// Guardar tokens en sessionStorage
export const saveToken = (access: string, refresh?: string) => {
    sessionStorage.setItem('access_token', access);
    if (refresh) {
        sessionStorage.setItem('refresh_token', refresh);
    }
};

// Obtener token de acceso del sessionStorage
export const getToken = (): string | null => {
    return sessionStorage.getItem('access_token');
};

// Obtener refresh token
export const getRefreshToken = (): string | null => {
    return sessionStorage.getItem('refresh_token');
};

// Limpiar tokens (logout)
export const clearTokens = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Login - enviar email y password
export const loginUsuario = async (datos: LoginRequest) => {
    return await api.post<LoginResponse>('/login/', datos);
};

// Logout
export const logoutUsuario = async () => {
    try {
        clearTokens();
    } catch (error) {
        console.error('Error en logout:', error);
    }
};

// Refresh token
export const refreshToken = async () => {
    try {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
            clearTokens();
            throw new Error('No refresh token available');
        }

        const response = await api.post<{ access: string }>('/token/refresh/', {
            refresh: refreshTokenValue,
        });

        if (response.data.access) {
            saveToken(response.data.access, refreshTokenValue);
            return response.data;
        }
    } catch (error) {
        clearTokens();
        throw error;
    }
};

// Verificar token
export const verifyToken = async (token?: string) => {
    try {
        const tokenToVerify = token || getToken();
        if (!tokenToVerify) {
            return false;
        }

        await api.post('/token/verify/', {
            token: tokenToVerify,
        });

        return true;
    } catch (error) {
        clearTokens();
        return false;
    }
};