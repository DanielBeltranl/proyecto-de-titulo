import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Agendamiento.module.css';
import { useAgendamiento } from './controller/useAgendamiento';
import MeetingConfig from './components/meetingConfig/MeetingConfig';
import LocalPlayerSelector from './components/localPlayerSelector/LocalPlayerSelector';
import InvitedPlayerSearch from './components/invitedPlayerSearch/InvitedPlayerSearch';
import ScheduleButton from './components/scheduleButton/ScheduleButton';
import { MatchScheduledModal } from './components/matchScheduledModal/MatchScheduledModal';

const Agendamiento: React.FC = () => {
  const navigate = useNavigate();
  const { form, players, loadingPlayers, submitting, showSuccessModal, setField, setInvited, submit, isValid } = useAgendamiento();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Nueva Sesión</span>
          <h1 className={styles.title}>AGENDAR PARTIDO</h1>
          <div className={styles.divider}></div>
        </header>

        <LocalPlayerSelector
          players={players}
          loading={loadingPlayers}
          selectedId={form.id_local_player}
          onSelect={(id) => setField('id_local_player', id)}
        />

        <div className={styles.grid}>
          <MeetingConfig
            onChange={(data) => {
              setField('best_of', data.best_of);
              setField('location', data.location);
              setField('surface', data.surface);
              setField('scheduled_date', data.scheduled_date);
              setField('scheduled_time', data.scheduled_time);
            }}
          />
          <InvitedPlayerSearch onChange={setInvited} excludeId={form.id_local_player} />
        </div>

        <footer className={styles.footer}>
          <ScheduleButton
            onClick={submit}
            disabled={!isValid}
            loading={submitting}
          />
        </footer>

        <div className={styles.copyright}>
          Double Fault Elite Management System © 2024
        </div>
      </div>

      <MatchScheduledModal
        open={showSuccessModal}
        onConfirm={() => navigate('/partidos')}
      />
    </main>
  );
};

export default Agendamiento;
