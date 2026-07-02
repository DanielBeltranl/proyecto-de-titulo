from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from apiusuario.models import QRLoginToken, Usuario

COACH_EMAILS = [
    'coach.carlos@tennis.app',
    'coach.maria@tennis.app',
    'coach.rodrigo@tennis.app',
]

QR_TOKEN_LIFETIME = timedelta(days=90)


class Command(BaseCommand):
    help = 'Genera (o reutiliza) tokens de login por QR para los entrenadores designados e imprime sus URLs.'

    def handle(self, *args, **kwargs):
        for correo in COACH_EMAILS:
            try:
                coach = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist as exc:
                raise CommandError(f'No se encontró el entrenador con correo {correo}.') from exc

            qr_token = QRLoginToken.objects.filter(
                usuario=coach, expires_at__gt=timezone.now()
            ).first()
            if qr_token is None:
                qr_token = QRLoginToken.objects.create(
                    usuario=coach, expires_at=timezone.now() + QR_TOKEN_LIFETIME
                )

            nombre_completo = f"{coach.nombre} {coach.apellidoPaterno} {coach.apellidoMaterno}"
            url = f"{settings.FRONTEND_BASE_URL}/qr-login/{qr_token.token}"
            self.stdout.write(f"QR_LOGIN {nombre_completo} {coach.correo} {url}")
