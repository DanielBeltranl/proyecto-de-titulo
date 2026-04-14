# Estos son los atributos que considere para los usuarios

class Ususarios(models.Model):
    usu_id = models.AutoField(primary_key=True)
    usu_nombre = models.CharField(max_length=50)
    usu_apellido = models.CharField(max_length=50)
    usu_email = models.EmailField(max_length=100, unique=True)
    usu_contraseña = models.CharField(max_length=100)
    usu_imagen = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.usu_nombre} {self.usu_apellido}"
    

# La tabla de tipo de relación sirve para declarar amistades, bloqueos y otras si es que salen

class TipoRelacion(models.Model):
    tre_id = models.AutoField(primary_key=True)
    tre_nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.tre_nombre
    
class Relacion(models.Model):
    rel_usuario1 = models.ForeignKey(Ususarios, on_delete=models.CASCADE, related_name='rel_usuario1')
    rel_usuario2 = models.ForeignKey(Ususarios, on_delete=models.CASCADE, related_name='rel_usuario2')
    rel_tipo = models.ForeignKey(TipoRelacion, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.rel_usuario1} - {self.rel_usuario2} - {self.rel_tipo}"


# De aqui en adelante son las tablas de los juegos

class Torneos(models.Model):
    tor_id = models.AutoField(primary_key=True)
    tor_nombre = models.CharField(max_length=100)
    tor_descripcion = models.TextField()

    def __str__(self):
        return self.tor_nombre

class Ranking(models.Model):
    ran_id = models.AutoField(primary_key=True)
    ran_nombre = models.TextField()
    ran_descripcion = models.TextField()
    ran_torneo = models.ForeignKey(Torneos, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.ran_nombre

class RankingUsuario(models.Model):
    rau_usuario = models.ForeignKey(Ususarios, on_delete=models.CASCADE)
    rau_ranking = models.ForeignKey(Ranking, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.rau_usuario} - {self.rau_ranking}"
    

# Las siguientes tablas son las que recopilan los datos de 1 juego, si me equivoque en el orden me corrigen pero tambien avisen porfa para no cagarla más

class Partidos(models.Model):
    par_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.par_id}"
    
class PartidosUsuario(models.Model):
    pau_usuario = models.ForeignKey(Ususarios, on_delete=models.CASCADE)
    pau_partido = models.ForeignKey(Partidos, on_delete=models.CASCADE)
    pau_posicion = models.CharField(max_length=1)

    def __str__(self):
        return f"{self.pau_usuario} - {self.pau_partido}"
    
class Set(models.Model):
    sse_partido = models.ForeignKey(Partidos, on_delete=models.CASCADE)
    sse_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.sse_partido} - {self.sse_id}"

class Juego(models.Model):
    jue_id = models.AutoField(primary_key=True)
    jue_set = models.ForeignKey(Set, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.jue_usuario} - {self.jue_set} - {self.jue_tiempo}"
    
class Puntos(models.Model):
    pun_juego = models.ForeignKey(Juego, on_delete=models.CASCADE)
    pun_usuario = models.ForeignKey(Ususarios, on_delete=models.CASCADE)
    pun_posicion = models.CharField(max_length=1)
    pun_tiempo = models.TimeField()

# De aqui en adelante van las tablas de las estadisticas
# El dani me dijo que mejor no guardar, que se calculen cuando se necesiten, pero igual las dejo por si acaso
#
#
#
#
#
#####################################################################################################

# Fijo sale algo más asi que añadanlo para abajo de esto pero respetando el formato, que los datos no se repitan si se pueden rescatar de otras tablas de relaciones, si tienen dudas porfa pregunten
