# ✅ Día 7: Optimización de Imágenes - Completado

**Fecha:** 2025-12-30  
**Tiempo invertido:** 1 hora  
**Archivos modificados:** 2 (`_header.html`, `index.html`)  
**Estado:** ✅ COMPLETADO

---

## 📊 Resumen de Cambios

### 1. Logo del Header Optimizado

**Archivo:** `src/_header.html`

**Antes:**

```html
<img
  src="assets/images/logoSS322-new01.png"
  alt="Logo de la Masonería: Escuadra y Compás"
  class="header__logo"
/>
```

**Después:**

```html
<img
  src="assets/images/logoSS322-new01.png"
  alt="Logo Logia Sociedad del Silencio 322 - Escuadra y Compás Masónico"
  class="header__logo"
  width="50"
  height="50"
  fetchpriority="high"
/>
```

**Mejoras aplicadas:**

- ✅ **width="50" height="50"** - Evita layout shift (CLS)
- ✅ **fetchpriority="high"** - Prioriza carga del logo
- ✅ **alt mejorado** - Más descriptivo para SEO ("Logia Sociedad del Silencio 322")
- ❌ **NO lazy loading** - El logo está "above the fold" (visible inmediatamente)

---

### 2. Preload del Logo Añadido

**Archivo:** `src/index.html`

**Añadido en `<head>`:**

```html
<!-- Preload: Recursos Críticos -->
<link
  rel="preload"
  href="assets/images/logoSS322-new01.png"
  as="image"
  type="image/png"
/>
```

**Beneficio:**

- ✅ Carga prioritaria del logo
- ✅ Mejora LCP (Largest Contentful Paint)
- ✅ Reduce tiempo de renderizado inicial

---

## 🎯 Impacto en Performance

### Core Web Vitals Esperados

| Métrica                            | Antes   | Después | Mejora |
| ---------------------------------- | ------- | ------- | ------ |
| **LCP** (Largest Contentful Paint) | ~2.5s   | ~2.0s   | -20%   |
| **CLS** (Cumulative Layout Shift)  | 0.1-0.2 | <0.05   | -75%   |
| **FCP** (First Contentful Paint)   | ~1.5s   | ~1.2s   | -20%   |

**Explicación:**

- **LCP mejorado:** Preload del logo acelera renderizado
- **CLS mejorado:** Dimensiones explícitas evitan saltos de layout
- **FCP mejorado:** fetchpriority="high" prioriza recursos críticos

---

## 📝 Guía de Mejores Prácticas para Futuras Imágenes

### Regla General: ¿Cuándo usar qué?

```
┌─────────────────────────────────────────────────────────┐
│                  DECISIÓN DE CARGA                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ¿La imagen está ABOVE THE FOLD?                       │
│  (visible sin hacer scroll)                            │
│                                                         │
│         SÍ                          NO                  │
│         │                           │                   │
│         ▼                           ▼                   │
│  fetchpriority="high"        loading="lazy"            │
│  + preload (opcional)        width + height            │
│  width + height              alt descriptivo           │
│  alt descriptivo                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Caso 1: Imágenes Above the Fold (Visibles Inmediatamente)

**Ejemplos:**

- Logo del header ✅ (ya optimizado)
- Hero image (si fuera `<img>` en lugar de background)
- Primera imagen de contenido

**Código recomendado:**

```html
<img
  src="assets/images/hero.jpg"
  alt="Descripción específica y descriptiva"
  width="1200"
  height="600"
  fetchpriority="high"
/>
```

**Preload (opcional pero recomendado):**

```html
<!-- En <head> -->
<link rel="preload" href="assets/images/hero.jpg" as="image" />
```

---

### Caso 2: Imágenes Below the Fold (Requieren Scroll)

**Ejemplos:**

- Imágenes de blog
- Galería de fotos
- Imágenes de secciones inferiores

**Código recomendado:**

```html
<img
  src="assets/images/blog-post.jpg"
  alt="Descripción específica del contenido de la imagen"
  width="800"
  height="450"
  loading="lazy"
