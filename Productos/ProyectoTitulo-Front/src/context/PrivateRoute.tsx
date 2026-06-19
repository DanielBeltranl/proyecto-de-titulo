import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleHome } from './roleUtils';

interface PrivateRouteProps {
    children: ReactNode;
    allowedRoles?: Array<'Jugador' | 'Entrenador'>;
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const accessToken = sessionStorage.getItem('access_token');
    const usuarioRaw = sessionStorage.getItem('usuario');

    if (!accessToken || !usuarioRaw) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const usuario = JSON.parse(usuarioRaw);
        if (!allowedRoles.includes(usuario.rol)) {
            return <Navigate to={getRoleHome(usuario.rol)} replace />;
        }
    }

    return <>{children}</>;
}