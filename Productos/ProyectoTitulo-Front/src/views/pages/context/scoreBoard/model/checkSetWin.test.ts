import { describe, it, expect } from 'vitest';
import { checkSetWin } from './checkSetWin';

describe('checkSetWin', () => {
  it('p1 wins 6-4', () => {
    expect(checkSetWin(6, 4)).toBe('p1');
  });

  it('p2 wins 4-6', () => {
    expect(checkSetWin(4, 6)).toBe('p2');
  });

  it('p1 wins 7-5', () => {
    expect(checkSetWin(7, 5)).toBe('p1');
  });

  it('returns null at 6-5 (no 2-game lead yet)', () => {
    expect(checkSetWin(6, 5)).toBeNull();
  });

  it('returns null at 6-6 (tiebreak pending)', () => {
    expect(checkSetWin(6, 6)).toBeNull();
  });

  it('returns null before 6 games', () => {
    expect(checkSetWin(5, 3)).toBeNull();
  });
});
