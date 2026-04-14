from django.db import models

# Create your models here.

class Torneos(models.Model):
    tor_id = models.BigAutoField(primary_key=True)
    tor_nombre = models.TextField(max_length=100)
    tor_descripcion = models.TextField(max_length=200, blank=True, null=True)
    tor_fecha_inicio = models.DateTimeField()
    tor_fecha_fin = models.DateTimeField()
    tor_fecha_creacion = models.DateTimeField(auto_now_add=True)
    tor_fecha_modificacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'torneos'

class Inscripciones(models.Model):
    ins_id = models.BigAutoField(primary_key=True)
    ins_usuario = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    ins_torneo = models.ForeignKey(Torneos, on_delete=models.CASCADE)
    ins_fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inscripciones'
        unique_together = ('ins_usuario', 'ins_torneo')

class Ranking(models.Model):
    rank_id = models.BigAutoField(primary_key=True)
    rank_nombre = models.TextField(max_length=100)
    rank_descripcion = models.TextField(max_length=200, blank=True, null=True)
    rank_torneo = models.ForeignKey(Torneos, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'ranking'
        unique_together = ('rank_nombre', 'rank_torneo')

class RankingUsuario(models.Model):
    raus_id = models.BigAutoField(primary_key=True)
    raus_usuario = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    raus_ranking = models.ForeignKey(Ranking, on_delete=models.CASCADE)
    raus_puntos = models.IntegerField(default=0)

    class Meta:
        db_table = 'ranking_usuario'
        unique_together = ('raus_usuario', 'raus_ranking')

