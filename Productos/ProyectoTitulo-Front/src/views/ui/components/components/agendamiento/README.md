# Componente Agendamiento

Módulo completo para la funcionalidad de agendamiento de partidos de tenis en la aplicación DOUBLE FAULT.

## Estructura

```
agendamiento/
├── Agendamiento.tsx                    # Componente principal
├── Agendamiento.module.css
├── index.ts
├── components/
│   ├── meetingConfig/
│   │   ├── MeetingConfig.tsx          # Sección de configuración del encuentro
│   │   ├── MeetingConfig.module.css
│   │   └── components/
│   │       ├── modalitySelector/      # Selector de modalidad (1/3/5 sets)
│   │       ├── locationInput/         # Campo de ubicación
│   │       └── courtSurface/          # Selector de tipo de cancha
│   ├── inviteOpponent/
│   │   ├── InviteOpponent.tsx         # Sección de invitación
│   │   ├── InviteOpponent.module.css
│   │   └── components/
│   │       ├── friendsList/           # Lista de amigos disponibles
│   │       ├── friendCard/            # Tarjeta individual de amigo
│   │       └── confirmationCard/      # Card de confirmación
│   └── scheduleButton/
│       ├── ScheduleButton.tsx         # Botón de acción principal
│       └── ScheduleButton.module.css
```

## Componentes Principales

### `Agendamiento`
Contenedor principal que orquesta toda la funcionalidad de agendamiento.

**Props:**
- Ninguna (componente standalone)

**Funcionalidades:**
- Maneja el estado general del formulario
- Coordina cambios entre secciones
- Valida que el formulario esté completo antes de permitir agendar

### `MeetingConfig`
Configuración del encuentro deportivo.

**Props:**
```typescript
interface MeetingConfigProps {
  onChange?: (data: MeetingConfigData) => void;
}
```

**Sub-componentes:**
- `ModalitySelector` - Elige entre 1, 3 o 5 sets
- `LocationInput` - Ingresa ubicación del partido
- `CourtSurface` - Selecciona tipo de cancha (Arcilla, Césped, Dura, Sintética)

### `InviteOpponent`
Sección para seleccionar e invitar oponentes.

**Props:**
```typescript
interface InviteOpponentProps {
  onChange?: (data: InviteOpponentData) => void;
}
```

**Sub-componentes:**
- `FriendsList` - Muestra lista de amigos disponibles
- `FriendCard` - Tarjeta individual con info del amigo
- `ConfirmationCard` - Muestra estado de confirmación

### `ScheduleButton`
Botón de acción para agendar el partido.

**Props:**
```typescript
interface ScheduleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

## Datos Esperados

### MeetingConfigData
```typescript
interface MeetingConfigData {
  modality: '1' | '3' | '5';    // Cantidad de sets
  location: string;              // Ubicación del partido
  surface: SurfaceType;          // Tipo de cancha
}
```

### InviteOpponentData
```typescript
interface InviteOpponentData {
  selectedFriendId?: number;     // ID del amigo seleccionado
}
```

### Friend
```typescript
interface Friend {
  id: number;
  nombre: string;
  nivel: 'Amateur' | 'Intermedio' | 'Avanzado' | 'Semi-Pro' | 'Profesional';
  avatar?: string;
  isSelected?: boolean;
}
```

## Uso

```typescript
import { Agendamiento } from '@/views/ui/components/components/agendamiento';

function MyPage() {
  return <Agendamiento />;
}
```

## TODO / Mejoras Futuras

- [ ] Integrar con API real para obtener amigos
- [ ] Agregar validación avanzada del formulario
- [ ] Implementar lógica de agendamiento en backend
- [ ] Agregar notificaciones al agendar
- [ ] Integrar con calendario para seleccionar fecha/hora
- [ ] Agregar búsqueda y filtros de amigos
- [ ] Persistir estados en localStorage
