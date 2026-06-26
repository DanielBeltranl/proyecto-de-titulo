import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../../../services/usuarioService', () => ({
  agendarPartido: vi.fn(),
  obtenerJugadoresDelEntrenador: vi.fn(),
  buscarJugadorPorNombre: vi.fn(),
}));

import {
  scheduleMatch,
  fetchJugadoresDelEntrenador,
  buscarJugadorExterno,
} from './agendamientoModel';

import {
  agendarPartido,
  obtenerJugadoresDelEntrenador,
  buscarJugadorPorNombre,
} from '../../../../../../services/usuarioService';

const mockAgendar = vi.mocked(agendarPartido);
const mockObtenerJugadores = vi.mocked(obtenerJugadoresDelEntrenador);
const mockBuscar = vi.mocked(buscarJugadorPorNombre);

beforeEach(() => {
  mockAgendar.mockReset();
  mockObtenerJugadores.mockReset();
  mockBuscar.mockReset();
});

describe('agendamientoModel', () => {
  describe('fetchJugadoresDelEntrenador', () => {
    it('maps nombre + apellidoPaterno into a single string', async () => {
      mockObtenerJugadores.mockResolvedValue({
        data: [{ id: 1, nombre: 'Ana', apellidoPaterno: 'Lopez', apellidoMaterno: '', correo: '', nivelUsuario: 'PRO' }],
      } as any);

      const result = await fetchJugadoresDelEntrenador();

      expect(result[0].nombre).toBe('Ana Lopez');
    });

    it('maps nivelUsuario to nivel', async () => {
      mockObtenerJugadores.mockResolvedValue({
        data: [{ id: 2, nombre: 'Carlos', apellidoPaterno: 'Ruiz', apellidoMaterno: '', correo: '', nivelUsuario: 'AMATEUR' }],
      } as any);

      const result = await fetchJugadoresDelEntrenador();

      expect(result[0].nivel).toBe('AMATEUR');
    });

    it('returns empty array when API returns no players', async () => {
      mockObtenerJugadores.mockResolvedValue({ data: [] } as any);

      const result = await fetchJugadoresDelEntrenador();

      expect(result).toEqual([]);
    });
  });

  describe('scheduleMatch', () => {
    it('returns the response data from agendarPartido', async () => {
      const responseData = { message: 'Partido agendado', error: null };
      mockAgendar.mockResolvedValue({ data: responseData } as any);

      const result = await scheduleMatch({
        id_local_player: 1,
        id_invited_player: null,
        guest_name: 'Invitado',
        location: 'Santiago',
        surface: 'Clay',
        best_of: 3,
        scheduled_at: '2025-06-01T10:00:00Z',
      });

      expect(result).toEqual(responseData);
    });
  });

  describe('buscarJugadorExterno', () => {
    it('returns data from API without transformation', async () => {
      const players = [{ id: 5, nombre: 'Pedro', apellidoPaterno: 'Vega', entrenador_nombre: null }];
      mockBuscar.mockResolvedValue({ data: players } as any);

      const result = await buscarJugadorExterno('Pedro');

      expect(result).toEqual(players);
    });
  });
});
