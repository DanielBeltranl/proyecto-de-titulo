import type { ScoreState, GamePayload, SetPayload, MatchScorePayload, Player, SetScore } from './scoreTypes';
import { checkSetWin } from './checkSetWin';

type GameTransitionResult = Pick<ScoreState,
    'p1Score' | 'p2Score' | 'gameEnded' | 'gameWinner' |
    'p1Games' | 'p2Games' | 'servingPlayer' | 'currentGameId' | 'currentSetId' | 'lastGame' | 'lastSet' |
    'isTiebreak' | 'tiebreakStartServer' | 'setWon' |
    'completedSets' | 'p1Sets' | 'p2Sets' | 'matchEnded' | 'lastMatchScore'
>;

export const applyGameTransition = (state: ScoreState, duration: number, setDuration: number, matchDuration: number): GameTransitionResult => {
    const { matchContext, gameWinner, servingPlayer, currentGameId, currentSetId, isTiebreak, tiebreakStartServer } = state;

    const newP1Games = gameWinner === 'p1' ? state.p1Games + 1 : state.p1Games;
    const newP2Games = gameWinner === 'p2' ? state.p2Games + 1 : state.p2Games;

    const lastGame: GamePayload = {
        id_game: currentGameId,
        id_set: currentSetId,
        p1_game_final_score: state.p1Score,
        p2_game_final_score: state.p2Score,
        duration,
        winner_id: gameWinner === 'p1' ? matchContext.p1Id : matchContext.p2Id,
        is_break: state.lastPoint?.break_point ?? false,
        is_Serving: servingPlayer === 'p1' ? matchContext.p1Id : matchContext.p2Id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const rotatedServer: Player = servingPlayer === 'p1' ? 'p2' : 'p1';
    const postTiebreakServer: Player = tiebreakStartServer === 'p1' ? 'p2' : 'p1';

    const setWinner = isTiebreak
        ? gameWinner
        : checkSetWin(newP1Games, newP2Games);

    const setWon = setWinner !== null;
    const activateTiebreak = !isTiebreak && !setWon && newP1Games === 6 && newP2Games === 6;
    const nextServingPlayer = isTiebreak ? postTiebreakServer : rotatedServer;

    // Historial de sets (dev: local — se reemplaza por fetch en producción)
    const completedSets: SetScore[] = setWon
        ? [...state.completedSets, { p1: newP1Games, p2: newP2Games }]
        : state.completedSets;

    const p1Sets = setWon && setWinner === 'p1' ? state.p1Sets + 1 : state.p1Sets;
    const p2Sets = setWon && setWinner === 'p2' ? state.p2Sets + 1 : state.p2Sets;

    const nextSetId = setWon ? crypto.randomUUID() : currentSetId;

    const lastSet: SetPayload | null = setWon && setWinner !== null
        ? {
            id_set: currentSetId,
            score_p1: newP1Games,
            score_p2: newP2Games,
            winner_id: setWinner === 'p1' ? matchContext.p1Id : matchContext.p2Id,
            duration: setDuration,
        }
        : null;

    const setsToWin = Math.ceil(matchContext.bestOf / 2);
    const matchEnded = p1Sets >= setsToWin || p2Sets >= setsToWin;
    const matchWinner = p1Sets >= setsToWin ? 'p1' : p2Sets >= setsToWin ? 'p2' : null;

    const lastMatchScore: MatchScorePayload | null = matchEnded && matchWinner !== null
        ? {
            id_match_score: matchContext.id_match_score,
            id_partido: matchContext.id_match,
            winner_id: matchWinner === 'p1' ? matchContext.p1Id : matchContext.p2Id,
            duration: matchDuration,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        : null;

    return {
        p1Score: '0',
        p2Score: '0',
        gameEnded: false,
        gameWinner: null,
        p1Games: setWon ? 0 : newP1Games,
        p2Games: setWon ? 0 : newP2Games,
        servingPlayer: nextServingPlayer,
        currentGameId: crypto.randomUUID(),
        currentSetId: nextSetId,
        lastGame,
        lastSet,
        matchEnded,
        lastMatchScore,
        isTiebreak: activateTiebreak,
        tiebreakStartServer: activateTiebreak ? nextServingPlayer : tiebreakStartServer,
        setWon,
        completedSets,
        p1Sets,
        p2Sets,
    };
};
