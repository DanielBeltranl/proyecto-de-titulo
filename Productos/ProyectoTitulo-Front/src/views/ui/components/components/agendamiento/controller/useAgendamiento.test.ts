import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../model/agendamientoModel', () => ({
  scheduleMatch: vi.fn(),
  fetchJugadoresDelEntrenador: vi.fn(),
}));

import { useAgendamiento } from './useAgendamiento';
import { scheduleMatch, fetchJugadoresDelEntrenador } from '../model/agendamientoModel';

const mockSchedule = vi.mocked(scheduleMatch);
const mockFetchPlayers = vi.mocked(fetchJugadoresDelEntrenador);

const FUTURE_DATE = '2030-01-01';
const FUTURE_TIME = '10:00';
const PAST_DATE = '2020-01-01';

beforeEach(() => {
  mockSchedule.mockReset();
  mockFetchPlayers.mockResolvedValue([]);
});

describe('useAgendamiento', () => {
  describe('initialization', () => {
    it('loads players on mount', async () => {
      const players = [{ id: 1, nombre: 'Ana Lopez', nivel: 'PRO' }];
      mockFetchPlayers.mockResolvedValue(players);

      const { result } = renderHook(() => useAgendamiento());

      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));
      expect(result.current.players).toEqual(players);
    });

    it('starts with isValid false', async () => {
      const { result } = renderHook(() => useAgendamiento());

      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));
      expect(result.current.isValid).toBe(false);
    });
  });

  describe('isValid', () => {
    it('is false when no local player is selected', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => {
        result.current.setField('location', 'Santiago');
        result.current.setField('scheduled_date', FUTURE_DATE);
        result.current.setField('scheduled_time', FUTURE_TIME);
      });

      expect(result.current.isValid).toBe(false);
    });

    it('is false when date is in the past', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => {
        result.current.setField('id_local_player', 1);
        result.current.setField('location', 'Santiago');
        result.current.setField('scheduled_date', PAST_DATE);
        result.current.setField('scheduled_time', '10:00');
      });

      expect(result.current.isValid).toBe(false);
    });

    it('is true with all required fields filled and future datetime', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => {
        result.current.setField('id_local_player', 1);
        result.current.setField('location', 'Santiago');
        result.current.setField('scheduled_date', FUTURE_DATE);
        result.current.setField('scheduled_time', FUTURE_TIME);
      });

      expect(result.current.isValid).toBe(true);
    });

    it('is false when invited type is "registered" but no player id', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => {
        result.current.setField('id_local_player', 1);
        result.current.setField('location', 'Santiago');
        result.current.setField('scheduled_date', FUTURE_DATE);
        result.current.setField('scheduled_time', FUTURE_TIME);
        result.current.setInvited({ type: 'registered' }); // no id_invited_player
      });

      expect(result.current.isValid).toBe(false);
    });

    it('is false when invited type is "guest" but no name', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => {
        result.current.setField('id_local_player', 1);
        result.current.setField('location', 'Santiago');
        result.current.setField('scheduled_date', FUTURE_DATE);
        result.current.setField('scheduled_time', FUTURE_TIME);
        result.current.setInvited({ type: 'guest', guest_name: '   ' }); // blank
      });

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('submit', () => {
    const fillValidForm = (result: ReturnType<typeof useAgendamiento>) => {
      result.setField('id_local_player', 7);
      result.setField('location', 'Club de Tenis');
      result.setField('surface', 'Clay');
      result.setField('best_of', 3);
      result.setField('scheduled_date', FUTURE_DATE);
      result.setField('scheduled_time', FUTURE_TIME);
    };

    it('calls scheduleMatch with correctly built payload', async () => {
      mockSchedule.mockResolvedValue({ message: 'ok', error: null });
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => fillValidForm(result.current));

      await act(async () => { await result.current.submit(); });

      expect(mockSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          id_local_player: 7,
          location: 'Club de Tenis',
          surface: 'Clay',
          best_of: 3,
          scheduled_at: `${FUTURE_DATE}T${FUTURE_TIME}:00Z`,
          id_invited_player: null,
          guest_name: null,
        }),
      );
    });

    it('shows success modal after a successful submit', async () => {
      mockSchedule.mockResolvedValue({ message: 'ok', error: null });
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      act(() => fillValidForm(result.current));
      await act(async () => { await result.current.submit(); });

      expect(result.current.showSuccessModal).toBe(true);
    });

    it('does not call scheduleMatch when form is invalid', async () => {
      const { result } = renderHook(() => useAgendamiento());
      await waitFor(() => expect(result.current.loadingPlayers).toBe(false));

      await act(async () => { await result.current.submit(); });

      expect(mockSchedule).not.toHaveBeenCalled();
    });
  });
});
