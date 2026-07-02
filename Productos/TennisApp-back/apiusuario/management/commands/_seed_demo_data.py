"""Static demo data tables for the seed_demo management command.

Names/levels reused from the abandoned seed_data.py (git show dfc8f6d) — kept
as-is since that data was already reviewed and is realistic. The only change
vs. that script: players face an unregistered guest opponent instead of each
other (decision: guest-vs-player matches, not player-vs-player).
"""
from datetime import date

from apiusuario.models import NivelUsuario, SexoUsuario

DEMO_PASSWORD = 'Tennis2024!'

COACHES = [
    {
        'nombre': 'Carlos', 'apellidoPaterno': 'Gómez', 'apellidoMaterno': 'Vidal',
        'correo': 'coach.carlos@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1980, 3, 15),
    },
    {
        'nombre': 'María', 'apellidoPaterno': 'Fernández', 'apellidoMaterno': 'Lagos',
        'correo': 'coach.maria@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1975, 7, 22),
    },
    {
        'nombre': 'Rodrigo', 'apellidoPaterno': 'Espinoza', 'apellidoMaterno': 'Bravo',
        'correo': 'coach.rodrigo@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1982, 11, 9),
    },
]

# coach_idx: 0 = Carlos, 1 = María, 2 = Rodrigo
PLAYERS = [
    # -- Carlos --
    {
        'nombre': 'Juan', 'apellidoPaterno': 'Pérez', 'apellidoMaterno': 'Mora',
        'correo': 'juan.perez@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1995, 5, 10), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 180, 'peso': 78, 'coach_idx': 0,
    },
    {
        'nombre': 'Pedro', 'apellidoPaterno': 'Rojas', 'apellidoMaterno': 'Silva',
        'correo': 'pedro.rojas@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1993, 8, 20), 'nivelUsuario': NivelUsuario.semipro,
        'altura': 183, 'peso': 80, 'coach_idx': 0,
    },
    {
        'nombre': 'Diego', 'apellidoPaterno': 'Méndez', 'apellidoMaterno': 'Castro',
        'correo': 'diego.mendez@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1998, 2, 14), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 175, 'peso': 72, 'coach_idx': 0,
    },
    {
        'nombre': 'Andrés', 'apellidoPaterno': 'Torres', 'apellidoMaterno': 'Navarro',
        'correo': 'andres.torres@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1991, 11, 3), 'nivelUsuario': NivelUsuario.pro,
        'altura': 188, 'peso': 85, 'coach_idx': 0,
    },
    {
        'nombre': 'Camila', 'apellidoPaterno': 'Ríos', 'apellidoMaterno': 'Jiménez',
        'correo': 'camila.rios@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1996, 4, 25), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 165, 'peso': 58, 'coach_idx': 0,
    },
    # -- María --
    {
        'nombre': 'Valentina', 'apellidoPaterno': 'Cruz', 'apellidoMaterno': 'Reyes',
        'correo': 'valentina.cruz@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1994, 9, 18), 'nivelUsuario': NivelUsuario.semipro,
        'altura': 168, 'peso': 60, 'coach_idx': 1,
    },
    {
        'nombre': 'Sofía', 'apellidoPaterno': 'Medina', 'apellidoMaterno': 'Pérez',
        'correo': 'sofia.medina@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1999, 1, 8), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 162, 'peso': 55, 'coach_idx': 1,
    },
    {
        'nombre': 'Lucas', 'apellidoPaterno': 'Vargas', 'apellidoMaterno': 'Ortega',
        'correo': 'lucas.vargas@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1997, 6, 30), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 178, 'peso': 75, 'coach_idx': 1,
    },
    {
        'nombre': 'Tomás', 'apellidoPaterno': 'Herrera', 'apellidoMaterno': 'Soto',
        'correo': 'tomas.herrera@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1992, 12, 5), 'nivelUsuario': NivelUsuario.semipro,
        'altura': 185, 'peso': 82, 'coach_idx': 1,
    },
    {
        'nombre': 'Isabella', 'apellidoPaterno': 'Morales', 'apellidoMaterno': 'Lara',
        'correo': 'isabella.morales@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1990, 7, 15), 'nivelUsuario': NivelUsuario.pro,
        'altura': 170, 'peso': 62, 'coach_idx': 1,
    },
    # -- Rodrigo --
    {
        'nombre': 'Martina', 'apellidoPaterno': 'Silva', 'apellidoMaterno': 'Contreras',
        'correo': 'martina.silva@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1995, 3, 12), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 166, 'peso': 59, 'coach_idx': 2,
    },
    {
        'nombre': 'Benjamín', 'apellidoPaterno': 'Muñoz', 'apellidoMaterno': 'Araya',
        'correo': 'benjamin.munoz@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1993, 10, 2), 'nivelUsuario': NivelUsuario.semipro,
        'altura': 181, 'peso': 79, 'coach_idx': 2,
    },
    {
        'nombre': 'Fernanda', 'apellidoPaterno': 'Rivas', 'apellidoMaterno': 'Godoy',
        'correo': 'fernanda.rivas@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1997, 8, 27), 'nivelUsuario': NivelUsuario.amateur,
        'altura': 163, 'peso': 56, 'coach_idx': 2,
    },
    {
        'nombre': 'Joaquín', 'apellidoPaterno': 'Fuentes', 'apellidoMaterno': 'Leiva',
        'correo': 'joaquin.fuentes@tennis.app', 'sexo': SexoUsuario.masculino,
        'fecha_nacimiento': date(1990, 1, 19), 'nivelUsuario': NivelUsuario.pro,
        'altura': 186, 'peso': 83, 'coach_idx': 2,
    },
    {
        'nombre': 'Antonia', 'apellidoPaterno': 'Carrasco', 'apellidoMaterno': 'Paredes',
        'correo': 'antonia.carrasco@tennis.app', 'sexo': SexoUsuario.femenino,
        'fecha_nacimiento': date(1994, 6, 5), 'nivelUsuario': NivelUsuario.semipro,
        'altura': 169, 'peso': 61, 'coach_idx': 2,
    },
]

LOCATIONS = [
    'Club Tenis Santiago',
    'Club Tenis Providencia',
    'Club Deportivo Municipal',
    'Club Tenis Las Condes',
]

SURFACES = ['Clay', 'Hard']

GUEST_NAMES = [
    'Roberto Vega', 'Francisca Soto', 'Ignacio Bravo', 'Constanza Reyes',
    'Matías Fuentes', 'Javiera Contreras', 'Felipe Aguilar', 'Antonia Salinas',
    'Cristóbal Núñez', 'Daniela Pizarro',
]
