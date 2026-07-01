# Guía de Estudio — Evaluación Final Transversal
## TennisApp / Stich — TPY1101

> **Estructura de la nota:** Encargo 20% + Presentación 80% = 100% del ET (que pondera 40% de la nota final).
> La calificación es **individual**. Te pueden preguntar a vos específicamente.
> El software debe estar al **100% del core del negocio** para aprobar.

---

## BLOQUE 1 — PLANIFICACIÓN Y ALCANCE
*Los ítems 1-5 de la presentación valen 8% c/u = 40% del total. Son los más importantes.*

---

### 1. Modelo de negocio / Procesos afectados

**¿Qué decir?**

TennisApp digitaliza el proceso de seguimiento técnico y estadístico del tenis amateur y semiprofesional. Los procesos de negocio que impacta son:

- **Registro de partido**: hoy se hace en papel o de memoria → el sistema lo captura punto a punto en tiempo real.
- **Análisis estadístico**: hoy no existe herramienta accesible para jugadores no profesionales → el sistema calcula automáticamente métricas de rendimiento físico y técnico.
- **Relación entrenador-jugador**: hoy el feedback es subjetivo y presencial → el sistema permite al entrenador monitorear el progreso de sus jugadores con datos reales.
- **Agendamiento de partidos**: hoy es por WhatsApp/verbal → el sistema formaliza el proceso con estados (PENDIENTE → ACEPTADO → INICIADO).

**Cliente objetivo:** Jugadores de tenis amateur, semiprofesionales y sus entrenadores.

---

### 2. Oportunidad / Problemática (Causa-Efecto)

**Problemática central:**
> Los jugadores de tenis amateur y semiprofesional no cuentan con herramientas accesibles para el análisis técnico y físico de sus partidos, lo que impide la mejora continua y el trabajo táctico fundamentado en datos.

**Causas (Diagrama Ishikawa):**
- Falta de herramientas digitales accesibles para el nivel amateur
- Las plataformas existentes son de alto costo o solo para uso profesional/televisivo
- El registro manual es impreciso y se pierde con el tiempo
- Los entrenadores no tienen acceso remoto al rendimiento de sus jugadores

**Efectos:**
- El jugador no puede identificar en qué momento del partido baja su rendimiento
- El entrenador no puede personalizar el entrenamiento con datos objetivos
- Se pierden datos valiosos de cada partido (duración de puntos, breaks, distancia)
- Imposibilidad de hacer comparativa histórica de progreso

---

### 3. Objetivo General y Específicos

**Objetivo General:**
> Desarrollar una plataforma web para el registro, análisis y seguimiento estadístico de partidos de tenis, orientada a jugadores amateur y semiprofesionales, que permita la mejora continua del rendimiento técnico y físico.

**Objetivo Específico 1:**
> Implementar un módulo de registro de marcador en tiempo real con lógica completa del reglamento de tenis, capturando métricas de tiempo y rendimiento por punto, game y set.

**Objetivo Específico 2:**
> Desarrollar un sistema de estadísticas automatizadas que calcule indicadores de rendimiento físico y técnico, diferenciados por nivel del jugador, género y superficie de juego.

---

### 4. Alcance del Proyecto

**Dentro del alcance (entregables):**
- API REST en Django con autenticación JWT
- Frontend en React (Stich)
- Módulo de registro de usuarios (jugador y entrenador)
- Módulo de registro de partido punto a punto
- Módulo de estadísticas (por partido y globales)
- Módulo de gestión de amistades
- Módulo de coaching (relación entrenador-jugador)
- Dashboard del jugador y del entrenador
- Despliegue en la nube (AWS: ECR + EC2 + SSM)
- Docker como ambiente replicable

**Supuestos:**
- El usuario tiene conexión a internet durante el partido
- El nivel del jugador es asignado por un entrenador registrado en el sistema
- Las variables de distancia recorrida están basadas en investigación científica publicada

