document.addEventListener('DOMContentLoaded', function() {

    // --- Menú de Navegación Móvil (Hamburguesa) ---
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
        });

        // Cerrar menú al hacer clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-active')) {
                    hamburger.classList.remove('is-active');
                    mainNav.classList.remove('is-active');
                }
            });
        });
    }

    // --- Animación de aparición de secciones al hacer scroll ---
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% de la sección debe ser visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez que es visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Evitar que el formulario se envíe (es solo un placeholder) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Gracias por su interés. Este formulario es una demostración. En una aplicación real, su mensaje sería enviado.');
            contactForm.reset();
        });
    }

});
