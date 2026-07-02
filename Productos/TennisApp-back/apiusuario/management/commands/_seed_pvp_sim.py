"""Probabilistic point-by-point simulator para partidos jugador-vs-jugador.

A diferencia de GuestMatchSimulator (_seed_demo_sim.py), acá ambos jugadores
son Usuario reales. Sigue la convencion de partidos reales usada en
matches/views.py RegisterPointView (~470-620), no la de partidos con
invitado:

- id_player_1 siempre es el creador del partido (match.id_local_player),
  id_player_2 siempre es el jugador invitado (match.id_invited_player) —
  fijo en cada MatchPoint, sin importar quien sirve.
- is_serving (MatchGame/MatchPoint) es el Usuario real que sirve ese punto.
- guest_is_serving siempre es None (campo exclusivo de partidos con invitado).
- La rotacion de saque usa get_next_server/get_tiebreak_server de
  matches/services.py con los IDs reales de ambos jugadores.
"""
import random
from datetime import timedelta

from matches.services import (
    advance_score,
    advance_tiebreak_score,
    get_next_server,
    get_tiebreak_server,
    is_break_point,
    is_break_point_chance,
    is_match_over,
    is_match_point_chance,
    is_set_over,
)


def _point_duration(rng, surface):
    if surface == 'Clay':
        return rng.randint(8, 55)
    return rng.randint(6, 45)


