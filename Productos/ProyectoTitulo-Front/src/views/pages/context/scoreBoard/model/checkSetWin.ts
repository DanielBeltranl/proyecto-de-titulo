import type { Player } from './scoreTypes';

export const checkSetWin = (p1Games: number, p2Games: number): Player | null => {
    if (p1Games >= 6 && p1Games - p2Games >= 2) return 'p1';
    if (p2Games >= 6 && p2Games - p1Games >= 2) return 'p2';
    return null;
};
