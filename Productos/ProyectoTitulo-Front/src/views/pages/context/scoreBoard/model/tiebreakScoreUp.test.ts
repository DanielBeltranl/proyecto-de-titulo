import { describe, it, expect } from 'vitest';
import { tiebreakScoreUp } from './tiebreakScoreUp';
import type { ScoreState } from './scoreTypes';

const makeState = (p1Score: string, p2Score: string, startServer: 'p1' | 'p2' = 'p1'): ScoreState =>
  ({
    p1Score,
    p2Score,
    tiebreakStartServer: startServer,
    servingPlayer: startServer,
  } as ScoreState);

describe('tiebreakScoreUp — scoring', () => {
  it('increments scorer and keeps gameEnded false mid-game', () => {
    const result = tiebreakScoreUp(makeState('3', '2'), 'p1');
    expect(result.p1Score).toBe('4');
    expect(result.p2Score).toBe('2');
    expect(result.gameEnded).toBe(false);
  });

  it('ends game at 7-0', () => {
    const result = tiebreakScoreUp(makeState('6', '0'), 'p1');
    expect(result.gameEnded).toBe(true);
    expect(result.gameWinner).toBe('p1');
  });

  it('does not end game at 7-6 (needs 2-point lead)', () => {
    // 6-6 → p2 scores → 6-7: lead is only 1, no winner yet
    const result = tiebreakScoreUp(makeState('6', '6'), 'p2');
    expect(result.gameEnded).toBe(false);
  });

  it('ends game at 8-6 (2-point lead after 6-6)', () => {
    const result = tiebreakScoreUp(makeState('7', '6'), 'p1');
    expect(result.gameEnded).toBe(true);
    expect(result.gameWinner).toBe('p1');
  });
});

describe('tiebreakScoreUp — server rotation (1-2-2 pattern)', () => {
  it('server changes after the first point', () => {
    // p1 starts, p1 scores (totalPoints becomes 1) → next server should be p2
    const result = tiebreakScoreUp(makeState('0', '0', 'p1'), 'p1');
    expect(result.servingPlayer).toBe('p2');
  });

  it('same server for the second consecutive pair (points 2 and 3)', () => {
    // After 1 point total (p1 scored), server is p2.
    // Now p2 scores a second time → totalPoints = 2, group=0 (even) → p2 serves again
    const afterPoint1 = tiebreakScoreUp(makeState('1', '0', 'p1'), 'p2');
    expect(afterPoint1.servingPlayer).toBe('p2');
  });
});
