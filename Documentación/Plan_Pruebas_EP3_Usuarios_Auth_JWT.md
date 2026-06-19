# Plan de Pruebas — Módulos de Usuarios, Autenticación y JWT (EP3)

**Asignatura:** Taller Aplicado de Programación (TPY1101) — Sección 002V
**Responsable de estos módulos:** Maximiliano Arturo Huerta González
**Módulos cubiertos:** Registro de usuarios (Jugador/Entrenador), Login / emisión de tokens, Autenticación y ciclo de vida de sesión JWT.
**App Django:** `apiusuario`

> Estos módulos corresponden a las responsabilidades individuales del integrante. El resto de
> los módulos del proyecto (marcador, estadísticas, etc.) cuentan con su propio plan de pruebas
> a cargo de los demás integrantes del equipo.

---

## 1. Estrategia y entorno de pruebas

Las pruebas son **automatizadas** y se ejecutan con el framework de testing de Django
(`django.test`) sobre el cliente de API de DRF (`rest_framework.test.APITestCase`).

**Principio de diseño — aislamiento:** las pruebas no dependen de infraestructura externa.
La aplicación en producción usa PostgreSQL (Neon) y Redis, pero las pruebas corren sobre un
entorno aislado para que cualquier integrante pueda ejecutarlas en cualquier máquina sin
levantar servicios:

- Base de datos **SQLite en memoria** (se crea y destruye en cada ejecución).
- `INSTALLED_APPS` reducido a lo que el módulo necesita.
- `ROOT_URLCONF` mínimo (`back/urls_test.py`).

**Archivos del entorno de pruebas:**

| Archivo | Rol |
|---------|-----|
| `back/settings_test.py` | Settings aislados (SQLite, apps mínimas, hashing rápido) |
| `back/urls_test.py` | URLconf reducido a las rutas de `apiusuario` + login/refresh/verify |
| `apiusuario/test_auth.py` | Suite de 23 casos de prueba |

**Comando de ejecución:**

```bash
python manage.py test apiusuario.test_auth --settings=back.settings_test -v 2
```

**Herramientas:** Python 3.11 · Django 5.2 · Django REST Framework · djangorestframework-simplejwt (HS256, access 60 min, refresh 1 día, rotación + blacklist).

---

## 2. Base de datos de pruebas

Los datos son creados y destruidos automáticamente en cada corrida. Datos base utilizados:

| Campo | Jugador de prueba | Entrenador de prueba |
|-------|-------------------|----------------------|
| nombre | Juan | Carlos |
| apellidoPaterno | Perez | Diaz |
| apellidoMaterno | Gonzalez | Munoz |
| correo | juan@test.com | carlos@test.com |
| password | Clave1234! | Clave1234! |
| rol | Jugador | Entrenador |
| sexo | Masculino | — |
| fecha_nacimiento | 2000-01-15 | 1985-03-20 |
| altura | 180 | — |
| peso | 75 | — |

---

## 3. Plan de pruebas

### 3.1 Módulo Registro de Usuarios — `POST /api/usuarios/registro/`

