import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaEntrenador from './VistaEntrenador';
import React from 'react';

// ── Mocks ─────────────────────────────────────────────────────────────────

vi.mock('../../../../../services/usuarioService', () => ({
  obtenerDashboardEntrenador: vi.fn(),
}));

vi.mock('../../components/background/Background', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./FeaturedMatch', () => ({
  default: () => <div data-testid="featured-match" />,
}));

vi.mock('./MatchCard', () => ({
  default: ({ partido }: { partido: { id_match: string } }) => (
    <div data-testid={`match-card-${partido.id_match}`} />
  ),
}));

import { obtenerDashboardEntrenador } from '../../../../../services/usuarioService';
const mockDashboard = vi.mocked(obtenerDashboardEntrenador);

// ── Helpers ───────────────────────────────────────────────────────────────

const makePartido = (id: string) => ({
  id_match: id,
  jugador: { id: 1, nombre: 'Ana', apellidoPaterno: 'Lopez', nivelUsuario: 'AMATEUR' },
  oponente: { nombre: 'Rival', apellidoPaterno: '', es_invitado: true },
  marcador_global: { jugador: 2, oponente: 1 },
  sets: [],
  duration: 3600,
  location: 'Santiago',
  surface: 'Clay',
  created_at: '2024-01-01T00:00:00Z',
});

const renderComponent = () =>
  render(
    <MemoryRouter>
      <VistaEntrenador />
    </MemoryRouter>,
  );

// ── Tests ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockDashboard.mockReset();
  sessionStorage.clear();
});

describe('VistaEntrenador', () => {
  it('shows loading state before data arrives', () => {
    mockDashboard.mockReturnValue(new Promise(() => {})); // never resolves

    renderComponent();

    expect(screen.getByText('Cargando partidos...')).toBeInTheDocument();
  });

  it('shows empty message when no matches exist', async () => {
    mockDashboard.mockResolvedValue({ data: { partidos: [] } } as any);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Ninguno de tus jugadores ha disputado partidos aún.'),
      ).toBeInTheDocument();
    });
  });

  it('renders FeaturedMatch with the first match', async () => {
    mockDashboard.mockResolvedValue({
      data: { partidos: [makePartido('p-001')] },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('featured-match')).toBeInTheDocument();
    });
  });

  it('renders MatchCards for every match after the first', async () => {
    mockDashboard.mockResolvedValue({
      data: { partidos: [makePartido('p-001'), makePartido('p-002'), makePartido('p-003')] },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('match-card-p-002')).toBeInTheDocument();
      expect(screen.getByTestId('match-card-p-003')).toBeInTheDocument();
    });
  });

  it('shows coach name from sessionStorage', async () => {
    sessionStorage.setItem('usuario', JSON.stringify({ nombre: 'Marcos' }));
    mockDashboard.mockResolvedValue({ data: { partidos: [] } } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Marcos')).toBeInTheDocument();
    });
  });

  it('falls back to "Entrenador" when sessionStorage is empty', async () => {
    mockDashboard.mockResolvedValue({ data: { partidos: [] } } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Entrenador')).toBeInTheDocument();
    });
  });
});
