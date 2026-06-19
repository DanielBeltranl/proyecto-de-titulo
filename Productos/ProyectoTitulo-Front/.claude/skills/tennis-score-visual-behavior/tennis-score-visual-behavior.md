---
name: tennis-scoreboard-behavior
description: >
  Guía de comportamiento visual, animaciones y lógica de display para marcadores de tenis.
  Agnóstica al stack, colores y diseño visual ya definido en el proyecto.
  Usa esta skill cuando necesites implementar: qué mostrar en cada momento del partido,
  cómo y cuándo animar transiciones de score, dónde y cómo mostrar mensajes de estado
  (break point, match point, deuce, etc.), cómo gestionar el overlay fullscreen para
  descansos y cambios de lado, o cómo estructurar la secuencia de eventos visuales
  del marcador. No dicta colores ni componentes — dicta comportamiento y timing.
---

# Tennis Scoreboard — Comportamiento Visual y Animaciones

Esta skill es una guía de comportamiento, no un estándar. Define el *qué* y el *cuándo*, no el *cómo* implementarlo ni el *cómo* se ve. Los colores, componentes y stack ya están definidos en el proyecto — esta guía se adapta a ellos.

---

## 1. Modelo Mental: Capas de Display

El marcador vive en capas. Cada capa tiene su propio ciclo de vida y nunca interrumpe a las demás sin una razón de estado:

```
┌─────────────────────────────────┐
│  CAPA 3 — Overlay fullscreen    │  ← descansos, cambio de lado, fin de set
│  (sobre todo lo demás)          │
├─────────────────────────────────┤
│  CAPA 2 — Mensajes de estado    │  ← break point, match point, deuce, fault
│  (contextual, dentro del HUD)   │
├─────────────────────────────────┤
│  CAPA 1 — Marcador base         │  ← siempre visible durante el juego
│  (persistente)                  │
└─────────────────────────────────┘
```

**Regla principal**: la Capa 3 (overlay) es la única que puede tapar completamente el marcador. Las Capas 1 y 2 coexisten. Nunca mostrar overlay y mensajes de estado al mismo tiempo — el overlay es el estado final de esa secuencia.

---

## 2. Mensajes de Estado — Dónde y Cuándo

Los mensajes de estado son eventos puntuales que ocurren dentro del flujo del partido. Tienen posición, duración y prioridad definidas.

### Posición en el layout

Los mensajes van **debajo del marcador base**, en un área reservada llamada zona de estado. Esta zona tiene altura fija — los mensajes no empujan el layout, aparecen dentro de ese espacio.

```
┌──────────────────────────────────────┐
│  [Marcador base — siempre presente]  │
├──────────────────────────────────────┤
│  [Zona de estado — altura fija]      │  ← aquí van los mensajes
└──────────────────────────────────────┘
```

Si no hay mensaje activo, la zona de estado está vacía pero el espacio se mantiene — el marcador no colapsa ni salta.

### Jerarquía de mensajes (prioridad de display)

Cuando hay varios eventos simultáneos, solo se muestra uno. Orden de prioridad descendente:

| Prioridad | Mensaje | Cuándo aparece |
|-----------|---------|----------------|
| 1 | **MATCH POINT** | El jugador que sirve (o recibe) puede ganar el partido con este punto |
| 2 | **SET POINT** | El jugador puede ganar el set con este punto |
| 3 | **BREAK POINT** | El jugador que recibe puede ganar el game |
| 4 | **DEUCE** | El score es 40-40 |
| 5 | **ADVANTAGE** | Después de deuce, un jugador lleva ventaja |
| 6 | **FAULT / DOUBLE FAULT** | Falta de saque |
| 7 | **LET** | El saque tocó la red y es válido |

Un mensaje de prioridad mayor siempre reemplaza al de menor prioridad sin animar la salida — el nuevo entra directamente.

### Timing de los mensajes

```
Evento ocurre
    │
    ├─ 0ms      → mensaje entra (animación de entrada)
    ├─ 0–∞      → mensaje visible mientras el estado es válido
    └─ estado cambia → mensaje sale (animación de salida)
```

