from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apiusuario.models import Usuario
from matches import models as matches_models
from matches.models import BestOf, MatchData, MatchScore, MatchState

from ._seed_demo_data import LOCATIONS, PLAYERS, SURFACES
from ._seed_pvp_sim import RealMatchSimulator

# Empareja a los 10 jugadores sembrados por seed_demo en 5 partidos
# jugador-vs-jugador (no vs invitado). Requiere que seed_demo ya haya corrido.
PAIRS = [(0, 1), (2, 3), (4, 5), (6, 7), (8, 9)]


class Command(BaseCommand):
    help = (
        'Crea 5 partidos jugador-vs-jugador finalizados entre los jugadores '
        'sembrados por seed_demo. Idempotente — requiere correr seed_demo antes.'
    )

    def handle(self, *args, **kwargs):
        try:
            players = [Usuario.objects.get(correo=PLAYERS[i]['correo']) for pair in PAIRS for i in pair]
        except Usuario.DoesNotExist as exc:
            raise CommandError(
                'No se encontraron los jugadores de seed_demo. Corre "python manage.py seed_demo" primero.'
            ) from exc

        first_creator, first_invited = players[0], players[1]
        if MatchData.objects.filter(id_local_player=first_creator, id_invited_player=first_invited).exists():
            self.stdout.write(self.style.WARNING('Partidos PvP ya existen. Skipping.'))
            return

        with transaction.atomic():
            for i, (idx_a, idx_b) in enumerate(PAIRS):
                creator = Usuario.objects.get(correo=PLAYERS[idx_a]['correo'])
                invited = Usuario.objects.get(correo=PLAYERS[idx_b]['correo'])
                self._build_match(creator, invited, i)

        self.stdout.write(self.style.SUCCESS(f'Listo: {len(PAIRS)} partidos jugador-vs-jugador creados.'))

    def _build_match(self, creator, invited, i):
        now = timezone.now()
        surface = SURFACES[i % len(SURFACES)]
        location = LOCATIONS[i % len(LOCATIONS)]
        scheduled_at = now - timedelta(days=13 - i, hours=i + 1)

        match = MatchData.objects.create(
            id_local_player=creator,
            id_invited_player=invited,
            id_entrenador=None,
            guest_name=None,
            location=location,
            surface=surface,
            best_of=BestOf.THREE,
            match_state=MatchState.INICIADO,
            scheduled_at=scheduled_at,
        )

        match_score = MatchScore.objects.create(id_partido=match)

        simulator = RealMatchSimulator(
            creator=creator,
            invited=invited,
            surface=surface,
            best_of=BestOf.THREE,
            scheduled_at=scheduled_at,
            models=matches_models,
        )
        total_duration, creator_wins_match = simulator.simulate(match_score)

        match_score.winner_id = creator if creator_wins_match else invited
        match_score.duration = total_duration
        match_score.save()

        match.id_match_score = match_score
        match.match_state = MatchState.FINALIZADA
        match.save()
