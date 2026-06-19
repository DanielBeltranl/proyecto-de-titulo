import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { isAuthenticated as checkAuth, getUsuario } from '../services/usuarioService';

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

interface AuthContextType {
    usuario: UsuarioAuth | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    setUsuario: (usuario: UsuarioAuth | null) => void;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuarioState] = useState<UsuarioAuth | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
    const initializedRef = useRef(false);

    // Función para sincronizar con sessionStorage
    const syncAuth = () => {
        const autenticado = checkAuth();
        
        if (autenticado) {
            const storedUser = getUsuario();
            setUsuarioState(storedUser || null);
            setIsAuthenticated(true);
        } else {
            setUsuarioState(null);
            setIsAuthenticated(false);
        }
    };

    // Inicializar al cargar la app
    useEffect(() => {
        if (initializedRef.current) return;
        syncAuth();
        initializedRef.current = true;
    }, []);

    const setUsuario = (user: UsuarioAuth | null) => {
        setUsuarioState(user);
        if (user) {
            sessionStorage.setItem('usuario', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            sessionStorage.removeItem('usuario');
            setIsAuthenticated(false);
        }
    };

    const logout = () => {
        setUsuarioState(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
    };

    const refreshAuth = () => {
        syncAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                isAuthenticated: isAuthenticated === true,
                isLoading: isAuthenticated === null,
                logout,
                setUsuario,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
}


