import { describe, it, expect } from 'vitest';
import { calcBreakPointChance } from './breakPointChance';
import type { ScoreState } from './scoreTypes';

const makeState = (overrides: Partial<ScoreState>): ScoreState =>
  ({
    p1Score: '0',
    p2Score: '0',
    servingPlayer: 'p1',
    isTiebreak: false,
    ...overrides,
  } as ScoreState);

describe('calcBreakPointChance', () => {
  it('returns true when receiver has advantage', () => {
    // p1 serves, p2 is receiver at A
    const state = makeState({ servingPlayer: 'p1', p2Score: 'A', p1Score: '40' });
    expect(calcBreakPointChance(state)).toBe(true);
  });

  it('returns true when receiver is at 40 and server is not', () => {
    const state = makeState({ servingPlayer: 'p1', p2Score: '40', p1Score: '30' });
    expect(calcBreakPointChance(state)).toBe(true);
  });

  it('returns false at deuce (40-40)', () => {
    const state = makeState({ servingPlayer: 'p1', p1Score: '40', p2Score: '40' });
    expect(calcBreakPointChance(state)).toBe(false);
  });

  it('returns false when server leads', () => {
    const state = makeState({ servingPlayer: 'p1', p1Score: '40', p2Score: '15' });
    expect(calcBreakPointChance(state)).toBe(false);
  });

  it('always returns false during tiebreak', () => {
    const state = makeState({ isTiebreak: true, servingPlayer: 'p1', p2Score: '40', p1Score: '30' });
    expect(calcBreakPointChance(state)).toBe(false);
  });
});
