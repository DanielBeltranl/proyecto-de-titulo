import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../model/partidosModel', () => ({
  fetchPartidosCreados: vi.fn(),
  fetchPartidosInvitado: vi.fn(),
  fetchPartidosAgendados: vi.fn(),
  fetchInvitacionesJugadores: vi.fn(),
  acceptarInvitacionJugador: vi.fn(),
}));

vi.mock('../../../../../../services/usuarioService', () => ({
  getUsuario: vi.fn(),
}));

import { usePartidos } from './usePartidos';
import {
  fetchPartidosCreados,
  fetchPartidosInvitado,
  fetchPartidosAgendados,
  fetchInvitacionesJugadores,
  acceptarInvitacionJugador,
} from '../model/partidosModel';
import { getUsuario } from '../../../../../../services/usuarioService';

const mockCreados = vi.mocked(fetchPartidosCreados);
const mockInvitado = vi.mocked(fetchPartidosInvitado);
const mockAgendados = vi.mocked(fetchPartidosAgendados);
const mockInvitaciones = vi.mocked(fetchInvitacionesJugadores);
const mockAceptar = vi.mocked(acceptarInvitacionJugador);
const mockGetUsuario = vi.mocked(getUsuario);

const MATCH = {
  id_match: 'm-001',
  creator: { id: 1, nombre: 'Ana', apellidoPaterno: 'Lopez', correo: 'a@a.cl' },
  invited: { id: 2, nombre: 'Carlos', apellidoPaterno: 'Ruiz', correo: 'c@c.cl' },
  location: 'Santiago',
  surface: 'Clay' as const,
  best_of: 3 as const,
  match_state: 'PENDIENTE' as const,
  score: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const asJugador = () => mockGetUsuario.mockReturnValue({ rol: 'Jugador' } as any);
const asEntrenador = () => mockGetUsuario.mockReturnValue({ rol: 'Entrenador' } as any);

beforeEach(() => {
  vi.resetAllMocks();
  mockCreados.mockResolvedValue([]);
  mockInvitado.mockResolvedValue([]);
  mockAgendados.mockResolvedValue([]);
  mockInvitaciones.mockResolvedValue([]);
  mockAceptar.mockResolvedValue(undefined);
  asJugador();
});

describe('usePartidos', () => {
  describe('Jugador role', () => {
    it('loads creados and invitados on mount', async () => {
      mockCreados.mockResolvedValue([MATCH]);
      mockInvitado.mockResolvedValue([{ ...MATCH, id_match: 'm-002' }]);

      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.creados).toHaveLength(1);
      expect(result.current.invitados).toHaveLength(1);
    });

    it('sets error when fetch fails', async () => {
      mockCreados.mockRejectedValue(new Error('network error'));
      mockInvitado.mockRejectedValue(new Error('network error'));

      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('No se pudieron cargar los partidos.');
    });

    it('does not call agendados or invitaciones endpoints', async () => {
      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockAgendados).not.toHaveBeenCalled();
      expect(mockInvitaciones).not.toHaveBeenCalled();
    });
  });

  describe('Entrenador role', () => {
    beforeEach(() => asEntrenador());

    it('loads agendados and invitaciones on mount', async () => {
      mockAgendados.mockResolvedValue([MATCH]);
      mockInvitaciones.mockResolvedValue([{ ...MATCH, id_match: 'm-inv-001' }]);

      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.agendados).toHaveLength(1);
      expect(result.current.invitacionesJugadores).toHaveLength(1);
    });

    it('does not call creados or invitados endpoints', async () => {
      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockCreados).not.toHaveBeenCalled();
      expect(mockInvitado).not.toHaveBeenCalled();
    });

    it('defaults coachTab to "agendados"', async () => {
      const { result } = renderHook(() => usePartidos());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.coachTab).toBe('agendados');
    });

    it('setCoachTab changes the active tab', async () => {
      const { result } = renderHook(() => usePartidos());
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => result.current.setCoachTab('invitaciones'));

      expect(result.current.coachTab).toBe('invitaciones');
    });
  });

  describe('acceptInvitation', () => {
    it('calls acceptarInvitacionJugador with the correct uuid', async () => {
      asEntrenador();
      const { result } = renderHook(() => usePartidos());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.acceptInvitation('match-xyz');
      });

      expect(mockAceptar).toHaveBeenCalledWith('match-xyz');
    });

    it('clears acceptingId after success', async () => {
      asEntrenador();
      const { result } = renderHook(() => usePartidos());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.acceptInvitation('match-xyz');
      });

      expect(result.current.acceptingId).toBeNull();
    });

    it('refreshes data after accepting', async () => {
      asEntrenador();
      mockAgendados.mockResolvedValue([MATCH]);

      const { result } = renderHook(() => usePartidos());
      await waitFor(() => expect(result.current.loading).toBe(false));

      const callsBefore = mockAgendados.mock.calls.length;

      await act(async () => {
        await result.current.acceptInvitation('match-xyz');
      });

      expect(mockAgendados.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });
});
