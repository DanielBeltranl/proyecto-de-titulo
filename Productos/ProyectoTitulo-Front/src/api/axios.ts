import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

// Interceptor para agregar el JWT a cada request
api.interceptors.request.use(
    (config) => {
        // Buscar token en sessionStorage (no localStorage)
        const token = sessionStorage.getItem('access_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si recibimos un 401 (no autorizado), limpiar tokens y redirigir
        if (error.response?.status === 401) {
            const hadToken = sessionStorage.getItem('access_token');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('usuario');
            if (hadToken) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;