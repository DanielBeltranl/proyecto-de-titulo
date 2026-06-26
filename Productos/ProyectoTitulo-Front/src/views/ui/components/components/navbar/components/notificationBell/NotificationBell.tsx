import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  obtenerNotificaciones,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
} from '../../../../../../../services/usuarioService';
import {
  connectNotifications,
  disconnectNotifications,
} from '../../../../../../../services/notificationSocket';
import styles from './NotificationBell.module.css';

interface NotifPayload {
  meta?: Record<string, unknown>;
  redirect_to?: string;
}

interface Notification {
  id: string;
  tipo: string;
  payload: NotifPayload;
  leida: boolean;
  created_at: string;
}

function buildMessage(noti: Notification): string {
  const meta = noti.payload?.meta ?? {};
  const nombre = [meta.nombre, meta.apellido].filter(Boolean).join(' ');
  const rival = (meta.rival_nombre as string) ?? '';
  const location = (meta.location as string) ?? '';

  switch (noti.tipo) {
    case 'solicitud_entrenador':
      return nombre
        ? `${nombre} te envió una solicitud para que seas su entrenador`
        : 'Recibiste una nueva solicitud de coaching';
    case 'solicitud_aceptada':
      return nombre
        ? `${nombre} aceptó tu solicitud de coaching`
        : 'Tu solicitud de coaching fue aceptada';
    case 'solicitud_rechazada':
      return nombre
        ? `${nombre} rechazó tu solicitud de coaching`
        : 'Tu solicitud de coaching fue rechazada';
    case 'partido_agendado': {
      const parts = ['Nuevo partido agendado'];
      if (rival) parts.push(`vs ${rival}`);
      if (location) parts.push(`en ${location}`);
      return parts.join(' ');
    }
    case 'partido_aceptado':
      return rival
        ? `${rival} aceptó tu invitación al partido`
        : 'Tu invitación de partido fue aceptada';
    case 'partido_iniciado':
      return rival ? `Partido vs ${rival} en curso` : 'Un partido comenzó';
    case 'partido_finalizado':
      return rival ? `Partido vs ${rival} finalizado` : 'Un partido finalizó';
    default:
      return noti.tipo;
  }
}

interface NotificationBellProps {
  isAuthenticated: boolean;
}

export function NotificationBell({ isAuthenticated }: NotificationBellProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const loadNotifications = useCallback(async () => {
    try {
      const res = await obtenerNotificaciones();
      const data = res.data as Notification[];
      setNotifications(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      console.error('[NotifBell] error al obtener notificaciones:', e);
    }
  }, []);

  // Initial fetch + polling fallback every 60s
  useEffect(() => {
    if (!isAuthenticated) return;
    loadNotifications();
    const id = setInterval(loadNotifications, 3_000);
    return () => clearInterval(id);
  }, [isAuthenticated, loadNotifications]);

  // WebSocket — singleton stays alive, no disconnect on cleanup
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = sessionStorage.getItem('access_token');
    if (!token) return;

    let cancelled = false;

    const tid = setTimeout(() => {
      if (cancelled) return;
      connectNotifications(token, (raw) => {
        const incoming = raw as Notification;
        console.log('[NotifBell] WS mensaje:', incoming);
        setNotifications((prev) => {
          if (prev.find((n) => n.id === incoming.id)) return prev;
          return [incoming, ...prev];
        });
      });
    }, 100);

    return () => { cancelled = true; clearTimeout(tid); };
  }, [isAuthenticated]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = async (noti: Notification) => {
    if (!noti.leida) {
      try {
        await marcarNotificacionLeida(noti.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, leida: true } : n))
        );
      } catch {
        // silent fail
      }
    }
    const route = resolveRoute(noti.tipo);
    if (route) {
      setOpen(false);
      navigate(route);
    }
  };

  const handleMarkAll = async () => {
    try {
      await marcarTodasNotificacionesLeidas();
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch {
      // silent fail
    }
  };

  if (!isAuthenticated) return null;

  function resolveRoute(tipo: string): string | null {
    if (tipo === 'solicitud_entrenador' || tipo === 'solicitud_aceptada') return '/contactos?tab=solicitudes';
    if (tipo === 'solicitud_rechazada') return null;
    if (tipo.startsWith('partido_')) return '/partidos';
    return null;
  }

  const hasRoute = (noti: Notification) => !!resolveRoute(noti.tipo);

  const dropdown = open ? (
    <div className={styles.overlay}>
      <div className={styles.dropdown} ref={dropdownRef}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Notificaciones</span>
          {unreadCount > 0 && (
            <button className={styles.markAll} onClick={handleMarkAll}>
              Marcar todas
            </button>
          )}
        </div>

        <ul className={styles.list}>
          {notifications.length === 0 && (
            <li className={styles.empty}>Sin notificaciones</li>
          )}
          {notifications.map((noti) => (
            <li
              key={noti.id}
              className={`${styles.item} ${!noti.leida ? styles.unread : ''} ${hasRoute(noti) ? styles.clickable : ''}`}
              onClick={() => handleClick(noti)}
            >
              <span className={`material-symbols-outlined ${styles.itemIcon}`}>
                {noti.tipo.startsWith('solicitud') ? 'person_add' : 'sports_tennis'}
              </span>
              <div className={styles.itemBody}>
                <p className={styles.itemMsg}>{buildMessage(noti)}</p>
                <time className={styles.itemTime}>
                  {new Date(noti.created_at).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              {!noti.leida && <span className={styles.dot} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {createPortal(dropdown, document.body)}
    </div>
  );
}
