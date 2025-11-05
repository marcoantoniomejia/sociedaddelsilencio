# 📜 GEMINI.md: Documentación del Proyecto

Este archivo detalla la estructura, las convenciones y los requisitos de optimización (SEO y A11y) del sitio web del blog de la Respetable Logia Simbólica Sociedad del Silencio 322.

## 1. Sobre el Proyecto

El proyecto es el sitio web oficial del blog de la **R∴L∴S∴ Sociedad del Silencio 322**, jurisdiccionada a la **Muy Respetable Gran Logia del Valle de México**.

*   **Objetivo Principal:** Difundir contenido sobre Masonería, Filosofía, Historia y Filantropía con el fin de atraer a candidatos cualificados de alto nivel (empresarios, políticos, profesionistas) para su iniciación.
*   **Temas Clave:** Masonería, Liderazgo, Filantropía Estratégica, Filosofía Aplicada, Historia Masónica.
*   **Tecnología:** Sitio estático/Híbrido utilizando HTML5, CSS y JavaScript para el frontend, con Ghost como backend (CMS) para la gestión del contenido del blog.
*   **Ubicación y Reuniones:** Sadi Carnot #75, Ciudad de México. Miércoles a las 8:00 p.m.

## 2. Puesta en Marcha y Despliegue

El proyecto está diseñado para ejecutarse en la infraestructura de Google Cloud.

*   **Plataforma de Despliegue:** Google Cloud Run (para el frontend y/o la instancia de Ghost).
*   **Despliegue (Ejemplo - Cloud Run):**
    *   Asegurarse de tener la imagen de Ghost configurada o el sitio estático empaquetado.
    *   Utilizar `gcloud run deploy` para desplegar el servicio.
    *   Gestionar las variables de entorno para la conexión con el CMS (si aplica).
*   **Nota:** Se requiere configurar un `Dockerfile` y `.dockerignore` adaptados a un build de Cloud Run (ya sea para el frontend estático o el CMS Ghost).

## 3. Estructura y Archivos Clave

El proyecto mantendrá la nomenclatura existente y requerirá documentación exhaustiva.

*   **index.html:** La página principal (Landing Page).
*   **quienes-somos.html (o Ruta):** Información sobre la Logia, su historia y su jurisdicción.
*   **principios.html:** Contenido central sobre los principios filosóficos masónicos.
*   **filantropia.html:** Contenido enfocado en el impacto social y estratégico de la filantropía.
*   **contacto-candidatos.html (o Ruta):** Formulario de contacto enfocado en la postulación.
*   **css/styles.css:** Archivo principal de estilos (manteniendo el estilo existente).
*   **blog/blog.html:** La página principal del listado de entradas del blog.
*   **js/:** Archivos de JavaScript (para interacciones y funcionalidades del menú/formulario).

### Requisito de Documentación:

*   **README.md:** Debe estar bien documentado, con instrucciones claras (Ver Sección 7).
*   **Comentarios en Código:** Todos los archivos HTML y CSS deben incluir comentarios que documenten la sección de código y su propósito.

## 4. Convenciones de Código y Nomenclatura

Se mantendrán y se reforzarán las siguientes convenciones para garantizar la uniformidad y el mantenimiento.

*   **Clases CSS:** Usar BEM (Block-Element-Modifier).
    *   **Ejemplo:** `header-principal__logo--oscuro`.
*   **Archivos/Rutas:** Usar kebab-case para todos los nombres de archivos HTML y directorios.
    *   **Ejemplo:** `quienes-somos.html`, `/contacto-candidatos`.
*   **JavaScript:** Usar camelCase para funciones y variables.
    *   **Ejemplo:** `validarFormularioIniciacion()`.

## 5. Optimización para Motores de Búsqueda (SEO) 🔎

El SEO orgánico es la prioridad máxima para atraer a candidatos de alto nivel (empresarios, políticos, profesionistas).

