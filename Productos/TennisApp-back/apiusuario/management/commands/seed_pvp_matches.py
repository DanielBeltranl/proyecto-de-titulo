from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apiusuario.models import Usuario
from matches import models as matches_models
from matches.models import BestOf, MatchData, MatchScore, MatchState

from ._seed_demo_data import GUEST_NAMES, LOCATIONS, PLAYERS, SURFACES
from ._seed_demo_sim import GuestMatchSimulator
from ._seed_pvp_sim import RealMatchSimulator

# PLAYERS está ordenado en bloques de 5 por entrenador: [0:5]=Carlos, [5:10]=María,
# [10:15]=Rodrigo. Dentro de cada bloque se arman 2 parejas PvP (4 jugadores) y
# queda 1 jugador sobrante por entrenador. De los 3 sobrantes (4, 9, 14), dos se
# emparejan entre sí (PvP cruzado entre entrenadores) y el que queda solo (14)
# recibe un segundo partido vs invitado en vez de PvP.
PAIRS = [(0, 1), (2, 3), (5, 6), (7, 8), (10, 11), (12, 13), (4, 9)]
SECOND_GUEST_PLAYER_IDX = 14


class Command(BaseCommand):
    help = (
        'Crea partidos jugador-vs-jugador finalizados entre los jugadores sembrados '
        'por seed_demo, más un segundo partido vs invitado para el jugador que queda '
        'sin pareja PvP. Idempotente — requiere correr seed_demo antes.'
    )

    def handle(self, *args, **kwargs):
        try:
            players = [Usuario.objects.get(correo=PLAYERS[i]['correo']) for pair in PAIRS for i in pair]
            second_guest_player = Usuario.objects.get(correo=PLAYERS[SECOND_GUEST_PLAYER_IDX]['correo'])
        except Usuario.DoesNotExist as exc:
            raise CommandError(
                'No se encontraron los jugadores de seed_demo. Corre "python manage.py seed_demo" primero.'
            ) from exc

        first_creator, first_invited = players[0], players[1]
        pvp_ya_existe = MatchData.objects.filter(
            id_local_player=first_creator, id_invited_player=first_invited
        ).exists()
        segundo_guest_ya_existe = MatchData.objects.filter(
            id_local_player=second_guest_player, id_invited_player__isnull=True
        ).count() >= 2

        if pvp_ya_existe and segundo_guest_ya_existe:
            self.stdout.write(self.style.WARNING('Partidos PvP ya existen. Skipping.'))
            return

        with transaction.atomic():
            if not pvp_ya_existe:
                for i, (idx_a, idx_b) in enumerate(PAIRS):
                    creator = Usuario.objects.get(correo=PLAYERS[idx_a]['correo'])
                    invited = Usuario.objects.get(correo=PLAYERS[idx_b]['correo'])
                    self._build_pvp_match(creator, invited, i)

            if not segundo_guest_ya_existe:
                self._build_second_guest_match(second_guest_player)

        self.stdout.write(self.style.SUCCESS(
            f'Listo: {len(PAIRS)} partidos jugador-vs-jugador y 1 segundo partido vs invitado.'
        ))

    def _build_pvp_match(self, creator, invited, i):
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

    def _build_second_guest_match(self, player):
        now = timezone.now()
        surface = SURFACES[SECOND_GUEST_PLAYER_IDX % len(SURFACES)]
        location = LOCATIONS[SECOND_GUEST_PLAYER_IDX % len(LOCATIONS)]
        guest_name = GUEST_NAMES[(SECOND_GUEST_PLAYER_IDX + 1) % len(GUEST_NAMES)]
        # scheduled_at distinto al del primer partido vs invitado (seed_demo) para no chocar.
        scheduled_at = now - timedelta(days=1, hours=SECOND_GUEST_PLAYER_IDX)

        match = MatchData.objects.create(
            id_local_player=player,
            id_invited_player=None,
            id_entrenador=player.entrenador,
            guest_name=guest_name,
            location=location,
            surface=surface,
            best_of=BestOf.THREE,
            match_state=MatchState.INICIADO,
            scheduled_at=scheduled_at,
        )

        match_score = MatchScore.objects.create(id_partido=match)

        simulator = GuestMatchSimulator(
            player=player,
            surface=surface,
            best_of=BestOf.THREE,
            scheduled_at=scheduled_at,
            models=matches_models,
        )
        total_duration, player_wins_match = simulator.simulate(match_score)

        match_score.winner_id = player if player_wins_match else None
        match_score.duration = total_duration
        match_score.save()

        match.id_match_score = match_score
        match.match_state = MatchState.FINALIZADA
        match.save()
