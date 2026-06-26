import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaJugador from './VistaJugador';

// ── Mocks ─────────────────────────────────────────────────────────────────

vi.mock('../../../../../services/usuarioService', () => ({
  obtenerResumenPartidos: vi.fn(),
}));

vi.mock('../../components/userInfo/Jugador/UserInfo', () => ({
  default: () => <div data-testid="user-info" />,
}));

vi.mock('../../components/statsComponents/StatsCTA', () => ({
  default: () => <div data-testid="stats-cta" />,
}));

vi.mock('../../components/background/Background', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../components/matchResult/MatchResult', () => ({
  default: () => <div data-testid="match-result" />,
}));

vi.mock('../../components/matchistory/MatchHistory', () => ({
  default: () => <div data-testid="match-history" />,
}));

import { obtenerResumenPartidos } from '../../../../../services/usuarioService';
const mockObtenerResumen = vi.mocked(obtenerResumenPartidos);

import React from 'react';

// ── Fixture ───────────────────────────────────────────────────────────────

const MATCH_FIXTURE = {
  id_match: 'match-001',
  local_player: { id: 1, nombre: 'Carlos', apellidoPaterno: 'Ruiz', correo: 'c@c.cl' },
  invited: null,
  guest_name: 'Rival',
  location: 'Santiago',
  surface: 'Clay',
  best_of: 3,
  match_state: 'FINALIZADA',
  winner: { id: 1, nombre: 'Carlos', apellidoPaterno: 'Ruiz', correo: 'c@c.cl' },
  duration: 3600,
  sets: [{ score_p1: 6, score_p2: 3, games: [] }],
  created_at: '2024-01-01T00:00:00Z',
};

const renderComponent = () =>
  render(
    <MemoryRouter>
      <VistaJugador />
    </MemoryRouter>,
  );

// ── Tests ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockObtenerResumen.mockReset();
});

describe('VistaJugador', () => {
  it('shows empty message when there are no matches', async () => {
    mockObtenerResumen.mockResolvedValue({ data: [] } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No hay partidos registrados aún.')).toBeInTheDocument();
    });
  });

  it('renders MatchResult when there is at least one match', async () => {
    mockObtenerResumen.mockResolvedValue({ data: [MATCH_FIXTURE] } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('match-result')).toBeInTheDocument();
    });
  });

  it('always renders UserInfo and StatsCTA regardless of matches', async () => {
    mockObtenerResumen.mockResolvedValue({ data: [] } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
      expect(screen.getByTestId('stats-cta')).toBeInTheDocument();
    });
  });

  it('renders MatchHistory with all matches', async () => {
    const matches = [MATCH_FIXTURE, { ...MATCH_FIXTURE, id_match: 'match-002' }];
    mockObtenerResumen.mockResolvedValue({ data: matches } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('match-history')).toBeInTheDocument();
    });
  });
});