Los mensajes **no tienen timeout propio** — viven mientras el estado del partido los justifica. No desaparecen solos después de N segundos, desaparecen cuando el estado cambia (se jugó el punto, cambió el score).

Excepción: FAULT y LET sí tienen timeout (2–3s) porque son eventos momentáneos, no estados persistentes.

### Comportamiento de DEUCE y ADVANTAGE

DEUCE y ADVANTAGE son estados que se alternan. El display debe reflejar la alternancia sin que parezca que "parpadea":

```
40-40 → mostrar DEUCE
punto → mostrar ADVANTAGE [Nombre]
punto → volver a DEUCE  ← NO re-animar entrada, actualizar in-place
punto → mostrar ADVANTAGE [Nombre]  ← el nombre puede cambiar
```

Cuando se vuelve a DEUCE después de ADVANTAGE, el mensaje actualiza su contenido *sin salir y volver a entrar*. Solo el texto cambia, la zona de estado permanece ocupada.

---

## 3. Animaciones del Marcador Base

### Principios generales

- **Solo animar lo que cambió.** Si cambió el game score, solo anima el game score. No mover el marcador entero.
- **La animación confirma, no informa.** El usuario ya sabe que pasó algo (vio el punto). La animación confirma el nuevo estado.
- **Velocidad sobre espectacularidad.** Un marcador de tenis se actualiza muchas veces por partido. Las animaciones deben ser rápidas y no cansar.
- **Nada se mueve de posición.** Los elementos tienen posición fija. Las animaciones son de opacidad, escala y color — nunca de posición.

### Specs de animación por evento

#### Cambio de game score (punto dentro de un game)

```
Propiedad:   opacity + scale
Dirección:   el número nuevo entra desde arriba (translateY -4px → 0)
Duración:    200ms
Easing:      ease-out
Delay:       0ms — inmediato al evento
```

El número anterior no anima su salida — se reemplaza directamente. Solo el nuevo valor tiene animación de entrada.

#### Cambio de game (se gana un game — avanza el contador de games del set)

```
Propiedad:   opacity + scale, más prominente que el punto
Duración:    300ms
Easing:      ease-out con ligero overshoot (cubic-bezier(0.34, 1.3, 0.64, 1))
Highlight:   el nuevo número tiene un flash de color breve (150ms) al llegar
```

El game score de ese jugador vuelve a 0. El 0 entra con la misma animación de punto, sin énfasis extra.

#### Cambio de set (se gana un set)

El evento más importante dentro del juego normal. Secuencia:

```
1. (0ms)     El score del set se actualiza con animación prominente
2. (0ms)     El game score vuelve a 0–0, ambos con fade suave
3. (300ms)   El set recién ganado queda en estado "won" (visualmente diferenciado)
4. (300ms)   El nuevo set en curso aparece — ambos jugadores en 0
```

El set ganado no desaparece — se queda visible con menor peso visual que el set en curso. La transición entre "set activo" y "set terminado" es el único momento donde puede haber un color de highlight breve en el contador de sets.

```
Duración total de la secuencia: ~500ms
No bloquear interacción durante la secuencia
```

#### Cambio de saque (quién sirve)

```
Propiedad:   opacity del indicador de saque
Salida viejo: opacity 1 → 0, 150ms, ease-in
Entrada nuevo: opacity 0 → 1, 200ms, ease-out, delay 50ms
```

No animar posición. El indicador de cada jugador está siempre en su lugar — solo cambia su visibilidad.

#### Tiebreak — entrada

Cuando el set llega a 6-6 y empieza el tiebreak:

```
1. El game score cambia su "modo" — ahora muestra enteros en vez de 15/30/40
2. Mostrar un indicador de TIEBREAK en la zona de estado (con prioridad máxima,
   sobre cualquier otro mensaje)
3. El indicador de TIEBREAK permanece visible durante todo el tiebreak
4. Duración de la animación de entrada: 300ms
```

---

## 4. Overlay Fullscreen — Comportamiento

