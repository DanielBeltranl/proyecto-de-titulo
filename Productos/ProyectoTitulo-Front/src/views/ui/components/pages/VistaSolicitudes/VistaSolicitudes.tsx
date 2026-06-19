import { useEffect, useState } from 'react';
import Background from '../../components/background/Background';
import {
    obtenerSolicitudesRecibidas,
    aceptarSolicitudCoaching,
    rechazarSolicitudCoaching,
} from '../../../../../services/usuarioService.ts';
import type { SolicitudCoaching } from '../../../../../services/usuarioService.ts';
import './VistaSolicitudes.css';

const NIVELES = ['Amateur', 'Semi-Pro', 'Profesional'] as const;

const VistaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState<SolicitudCoaching[]>([]);
    const [loading, setLoading] = useState(true);
    const [nivelPorSolicitud, setNivelPorSolicitud] = useState<Record<number, string>>({});
    const [procesando, setProcesando] = useState<number | null>(null);

    useEffect(() => {
        obtenerSolicitudesRecibidas()
            .then(r => setSolicitudes(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleAceptar = async (id: number) => {
        const nivel = nivelPorSolicitud[id] ?? 'Amateur';
        setProcesando(id);
        try {
            await aceptarSolicitudCoaching(id, nivel);
            console.log("Solicitud aceptada:", id, "nivel:", nivel);
            setSolicitudes(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("Error al aceptar solicitud:", err);
        } finally {
            setProcesando(null);
        }
    };

    const handleRechazar = async (id: number) => {
        setProcesando(id);
        try {
            await rechazarSolicitudCoaching(id);
            console.log("Solicitud rechazada:", id);
            setSolicitudes(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("Error al rechazar solicitud:", err);
        } finally {
            setProcesando(null);
        }
    };

    return (
        <Background>
            <div className="solicitudes-container">
                <h1 className="solicitudes-title">Solicitudes recibidas</h1>
                <p className="solicitudes-subtitle">Jugadores que quieren que seas su entrenador</p>

                {loading && <p className="solicitudes-empty">Cargando...</p>}

                {!loading && solicitudes.length === 0 && (
                    <p className="solicitudes-empty">No tenés solicitudes pendientes.</p>
                )}

                <ul className="solicitudes-list">
                    {solicitudes.map(s => (
                        <li key={s.id} className="solicitud-card">
                            <div className="solicitud-jugador">
                                <span className="solicitud-nombre">
                                    {s.jugador.nombre} {s.jugador.apellidoPaterno} {s.jugador.apellidoMaterno}
                                </span>
                                <span className="solicitud-correo">{s.jugador.correo}</span>
                            </div>

                            <div className="solicitud-actions">
                                <select
                                    className="nivel-select"
                                    value={nivelPorSolicitud[s.id] ?? 'Amateur'}
                                    onChange={e =>
                                        setNivelPorSolicitud(prev => ({ ...prev, [s.id]: e.target.value }))
                                    }
                                    disabled={procesando === s.id}
                                >
                                    {NIVELES.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>

                                <button
                                    className="btn-aceptar"
                                    onClick={() => handleAceptar(s.id)}
                                    disabled={procesando === s.id}
                                >
                                    {procesando === s.id ? '...' : 'Aceptar'}
                                </button>

                                <button
                                    className="btn-rechazar"
                                    onClick={() => handleRechazar(s.id)}
                                    disabled={procesando === s.id}
                                >
                                    {procesando === s.id ? '...' : 'Rechazar'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Background>
    );
};

export default VistaSolicitudes;
