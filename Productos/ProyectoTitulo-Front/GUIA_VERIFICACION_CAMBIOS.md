# ✅ Verificación de Cambios - Guía de Testing

> Instrucciones para verificar que todos los cambios han sido implementados correctamente

---

## 🧪 Testing Funcional

### Test 1: Selector de Rol - Interfaz Visual

**Pasos:**
1. Navega a `/register`
2. Deberías ver una pantalla con dos botones:
   - "Soy Jugador" con icono de tenis 🎾
   - "Soy Entrenador" con icono de escuela 📚

**Verificaciones visuales:**
- ✅ Botones tienen borde dorado (#ffc174)
- ✅ Hay efecto de glow al pasar el mouse
- ✅ El texto está centrado y formateado en uppercase
- ✅ Responsividad: En móvil están en 1 columna, en desktop 2 columnas
- ✅ Animación suave al hacer hover

---

### Test 2: Registro de Jugador

**Pasos:**
1. Click en "Soy Jugador"
2. Deberías ver el formulario con:
   - Campo foto de perfil (arriba)
   - Campos básicos: nombre, apellidos, correo, password
   - Campo fecha de nacimiento (DATE PICKER)
   - Sección "Información de rendimiento":
     - Sexo (dropdown)
     - Altura (cm)
     - Peso (kg)
   - Botón atrás y botón registrarse

**Verificaciones:**
- ✅ Campo fecha_nacimiento es un date picker
- ✅ Foto de perfil está visible solo para Jugador
- ✅ Sección de rendimiento está visible
- ✅ Al enviar, se envía `rol: "Jugador"`
- ✅ Se envían: sexo, altura, peso

---

### Test 3: Registro de Entrenador

**Pasos:**
1. Click en "Soy Entrenador"
2. Deberías ver el formulario con:
   - Campos básicos: nombre, apellidos, correo, password
   - Campo fecha de nacimiento (DATE PICKER)
   - ❌ NO: foto de perfil
   - ❌ NO: sexo, altura, peso
   - Botón atrás y botón registrarse

**Verificaciones:**
- ✅ Foto de perfil está OCULTA
- ✅ Sección de rendimiento está OCULTA
- ✅ Al enviar, se envía `rol: "Entrenador"`
- ✅ NO se envían: sexo, altura, peso

---

### Test 4: Validación de Fecha

**Pasos:**
1. Intenta registrar con fecha < 16 años
2. Deberías ver error: "Debe ser mayor de 16 años"

**Verificaciones:**
- ✅ Validación de edad mínima funciona
- ✅ Formato YYYY-MM-DD es validado

---

### Test 5: Botón Atrás

**Pasos:**
1. Click en "Soy Jugador"
2. Click en botón "Atrás"
3. Deberías volver al selector de rol

**Verificaciones:**
- ✅ Vuelves al selector inicial
- ✅ El estado se resetea

---

### Test 6: Login Post-Registro

**Pasos:**
1. Registra un Jugador exitosamente
2. Inicia sesión con ese usuario
3. Abre DevTools > Console > sessionStorage

**Verificaciones:**
- ✅ Token contiene `rol: "Jugador"`
- ✅ Token contiene `nivelUsuario: null`
- ✅ Token contiene `sexo` del usuario
- ✅ Usuario se guarda en sessionStorage

---

## 📋 Verificación de Código

### AuthContext.tsx

```bash
# Verifica que la interfaz UsuarioAuth contenga:
grep -n "rol:" src/context/AuthContext.tsx
grep -n "fecha_nacimiento" src/context/AuthContext.tsx
grep -n "nivelUsuario" src/context/AuthContext.tsx
```

**Esperado:**
```typescript
rol: "Jugador" | "Entrenador";
fecha_nacimiento?: string;
nivelUsuario?: string | null;
```

---

### usuarioService.ts

```bash
# Verifica que UsuarioData tenga rol y fecha_nacimiento
grep -A 10 "interface UsuarioData" src/services/usuarioService.ts
```

**Esperado:**
```typescript
rol: "Jugador" | "Entrenador";
fecha_nacimiento: string;
```

---

### userDataValidator.ts

```bash
# Verifica que use discriminatedUnion
grep -n "discriminatedUnion" src/views/pages/context/register/model/userDataValidator.ts
```

**Esperado:**
- Schema discriminado por rol
- Validación diferente para Jugador vs Entrenador

---

### formValidator.module.css

```bash
# Verifica que existan los estilos de rol
grep -n "roleButton\|roleIcon\|roleSelector" src/views/pages/context/register/view/formValidator.module.css
```

**Esperado:**
- Clases CSS para: roleSelector, roleButton, roleIcon, etc.

---

## 🔍 Verificación de Estilos

### Color dorado consistente
```bash
# Busca referencias al color #ffc174
grep -r "#ffc174" src/views/pages/context/register/
grep -r "rgba(255, 193, 116" src/views/pages/context/register/
```

**Esperado:**
- Borders en hover: #ffc174
- Glow effect: rgba(255, 193, 116, 0.x)

---

## 📊 Cobertura de cambios

### Archivos modificados: ✅ 5
- [x] AuthContext.tsx
- [x] usuarioService.ts
- [x] userDataValidator.ts
- [x] formValidator.tsx
- [x] formValidator.module.css

### Documentos creados: ✅ 3
- [x] CAMBIOS_API_CONTRACTS_IMPLEMENTADOS.md
- [x] CAMBIOS_DISEÑO_SELECTOR_ROL.md
- [x] RESUMEN_CAMBIOS_FASE_1.md

### Cambios funcionales: ✅ 8
- [x] JWT con `rol`
- [x] Registro bifurcado por rol
- [x] `edad` → `fecha_nacimiento`
- [x] Campos condicionales por rol
- [x] Selector visual de rol
- [x] Validación de edad mínima
- [x] Estilos temáticos dorados
- [x] Iconos Material Symbols

---

## 🚨 Checklist Pre-Deploy

- [ ] Verificar que Material Symbols está en index.html
- [ ] Verificar que Manrope font está importada
- [ ] Ejecutar `npm run build` sin errores
- [ ] Verificar en navegador (Chrome/Firefox/Safari)
- [ ] Probar registro en Jugador
- [ ] Probar registro en Entrenador
- [ ] Probar login y verificar token
- [ ] Probar validación de edad
- [ ] Verificar responsividad en móvil

---

## 📱 Responsividad

### Móvil (< 600px)
- [ ] Botones stack vertical (1 columna)
- [ ] Formulario llena el ancho
- [ ] Inputs en columna única

### Tablet (600px - 1024px)
- [ ] Botones en 2 columnas
- [ ] Formulario tiene max-width

### Desktop (> 1024px)
- [ ] Botones en 2 columnas espaciadas
- [ ] Formulario centrado con max-width 640px
- [ ] Metrics grid 3 columnas

---

## 🎨 Verificación Visual

### Colores
| Elemento | Color | RGB |
|----------|-------|-----|
| Acentos | #ffc174 | 255, 193, 116 |
| Fondo | #0a0a0a | 10, 10, 10 |
| Texto principal | #e2e2e2 | 226, 226, 226 |
| Texto secundario | #a08e7a | 160, 142, 122 |

### Fuentes
- [ ] Font-family: 'Manrope'
- [ ] Weights: 700, 800, 900
- [ ] Text-transform: uppercase

### Iconos
- [ ] Material Symbols: sports_tennis (Jugador)
- [ ] Material Symbols: school (Entrenador)
- [ ] Size: 3.5rem
- [ ] Color: #ffc174

---

## ✨ Resultado esperado final

**Pantalla 1 - Selector:**
```
Título dorado + Subtítulo beige
Dos botones con borde dorado + iconos grandes
```

**Pantalla 2 - Registro Jugador:**
```
Foto de perfil
Campos básicos (nombre, apellidos, correo, password)
Fecha nacimiento (date picker)
Sección "Información de rendimiento"
  - Sexo, Altura, Peso
Botón atrás + Botón registrarse
```

**Pantalla 3 - Registro Entrenador:**
```
Campos básicos (nombre, apellidos, correo, password)
Fecha nacimiento (date picker)
Botón atrás + Botón registrarse
```

---

**Estado**: ✅ Ready for testing  
**Última actualización**: 23 de mayo, 2026