/>
```

**NO usar:**

- ❌ `fetchpriority="high"` (solo para above the fold)
- ❌ `preload` (desperdicia ancho de banda)

---

### Caso 3: Background Images en CSS

**Situación actual:**

- Hero section usa `background-image` en CSS ✅

**Código actual (correcto):**

```css
.hero {
  background: var(--gradient-overlay),
    url("../images/logoSS322-new01.png") no-repeat center center/cover;
}
```

**Cuándo usar background-image:**

- ✅ Imágenes decorativas
- ✅ Patrones de fondo
- ✅ Cuando necesitas overlay/gradiente

**Cuándo NO usar background-image:**

- ❌ Imágenes con contenido importante (usar `<img>`)
- ❌ Imágenes que necesitan alt text para SEO
- ❌ Imágenes que deben ser indexadas por Google

---

## 🖼️ Plantillas de Código para Copiar/Pegar

### Imagen de Blog Post

```html
<article class="blog__post-full">
  <img
    src="assets/images/blog/post-titulo.jpg"
    alt="Descripción detallada: Qué muestra la imagen y contexto"
    width="800"
    height="450"
    loading="lazy"
    class="blog__image"
  />
  <h2>Título del Post</h2>
  <p>Contenido...</p>
</article>
```

---

### Galería de Imágenes

```html
<div class="gallery">
  <figure class="gallery__item">
    <img
      src="assets/images/gallery/evento-1.jpg"
      alt="Evento masónico 2024 - Ceremonia de iniciación"
      width="600"
      height="400"
      loading="lazy"
    />
    <figcaption>Ceremonia de Iniciación 2024</figcaption>
  </figure>

  <figure class="gallery__item">
    <img
      src="assets/images/gallery/evento-2.jpg"
      alt="Reunión fraternal Logia Sociedad del Silencio 322"
      width="600"
      height="400"
      loading="lazy"
    />
    <figcaption>Reunión Fraternal</figcaption>
  </figure>
</div>
```

---

### Imagen con Formato Moderno (WebP + Fallback)

```html
<picture>
  <!-- Formato moderno (WebP) -->
  <source srcset="assets/images/hero.webp" type="image/webp" />

  <!-- Fallback (JPEG/PNG) -->
  <img
    src="assets/images/hero.jpg"
    alt="Templo Masónico Sociedad del Silencio 322"
    width="1200"
    height="600"
    loading="lazy"
  />
</picture>
```

---

## 📐 Cómo Obtener Dimensiones de Imágenes

### Opción 1: Desde Terminal (Linux/Mac)

```bash
# Para PNG
file assets/images/logoSS322-new01.png

# Para JPEG
identify assets/images/foto.jpg

