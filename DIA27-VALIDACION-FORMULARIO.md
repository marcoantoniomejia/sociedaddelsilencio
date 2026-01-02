# ✅ Día 27: Validación de Formulario - Completado

**Fecha:** 2026-01-02  
**Tiempo invertido:** 1 hora  
**Archivos modificados:** `main.js`, `style.css`  
**Estado:** ✅ COMPLETADO

---

## 📊 Resumen de Cambios

### 1. Validación en Tiempo Real ✅

**Validación al salir del campo (blur):**

- Nombre completo
- Fecha de nacimiento (>21 años)
- Profesión
- Estado civil
- Residencia
- Email (formato válido)
- Teléfono (10 dígitos)
- Textareas (mínimo 20 caracteres)

---

### 2. Validaciones Específicas ✅

**Edad (>21 años):**

```javascript
const validateAge = (dateInput) => {
  const birthDate = new Date(dateInput.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  // Ajuste por mes y día

  if (age < 21) {
    showError(dateInput, "Debe ser mayor de 21 años para postularse");
    return false;
  }
  return true;
};
```

**Email:**

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Teléfono (10 dígitos):**

```javascript
const phoneRegex = /^\d{10}$/;
const cleanPhone = phoneInput.value.replace(/\s|-/g, "");
```

**Textarea (mínimo 20 caracteres):**

```javascript
if (textarea.value.trim().length < 20) {
  showError(textarea, "Por favor proporcione al menos 20 caracteres");
}
```

---

### 3. Indicadores Visuales ✅

**Estados:**

- ❌ **Error:** Borde rojo + shake animation
- ✅ **Éxito:** Borde verde
- 📝 **Mensaje de error:** Texto rojo debajo del campo

---

## 🎨 Efectos Visuales

### Estado Error

```
┌─────────────────────────────┐
│ 👤  Juan                    │ ← Borde rojo + shake
└─────────────────────────────┘
  ❌ Este campo es requerido
```

### Estado Éxito

```
┌─────────────────────────────┐
│ 👤  Juan Pérez García       │ ← Borde verde
└─────────────────────────────┘
  ✅ (sin mensaje)
```

---

## 🎯 Validaciones Implementadas

### 1. Campos Requeridos

**Campos:**

- Nombre completo
- Profesión
- Estado civil
- Residencia

**Validación:**

```javascript
if (input.value.trim() === "") {
  showError(input, "Este campo es requerido");
}
```

---

### 2. Validación de Edad

**Requisito:** Mayor de 21 años

**Lógica:**

```javascript
// Calcula edad exacta considerando mes y día
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();

if (
  monthDiff < 0 ||
  (monthDiff === 0 && today.getDate() < birthDate.getDate())
) {
  age--;
}
```

**Mensaje de error:**
"Debe ser mayor de 21 años para postularse"

---

### 3. Validación de Email

**Regex:**

```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Válidos:**

- usuario@ejemplo.com
- nombre.apellido@dominio.mx

**Inválidos:**

- usuario@ejemplo
- @ejemplo.com
- usuario ejemplo.com

---

### 4. Validación de Teléfono

**Requisito:** 10 dígitos

**Lógica:**

```javascript
// Limpia espacios y guiones
const cleanPhone = phoneInput.value.replace(/\s|-/g, "");

// Valida 10 dígitos
/^\d{10}$/.test(cleanPhone);
```

**Válidos:**

- 5512345678
- 55 1234 5678
- 55-1234-5678

**Inválidos:**

- 551234567 (9 dígitos)
- 55123456789 (11 dígitos)

---

### 5. Validación de Textarea

**Requisito:** Mínimo 20 caracteres

**Lógica:**

```javascript
if (textarea.value.trim().length < 20) {
  showError(textarea, "Por favor proporcione al menos 20 caracteres");
}
```

---

## 🎬 Flujo de Validación

### Al Salir del Campo (Blur)

```
Usuario llena campo
    ↓
Usuario sale del campo (blur)
    ↓
Validación automática
    ↓
