from django.db import models

# Create your models here.
class Usuario(models.Model):
    usu_id = models.BigAutoField(primary_key=True)
    usu_nombres = models.TextField(max_length=100)
    usu_apellidos = models.TextField(max_length=100)
    usu_email = models.EmailField(max_length=100, unique=True)
    usu_contrasena = models.CharField(max_length=128)
    usu_fecha_nacimiento = models.DateTimeField()
    usu_imagen_perfil = models.URLField(max_length=200, blank=True, null=True)
    usu_fecha_creacion = models.DateTimeField(auto_now_add=True)
    usu_fecha_modificacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'usuarios'

class TipoRelacion(models.Model):
    tr_id = models.BigAutoField(primary_key=True)
    tr_nombre = models.TextField(max_length=50)
    tr_descripcion = models.TextField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'tipos_relacion'

class Relacion(models.Model):
    rel_id = models.BigAutoField(primary_key=True)
    rel_usuario1 = models.ForeignKey(Usuario, related_name='relaciones_usuario1', on_delete=models.CASCADE)
    rel_usuario2 = models.ForeignKey(Usuario, related_name='relaciones_usuario2', on_delete=models.CASCADE)
    rel_tipo = models.ForeignKey(TipoRelacion, on_delete=models.CASCADE)
    rel_fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'relaciones'
        unique_together = ('rel_usuario1', 'rel_usuario2', 'rel_tipo')