**Restricciones:**
- El sistema no cuenta con módulo de transmisión en vivo (WebSocket) en esta entrega
- No incluye módulo de grupos privados
- El sistema requiere que el jugador tenga entrenador para que se le asigne nivel y acceda a estadísticas avanzadas

---

### 5. Planificación de Actividades

**Fases del proyecto:**

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 1 | Base: registro, login JWT, partidos básicos, estadísticas, amistades | ✅ Completada |
| Fase 2 | Registro diferenciado por rol (Jugador vs Entrenador) | ✅ Completada |
| Fase 3 | Flujo completo Coaching: solicitud, aceptación, asignación de nivel | ✅ Completada |
| Fase 4 | Partidos con invitado sin cuenta (`guest_name`) | ✅ Completada |
| Fase 5 | Dashboard del entrenador | ✅ Completada |

**Carta Gantt:** Disponible en `Documentacion/Diagramas/`.

**Distribución de responsabilidades:** Cada integrante tomó ownership de módulos específicos, con revisiones cruzadas documentadas en `correcciones.md`.

---

## BLOQUE 2 — TECNOLOGÍA Y METODOLOGÍA
*6% y 5% respectivamente en la presentación.*

---

### 6. Elección de Tecnología (Cloud)

**Stack seleccionado y justificación:**

| Tecnología | Justificación |
|-----------|---------------|
| **Django + DRF** | Framework maduro, sigue convención sobre configuración, ORM robusto para el modelo relacional complejo del sistema. Permite monolito modular sin sobre-ingeniería. |
| **PostgreSQL (contenedor Docker en EC2)** | Base de datos relacional con soporte nativo para UUID, tipos ENUM y foreign keys que el modelo requiere. Corre en contenedor junto al backend, versionada vía `docker-compose.prod.yml`. |
| **React + CSS Modules** | Librería de UI con gran ecosistema. CSS Modules evita colisiones de estilos en el sistema de componentes atómicos. |
| **AWS (ECR + EC2 + SSM)** | Registro de imágenes en ECR, despliegue e infraestructura en EC2, orquestado sin acceso SSH directo mediante AWS Systems Manager (SSM). GitHub Actions automatiza build, push y despliegue en cada push a `main`. Cumple el requisito Cloud de la evaluación. |
| **Docker** | Garantiza que el ambiente de desarrollo replique exactamente el de producción. Elimina el "funciona en mi máquina". |
| **JWT (djangorestframework-simplejwt)** | Autenticación stateless, escalable y estándar de la industria para APIs REST. Access token 60 min + Refresh token 24 hs. |

**¿Por qué Cloud y no local?**
La solución en la nube permite que entrenadores y jugadores accedan desde cualquier dispositivo sin instalación, que los datos sean persistentes e independientes del equipo del usuario, y que el sistema escale si la base de usuarios crece.

---

### 7. Metodología

**Metodología usada: Desarrollo incremental por fases**

Se adoptó un ciclo de vida **iterativo-incremental**, donde cada fase entrega un producto funcional que se valida antes de pasar a la siguiente. Esto es coherente con:
- La naturaleza del proyecto (funcionalidades que dependen de las anteriores)
- El equipo pequeño (3 personas)
- La necesidad de retroalimentación continua del docente

**Patrón de diseño:**
- **Backend**: Monolito modular (apps Django por contexto de negocio). Principios **SOLID** aplicados. Separación clara de responsabilidades entre modelos, serializadores, vistas y servicios.
- **Frontend**: **MVC adaptado** con **Atomic Design**. Model (Zod + lógica de negocio), View (componentes React), Controller (custom hooks). Economia de render.

---

## BLOQUE 3 — DESARROLLO DE LA SOLUCIÓN
*Ítems 8, 9 de presentación = 5% c/u.*

---

### 8. Ambiente de Pruebas

**Configuración del ambiente:**

El ambiente de pruebas replica producción mediante Docker Compose con tres servicios:
- `db`: PostgreSQL 16 Alpine
- `redis`: Redis 7 Alpine (para WebSocket futuro)
- `web`: Django con Daphne

