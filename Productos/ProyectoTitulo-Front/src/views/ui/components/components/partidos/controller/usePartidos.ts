import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchPartidosCreados,
  fetchPartidosInvitado,
  fetchPartidosAgendados,
  fetchInvitacionesJugadores,
  acceptarInvitacionJugador,
} from '../model/partidosModel';
import { getUsuario } from '../../../../../../services/usuarioService';
import type { MatchItem } from '../model/partidosModel';

export type CoachTab = 'agendados' | 'invitaciones';

interface UsePartidosReturn {
  creados: MatchItem[];
  invitados: MatchItem[];
  agendados: MatchItem[];
  invitacionesJugadores: MatchItem[];
  coachTab: CoachTab;
  setCoachTab: (tab: CoachTab) => void;
  loading: boolean;
  error: string | null;
  acceptingId: string | null;
  refresh: () => Promise<void>;
  acceptInvitation: (uuid: string) => Promise<void>;
}

export const usePartidos = (): UsePartidosReturn => {
  const [creados, setCreados] = useState<MatchItem[]>([]);
  const [invitados, setInvitados] = useState<MatchItem[]>([]);
  const [agendados, setAgendados] = useState<MatchItem[]>([]);
  const [invitacionesJugadores, setInvitacionesJugadores] = useState<MatchItem[]>([]);
  const [coachTab, setCoachTab] = useState<CoachTab>('agendados');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const isEntrenador = useMemo(() => getUsuario()?.rol === 'Entrenador', []);

  const refresh = useCallback(async () => {
    setError(null);
    if (isEntrenador) {
      try {
        const agendadosData = await fetchPartidosAgendados();
        setAgendados(agendadosData);
      } catch (err: any) {
        console.error('[usePartidos] agendados', { status: err?.response?.status, url: err?.config?.url });
      }
      try {
        const invitacionesData = await fetchInvitacionesJugadores();
        setInvitacionesJugadores(invitacionesData);
      } catch (err: any) {
        console.error('[usePartidos] invitaciones', { status: err?.response?.status, url: err?.config?.url });
      }
    } else {
      try {
        const [creadosData, invitadosData] = await Promise.all([
          fetchPartidosCreados(),
          fetchPartidosInvitado(),
        ]);
        setCreados(creadosData);
        setInvitados(invitadosData);
      } catch (err: any) {
        console.error('[usePartidos] jugador', { status: err?.response?.status, url: err?.config?.url });
        setError('No se pudieron cargar los partidos.');
      }
    }
  }, [isEntrenador]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    load();
  }, [refresh]);

  const refreshInvitaciones = useCallback(async () => {
    try {
      const data = await fetchInvitacionesJugadores();
      setInvitacionesJugadores(data);
    } catch (err: any) {
      console.error('[usePartidos] invitaciones', { status: err?.response?.status, url: err?.config?.url });
    }
  }, []);

  useEffect(() => {
    if (!isEntrenador) return;
    const id = setInterval(refreshInvitaciones, 30_000);
    return () => clearInterval(id);
  }, [isEntrenador, refreshInvitaciones]);

  const acceptInvitation = useCallback(async (uuid: string) => {
    try {
      setAcceptingId(uuid);
      await acceptarInvitacionJugador(uuid);
      await refreshInvitaciones();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) alert('No tenés acceso a este partido.');
      else if (status === 400) alert(err.response?.data?.error || 'Acción no permitida.');
      else alert('Error al aceptar la invitación. Intentá de nuevo.');
    } finally {
      setAcceptingId(null);
    }
  }, [refreshInvitaciones]);

  return {
    creados,
    invitados,
    agendados,
    invitacionesJugadores,
    coachTab,
    setCoachTab,
    loading,
    error,
    acceptingId,
    refresh,
    acceptInvitation,
  };
};
