from django.db import models

# Create your models here.

class Partido(models.Model):
    par_id = models.AutoField(primary_key=True)
    par_fecha = models.DateTimeField()
    par_ganador = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE, related_name='partidos_ganador')

    class Meta:
        db_table = 'partidos'

class PartidoRol(models.Model):
    par_rol_id = models.AutoField(primary_key=True)
    par_rol_partido = models.TextField(max_length=100)

    class Meta:
        db_table = 'partido_roles'

class PartidoUsuario(models.Model):
    paus_id = models.AutoField(primary_key=True)
    paus_partido = models.ForeignKey(Partido, on_delete=models.CASCADE)
    paus_usuario = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    paus_rol = models.ForeignKey(PartidoRol, on_delete=models.CASCADE)

    class Meta:
        db_table = 'partido_usuario'
        unique_together = ('paus_partido', 'paus_usuario')

class Set(models.Model):
    set_id = models.AutoField(primary_key=True)
    set_partido = models.ForeignKey(Partido, on_delete=models.CASCADE)
    set_numero = models.IntegerField()

    class Meta:
        db_table = 'sets'
        unique_together = ('set_partido', 'set_numero')

class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    game_set = models.ForeignKey(Set, on_delete=models.CASCADE)
    game_numero = models.IntegerField()

    class Meta:
        db_table = 'games'
        unique_together = ('game_set', 'game_numero')

class Punto(models.Model):
    punto_id = models.AutoField(primary_key=True)
    punto_game = models.ForeignKey(Game, on_delete=models.CASCADE)
    punto_usuario = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    punto_tiempo = models.TimeField(auto_now_add=True)
    punto_numero = models.IntegerField()

    class Meta:
        db_table = 'puntos'
        unique_together = ('punto_game', 'punto_usuario', 'punto_numero')