```bash
# Levantar ambiente de pruebas
docker compose up db redis -d
uv run python manage.py migrate
uv run python manage.py runserver
```

**Variables de entorno diferenciadas:** El sistema usa `.env` para separar configuración de desarrollo vs producción (DB host, SECRET_KEY, DEBUG).

**Backup de base de datos:**

Automatizado en `.github/workflows/deploy.yml` (job `backup-db`, disparado manualmente con `workflow_dispatch`). El workflow se conecta a la instancia EC2-Back vía SSM (sin exponer SSH) y ejecuta:

```bash
# Dentro de la instancia EC2-Back, sobre el contenedor Postgres de producción:
docker-compose -f /opt/tennisapp/docker-compose.yml exec -T db \
  pg_dump -U tennisapp -d tennisapp > /opt/tennisapp/backups/backup_<timestamp>.sql

# Verificación de integridad (conteo de filas por tabla):
docker-compose -f /opt/tennisapp/docker-compose.yml exec -T db \
  psql -U tennisapp -d tennisapp -c "SELECT relname, n_live_tup FROM pg_stat_user_tables;"
```

El log de la Action queda como evidencia (timestamp, tamaño del archivo, conteo de filas). Para restaurar en el entorno local de pruebas:

```bash
# Descargar backup_<timestamp>.sql desde la instancia (aws ssm start-session + scp, o S3 si se agrega bucket)
docker compose up db -d
psql -h localhost -U tennisapp -d tennisapp < backup_<timestamp>.sql
```

---

### 9. Módulos Desarrollados (Core del Negocio)

Los siguientes módulos conforman el **core funcional** del sistema:

#### Autenticación y Usuarios
- Registro diferenciado: jugador (nombre, sexo, edad, altura, peso) vs entrenador (lugar de trabajo)
- Login con JWT (access 60 min, refresh 24 hs)
- Perfil consultable y modificable
- Logout con invalidación

#### Registro de Partido
- Creación de sesión con modalidad (Best of 1/3/5), superficie y ubicación
- Agendamiento con estados: PENDIENTE → ACEPTADO → INICIADO → PAUSADO → FINALIZADA
- Registro punto a punto con lógica completa: 0/15/30/40/Deuce/Ventaja
- Tiebreak a partir de 6-6
- Detección automática de Break Point y Break Point Chance
- Función Undo con reversión en cascada
- Soporte para invitado sin cuenta (`guest_name`)
- Registro de timestamps por punto, game y set

#### Estadísticas
- **Estadísticas por partido:** cuartiles de duración de punto, duración media ganado/perdido, break points, distancia total, duración partido
- **Estadísticas globales:** últimos 14 partidos, puntos por intervalo de 5 min, distancia por intervalo, record histórico W/D
- **Fórmula de distancia** basada en investigación científica, diferenciada por nivel + género + superficie

#### Coaching
- Solicitud de asociación jugador → entrenador
- El entrenador asigna nivel (Amateur/Semi-Pro/Profesional) al aceptar
- El entrenador puede ver estadísticas de todos sus jugadores

#### Amistades
- Búsqueda por nombre/correo
- Solicitudes con estados PENDIENTE/ACEPTADO
- Panel de gestión

#### Dashboard
- **Jugador:** últimos 5 partidos, último partido destacado, datos del perfil
- **Entrenador:** últimos 5 partidos de todos sus jugadores combinados, solicitudes de asociación pendientes

---

## BLOQUE 4 — VALIDACIÓN Y MEJORAS
*Ítems 10, 11, 12, 13 de presentación = 5% c/u.*

---

### 10. Plan de Pruebas

**Documento:** `Documentacion/Plan de pruebas aplicacion tenis/casos-de-prueba.xlsx`

Estructura del plan:

