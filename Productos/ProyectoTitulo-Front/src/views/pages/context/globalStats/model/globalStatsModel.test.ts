import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGlobalStats } from './globalStatsModel';

vi.mock('../../../../../api/axios', () => ({
  default: { get: vi.fn() },
}));

import api from '../../../../../api/axios';
const mockGet = vi.mocked(api.get);

const BASE_RESPONSE = {
  record: { wins: 3, losses: 1, total: 4, win_pct: 75, loss_pct: 25 },
  last_result: {
    match_id: 'abc',
    won: true,
    opponent: { id: 1, nombre: 'Juan', apellidoPaterno: 'Perez' },
    location: 'Santiago',
    surface: 'Clay',
  },
  points_win_loss: { won: 120, lost: 80, total: 200, won_pct: 60, lost_pct: 40 },
  avg_duration_won: '01:20:00',
  avg_duration_lost: '01:45:00',
  break_points: {
    generated: 10, converted: 5, conversion_pct: 50,
    faced: 8, saved: 6, save_pct: 75,
  },
  quartiles: [
    { quartile: 1, min_duration: 0, max_duration: 30, count: 5, pct: 25 },
    { quartile: 2, min_duration: 31, max_duration: 60, count: 5, pct: 25 },
    { quartile: 3, min_duration: 61, max_duration: 90, count: 5, pct: 25 },
    { quartile: 4, min_duration: 91, max_duration: 120, count: 5, pct: 25 },
  ],
  points_per_interval: [{ interval: 1, points_won_avg: 3.5 }],
};

beforeEach(() => {
  mockGet.mockReset();
});

describe('fetchGlobalStats', () => {
  it('returns null when API responds with a message (no data)', async () => {
    mockGet.mockResolvedValue({ data: { message: 'No stats found' } });

    const result = await fetchGlobalStats();

    expect(result).toBeNull();
  });

  it('maps quartiles correctly, filling missing ones with zeros', async () => {
    const responseWithMissingQ3 = {
      ...BASE_RESPONSE,
      quartiles: [
        { quartile: 1, min_duration: 0, max_duration: 30, count: 5, pct: 25 },
        { quartile: 2, min_duration: 31, max_duration: 60, count: 5, pct: 50 },
        // Q3 missing
        { quartile: 4, min_duration: 91, max_duration: 120, count: 5, pct: 25 },
      ],
    };
    mockGet.mockResolvedValue({ data: responseWithMissingQ3 });

    const result = await fetchGlobalStats();

    expect(result?.quartiles[2]).toEqual({ pct: 0, minSec: 0, maxSec: 0 });
  });

  it('calls the correct URL when playerId is provided', async () => {
    mockGet.mockResolvedValue({ data: BASE_RESPONSE });

    await fetchGlobalStats(42);

    expect(mockGet).toHaveBeenCalledWith('/statistics/global/?player_id=42');
  });

  it('calls the global URL when no playerId is provided', async () => {
    mockGet.mockResolvedValue({ data: BASE_RESPONSE });

    await fetchGlobalStats();

    expect(mockGet).toHaveBeenCalledWith('/statistics/global/');
  });

  it('uses fallback values when optional fields are missing', async () => {
    const sparse = {
      record: BASE_RESPONSE.record,
      points_win_loss: BASE_RESPONSE.points_win_loss,
      break_points: BASE_RESPONSE.break_points,
    };
    mockGet.mockResolvedValue({ data: sparse });

    const result = await fetchGlobalStats();

    expect(result?.avgDurationWon).toBe('—');
    expect(result?.avgDurationLost).toBe('—');
    expect(result?.lastResult).toBeNull();
    expect(result?.pointsPerInterval).toEqual([]);
  });
});
