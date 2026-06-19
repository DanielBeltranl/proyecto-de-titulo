import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario } from '../../../../../../services/usuarioService';
import {
  fetchMatchData,
  acceptMatch,
  rejectMatch,
  startMatch,
  resumeMatch,
} from '../model/matchDetailModel';
import type { MatchData, UserRole } from '../model/matchDetailModel';

interface UseMatchDetailReturn {
  match: MatchData | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  actionLoading: boolean;
  showServerSelector: boolean;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleRequestStart: () => void;
  handleCancelStart: () => void;
  handleStart: (firstServerId: number) => Promise<void>;
  handleGoToGame: () => void | Promise<void>;
  refresh: () => Promise<void>;
}

export const useMatchDetail = (uuid: string): UseMatchDetailReturn => {
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const navigate = useNavigate();

  const usuario = getUsuario();

  const resolveRole = (data: MatchData): UserRole => {
    if (!usuario) return 'spectator';
    if (data.local_player && usuario.id === data.local_player.id) return 'creator';
    if (data.invited && usuario.id === data.invited.id) return 'invited';
    if (data.entrenador && usuario.id === data.entrenador.id) return 'entrenador';
    return 'spectator';
  };

  const refresh = useCallback(async () => {
    try {
      const data = await fetchMatchData(uuid);
      setMatch(data);
      setError(null);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) setError('No tenés acceso a este partido.');
      else if (status === 404) setError('El partido no existe o fue eliminado.');
      else setError(err.response?.data?.error || 'Error al cargar el partido.');
    }
  }, [uuid]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    load();
  }, [refresh]);

  const withRefresh = async (action: () => Promise<void>) => {
    try {
      setActionLoading(true);
      await action();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) alert('No tenés acceso a este partido.');
      else if (status === 400) alert(err.response?.data?.error || 'Acción no permitida en el estado actual.');
      else if (status === 404) alert('El partido no existe o fue eliminado.');
      else alert('Error inesperado. Intenta de nuevo.');
    } finally {
      await refresh();
      setActionLoading(false);
    }
  };

  const handleAccept = () =>
    withRefresh(async () => {
      console.log('[useMatchDetail] aceptando partido:', uuid);
      const result = await acceptMatch(uuid);
      console.log('[useMatchDetail] partido aceptado:', result);
    });

  const handleReject = () =>
    withRefresh(async () => {
      console.log('[useMatchDetail] rechazando partido:', uuid);
      await rejectMatch(uuid);
      console.log('[useMatchDetail] partido rechazado');
      navigate('/vista');
    });

  const handleRequestStart = () => {
    if (!match?.invited && match?.local_player) {
      handleStart(match.local_player.id);
    } else {
      setShowServerSelector(true);
    }
  };
  const handleCancelStart = () => setShowServerSelector(false);

  const handleStart = async (firstServerId: number): Promise<void> => {
    if (!match?.local_player) return;
    setShowServerSelector(false);
    setActionLoading(true);
    try {
      await startMatch(uuid, firstServerId);
      navigate(`/marcador/${uuid}`, {
        state: {
          isNew: true,
          p1Id: match.local_player.id,
          p2Id: match.invited?.id ?? 0,
          p1Name: `${match.local_player.nombre} ${match.local_player.apellidoPaterno}`.trim(),
          p2Name: match.invited
            ? `${match.invited.nombre} ${match.invited.apellidoPaterno}`.trim()
            : (match.guest_name ?? 'Invitado'),
          isGuestMatch: match.invited === null,
          firstServerId,
          bestOf: match.best_of,
        },
      });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) alert('No tenés acceso a este partido.');
      else if (status === 400) alert(err.response?.data?.error || 'Acción no permitida en el estado actual.');
      else if (status === 404) alert('El partido no existe o fue eliminado.');
      else alert('Error inesperado. Intenta de nuevo.');
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoToGame = async () => {
    if (match?.match_state === 'PAUSADO') {
      try {
        setActionLoading(true);
        console.log('[useMatchDetail] reanudando partido pausado:', uuid);
        await resumeMatch(uuid);
      } catch (err: any) {
        setActionLoading(false);
        alert(err.response?.data?.error || 'Error al reanudar el partido.');
        return;
      }
    }
    navigate(`/marcador/${uuid}`);
  };

  const role = match ? resolveRole(match) : 'spectator';

  return {
    match,
    loading,
    error,
    role,
    actionLoading,
    showServerSelector,
    handleAccept,
    handleReject,
    handleRequestStart,
    handleCancelStart,
    handleStart,
    handleGoToGame,
    refresh,
  };
};