| ID | Módulo | Funcionalidad | Acción | Resultado Esperado |
|----|--------|--------------|--------|--------------------|
| TC-001 | Auth | Registro jugador | POST /api/usuario/register/ con datos válidos | 201 Created, token JWT retornado |
| TC-002 | Auth | Login | POST /api/usuario/login/ con credenciales correctas | 200 OK, access + refresh token |
| TC-003 | Auth | Login inválido | POST con contraseña incorrecta | 401 Unauthorized |
| TC-004 | Partido | Crear sesión | POST /api/matches/ con modalidad y superficie | 201, match en estado PENDIENTE |
| TC-005 | Partido | Registrar punto | POST /api/matches/{id}/point/ | Puntaje actualizado correctamente |
| TC-006 | Partido | Deuce | Cuando ambos llegan a 40 | Sistema cambia a estado DEUCE |
| TC-007 | Partido | Undo | DELETE /api/matches/{id}/point/ último punto | Estado revierte al punto anterior |
| TC-008 | Estadísticas | Por partido | GET /api/statistics/{match_id}/ | Retorna todas las métricas calculadas |
| TC-009 | Estadísticas | Globales | GET /api/statistics/global/ | Retorna últimos 14 partidos |
| TC-010 | Coaching | Solicitud | POST solicitud de asociación | Estado PENDIENTE, notificación enviada |
| TC-011 | Coaching | Aceptar | El entrenador acepta la solicitud | Jugador obtiene nivel asignado |
| TC-012 | Amistades | Agregar | POST solicitud de amistad | Estado PENDIENTE |
| TC-013 | Dashboard | Jugador | GET /api/dashboard/ | Retorna últimos 5 partidos + perfil |
| TC-014 | Dashboard | Entrenador | GET /api/dashboard/coach/ | Retorna partidos de todos sus jugadores |

---

### 11. Aplicación de Pruebas de Validación

**Pruebas ejecutadas sobre los componentes:**

- **Pruebas funcionales**: Cada endpoint del API fue probado con casos válidos e inválidos. Documentadas en `casos-de-prueba.xlsx`.
- **Pruebas de autenticación**: Validación de tokens JWT, expiración, refresh y logout.
- **Pruebas de lógica de tenis**: Deuce, Ventaja, Tiebreak, Break Point, Undo en cascada.
- **Pruebas de roles**: Un entrenador no puede registrar un partido; un jugador sin nivel no accede a estadísticas avanzadas.
- **Pruebas de cálculo estadístico**: Verificación de la fórmula de distancia con valores conocidos de las tablas de investigación.

---

### 12. Mejoras Post-Prueba

Las siguientes mejoras fueron aplicadas como resultado de las pruebas:

| Hallazgo | Mejora Aplicada |
|----------|----------------|
| El campo `edad` no permitía calcular la edad actual correctamente con el tiempo | Se migró a `fecha_nacimiento` (Fase 2) |
| El registro no diferenciaba campos por rol | Se implementó registro diferenciado Jugador vs Entrenador (Fase 2) |
| Los partidos solo podían jugarse contra usuarios registrados | Se agregó soporte para `guest_name` (invitado sin cuenta) (Fase 4) |
| El dashboard del entrenador no existía | Se implementó con partidos consolidados de todos sus jugadores (Fase 5) |
| Los valores de distancia estaban hardcodeados | Se migraron a variables de entorno para flexibilidad y mantenibilidad |

---

### 13. Conclusiones (para la presentación)

**Puntos clave a mencionar:**

1. **Objetivo cumplido**: El sistema resuelve la problemática identificada — un jugador amateur ahora puede acceder a estadísticas de nivel profesional con solo registrar su partido.

2. **Decisión técnica destacada**: El uso del monolito modular en Django permitió iterar rápido sin sobre-ingeniería. La decisión de separar apps por contexto de negocio (no por tipo de archivo) facilitó que cada integrante trabajara en módulos independientes sin conflictos.

3. **Aprendizaje del proceso**: La migración de campos (edad → fecha_nacimiento) en producción enseñó la importancia de diseñar el modelo de datos correctamente desde el inicio. Los cambios de esquema son los más costosos en un proyecto real.