El overlay fullscreen es una capa que cubre completamente el marcador (y opcionalmente toda la pantalla). Se activa en momentos de pausa del juego: descansos, cambio de lado y fin de set/partido.

### Cuándo activar el overlay

| Evento | ¿Overlay? | Contenido principal |
|--------|-----------|---------------------|
| Fin de game (normal) | ❌ No | Solo actualiza el marcador |
| Fin de set | ✅ Sí | Resumen del set, tiempo de descanso |
| Cambio de lado (cada 2 games en el primer game de cada set) | ✅ Sí | Countdown, lado de cancha |
| Descanso médico / lluvia | ✅ Sí | Indicador de pausa, razón si disponible |
| Fin de partido | ✅ Sí | Ganador, resultado final completo |
| Warm-up / antes de partido | ✅ Sí | Información de los jugadores |

### Estructura del overlay

El overlay no tiene un diseño fijo — se adapta al del proyecto. Pero su comportamiento es consistente:

```
┌────────────────────────────────────────────┐
│                                            │
│   [Zona principal — contenido del evento]  │
│                                            │
│   [Countdown si aplica]                    │
│                                            │
│   [Info contextual secundaria]             │
│                                            │
└────────────────────────────────────────────┘
```

El marcador base NO es visible durante el overlay. Puede estar renderizado debajo pero sin visibilidad — no ocultarlo del DOM, solo cubrirlo.

### Animación de entrada del overlay

```
Propiedad:   opacity
Entrada:     0 → 1
Duración:    400ms
Easing:      ease-out
Delay:       200ms después del evento que lo dispara
             (dar tiempo a que el marcador procese el evento primero)
```

El delay de 200ms es importante — el usuario debe ver primero que el set terminó en el marcador, y *después* que aparece el overlay. No al revés.

### Animación de salida del overlay

```
Propiedad:   opacity
Salida:      1 → 0
Duración:    300ms
Easing:      ease-in
Trigger:     cuando el countdown llega a 0, o cuando el partido se reanuda
```

Al salir el overlay, el marcador base debe estar ya actualizado con el nuevo estado — no hay animación de "reaparición" del marcador, simplemente el overlay se va y el marcador ya estaba listo debajo.

### Countdown — comportamiento

El countdown es el elemento más activo del overlay. Reglas:

- **Actualización**: cada segundo, sin animación. El número cambia de forma directa — no hace falta animar cada segundo, cansa.
- **Último tramo** (≤10 segundos): puede introducirse una animación sutil por segundo para comunicar urgencia. Nada agresivo — un pulso de opacidad o un cambio de color es suficiente.
- **Llegada a 0**: el número llega a 0, el overlay inicia su salida después de 500ms de pausa en el 0.
- **Si el partido se reanuda antes del countdown**: el overlay sale inmediatamente, ignorando el countdown.

```
Countdown normal:  número estático, cambia cada 1s
Countdown ≤10s:    pulso sutil por cada segundo
Countdown = 0:     pausa 500ms → overlay sale
Reanudación early: overlay sale sin esperar el 0
```

### Cambio de lado — contenido específico

El cambio de lado ocurre cada 2 games en el primer game de cada set (y al llegar a 6 games si el set sigue). El overlay de cambio de lado debe mostrar:

- Qué lado pasa a cada jugador (izquierda / derecha, o norte / sur)
- Countdown del descanso (90 segundos en ATP)
- Score actual resumido

La representación visual del "lado" es libre — puede ser un diagrama simplificado de cancha, flechas, o simplemente texto. Lo importante es que esté en el overlay y no en el marcador base.

### Fin de set — contenido específico

El overlay de fin de set muestra:

1. El resultado del set que acaba de terminar (score del set, quién lo ganó)
2. El resultado acumulado hasta ahora (sets ganados por cada jugador)
3. Countdown del descanso (120 segundos en ATP entre sets)
4. Stats opcionales del set (si el proyecto los tiene)

El orden de los puntos 1 y 2 importa — primero el evento inmediato (este set), luego el contexto global.

