import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../../../services/usuarioService', () => ({
  obtenerPartidosCreados: vi.fn(),
  obtenerPartidosInvitado: vi.fn(),
  obtenerPartidosAgendados: vi.fn(),
  obtenerInvitacionesJugadoresCoach: vi.fn(),
  aceptarInvitacionPartido: vi.fn(),
}));

import {
  fetchPartidosCreados,
  fetchPartidosInvitado,
  fetchPartidosAgendados,
  fetchInvitacionesJugadores,
  acceptarInvitacionJugador,
} from './partidosModel';

import {
  obtenerPartidosCreados,
  obtenerPartidosInvitado,
  obtenerPartidosAgendados,
  obtenerInvitacionesJugadoresCoach,
  aceptarInvitacionPartido,
} from '../../../../../../services/usuarioService';

const mockCreados = vi.mocked(obtenerPartidosCreados);
const mockInvitado = vi.mocked(obtenerPartidosInvitado);
const mockAgendados = vi.mocked(obtenerPartidosAgendados);
const mockInvitaciones = vi.mocked(obtenerInvitacionesJugadoresCoach);
const mockAceptar = vi.mocked(aceptarInvitacionPartido);

const PLAYER = { id: 1, nombre: 'Ana', apellidoPaterno: 'Lopez', correo: 'a@a.cl' };

beforeEach(() => {
  vi.resetAllMocks();
});

describe('partidosModel', () => {
  describe('fetchPartidosCreados', () => {
    it('returns the array from the API', async () => {
      const match = { id_match: 'abc', creator: PLAYER };
      mockCreados.mockResolvedValue({ data: [match] } as any);

      const result = await fetchPartidosCreados();

      expect(result).toEqual([match]);
    });

    it('returns empty array when API does not return an array', async () => {
      mockCreados.mockResolvedValue({ data: null } as any);

      const result = await fetchPartidosCreados();

      expect(result).toEqual([]);
    });
  });

  describe('fetchPartidosInvitado', () => {
    it('returns empty array when API does not return an array', async () => {
      mockInvitado.mockResolvedValue({ data: undefined } as any);

      const result = await fetchPartidosInvitado();

      expect(result).toEqual([]);
    });
  });

  describe('fetchPartidosAgendados', () => {
    const BASE_SCHEDULE = {
      id_match: 'sched-001',
      entrenador: PLAYER,
      local_player: PLAYER,
      invited: null,
      scheduled_at: '2025-06-01T10:00:00Z',
      guest_name: null,
      location: 'Santiago',
      surface: 'Clay' as const,
      best_of: 3 as const,
      match_state: 'PENDIENTE' as const,
      created_at: '2025-05-01T00:00:00Z',
    };

    it('maps ScheduleItem fields to MatchItem correctly', async () => {
      mockAgendados.mockResolvedValue({ data: [BASE_SCHEDULE] } as any);

      const result = await fetchPartidosAgendados();

      expect(result[0]).toMatchObject({
        id_match: 'sched-001',
        creator: PLAYER,
        location: 'Santiago',
        surface: 'Clay',
        best_of: 3,
        match_state: 'PENDIENTE',
        created_at: '2025-06-01T10:00:00Z',
      });
    });

    it('uses guest_name as invited nombre when invited is null', async () => {
      const schedule = { ...BASE_SCHEDULE, invited: null, guest_name: 'Pedro Externo' };
      mockAgendados.mockResolvedValue({ data: [schedule] } as any);

      const result = await fetchPartidosAgendados();

      expect(result[0].invited.nombre).toBe('Pedro Externo');
      expect(result[0].invited.id).toBe(0);
    });

    it('falls back to "Invitado externo" when invited is null and no guest_name', async () => {
      const schedule = { ...BASE_SCHEDULE, invited: null, guest_name: null };
      mockAgendados.mockResolvedValue({ data: [schedule] } as any);

      const result = await fetchPartidosAgendados();

      expect(result[0].invited.nombre).toBe('Invitado externo');
    });
  });

  describe('fetchInvitacionesJugadores', () => {
    const BASE_ITEM = {
      id_match: 'inv-001',
      entrenador: PLAYER,
      local_player: PLAYER,
      invited: PLAYER,
      guest_name: null,
      location: 'Valpo',
      surface: 'Hard' as const,
      best_of: 1 as const,
      match_state: 'PENDIENTE' as const,
      scheduled_at: '2025-06-01T10:00:00Z',
      score: null,
      created_at: '2025-05-01T00:00:00Z',
      updated_at: '2025-05-01T00:00:00Z',
    };

    it('filters out matches with state FINALIZADA', async () => {
      const items = [
        { ...BASE_ITEM, id_match: 'inv-001', match_state: 'PENDIENTE' as const },
        { ...BASE_ITEM, id_match: 'inv-002', match_state: 'FINALIZADA' as const },
        { ...BASE_ITEM, id_match: 'inv-003', match_state: 'INICIADO' as const },
      ];
      mockInvitaciones.mockResolvedValue({ data: items } as any);

      const result = await fetchInvitacionesJugadores();

      expect(result.map(r => r.id_match)).toEqual(['inv-001', 'inv-003']);
    });

    it('returns empty array when all matches are FINALIZADA', async () => {
      mockInvitaciones.mockResolvedValue({
        data: [{ ...BASE_ITEM, match_state: 'FINALIZADA' as const }],
      } as any);

      const result = await fetchInvitacionesJugadores();

      expect(result).toEqual([]);
    });
  });

  describe('acceptarInvitacionJugador', () => {
    it('calls aceptarInvitacionPartido with the given uuid', async () => {
      mockAceptar.mockResolvedValue({} as any);

      await acceptarInvitacionJugador('match-xyz');

      expect(mockAceptar).toHaveBeenCalledWith('match-xyz');
    });
  });
});