class RealMatchSimulator:
    """Simula un partido finalizado entre dos jugadores reales (creador e invitado)."""

    def __init__(self, creator, invited, surface, best_of, scheduled_at, models):
        self.creator = creator
        self.invited = invited
        self.surface = surface
        self.best_of = best_of
        self.scheduled_at = scheduled_at
        self.models = models  # modulo: matches.models

        self.rng = random.Random(f'{creator.correo}:{invited.correo}')
        self.p_win_own_serve = {
            creator.id: 0.62 + self.rng.uniform(-0.05, 0.05),
            invited.id: 0.62 + self.rng.uniform(-0.05, 0.05),
        }

        self._elapsed_seconds = 0
        self._all_points = []  # instancias MatchPoint en memoria a la espera de fix-up de timestamp

    def _next_timestamp(self, duration):
        ts = self.scheduled_at + timedelta(seconds=self._elapsed_seconds)
        self._elapsed_seconds += duration
        return ts

    def _roll_point_winner(self, server_id):
        p_win = self.p_win_own_serve[server_id]
        server_wins = self.rng.random() < p_win
        return server_id if server_wins else (
            self.invited.id if server_id == self.creator.id else self.creator.id
        )

    def simulate(self, match_score):
        MatchSet = self.models.MatchSet

        sets_p1 = 0
        sets_p2 = 0
        total_duration = 0
        next_server_id = self.creator.id  # el creador sirve el primer game

        while True:
            current_set = MatchSet.objects.create(id_match_score=match_score, duration=0)
            set_duration, creator_wins_set, next_server_id = self._simulate_set(
                current_set, next_server_id, sets_p1, sets_p2
            )
            current_set.duration = set_duration
            current_set.winner_id = self.creator if creator_wins_set else self.invited
            current_set.save()

            total_duration += set_duration
            if creator_wins_set:
                sets_p1 += 1
            else:
                sets_p2 += 1

            match_over, p1_wins = is_match_over(sets_p1, sets_p2, self.best_of)
            if match_over:
                self._backdate_points()
                return total_duration, p1_wins

    def _simulate_set(self, current_set, next_server_id, sets_p1, sets_p2):
        MatchGame = self.models.MatchGame

        games_p1 = 0
        games_p2 = 0
        set_duration = 0

        while True:
            over, p1_wins_set, tiebreak_needed = is_set_over(games_p1, games_p2)
            if over:
                current_set.score_p1 = games_p1
                current_set.score_p2 = games_p2
                return set_duration, p1_wins_set, next_server_id
            if tiebreak_needed:
                server = self.creator if next_server_id == self.creator.id else self.invited
                game = MatchGame.objects.create(
                    id_set=current_set, is_serving=server,
                    guest_is_serving=None, is_tiebreak=True,
                )
                game_duration, creator_wins_game, next_server_id = self._simulate_tiebreak_game(
                    game, next_server_id, sets_p1, sets_p2
                )
                set_duration += game_duration
                if creator_wins_game:
                    games_p1 += 1
                else:
                    games_p2 += 1
                game.p1_game_final_score = games_p1
                game.p2_game_final_score = games_p2
                game.save(update_fields=['p1_game_final_score', 'p2_game_final_score'])
                continue

            server = self.creator if next_server_id == self.creator.id else self.invited
            game = MatchGame.objects.create(
                id_set=current_set, is_serving=server,
                guest_is_serving=None, is_tiebreak=False,
            )
            game_duration, creator_wins_game, next_server_id = self._simulate_regular_game(
                game, next_server_id, games_p1, games_p2, sets_p1, sets_p2
            )
            set_duration += game_duration
            if creator_wins_game:
                games_p1 += 1
            else:
                games_p2 += 1
            game.p1_game_final_score = games_p1
            game.p2_game_final_score = games_p2
            game.save(update_fields=['p1_game_final_score', 'p2_game_final_score'])

    def _simulate_regular_game(self, game, server_id, games_p1, games_p2, sets_p1, sets_p2):
        MatchPoint = self.models.MatchPoint

        score_p1 = '0'
        score_p2 = '0'
        game_duration = 0

        while True:
            mp_p1 = is_match_point_chance(score_p1, score_p2, games_p1, games_p2, sets_p1, self.best_of, False)
            mp_p2 = is_match_point_chance(score_p2, score_p1, games_p2, games_p1, sets_p2, self.best_of, False)

            point_winner_id = self._roll_point_winner(server_id)
            creator_wins_point = (point_winner_id == self.creator.id)
            duration = _point_duration(self.rng, self.surface)
            game_duration += duration

            if creator_wins_point:
                new_p1, new_p2, game_over = advance_score(score_p1, score_p2)
            else:
                new_p2, new_p1, game_over = advance_score(score_p2, score_p1)

            server_is_creator = (server_id == self.creator.id)
            score_server   = score_p1 if server_is_creator else score_p2
            score_receiver = score_p2 if server_is_creator else score_p1
            receiver_won   = (creator_wins_point != server_is_creator)

            bp_chance = is_break_point_chance(score_server, score_receiver)
            bp        = is_break_point(score_server, score_receiver, receiver_won)

            winner = self.creator if creator_wins_point else self.invited
            server = self.creator if server_is_creator else self.invited
            point = MatchPoint(
                id_game=game,
                is_serving=server,
                id_player_1=self.creator,
                id_player_2=self.invited,
                winner_id=winner,
                score_p1=new_p1,
                score_p2=new_p2,
                duration=duration,
                break_point_chance=bp_chance,
                break_point=bp,
                match_point_p1=mp_p1,
                match_point_p2=mp_p2,
            )
            self._all_points.append((point, duration))

            score_p1, score_p2 = new_p1, new_p2

            if game_over:
                game.winner_id = winner
                game.duration = game_duration
                game.is_break = (server_id != point_winner_id)
                game.save()
                next_server_id = get_next_server(server_id, self.creator.id, self.invited.id)
                return game_duration, creator_wins_point, next_server_id

    def _simulate_tiebreak_game(self, game, initial_server_id, sets_p1, sets_p2):
        MatchPoint = self.models.MatchPoint

        other_server_id = self.invited.id if initial_server_id == self.creator.id else self.creator.id
        score_p1 = '0'
        score_p2 = '0'
        game_duration = 0
        point_index = 0

        while True:
            mp_p1 = is_match_point_chance(score_p1, score_p2, 6, 6, sets_p1, self.best_of, True)
            mp_p2 = is_match_point_chance(score_p2, score_p1, 6, 6, sets_p2, self.best_of, True)

            server_id = get_tiebreak_server(initial_server_id, other_server_id, point_index)
            point_winner_id = self._roll_point_winner(server_id)
            creator_wins_point = (point_winner_id == self.creator.id)
            duration = _point_duration(self.rng, self.surface)
            game_duration += duration

            if creator_wins_point:
                new_p1, new_p2, game_over = advance_tiebreak_score(score_p1, score_p2)
            else:
                new_p2, new_p1, game_over = advance_tiebreak_score(score_p2, score_p1)

            winner = self.creator if creator_wins_point else self.invited
            server = self.creator if server_id == self.creator.id else self.invited
            point = MatchPoint(
                id_game=game,
                is_serving=server,
                id_player_1=self.creator,
                id_player_2=self.invited,
                winner_id=winner,
                score_p1=new_p1,
                score_p2=new_p2,
                duration=duration,
                break_point_chance=False,
                break_point=False,
                match_point_p1=mp_p1,
                match_point_p2=mp_p2,
            )
            self._all_points.append((point, duration))

            score_p1, score_p2 = new_p1, new_p2
            point_index += 1

            if game_over:
                game.winner_id = winner
                game.duration = game_duration
                game.is_break = None
                game.save()
                next_server_id = get_next_server(initial_server_id, self.creator.id, self.invited.id)
                return game_duration, creator_wins_point, next_server_id

    def _backdate_points(self):
        """Persiste los puntos y despues corrige created_at (bypass de auto_now_add).

        MatchPoint.created_at es auto_now_add=True, asi que Django fuerza
        timezone.now() en el INSERT sin importar lo que se pase a bulk_create.
        Se hace bulk_create primero, y despues bulk_update de created_at con un
        UPDATE plano — bulk_update no vuelve a disparar auto_now_add.
        """
        MatchPoint = self.models.MatchPoint

        points = [p for p, _duration in self._all_points]
        durations = [d for _p, d in self._all_points]

        MatchPoint.objects.bulk_create(points)

        elapsed = 0
        for point, duration in zip(points, durations):
            point.created_at = self.scheduled_at + timedelta(seconds=elapsed)
            elapsed += duration

        MatchPoint.objects.bulk_update(points, ['created_at'])
