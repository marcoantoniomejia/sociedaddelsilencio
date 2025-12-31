document.addEventListener('DOMContentLoaded', function() {

    // --- Menú de Navegación Móvil (Hamburguesa) ---
    const initializeHamburgerMenu = () => {
        const hamburger = document.querySelector('.header__hamburger');
        const nav = document.querySelector('.nav');

        if (hamburger && nav) {
            hamburger.addEventListener('click', () => {
                nav.classList.toggle('is-active');
                hamburger.classList.toggle('is-active');
            });

            // Cerrar menú al hacer clic en un enlace
            nav.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    if (nav.classList.contains('is-active')) {
                        nav.classList.remove('is-active');
                        hamburger.classList.remove('is-active');
                    }
                });
            });
        }
    };

    // Inicializar el menú de hamburguesa
    initializeHamburgerMenu();

    // --- Header Glassmorphism con Scroll ---
    const initializeScrollHeader = () => {
        const header = document.querySelector('.header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    };

    // Inicializar scroll header
    initializeScrollHeader();

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
    const contactForm = document.querySelector('.form');
    if (contactForm && contactForm.getAttribute('action').includes('formspree')) {
        // No hacer nada si es un form de formspree
    } else if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Gracias por su interés. Este formulario es una demostración. En una aplicación real, su mensaje sería enviado.');
            contactForm.reset();
        });
    }

});