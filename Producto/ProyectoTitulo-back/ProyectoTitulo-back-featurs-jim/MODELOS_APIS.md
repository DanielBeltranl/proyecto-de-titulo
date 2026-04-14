# Documentacion de modelos por API

Este archivo resume los modelos definidos en el proyecto, separados por API, con una explicacion breve de cada atributo.

## API: api_competitivo

### Modelo: Torneos
- tor_id: BigAutoField, clave primaria autoincremental del torneo.
- tor_nombre: TextField (max 100), nombre del torneo.
- tor_descripcion: TextField (max 200, opcional), descripcion general del torneo.
- tor_fecha_inicio: DateTimeField, fecha y hora de inicio del torneo.
- tor_fecha_fin: DateTimeField, fecha y hora de termino del torneo.
- tor_fecha_creacion: DateTimeField (auto_now_add), fecha y hora de creacion del registro.
- tor_fecha_modificacion: DateTimeField (auto_now), fecha y hora de ultima modificacion del registro.
- Meta.db_table: tabla `torneos`.

### Modelo: Inscripciones
- ins_id: BigAutoField, clave primaria autoincremental de la inscripcion.
- ins_usuario: ForeignKey a Usuario, usuario inscrito en el torneo.
- ins_torneo: ForeignKey a Torneos, torneo al que pertenece la inscripcion.
- ins_fecha_inscripcion: DateTimeField (auto_now_add), fecha y hora en que se registro la inscripcion.
- Meta.db_table: tabla `inscripciones`.
- Meta.unique_together: combinacion unica de (ins_usuario, ins_torneo), evita inscripciones duplicadas del mismo usuario al mismo torneo.

### Modelo: Ranking
- rank_id: BigAutoField, clave primaria autoincremental del ranking.
- rank_nombre: TextField (max 100), nombre del ranking.
- rank_descripcion: TextField (max 200, opcional), descripcion del ranking.
- rank_torneo: ForeignKey a Torneos (opcional), torneo asociado al ranking.
- Meta.db_table: tabla `ranking`.
- Meta.unique_together: combinacion unica de (rank_nombre, rank_torneo), evita rankings repetidos por torneo.

### Modelo: RankingUsuario
- raus_id: BigAutoField, clave primaria autoincremental de la relacion ranking-usuario.
- raus_usuario: ForeignKey a Usuario, usuario asociado al ranking.
- raus_ranking: ForeignKey a Ranking, ranking asociado al usuario.
- raus_puntos: IntegerField (default 0), puntaje acumulado del usuario en ese ranking.
- Meta.db_table: tabla `ranking_usuario`.
- Meta.unique_together: combinacion unica de (raus_usuario, raus_ranking), evita duplicados del mismo usuario en el mismo ranking.


## API: api_partidos

### Modelo: Partido
- par_id: AutoField, clave primaria autoincremental del partido.
- par_fecha: DateTimeField, fecha y hora del partido.
- par_ganador: ForeignKey a Usuario, usuario ganador del partido.
- Meta.db_table: tabla `partidos`.

### Modelo: PartidoRol
- par_rol_id: AutoField, clave primaria autoincremental del rol.
- par_rol_partido: TextField (max 100), nombre o descripcion del rol dentro del partido.
- Meta.db_table: tabla `partido_roles`.

### Modelo: PartidoUsuario
- paus_id: AutoField, clave primaria autoincremental de la participacion.
- paus_partido: ForeignKey a Partido, partido asociado.
- paus_usuario: ForeignKey a Usuario, usuario participante.
- paus_rol: ForeignKey a PartidoRol, rol del usuario en el partido.
- Meta.db_table: tabla `partido_usuario`.
- Meta.unique_together: combinacion unica de (paus_partido, paus_usuario), evita duplicar un mismo usuario en el mismo partido.

### Modelo: Set
- set_id: AutoField, clave primaria autoincremental del set.
- set_partido: ForeignKey a Partido, partido al que pertenece el set.
- set_numero: IntegerField, numero de orden del set en el partido.
- Meta.db_table: tabla `sets`.
- Meta.unique_together: combinacion unica de (set_partido, set_numero), evita repetir el numero de set dentro del mismo partido.

### Modelo: Game
- game_id: AutoField, clave primaria autoincremental del game.
- game_set: ForeignKey a Set, set al que pertenece el game.
- game_numero: IntegerField, numero de orden del game en el set.
- Meta.db_table: tabla `games`.
- Meta.unique_together: combinacion unica de (game_set, game_numero), evita repetir el numero de game dentro del mismo set.

### Modelo: Punto
- punto_id: AutoField, clave primaria autoincremental del punto.
- punto_game: ForeignKey a Game, game donde ocurre el punto.
- punto_usuario: ForeignKey a Usuario, usuario que anota el punto.
- punto_tiempo: TimeField (auto_now_add), hora en que se registra el punto.
- punto_numero: IntegerField, numero de orden del punto.
- Meta.db_table: tabla `puntos`.
- Meta.unique_together: combinacion unica de (punto_game, punto_usuario, punto_numero), evita duplicados de numeracion por usuario dentro de un game.

## API: api_usuarios

### Modelo: Usuario
- usu_id: BigAutoField, clave primaria autoincremental del usuario.
- usu_nombres: TextField (max 100), nombres del usuario.
- usu_apellidos: TextField (max 100), apellidos del usuario.
- usu_email: EmailField (max 100, unico), correo electronico del usuario.
- usu_contrasena: CharField (max 128), hash o valor de contrasena almacenado.
- usu_fecha_nacimiento: DateTimeField, fecha y hora de nacimiento registrada.
- usu_imagen_perfil: URLField (max 200, opcional), URL de imagen de perfil.
- usu_fecha_creacion: DateTimeField (auto_now_add), fecha y hora de creacion del registro.
- usu_fecha_modificacion: DateTimeField (auto_now), fecha y hora de ultima modificacion del registro.
- Meta.db_table: tabla `usuarios`.

### Modelo: TipoRelacion
- tr_id: BigAutoField, clave primaria autoincremental del tipo de relacion.
- tr_nombre: TextField (max 50), nombre del tipo de relacion.
- tr_descripcion: TextField (max 200, opcional), descripcion del tipo de relacion.
- Meta.db_table: tabla `tipos_relacion`.

### Modelo: Relacion
- rel_id: BigAutoField, clave primaria autoincremental de la relacion.
- rel_usuario1: ForeignKey a Usuario, primer usuario involucrado en la relacion.
- rel_usuario2: ForeignKey a Usuario, segundo usuario involucrado en la relacion.
- rel_tipo: ForeignKey a TipoRelacion, tipo de relacion entre usuarios.
- rel_fecha_creacion: DateTimeField (auto_now_add), fecha y hora de creacion de la relacion.
- Meta.db_table: tabla `relaciones`.
- Meta.unique_together: combinacion unica de (rel_usuario1, rel_usuario2, rel_tipo), evita duplicados de la misma relacion entre dos usuarios con el mismo tipo.

## API: api_estadisticas

Actualmente no hay modelos definidos en `api_estadisticas/models.py`.