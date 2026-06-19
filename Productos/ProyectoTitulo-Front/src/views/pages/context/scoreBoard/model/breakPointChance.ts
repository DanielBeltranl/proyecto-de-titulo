import type { ScoreState, Player } from './scoreTypes';

export const calcBreakPointChance = (state: ScoreState): boolean => {
    if (state.isTiebreak) return false;

    const { servingPlayer } = state;
    const receiver: Player = servingPlayer === 'p1' ? 'p2' : 'p1';
    const receiverScore = receiver === 'p1' ? state.p1Score : state.p2Score;
    const serverScore = servingPlayer === 'p1' ? state.p1Score : state.p2Score;

    if (receiverScore === 'A') return true;
    if (receiverScore === '40' && serverScore !== '40' && serverScore !== 'A') return true;

    return false;
};
