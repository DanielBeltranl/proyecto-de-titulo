import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../../../services/usuarioService', () => ({
  obtenerSolicitudesRecibidas: vi.fn(),
  aceptarSolicitudCoaching: vi.fn(),
  rechazarSolicitudCoaching: vi.fn(),
}));

vi.mock('../../components/background/Background', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import VistaSolicitudes from './VistaSolicitudes';
import {
  obtenerSolicitudesRecibidas,
  aceptarSolicitudCoaching,
  rechazarSolicitudCoaching,
} from '../../../../../services/usuarioService';

const mockObtener = vi.mocked(obtenerSolicitudesRecibidas);
const mockAceptar = vi.mocked(aceptarSolicitudCoaching);
const mockRechazar = vi.mocked(rechazarSolicitudCoaching);

const makeSolicitud = (id: number, nombre = 'Ana') => ({
  id,
  jugador: { id, nombre, apellidoPaterno: 'Lopez', apellidoMaterno: 'G', correo: `${nombre}@a.cl` },
  entrenador: { id: 99, nombre: 'Coach', apellidoPaterno: 'X', apellidoMaterno: '', correo: 'c@c.cl' },
  status: 'PENDIENTE' as const,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
});

beforeEach(() => {
  vi.resetAllMocks();
  mockAceptar.mockResolvedValue({} as any);
  mockRechazar.mockResolvedValue({} as any);
});

describe('VistaSolicitudes — selección de nivel', () => {
  it('defaults nivel to "Amateur" for each solicitud', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('Amateur');
  });

  it('shows all three level options in the select', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
    const options = screen.getAllByRole('option').map(o => (o as HTMLOptionElement).value);
    expect(options).toEqual(['Amateur', 'Semi-Pro', 'Profesional']);
  });

  it('updates the selected nivel when the user changes it', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Profesional' } });
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('Profesional');
  });

  it('calls aceptarSolicitudCoaching with the selected nivel', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Semi-Pro' } });
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() =>
      expect(mockAceptar).toHaveBeenCalledWith(1, 'Semi-Pro'),
    );
  });

  it('uses "Amateur" as default when accepting without changing nivel', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByText('Aceptar')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() =>
      expect(mockAceptar).toHaveBeenCalledWith(1, 'Amateur'),
    );
  });

  it('keeps nivel selection independent between two solicitudes', async () => {
    mockObtener.mockResolvedValue({
      data: [makeSolicitud(1, 'Ana'), makeSolicitud(2, 'Carlos')],
    } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getAllByRole('combobox')).toHaveLength(2));
    const [select1, select2] = screen.getAllByRole('combobox');

    fireEvent.change(select1, { target: { value: 'Profesional' } });

    expect((select1 as HTMLSelectElement).value).toBe('Profesional');
    expect((select2 as HTMLSelectElement).value).toBe('Amateur'); // unchanged
  });

  it('disables the select while processing that solicitud', async () => {
    mockAceptar.mockReturnValue(new Promise(() => {})); // never resolves
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByText('Aceptar')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() =>
      expect(screen.getByRole('combobox')).toBeDisabled(),
    );
  });

  it('removes the solicitud from the list after accepting', async () => {
    mockObtener.mockResolvedValue({ data: [makeSolicitud(1)] } as any);

    render(<VistaSolicitudes />);

    await waitFor(() => expect(screen.getByText('Aceptar')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() =>
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument(),
    );
  });
});
