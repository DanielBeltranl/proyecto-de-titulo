import { useNavigate } from 'react-router';
import { getUsuario } from '../services/usuarioService';

export function getRoleHome(rol: string | undefined): string {
    if (rol === 'Entrenador') return '/vista-entrenador';
    return '/vista';
}

export function useRoleNavigate() {
    const navigate = useNavigate();

    return (options?: { replace?: boolean }) => {
        const usuario = getUsuario();
        navigate(getRoleHome(usuario?.rol), options);
    };
}
