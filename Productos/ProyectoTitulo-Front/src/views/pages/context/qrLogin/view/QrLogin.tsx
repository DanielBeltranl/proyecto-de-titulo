import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { getRoleHome } from '../../../../../context/roleUtils';
import { getUsuario, loginConQr } from '../../../../../services/usuarioService';
import Background from '../../../../ui/components/components/background/Background';
import styles from './QrLogin.module.css';

export default function QrLogin() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { refreshAuth } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Este código QR ya no es válido.');
            return;
        }

        let cancelado = false;

        const iniciarSesionConQr = async () => {
            try {
                await loginConQr(token);
                refreshAuth();

                if (!cancelado) {
                    const usuario = getUsuario();
                    navigate(getRoleHome(usuario?.rol), { replace: true });
                }
            } catch {
                if (!cancelado) {
                    setError('Este código QR ya no es válido.');
                }
            }
        };

        iniciarSesionConQr();

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <Background>
            <div className={styles.container}>
                <div className={styles.card}>
                    {error ? (
                        <>
                            <div className={styles.errorAlert}>{error}</div>
                            <a href="/login" className={styles.link}>
                                Volver a iniciar sesión
                            </a>
                        </>
                    ) : (
                        <p className={styles.message}>Iniciando sesión...</p>
                    )}
                </div>
            </div>
        </Background>
    );
}