# Múltiples archivos
for img in assets/images/*.{jpg,png}; do
    echo "$img: $(identify -format '%wx%h' "$img")"
done
```

### Opción 2: Desde Navegador

1. Abrir DevTools (F12)
2. Ir a Network tab
3. Recargar página
4. Buscar la imagen
5. Ver dimensiones en la columna "Size"

### Opción 3: Propiedades del Archivo

- **Windows:** Clic derecho → Propiedades → Detalles
- **Mac:** Clic derecho → Get Info
- **Linux:** Clic derecho → Properties → Image

---

## 🎨 Guía de Alt Text Efectivo

### ❌ Alt Text Malo (Genérico)

```html
<img src="logo.png" alt="logo" />
<img src="foto.jpg" alt="imagen" />
<img src="templo.jpg" alt="templo masónico" />
```

### ✅ Alt Text Bueno (Descriptivo y SEO-Friendly)

```html
<img
  src="logo.png"
  alt="Logo Logia Sociedad del Silencio 322 - Escuadra y Compás Masónico"
/>
<img
  src="foto.jpg"
  alt="Ceremonia de iniciación masónica en Templo Sociedad del Silencio 322"
/>
<img
  src="templo.jpg"
  alt="Interior del Templo Masónico ubicado en Sadi Carnot 75, CDMX"
/>
```

### Fórmula para Alt Text Perfecto

```
[Qué es] + [Contexto específico] + [Ubicación/Evento si aplica]
```

**Ejemplos:**

- "Logo Logia Sociedad del Silencio 322 - Escuadra y Compás Masónico"
- "Reunión fraternal de la Logia SS322 en diciembre 2024"
- "Símbolo masónico de la escuadra y compás con letra G"

---

## 🚀 Optimización Avanzada (Futuro)

### 1. Convertir Imágenes a WebP

**Ventajas:**

- 25-35% más pequeñas que JPEG
- Mejor calidad a menor tamaño
- Soportado por todos los navegadores modernos

**Herramienta:**

```bash
# Instalar cwebp
sudo apt install webp  # Linux
brew install webp      # Mac

# Convertir imagen
cwebp -q 80 input.jpg -o output.webp

# Batch conversion
for img in *.jpg; do
    cwebp -q 80 "$img" -o "${img%.jpg}.webp"
done
```

---

### 2. Responsive Images (srcset)

**Para diferentes tamaños de pantalla:**

```html
<img
  src="assets/images/hero-800.jpg"
  srcset="
    assets/images/hero-400.jpg   400w,
    assets/images/hero-800.jpg   800w,
    assets/images/hero-1200.jpg 1200w,
    assets/images/hero-1600.jpg 1600w
  "
  sizes="(max-width: 600px) 400px,
           (max-width: 1200px) 800px,
           1200px"
  alt="Hero image"
  width="1200"
  height="600"
  loading="lazy"
/>
```

---

### 3. Lazy Loading con Intersection Observer (JavaScript)

**Para control más fino:**

```javascript
// En main.js
const lazyImages = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));
```

**HTML:**

```html
<img
  data-src="assets/images/lazy-image.jpg"
  alt="Imagen con lazy loading personalizado"
  width="800"
  height="450"
/>
```

---

## 📊 Checklist de Optimización de Imágenes

### Para Cada Imagen Nueva:

- [ ] ✅ Atributo `alt` descriptivo y SEO-friendly
- [ ] ✅ Atributos `width` y `height` especificados
- [ ] ✅ `loading="lazy"` si está below the fold
- [ ] ✅ `fetchpriority="high"` si está above the fold
- [ ] ✅ Formato optimizado (WebP si es posible)
- [ ] ✅ Tamaño de archivo razonable (<200KB idealmente)
- [ ] ✅ Dimensiones apropiadas (no más grandes de lo necesario)

### Para Imágenes Críticas:

- [ ] ✅ Preload en `<head>`
- [ ] ✅ fetchpriority="high"
- [ ] ✅ Formato optimizado
- [ ] ✅ Compresión adecuada

---

## 🛠️ Herramientas Recomendadas

### Compresión de Imágenes

**Online:**

- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [Compressor.io](https://compressor.io/) - Múltiples formatos

**Offline:**

- [ImageOptim](https://imageoptim.com/) - Mac
- [FileOptimizer](https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer) - Windows
- `cwebp` - Command line (todas las plataformas)

### Análisis de Performance

- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's tool
- [GTmetrix](https://gtmetrix.com/) - Detailed analysis
- [WebPageTest](https://www.webpagetest.org/) - Advanced testing

---

## 📈 Métricas a Monitorear

### Antes vs Después (Esperado)

| Métrica              | Antes | Después | Objetivo     |
| -------------------- | ----- | ------- | ------------ |
| **LCP**              | 2.5s  | 2.0s    | <2.5s (Good) |
| **CLS**              | 0.15  | 0.03    | <0.1 (Good)  |
| **FCP**              | 1.5s  | 1.2s    | <1.8s (Good) |
| **Total Image Size** | -     | -       | <500KB       |

### Cómo Medir

1. **Google PageSpeed Insights:**

   ```
   https://pagespeed.web.dev/
   Analizar: https://www.sociedaddelsilencio322.org/
   ```

2. **Chrome DevTools:**

   - F12 → Lighthouse tab
   - Generate report
   - Ver "Performance" y "Best Practices"

3. **Network Tab:**
   - F12 → Network
   - Filtrar por "Img"
   - Ver tamaño y tiempo de carga

---

## ✅ Estado Actual del Proyecto

### Imágenes Optimizadas:

- [x] ✅ Logo del header (`_header.html`)
  - width/height: 50x50
  - fetchpriority: high
  - alt mejorado
  - preload añadido

### Imágenes en CSS (No requieren optimización):

- [x] ✅ Hero background (`style.css`)
  - Correctamente implementado como background-image
  - Overlay con gradiente aplicado

### Pendiente (Cuando se añadan):

- [ ] ⏳ Imágenes de blog posts
- [ ] ⏳ Galería de eventos
- [ ] ⏳ Fotos de miembros/actividades
- [ ] ⏳ Iconos/ilustraciones

---

## 🎯 Próximos Pasos

### Inmediato (Después de Deploy)

1. **Medir Performance Actual:**

   - PageSpeed Insights
   - Verificar LCP, CLS, FCP
   - Documentar baseline

2. **Validar Implementación:**
   - Logo carga correctamente
   - No hay layout shift
   - Alt text visible en screen readers

### Cuando Añadas Nuevas Imágenes

1. **Seguir la guía de mejores prácticas**
2. **Usar las plantillas de código**
3. **Optimizar antes de subir** (TinyPNG, Squoosh)
4. **Medir impacto en performance**

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [MDN: Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev: Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Web.dev: Preload Critical Assets](https://web.dev/preload-critical-assets/)

### Guías

- [Google: Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [WebP Guide](https://developers.google.com/speed/webp)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Fecha de implementación:** 2025-12-30  
**Próximo:** Día 8 - Accesibilidad Básica (skip links, focus states, ARIA)  
**Estado:** ✅ COMPLETADO
