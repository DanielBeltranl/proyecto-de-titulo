import type { ScoreState, ScoreAction, ScoreSnapshot, Player, PointPayload } from './scoreTypes';
import { scoreUp } from './scoreUp';
import { tiebreakScoreUp } from './tiebreakScoreUp';
import { calcBreakPointChance } from './breakPointChance';
import { applyGameTransition } from './gameTransition';

export const scoreReducer = (state: ScoreState, action: ScoreAction): ScoreState => {
    switch (action.type) {
        case 'SCORE_UP': {
            if (state.gameEnded || state.matchEnded) return state;

            const { matchContext, servingPlayer, currentGameId } = state;
            const receiver: Player = servingPlayer === 'p1' ? 'p2' : 'p1';

            const prevSnapshot: ScoreSnapshot = {
                p1Score: state.p1Score,
                p2Score: state.p2Score,
                p1Games: state.p1Games,
                p2Games: state.p2Games,
                gameEnded: state.gameEnded,
                gameWinner: state.gameWinner,
                breakPointChance: state.breakPointChance,
                servingPlayer: state.servingPlayer,
                currentGameId: state.currentGameId,
                currentSetId: state.currentSetId,
                isTiebreak: state.isTiebreak,
                tiebreakStartServer: state.tiebreakStartServer,
                setWon: state.setWon,
                completedSets: state.completedSets,
                p1Sets: state.p1Sets,
                p2Sets: state.p2Sets,
            };

            const bpc = state.isTiebreak ? false : calcBreakPointChance(state);
            const updates = state.isTiebreak
                ? tiebreakScoreUp(state, action.player)
                : scoreUp(state, action.player);

            const next = { ...state, ...updates };
            const bp = bpc && next.gameWinner === receiver;

            const lastPoint: PointPayload = {
                id_game: currentGameId,
                id_player_1: matchContext.p1Id,
                id_player_2: matchContext.p2Id,
                is_serving: servingPlayer === 'p1' ? matchContext.p1Id : matchContext.p2Id,
                winner_id: action.player === 'p1' ? matchContext.p1Id : matchContext.p2Id,
                score_p1: next.p1Score,
                score_p2: next.p2Score,
                duration: action.pointDuration ?? 0,
                break_point_chance: bpc,
                break_point: bp,
                created_at: new Date().toISOString(),
            };

            const afterPoint: ScoreState = {
                ...next,
                breakPointChance: state.isTiebreak ? false : calcBreakPointChance(next),
                lastPoint,
                prevSnapshot,
                setWon: false,
            };

            if (next.gameEnded) {
                const transition = applyGameTransition(afterPoint, action.gameDuration ?? 0, action.setDuration ?? 0, action.matchDuration ?? 0);
                return { ...afterPoint, ...transition, breakPointChance: false };
            }

            return afterPoint;
        }
        case 'UNDO': {
            if (!state.prevSnapshot || state.matchEnded) return state;

            const { prevSnapshot } = state;
            return {
                ...state,
                p1Score: prevSnapshot.p1Score,
                p2Score: prevSnapshot.p2Score,
                p1Games: prevSnapshot.p1Games,
                p2Games: prevSnapshot.p2Games,
                gameEnded: prevSnapshot.gameEnded,
                gameWinner: prevSnapshot.gameWinner,
                breakPointChance: prevSnapshot.breakPointChance,
                servingPlayer: prevSnapshot.servingPlayer,
                currentGameId: prevSnapshot.currentGameId,
                currentSetId: prevSnapshot.currentSetId,
                isTiebreak: prevSnapshot.isTiebreak,
                tiebreakStartServer: prevSnapshot.tiebreakStartServer,
                setWon: prevSnapshot.setWon,
                completedSets: prevSnapshot.completedSets,
                p1Sets: prevSnapshot.p1Sets,
                p2Sets: prevSnapshot.p2Sets,
                prevSnapshot: null,
                lastPoint: null,
                lastGame: null,
                lastSet: null,
                lastMatchScore: null,
            };
        }
        default:
            return state;
    }
};
