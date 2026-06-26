import { describe, it, expect } from 'vitest';
import { scoreUp } from './scoreUp';
import type { ScoreState } from './scoreTypes';

const makeState = (p1Score: string, p2Score: string): Pick<ScoreState, 'p1Score' | 'p2Score'> =>
  ({ p1Score, p2Score } as ScoreState);

describe('scoreUp — normal progression', () => {
  it('advances 0 → 15', () => {
    const result = scoreUp(makeState('0', '0') as ScoreState, 'p1');
    expect(result.p1Score).toBe('15');
    expect(result.gameEnded).toBe(false);
  });

  it('advances 15 → 30', () => {
    const result = scoreUp(makeState('15', '0') as ScoreState, 'p1');
    expect(result.p1Score).toBe('30');
  });

  it('advances 30 → 40', () => {
    const result = scoreUp(makeState('30', '0') as ScoreState, 'p1');
    expect(result.p1Score).toBe('40');
  });

  it('wins game from 40 when opponent is not at 40', () => {
    const result = scoreUp(makeState('40', '30') as ScoreState, 'p1');
    expect(result.gameEnded).toBe(true);
    expect(result.gameWinner).toBe('p1');
  });
});

describe('scoreUp — deuce mechanics', () => {
  it('goes to advantage at deuce (40-40)', () => {
    const result = scoreUp(makeState('40', '40') as ScoreState, 'p1');
    expect(result.p1Score).toBe('A');
    expect(result.p2Score).toBe('40');
    expect(result.gameEnded).toBe(false);
  });

  it('wins from advantage', () => {
    const result = scoreUp(makeState('A', '40') as ScoreState, 'p1');
    expect(result.gameEnded).toBe(true);
    expect(result.gameWinner).toBe('p1');
  });

  it('restores deuce when opponent had advantage', () => {
    const result = scoreUp(makeState('40', 'A') as ScoreState, 'p1');
    expect(result.p1Score).toBe('40');
    expect(result.p2Score).toBe('40');
    expect(result.gameEnded).toBe(false);
  });
});