| ID | Funcionalidad a comprobar | Acción / Entrada | Resultado esperado | Tipo |
|----|---------------------------|------------------|--------------------|------|
| CP-REG-01 | Registro de jugador con datos completos | POST con todos los campos válidos de jugador | HTTP 201; la respuesta incluye `access`, `refresh` y el objeto `usuario` | Funcional |
| CP-REG-02 | Campo obligatorio `sexo` en jugador | POST de jugador sin `sexo` | HTTP 400; el error indica el campo `sexo` | Validación |
| CP-REG-03 | Campo obligatorio `peso` en jugador | POST de jugador sin `peso` | HTTP 400 | Validación |
| CP-REG-04 | Campo obligatorio `altura` en jugador | POST de jugador sin `altura` | HTTP 400 | Validación |
| CP-REG-05 | Unicidad de correo electrónico | POST con un correo ya registrado | HTTP 400; el error indica el campo `correo` | Validación |
| CP-REG-06 | Rechazo de rol inexistente | POST con `rol: "Arbitro"` | HTTP 400; el error indica el campo `rol` | Validación |
| CP-REG-07 | No exposición de la contraseña | Inspeccionar el objeto `usuario` de la respuesta | El campo `password` NO está presente | Seguridad |
| CP-REG-08 | Persistencia de sesión al registrar | Registro exitoso de jugador | Se crea 1 `TokenSession` activa asociada al usuario | Funcional |
| CP-REG-09 | Registro de entrenador con datos completos | POST con campos obligatorios de entrenador | HTTP 201; `rol: "Entrenador"` en la respuesta | Funcional |
| CP-REG-10 | Campo obligatorio `fecha_nacimiento` en entrenador | POST de entrenador sin `fecha_nacimiento` | HTTP 400; el error indica el campo `fecha_nacimiento` | Validación |

### 3.2 Módulo Login / Emisión de Token — `POST /api/login/`

| ID | Funcionalidad a comprobar | Acción / Entrada | Resultado esperado | Tipo |
|----|---------------------------|------------------|--------------------|------|
| CP-LOGIN-01 | Login con credenciales válidas | POST con correo y contraseña correctos | HTTP 200; respuesta con `access` y `refresh` | Funcional |
| CP-LOGIN-02 | Rechazo por contraseña incorrecta | POST con contraseña errónea | HTTP 401 | Seguridad |
| CP-LOGIN-03 | Rechazo por correo no registrado | POST con correo inexistente | HTTP 401 | Seguridad |
| CP-LOGIN-04 | Claims personalizados en el JWT | Decodificar el `access` retornado | El payload contiene `correo`, `nombre` y `rol` | Funcional |
| CP-LOGIN-05 | Creación de sesión al iniciar sesión | Login exitoso | Existe una `TokenSession` activa para el usuario | Funcional |
| CP-LOGIN-06 | Invalidación de sesión previa al re-login | Dos logins consecutivos del mismo usuario | Queda solo 1 `TokenSession` activa | Funcional |

### 3.3 Módulo Autenticación / Ciclo de vida JWT — `/api/usuarios/...`

| ID | Funcionalidad a comprobar | Acción / Entrada | Resultado esperado | Tipo |
|----|---------------------------|------------------|--------------------|------|
| CP-JWT-01 | Protección de endpoint autenticado | POST `/api/usuarios/perfil/` sin header `Authorization` | HTTP 401 | Seguridad |
| CP-JWT-02 | Acceso a perfil con token válido | POST `/api/usuarios/perfil/` con `Bearer` válido | HTTP 200; datos del usuario autenticado | Funcional |
| CP-JWT-03 | Rechazo de token malformado | Header `Authorization: Bearer token.falso.aqui` | HTTP 401 | Seguridad |
| CP-JWT-04 | Cambio de contraseña exitoso | POST `/api/usuarios/cambiar_password/` con contraseña actual correcta | HTTP 200 | Funcional |
| CP-JWT-05 | Rechazo de cambio con contraseña actual incorrecta | POST `/api/usuarios/cambiar_password/` con contraseña actual errónea | HTTP 400 | Validación |
| CP-JWT-06 | Listado de sesiones activas | GET `/api/usuarios/sesiones_activas/` autenticado | HTTP 200; `total` >= 1 | Funcional |
| CP-JWT-07 | Logout invalida la sesión activa | POST `/api/usuarios/logout/` con token válido | HTTP 200; la `TokenSession` deja de estar activa | Funcional |

---

## 4. Aplicación de las pruebas y resultados

### 4.1 Primera ejecución

**Total ejecutado:** 23 casos. **Resultado:** 22 PASS / 1 FAIL.