¿Válido?
├─ SÍ → Borde verde + icono verde
└─ NO → Borde rojo + mensaje error + shake
```

---

### Al Enviar Formulario

```
Usuario click "Enviar"
    ↓
Validar TODOS los campos
    ↓
¿Todos válidos?
├─ SÍ → Enviar formulario (Formspree)
│        o mostrar mensaje (demo)
│
└─ NO → Prevenir envío
         ↓
         Scroll al primer error
         ↓
         Focus en campo con error
```

---

## 📋 Funciones Principales

### showError()

```javascript
const showError = (input, message) => {
  // Crear elemento de error
  // Añadir clase .form__input--error
  // Mostrar mensaje
};
```

### showSuccess()

```javascript
const showSuccess = (input) => {
  // Remover mensaje de error
  // Añadir clase .form__input--success
};
```

### clearValidation()

```javascript
const clearValidation = (input) => {
  // Remover mensaje de error
  // Remover clases de validación
};
```

---

## 🎨 Animaciones

### Shake (Error)

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
```

**Efecto:**

```
Normal: ─────
Shake:  ←→←→← (vibra horizontalmente)
```

---

### Slide Down (Mensaje Error)

```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Efecto:**

```
Mensaje aparece deslizándose desde arriba
```

---

## ✅ Checklist

### JavaScript ✅

- [x] Validación de edad (>21 años)
- [x] Validación de email
- [x] Validación de teléfono (10 dígitos)
- [x] Validación de campos requeridos
- [x] Validación de textareas (>20 caracteres)
- [x] Validación en blur
- [x] Validación al submit
- [x] Scroll al primer error
- [x] Limpieza de validaciones

### CSS ✅

- [x] Estilos para .form\_\_error
- [x] Estilos para .form\_\_input--error
- [x] Estilos para .form\_\_input--success
- [x] Animación shake
- [x] Animación slideDown
- [x] Colores de iconos según estado

### UX ✅

- [x] Feedback inmediato
- [x] Mensajes claros
- [x] Scroll automático a errores
- [x] Animaciones suaves

---

## 🧪 Cómo Probar

### 1. Validación de Edad

**Pasos:**

1. Ingresar fecha que resulte en <21 años
2. Salir del campo
3. **Observar:**
   - Borde rojo ✅
   - Mensaje: "Debe ser mayor de 21 años..." ✅
   - Shake animation ✅

---

### 2. Validación de Email

**Pasos:**

1. Ingresar email inválido: "usuario@ejemplo"
2. Salir del campo
3. **Observar:**
   - Borde rojo ✅
   - Mensaje: "Por favor ingrese un correo..." ✅

---

### 3. Validación de Teléfono

**Pasos:**

1. Ingresar teléfono de 9 dígitos: "551234567"
2. Salir del campo
3. **Observar:**
   - Borde rojo ✅
   - Mensaje: "Por favor ingrese un teléfono válido de 10 dígitos" ✅

---

### 4. Validación de Textarea

**Pasos:**

1. Escribir menos de 20 caracteres
2. Salir del campo
3. **Observar:**
   - Borde rojo ✅
   - Mensaje: "Por favor proporcione al menos 20 caracteres" ✅

---

### 5. Submit con Errores

**Pasos:**

1. Dejar campos vacíos
2. Click en "Enviar Solicitud"
3. **Observar:**
   - Formulario NO se envía ✅
   - Scroll al primer error ✅
   - Focus en campo con error ✅

---

## 📈 Progreso

**Semana 1-5:** ✅ COMPLETADAS  
**Semana 6:** 🔄 EN PROGRESO (40%)

**Días completados:** 27/50 (54% del plan total)

---

## 🎯 Próximos Pasos

### Día 28 (Siguiente)

**Mejoras en Footer:**

- Añadir información de contacto
- Enlaces a redes sociales
- Mapa del sitio
- Copyright y legal

---

**Fecha de implementación:** 2026-01-02  
**Próximo:** Día 28 - Mejoras en Footer  
**Estado:** ✅ COMPLETADO
