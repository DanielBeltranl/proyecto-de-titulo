import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchRecovery,
  postPoint,
  deleteUndo,
  pauseMatchApi,
  finishMatchApi,
} from '../model/scoreBoardModel';
import type { RecoveryResponse } from '../model/scoreBoardModel';
import type { Player, SetScore, MatchContext } from '../model/scoreTypes';

export interface LiveBoardState {
  p1Id: number;
  p2Id: number;
  p1Name: string;
  p2Name: string;
  isGuestMatch: boolean;
  p1Score: string;
  p2Score: string;
  p1Games: number;
  p2Games: number;
  p1Sets: number;
  p2Sets: number;
  completedSets: SetScore[];
  isTiebreak: boolean;
  servingPlayer: Player;
  breakPointChance: boolean;
  gameEnded: boolean;
  gameWinner: Player | null;
  currentGameId: string;
  currentSetId: string;
  matchContext: MatchContext;
  matchEnded: boolean;
  matchClosed: boolean;
  pendingWinnerId: number | null;
  hasUndo: boolean;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

export interface UseScoreBoardApiReturn {
  state: LiveBoardState;
  onScoreUp: (player: Player, pointDuration: number) => Promise<void>;
  onUndo: () => Promise<void>;
  onPause: () => Promise<void>;
  onFinish: () => Promise<void>;
}

const calcBreakPoint = (
  servingPlayer: Player,
  p1Score: string,
  p2Score: string,
  isTiebreak: boolean
): boolean => {
  if (isTiebreak) return false;
  const receiverScore = servingPlayer === 'p1' ? p2Score : p1Score;
  const serverScore   = servingPlayer === 'p1' ? p1Score : p2Score;
  if (receiverScore === 'A' || receiverScore === 'AD') return true;
  if (receiverScore === '40' && serverScore !== '40' && serverScore !== 'A' && serverScore !== 'AD') return true;
  return false;
};

// ─── Init desde navigation state (partido recién iniciado) ───────────────────
export interface ScoreBoardNavState {
  isNew: true;
  p1Id: number;
  p2Id: number;
  p1Name: string;
  p2Name: string;
  isGuestMatch: boolean;
  firstServerId: number;
  bestOf: 1 | 3 | 5;
}

const initFromNavState = (nav: ScoreBoardNavState, uuid: string): LiveBoardState => {
  const servingPlayer: Player = nav.firstServerId === nav.p2Id ? 'p2' : 'p1';
  return {
    p1Id: nav.p1Id,
    p2Id: nav.p2Id,
    p1Name: nav.p1Name,
    p2Name: nav.p2Name,
    isGuestMatch: nav.isGuestMatch,
    p1Score: '0',
    p2Score: '0',
    p1Games: 0,
    p2Games: 0,
    p1Sets: 0,
    p2Sets: 0,
    completedSets: [],
    isTiebreak: false,
    servingPlayer,
    breakPointChance: false,
    gameEnded: false,
    gameWinner: null,
    currentGameId: 'init',
    currentSetId:  'init',
    matchContext: {
      p1Id: String(nav.p1Id),
      p2Id: String(nav.p2Id),
      id_match: uuid,
      id_match_score: '',
      bestOf: nav.bestOf,
    },
    matchEnded: false,
    matchClosed: false,
    pendingWinnerId: null,
    hasUndo: false,
    loading: false,
    actionLoading: false,
    error: null,
  };
};

// ─── Init desde recovery (reload de página) ──────────────────────────────────
const applyRecovery = (rec: RecoveryResponse): Partial<LiveBoardState> => {
  const p1 = rec.match.local_player;
  const isGuestMatch = rec.match.invited === null;
  const p2 = rec.match.invited;

  const p2Id   = isGuestMatch ? 0 : p2!.id;
  const p2Name = isGuestMatch
    ? (rec.match.guest_name ?? 'Invitado')
    : `${p2!.nombre} ${p2!.apellidoPaterno}`.trim();

  const servingId: number | null = rec.current_game?.is_serving?.id ?? null;
  const servingPlayer: Player    = servingId === p2Id ? 'p2' : 'p1';

  const p1Score    = rec.current_score?.score_p1 ?? '0';
  const p2Score    = rec.current_score?.score_p2 ?? '0';
  const isTiebreak = rec.current_game?.is_tiebreak ?? false;

  const completedSets: SetScore[] = (rec.sets ?? [])
    .filter(s => s.id_set !== rec.current_set?.id_set)
    .map(s => ({ p1: s.score_p1, p2: s.score_p2 }));

  return {
    p1Id: p1.id,
    p2Id,
    p1Name: `${p1.nombre} ${p1.apellidoPaterno}`.trim(),
    p2Name,
    isGuestMatch,
    p1Score,
    p2Score,
    p1Games: rec.current_set?.score_p1 ?? 0,
    p2Games: rec.current_set?.score_p2 ?? 0,
    p1Sets: rec.sets_p1 ?? 0,
    p2Sets: rec.sets_p2 ?? 0,
    completedSets,
    isTiebreak,
    servingPlayer,
    breakPointChance: calcBreakPoint(servingPlayer, p1Score, p2Score, isTiebreak),
    currentGameId: rec.current_game?.id_game ?? 'no-game',
    currentSetId:  rec.current_set?.id_set  ?? 'no-set',
    matchContext: {
      p1Id: String(p1.id),
      p2Id: String(p2Id),
      id_match: rec.match.id_match,
      id_match_score: '',
      bestOf: rec.match.best_of,
    },
    hasUndo:    rec.last_point !== null,
    matchEnded: rec.match.match_state === 'FINALIZADA',
  };
};

const emptyState = (uuid: string): LiveBoardState => ({
  p1Id: 0, p2Id: 0, p1Name: 'J1', p2Name: 'J2',
  isGuestMatch: false,
  p1Score: '0', p2Score: '0',
  p1Games: 0, p2Games: 0,
  p1Sets: 0,  p2Sets: 0,
  completedSets: [],
  isTiebreak: false,
  servingPlayer: 'p1',
  breakPointChance: false,
  gameEnded: false, gameWinner: null,
  currentGameId: 'init', currentSetId: 'init',
  matchContext: { p1Id: '', p2Id: '', id_match: uuid, id_match_score: '', bestOf: 3 },
  matchEnded: false, matchClosed: false, pendingWinnerId: null,
  hasUndo: false,
  loading: true,
  actionLoading: false,
  error: null,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useScoreBoardApi = (uuid: string): UseScoreBoardApiReturn => {
  const location   = useLocation();
  const navState   = location.state as ScoreBoardNavState | null;
  const isNewMatch = navState?.isNew === true;

  const [state, setState] = useState<LiveBoardState>(() =>
    isNewMatch && navState ? initFromNavState(navState, uuid) : emptyState(uuid)
  );

  // Limpia el nav state del history para que un reload dispare recovery
  useEffect(() => {
    if (isNewMatch) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Snapshot anterior para undo local
  const prevSnapshotRef = useRef<Partial<LiveBoardState> | null>(null);

  const navigate = useNavigate();

  // Solo llama recovery en reload (match ya en curso sin nav state)
  useEffect(() => {
    console.log('[ScoreBoard] useEffect — isNewMatch:', isNewMatch, '| uuid:', uuid);
    if (isNewMatch) {
      console.log('[ScoreBoard] isNewMatch=true, skipping recovery');
      return;
    }

    const init = async () => {
      console.log('[ScoreBoard] starting recovery fetch...');
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const rec = await fetchRecovery(uuid);
        console.log('[ScoreBoard] recovery raw:', rec);
        try {
          const updates = applyRecovery(rec);
          console.log('[ScoreBoard] applyRecovery result:', updates);
          setState(prev => ({ ...prev, ...updates, loading: false }));
          console.log('[ScoreBoard] state updated');
        } catch (parseErr: any) {
          console.error('[ScoreBoard] applyRecovery crash:', parseErr);
          setState(prev => ({ ...prev, loading: false, error: 'Error al procesar el estado del partido.' }));
        }
      } catch (err: any) {
        const status     = err.response?.status;
        const backendMsg = err.response?.data?.error ?? err.response?.data?.detail ?? '';
        console.error('[ScoreBoard] fetch recovery error:', status, err.response?.data, err);
        const error =
          status === 403 ? 'No tenés acceso a este partido. (403)' :
          status === 404 ? 'Partido no encontrado. (404)' :
          `Error ${status ?? 'de red'}: ${backendMsg || 'No se pudo cargar el partido.'}`;
        setState(prev => ({ ...prev, loading: false, error }));
      }
    };
    init();
  }, [uuid, isNewMatch]);

  // ─── Registrar punto ────────────────────────────────────────────────────────
  const onScoreUp = async (player: Player, pointDuration: number): Promise<void> => {
    // Guardar snapshot para posible undo
    prevSnapshotRef.current = {
      p1Score: state.p1Score, p2Score: state.p2Score,
      p1Games: state.p1Games, p2Games: state.p2Games,
      p1Sets:  state.p1Sets,  p2Sets:  state.p2Sets,
      completedSets: state.completedSets,
      servingPlayer: state.servingPlayer,
      isTiebreak: state.isTiebreak,
      currentGameId: state.currentGameId,
      currentSetId:  state.currentSetId,
      breakPointChance: state.breakPointChance,
      hasUndo: state.hasUndo,
    };

    setState(prev => ({ ...prev, actionLoading: true }));

    const winnerId = player === 'p1' ? state.p1Id : (state.isGuestMatch ? null : state.p2Id);

    try {
      const resp = await postPoint(uuid, winnerId, Math.round(pointDuration));

      setState(prev => {
        const gameWinner: Player | null = resp.game_closed ? player : null;

        let p1Games      = prev.p1Games;
        let p2Games      = prev.p2Games;
        let p1Sets       = prev.p1Sets;
        let p2Sets       = prev.p2Sets;
        let completedSets = prev.completedSets;

        if (resp.game_closed) {
          if (resp.set_closed) {
            const closedP1 = gameWinner === 'p1' ? prev.p1Games + 1 : prev.p1Games;
            const closedP2 = gameWinner === 'p2' ? prev.p2Games + 1 : prev.p2Games;
            completedSets  = [...prev.completedSets, { p1: closedP1, p2: closedP2 }];
            if (gameWinner === 'p1') p1Sets = prev.p1Sets + 1;
            else if (gameWinner === 'p2') p2Sets = prev.p2Sets + 1;
            p1Games = 0;
            p2Games = 0;
          } else {
            p1Games = gameWinner === 'p1' ? prev.p1Games + 1 : prev.p1Games;
            p2Games = gameWinner === 'p2' ? prev.p2Games + 1 : prev.p2Games;
          }
        }

        const newServingId  = resp.current_game?.is_serving_id ?? null;
        const servingPlayer: Player = newServingId === prev.p2Id ? 'p2' : 'p1';
        const isTiebreak    = resp.game_closed
          ? (resp.tiebreak_required ?? false)
          : (resp.current_game?.is_tiebreak ?? prev.isTiebreak);
        const currentGameId = resp.current_game?.id_game ?? prev.currentGameId;
        const p1Score = resp.game_closed ? '0' : resp.current_score.score_p1;
        const p2Score = resp.game_closed ? '0' : resp.current_score.score_p2;

        return {
          ...prev,
          p1Score, p2Score,
          p1Games, p2Games,
          p1Sets,  p2Sets,
          completedSets,
          servingPlayer,
          isTiebreak,
          currentGameId,
          breakPointChance: resp.game_closed
            ? false
            : calcBreakPoint(servingPlayer, p1Score, p2Score, isTiebreak),
          gameEnded:       resp.game_closed,
          gameWinner,
          matchEnded:      resp.match_closed,
          matchClosed:     resp.match_closed,
          pendingWinnerId: resp.match_closed && resp.winner ? resp.winner.id : null,
          hasUndo:    true,
          actionLoading: false,
        };
      });

      if (resp.game_closed) {
        setTimeout(() => setState(prev => ({ ...prev, gameEnded: false, gameWinner: null })), 2000);
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, actionLoading: false }));
      alert(err.response?.data?.error ?? 'Error al registrar el punto.');
    }
  };

  // ─── Deshacer punto ─────────────────────────────────────────────────────────
  const onUndo = async (): Promise<void> => {
    setState(prev => ({ ...prev, actionLoading: true }));
    try {
      await deleteUndo(uuid);
      if (prevSnapshotRef.current) {
        setState(prev => ({
          ...prev,
          ...prevSnapshotRef.current,
          hasUndo: false,
          actionLoading: false,
        }));
        prevSnapshotRef.current = null;
      } else {
        // Fallback: recovery si no hay snapshot local
        const updates = await fetchRecovery(uuid).then(applyRecovery);
        setState(prev => ({ ...prev, ...updates, actionLoading: false }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, actionLoading: false }));
      alert(err.response?.data?.error ?? 'Error al deshacer el punto.');
    }
  };

  // ─── Pausar ─────────────────────────────────────────────────────────────────
  const onPause = async (): Promise<void> => {
    setState(prev => ({ ...prev, actionLoading: true }));
    try {
      await pauseMatchApi(uuid);
      navigate(`/match/${uuid}`);
    } catch (err: any) {
      setState(prev => ({ ...prev, actionLoading: false }));
      alert(err.response?.data?.error ?? 'Error al pausar el partido.');
    }
  };

  // ─── Finalizar ───────────────────────────────────────────────────────────────
  const onFinish = async (): Promise<void> => {
    if (!state.matchClosed) return;
    setState(prev => ({ ...prev, actionLoading: true }));
    try {
      await finishMatchApi(uuid, state.pendingWinnerId);
      navigate(`/match-stats/${uuid}`);
    } catch (err: any) {
      setState(prev => ({ ...prev, actionLoading: false }));
      alert(err.response?.data?.error ?? 'Error al finalizar el partido.');
    }
  };

  return { state, onScoreUp, onUndo, onPause, onFinish };
};