| ID | Resultado obtenido | Estado |
|----|--------------------|--------|
| CP-REG-01 … CP-REG-09 | Conforme a lo esperado | ✅ PASS |
| **CP-REG-10** | **HTTP 201 (se esperaba 400): el sistema permitió registrar un entrenador sin `fecha_nacimiento`** | ❌ **FAIL** |
| CP-LOGIN-01 … CP-LOGIN-06 | Conforme a lo esperado | ✅ PASS |
| CP-JWT-01 … CP-JWT-07 | Conforme a lo esperado | ✅ PASS |

```
FAIL: test_cp_reg_10_entrenador_sin_fecha_nacimiento
AssertionError: 201 != 400
Ran 23 tests ... FAILED (failures=1)
```

### 4.2 Defecto detectado y mejora aplicada

| ID Prueba | Defecto | Causa raíz | Corrección | Archivo |
|-----------|---------|-----------|------------|---------|
| CP-REG-10 | El endpoint registraba un entrenador sin `fecha_nacimiento`, devolviendo HTTP 201 en lugar de HTTP 400 | El campo del modelo es `null=True, blank=True`, por lo que el `ModelSerializer` lo infiere como `required=False`. DRF **no ejecuta** el validador de campo (`validate_fecha_nacimiento`) cuando el campo está ausente, por lo que la validación nunca se disparaba | Se declaró el campo de forma explícita: `fecha_nacimiento = serializers.DateField(required=True)`, forzando su presencia antes de cualquier otra lógica | `apiusuario/serializer.py` |

**Antes:**
```python
class EntrenadorRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['nombre', 'apellidoPaterno', 'apellidoMaterno',
                  'correo', 'password', 'rol', 'fecha_nacimiento']

    def validate_fecha_nacimiento(self, value):   # nunca se invoca si el campo no viene
        if not value:
            raise serializers.ValidationError('Este campo es obligatorio para entrenadores.')
        return value
```

**Después:**
```python
class EntrenadorRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fecha_nacimiento = serializers.DateField(required=True)   # fuerza la presencia del campo

    class Meta:
        model = Usuario
        fields = ['nombre', 'apellidoPaterno', 'apellidoMaterno',
                  'correo', 'password', 'rol', 'fecha_nacimiento']
```

### 4.3 Ejecución final (tras la corrección)

**Resultado:** 23 PASS / 0 FAIL.

```
Ran 23 tests in 0.189s

OK
```

---

## 5. Evaluación de estándares de calidad

| Estándar | Evaluación |
|----------|-----------|
| **Usabilidad** | Los errores de validación identifican el campo específico que falló, facilitando la corrección por parte del cliente de la API |
| **Seguridad** | Verificado: la contraseña no se expone en las respuestas (CP-REG-07), los tokens malformados se rechazan (CP-JWT-03), los endpoints protegidos exigen autenticación válida (CP-JWT-01) y el re-login invalida la sesión previa (CP-LOGIN-06) |
| **Completitud** | El 100% de los casos planificados (23) fue ejecutado y aprobado tras la corrección |
| **Corrección** | El defecto CP-REG-10 fue identificado, documentado con su causa raíz y corregido con evidencia antes/después |
| **Pertinencia** | Las validaciones responden directamente a los requerimientos de registro de Jugador y Entrenador |

---

## 6. Reproducir las pruebas

```bash
# desde TennisApp-back/
python manage.py test apiusuario.test_auth --settings=back.settings_test -v 2
```

No requiere PostgreSQL, Redis ni variables de entorno de producción: el entorno de pruebas
usa SQLite en memoria.

> **Nota técnica (lección aprendida):** la app del proyecto se llama `statistics`, lo que
> ensombrece al módulo `statistics` de la librería estándar de Python (que el backend SQLite
> de Django necesita). El entorno de pruebas fija el módulo estándar como solución acotada; la
> corrección de fondo recomendada es renombrar la app (p. ej. `player_stats`).
