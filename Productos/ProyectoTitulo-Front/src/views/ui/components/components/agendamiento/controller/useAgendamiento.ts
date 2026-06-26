import { useState, useEffect } from 'react';
import { scheduleMatch, fetchJugadoresDelEntrenador } from '../model/agendamientoModel';
import type { Surface, BestOf, FriendOption, ScheduleMatchPayload, InvitedPlayerData } from '../model/agendamientoModel';

interface FormState {
  id_local_player: number | undefined;
  best_of: BestOf;
  location: string;
  surface: Surface;
  invited: InvitedPlayerData;
  scheduled_date: string;
  scheduled_time: string;
}

export interface UseAgendamientoReturn {
  form: FormState;
  players: FriendOption[];
  loadingPlayers: boolean;
  submitting: boolean;
  showSuccessModal: boolean;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  setInvited: (data: InvitedPlayerData) => void;
  submit: () => Promise<void>;
  isValid: boolean;
}

function buildScheduledAt(date: string, time: string): string {
  return `${date}T${time}:00Z`;
}

function isInvitedValid(invited: InvitedPlayerData): boolean {
  if (invited.type === 'none') return true;
  if (invited.type === 'registered') return !!invited.id_invited_player;
  return !!(invited.guest_name?.trim());
}

function isFutureDateTime(date: string, time: string): boolean {
  if (!date || !time) return false;
  return new Date(`${date}T${time}`) > new Date();
}

export const useAgendamiento = (): UseAgendamientoReturn => {
  const [form, setForm] = useState<FormState>({
    id_local_player: undefined,
    best_of: 3,
    location: '',
    surface: 'Hard',
    invited: { type: 'none' },
    scheduled_date: '',
    scheduled_time: '',
  });
  const [players, setPlayers] = useState<FriendOption[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingPlayers(true);
        const data = await fetchJugadoresDelEntrenador();
        setPlayers(data);
      } catch (err) {
        console.error('[useAgendamiento] error cargando jugadores:', err);
      } finally {
        setLoadingPlayers(false);
      }
    };
    cargar();
  }, []);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setInvited = (data: InvitedPlayerData) => {
    setForm(prev => ({ ...prev, invited: data }));
  };

  const isValid =
    !!form.id_local_player &&
    !!form.location &&
    !!form.scheduled_date &&
    !!form.scheduled_time &&
    isFutureDateTime(form.scheduled_date, form.scheduled_time) &&
    isInvitedValid(form.invited);

  const submit = async () => {
    if (!isValid) return;

    const { invited } = form;
    const payload: ScheduleMatchPayload = {
      id_local_player: form.id_local_player!,
      id_invited_player: invited.type === 'registered' ? (invited.id_invited_player ?? null) : null,
      guest_name: invited.type === 'guest' ? (invited.guest_name?.trim() ?? null) : null,
      location: form.location,
      surface: form.surface,
      best_of: form.best_of,
      scheduled_at: buildScheduledAt(form.scheduled_date, form.scheduled_time),
    };

    try {
      setSubmitting(true);
      console.log('[useAgendamiento] payload enviado:', payload);
      const result = await scheduleMatch(payload);
      console.log('[useAgendamiento] respuesta:', result);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('[useAgendamiento] error al agendar:', err);
      const errData = err.response?.data;
      const msg =
        errData?.error ||
        errData?.non_field_errors?.[0] ||
        errData?.detail ||
        'Error al agendar el partido';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { form, players, loadingPlayers, submitting, showSuccessModal, setField, setInvited, submit, isValid };
};