### Fin de partido — contenido específico

El overlay de fin de partido es el más permanente — no tiene countdown. Sale solo cuando el usuario navega o hay una acción explícita. Debe mostrar:

1. Ganador (prominente)
2. Resultado completo set a set
3. Duración del partido
4. Stats finales si disponibles

No hay animación de salida automática. El overlay de fin de partido es el estado final del sistema.

---

## 5. Secuencias Compuestas

Algunos eventos disparan varias cosas en secuencia. El orden importa.

### Secuencia: punto que cierra un game

```
t=0ms    Score del punto animado en marcador
t=100ms  Zona de estado limpia (sale el mensaje si había)
t=200ms  Contador de games actualizado con animación
t=300ms  Game score vuelve a 0–0
t=400ms  Si corresponde, indicador de saque actualizado
```

### Secuencia: punto que cierra un set

```
t=0ms    Score del punto animado en marcador
t=100ms  Zona de estado limpia
t=200ms  Contador de sets actualizado — animación prominente
t=300ms  Games del set terminado pasan a estado "histórico" (menos peso visual)
t=400ms  Game score y games del nuevo set aparecen en 0–0
t=600ms  Overlay de fin de set entra (delay 200ms sobre t=400ms)
```

### Secuencia: match point convertido

```
t=0ms    Score del punto animado en marcador
t=100ms  Zona de estado: "MATCH POINT" → sale
t=200ms  Todos los contadores actualizan al resultado final
t=400ms  Pausa — el marcador muestra el resultado final quieto
t=800ms  Overlay de fin de partido entra
```

La pausa de 400ms en el match point es intencional — el usuario merece un momento de ver el marcador final antes del overlay.

---

## 6. Lo que No Se Anima

Lista explícita de cosas que no deben tener animación, por más que técnicamente sea posible:

- **Nombres de jugadores** — nunca, bajo ninguna circunstancia
- **Flags o avatares** — estáticos siempre
- **Sets terminados** — ya son historia, no llamar la atención sobre ellos
- **El layout completo** — las columnas del marcador no se mueven
- **El overlay mientras el countdown corre** — una vez visible, está quieto
- **Cambios de score durante el overlay** — si el overlay está activo, el marcador debajo se actualiza silenciosamente, sin animaciones

---

## 7. Accesibilidad del Comportamiento

- Todo cambio de estado importante debe tener un equivalente en texto accesible (aria-live) además de la animación visual
- `prefers-reduced-motion`: todas las animaciones deben poder desactivarse. El comportamiento (qué se muestra) no cambia — solo la animación
- El countdown debe ser legible por screen reader en cada actualización, pero sin ser verboso — anunciar solo cuando cambia la decena (90, 80, 70...)
- Los mensajes de estado (break point, match point, etc.) deben anunciarse en aria-live="assertive" — son informativos y urgentes

---

## 8. Guía Rápida de Referencia

```
EVENTO                  ZONA AFECTADA          DURACIÓN TOTAL
─────────────────────────────────────────────────────────────
Punto                   Game score             200ms
Game ganado             Games del set          300ms
Set ganado              Sets + overlay         500ms + overlay
Match ganado            Todo + overlay         800ms + overlay

MENSAJE                 POSICIÓN               TIENE TIMEOUT
─────────────────────────────────────────────────────────────
Match Point             Zona de estado         No (vive con el estado)
Set Point               Zona de estado         No
Break Point             Zona de estado         No
Deuce / Advantage       Zona de estado         No (alterna in-place)
Fault / Double Fault    Zona de estado         Sí — 2–3s
Let                     Zona de estado         Sí — 2s
Tiebreak                Zona de estado         No (todo el tiebreak)

OVERLAY                 TRIGGER                SALIDA
─────────────────────────────────────────────────────────────
Fin de set              Set cerrado            Countdown (120s)
Cambio de lado          Cada 2 games/set       Countdown (90s)
Fin de partido          Match cerrado          Manual / navegación
Pausa médica/lluvia     Evento externo         Reanudación del partido
```
