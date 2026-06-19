import React, { useState } from 'react';
import styles from './CoachingRequests.module.css';
import LevelModal from '../levelModal/LevelModal';
import {
  aceptarSolicitudCoaching,
  rechazarSolicitudCoaching,
} from '../../../../../../../services/usuarioService';
import type { SolicitudCoaching } from '../../../../../../../services/usuarioService';

interface CoachingRequestsProps {
  solicitudes: SolicitudCoaching[];
  onHandled: (id: number) => void;
}

const CoachingRequests: React.FC<CoachingRequestsProps> = ({ solicitudes, onHandled }) => {
  const [pendingRequest, setPendingRequest] = useState<SolicitudCoaching | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);

  const handleAccept = (solicitud: SolicitudCoaching) => {
    setPendingRequest(solicitud);
  };

  const handleReject = async (id: number) => {
    try {
      setRejecting(id);
      await rechazarSolicitudCoaching(id);
      onHandled(id);
    } catch (err: any) {
      console.error('[CoachingRequests] error rechazando solicitud:', err);
      alert(err.response?.data?.error || 'Error al rechazar la solicitud');
    } finally {
      setRejecting(null);
    }
  };

  const handleNivelConfirm = async (nivel: string) => {
    if (!pendingRequest) return;
    await aceptarSolicitudCoaching(pendingRequest.id, nivel);
    onHandled(pendingRequest.id);
    setPendingRequest(null);
  };

  const handleModalClose = () => {
    if (pendingRequest) onHandled(pendingRequest.id);
    setPendingRequest(null);
  };

  if (solicitudes.length === 0) {
    return <div className={styles.empty}>No tenés solicitudes de asociación pendientes</div>;
  }

  return (
    <>
      <div className={styles.list}>
        {solicitudes.map(s => (
          <div key={s.id} className={styles.card}>
            <div className={styles.avatar}>
              {s.jugador.nombre.charAt(0).toUpperCase()}
            </div>
            <div className={styles.info}>
              <span className={styles.name}>
                {s.jugador.nombre} {s.jugador.apellidoPaterno}
              </span>
              <span className={styles.email}>{s.jugador.correo}</span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.acceptBtn}
                onClick={() => handleAccept(s)}
                disabled={rejecting === s.id}
              >
                <span className="material-symbols-outlined">check</span>
                <span>Aceptar</span>
              </button>
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={() => handleReject(s.id)}
                disabled={rejecting === s.id}
              >
                <span className="material-symbols-outlined">close</span>
                <span>{rejecting === s.id ? '...' : 'Rechazar'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <LevelModal
        isOpen={!!pendingRequest}
        jugadorNombre={pendingRequest ? `${pendingRequest.jugador.nombre} ${pendingRequest.jugador.apellidoPaterno}` : ''}
        onConfirm={handleNivelConfirm}
        onClose={handleModalClose}
      />
    </>
  );
};

export default CoachingRequests;