4. **Desde el punto de vista de la industria**: El stack elegido (Django + PostgreSQL + React + Docker + Cloud) es el mismo que usan startups y empresas medianas del mercado tech actual. Las decisiones tomadas siguen patrones reales: JWT stateless, variables de entorno para configuración sensible, Docker para replicabilidad de ambiente.

---

## PREGUNTAS FRECUENTES QUE PUEDEN HACERTE

**¿Por qué Django y no FastAPI o Node?**
Django tiene un ORM muy robusto que se adapta al modelo relacional complejo del sistema (partidos → sets → games → puntos con múltiples foreign keys). DRF agrega la capa REST sin reinventar la rueda. FastAPI sería una buena opción si la performance fuera crítica desde el inicio, pero para un MVP con este equipo, Django es más productivo.

**¿Por qué PostgreSQL y no MySQL?**
PostgreSQL tiene mejor soporte para tipos ENUM nativos, UUID como PK, y es el estándar de NeonDB (la solución Cloud elegida). MySQL requeriría más configuración adicional para los mismos resultados.

**¿Cómo funciona el cálculo de distancia?**
`D = Tiempo_total_punto × (Tiempo_efectivo / 100) × (Metros_por_minuto / 60)`. Los valores de tiempo efectivo y metros por minuto vienen de tablas de investigación científica diferenciadas por nivel (Amateur/Semi-Pro/Pro), género (H/M) y superficie (Arcilla/Dura). Se guardan en variables de entorno porque son valores que pueden actualizarse con nueva investigación sin tocar el código.

**¿Qué es el Undo y cómo funciona?**
Es la función de deshacer el último punto. Elimina el punto de la base de datos y revierte en cascada: si el punto era el primero de un game, también elimina el game. Si el game era el primero de un set, también elimina el set. Garantiza que el árbol de datos siempre sea consistente.

**¿Por qué el token JWT va en memoria y no en localStorage?**
localStorage es accesible desde JavaScript de terceros (ataques XSS). Guardar el token en memoria (estado de la aplicación) lo protege de ese vector de ataque. Es la práctica recomendada por OWASP para SPAs.

**¿Qué módulos NO están implementados?**
La transmisión en vivo (WebSocket) y los grupos privados son funcionalidades planificadas pero no entregadas en esta versión. El core del negocio (registro de partido, estadísticas, usuarios, coaching) está 100% funcional.

---

## CHECKLIST DE PREPARACIÓN

### Encargo (verificar antes de entregar)
- [ ] Portada con nombre del proyecto e integrantes
- [ ] Índice
- [ ] Introducción
- [ ] Modelo de negocio documentado
- [ ] Diagrama Ishikawa
- [ ] Objetivo general + 2 objetivos específicos
- [ ] Alcance (entregables, supuestos, restricciones)
- [ ] Carta Gantt
- [ ] Justificación de tecnologías
- [ ] Descripción de arquitectura
- [ ] Plan de pruebas en tabla (funcionalidad → resultado esperado)
- [ ] Evidencias de pruebas ejecutadas
- [ ] Mejoras documentadas con antes/después
- [ ] Informe de conclusiones
- [ ] Software funcionando (demo o capturas)
- [ ] Archivo comprimido: `EP_TPY1101_[número]_[sección].rar`
- [ ] Archivo `Grupo_[número].txt` con nombres completos

### Presentación (verificar antes de exponer)
- [ ] PPT sin errores ortográficos
- [ ] Demo del software funcionando en vivo
- [ ] Sabés explicar el modelo de negocio sin leer las diapositivas
- [ ] Sabés explicar la problemática con causas y efectos
- [ ] Tenés claro el objetivo general y los 2 específicos de memoria
- [ ] Podés argumentar la elección de cada tecnología
- [ ] Tenés el plan de pruebas en una tabla visual clara
- [ ] Podés mostrar las evidencias de mejoras post-prueba
- [ ] Tenés preparadas las conclusiones con aprendizaje técnico
