import type { ScoreState, Player } from './scoreTypes';

// Rotación 1-2-2: calcula quién sirve el siguiente punto del tiebreak
const calcTiebreakServer = (startServer: Player, totalPointsPlayed: number): Player => {
    if (totalPointsPlayed === 0) return startServer;
    const group = Math.floor((totalPointsPlayed - 1) / 2);
    return group % 2 === 0
        ? (startServer === 'p1' ? 'p2' : 'p1')
        : startServer;
};

type TiebreakResult = {
    p1Score: string;
    p2Score: string;
    gameEnded: boolean;
    gameWinner: Player | null;
    servingPlayer: Player;
};

export const tiebreakScoreUp = (state: ScoreState, player: Player): TiebreakResult => {
    const p1 = parseInt(state.p1Score);
    const p2 = parseInt(state.p2Score);

    const newP1 = player === 'p1' ? p1 + 1 : p1;
    const newP2 = player === 'p2' ? p2 + 1 : p2;

    const winnerScore = player === 'p1' ? newP1 : newP2;
    const loserScore  = player === 'p1' ? newP2 : newP1;
    const gameEnded   = winnerScore >= 7 && winnerScore - loserScore >= 2;

    const totalPoints = newP1 + newP2;
    const nextServer  = calcTiebreakServer(state.tiebreakStartServer, totalPoints);

    return {
        p1Score: String(newP1),
        p2Score: String(newP2),
        gameEnded,
        gameWinner: gameEnded ? player : null,
        servingPlayer: nextServer,
    };
};
