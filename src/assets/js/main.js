document.addEventListener('DOMContentLoaded', function() {

    // --- Cargar Header y Footer ---
    const loadHTML = (url, elementId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar ${url}: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                    // Si estamos cargando el header, reinicializamos el menú hamburguesa
                    if (elementId === 'header-placeholder') {
                        initializeHamburgerMenu();
                    }
                }
            })
            .catch(error => console.error(error));
    };

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

    // Solo cargar header y footer en las páginas principales, no en los propios parciales
    if (document.getElementById('header-placeholder')) {
        loadHTML('_header.html', 'header-placeholder');
    }
    if (document.getElementById('footer-placeholder')) {
        loadHTML('_footer.html', 'footer-placeholder');
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