| Elemento | Regla de Implementación | Ejemplo para index.html |
| :--- | :--- | :--- |
| **Title** | Estructura: `[Tópico Principal] | [Nombre de la Logia]` | `Liderazgo y Masonería | Logia Sociedad del Silencio 322` |
| **Meta Description** | Única, enfocada en el desarrollo de carácter, ética, influencia y red de contactos para la élite profesional. Debe filtrar al público objetivo. | `Descubra el camino masónico que ha moldeado a líderes, políticos y profesionistas de alto nivel. La Sociedad del Silencio 322: Ética, influencia y desarrollo personal de élite.` |
| **Canonicalization** | `<link rel="canonical">` siempre incluido, apuntando a la URL preferida para evitar duplicidad de contenido (especialmente importante con Ghost). | `<link rel="canonical" href="https://www.sociedaddelsilencio322.org/index.html">` |
| **Robots** | Usar `index, follow` por defecto en todas las páginas. | `<meta name="robots" content="index, follow">` |

## 5.2. Semántica y Estructura del Contenido
    * Etiquetas H: Estricta jerarquía lógica.

        Solo un <h1> por página, conteniendo la palabra clave principal con un enfoque elevado (Masonería y Liderazgo, Ética Profesional, Filantropía Estratégica).

    * Usar <h2> para los módulos de contenido clave (ej. "Valores Masónicos en la Esfera Pública", "El Liderazgo a través de la Filosofía").

    * HTML Semántico: Priorizar el uso de <main>, <nav>, <header>, <footer>, <section> y <article> para la estructura del contenido, reduciendo el uso de <div>.

Accesibilidad (A11y): Las imágenes deben tener un atributo alt descriptivo. Usar ARIA para enlaces y botones clave.

## 5.3. Datos Estructurados (JSON-LD)
*   **Requerido: Incluir datos estructurados en formato JSON-LD en el <head> de cada página.

*   **index.html y quienes-somos.html: Deben incluir el Schema Organization y LocalBusiness (énfasis en la dirección: Sadi Carnot #75, CDMX, y el horario de reunión para el networking).

*   **Blog/Artículos: Usar el Schema Article (o BlogPosting según Ghost) para cada entrada.

## 6. Accesibilidad (A11y) ♿

El sitio debe cumplir con las pautas de WCAG 2.1 Nivel AA.

*   **Contraste de Color:** Mínimo 4.5:1 para texto normal.
*   **Texto Alternativo:** Todas las imágenes (`<img>`) deben tener un atributo `alt` descriptivo.
*   **Navegación por Teclado:** El sitio debe ser completamente navegable usando solo el teclado.
*   **ARIA Roles:** Usar roles ARIA donde sea necesario para mejorar la semántica.

### 6.1 Integración con Redes Sociales y Plataformas
Se deben implementar etiquetas que faciliten la compartición y el rastreo social.

*   **Open Graph (OG):** Incluir las meta etiquetas OG (ej. `og:title`, `og:description`, `og:image`) para Facebook, Instagram y LinkedIn.

*   **Twitter Cards:** Incluir meta etiquetas específicas para X (Twitter).

*   **Enlaces de Redes Sociales:** Los iconos/enlaces a YouTube, Instagram, Facebook, X y TikTok deben ser visibles en el footer

## 7. Documentación y Mantenimiento

*   **README.md:**
    *   Instrucciones de instalación y despliegue.
    *   Descripción de la arquitectura.
    *   Guía de contribución.
*   **Comentarios en el Código:**
    *   Comentar cada sección de CSS y HTML.
    *   Explicar la lógica de las funciones de JavaScript.

## 8. Plan de Contenido

El contenido del blog se centrará en los temas clave definidos en la sección 1.

*   **Frecuencia:** 1-2 artículos por semana.
*   **Tono:** Serio, académico y profesional.
*   **Autores:** Miembros de la logia y expertos invitados.