import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import LevelModal from './LevelModal';

const onConfirm = vi.fn();
const onClose = vi.fn();

const renderOpen = (jugadorNombre = 'Ana Lopez') =>
  render(
    <LevelModal
      isOpen={true}
      jugadorNombre={jugadorNombre}
      onConfirm={onConfirm}
      onClose={onClose}
    />,
  );

beforeEach(() => {
  onConfirm.mockReset();
  onClose.mockReset();
});

describe('LevelModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <LevelModal isOpen={false} jugadorNombre="Ana" onConfirm={onConfirm} onClose={onClose} />,
    );
    expect(screen.queryByText('Elige el nivel de tu jugador')).not.toBeInTheDocument();
  });

  it('shows the three level options when open', () => {
    renderOpen();
    expect(screen.getByText('Amateur')).toBeInTheDocument();
    expect(screen.getByText('Semi-Pro')).toBeInTheDocument();
    expect(screen.getByText('Profesional')).toBeInTheDocument();
  });

  it('shows the player name in the subtitle', () => {
    renderOpen('Carlos Ruiz');
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
  });

  it('moves to confirmation screen when a level is selected', () => {
    renderOpen('Ana Lopez');
    fireEvent.click(screen.getAllByText('Elegir')[0]); // Amateur
    expect(screen.getByText('¿Confirmar nivel?')).toBeInTheDocument();
  });

  it('shows the selected level in the confirmation', () => {
    renderOpen('Ana Lopez');
    fireEvent.click(screen.getAllByText('Elegir')[1]); // Semi-Pro
    expect(screen.getByText('Semi-Pro')).toBeInTheDocument();
  });

  it('calls onConfirm with the selected level when confirmed', async () => {
    onConfirm.mockResolvedValue(undefined);
    renderOpen();
    fireEvent.click(screen.getAllByText('Elegir')[2]); // Profesional
    fireEvent.click(screen.getByText('Confirmar'));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('Profesional'));
  });

  it('goes back to options when "Volver" is clicked', () => {
    renderOpen();
    fireEvent.click(screen.getAllByText('Elegir')[0]);
    fireEvent.click(screen.getByText('Volver'));
    expect(screen.getByText('Elige el nivel de tu jugador')).toBeInTheDocument();
  });

  it('calls onClose when "Cancelar" is clicked', () => {
    renderOpen();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
