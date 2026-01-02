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

    // --- Animaciones de Entrada Mejoradas ---
    const initializeScrollAnimations = () => {
        // Seleccionar elementos con animación
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length === 0) {
            // Fallback: animar secciones si no hay elementos específicos
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.classList.add('animate-on-scroll', 'animate-fadeInUp');
            });
        }
        
        // Configuración del observer
        const observerOptions = {
            root: null,
            rootMargin: '-50px', // Activar cuando esté 50px dentro del viewport
            threshold: 0.15 // 15% visible para activar
        };
        
        // Crear observer
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase animated para activar la animación
                    entry.target.classList.add('animated');
                    
                    // Opcional: dejar de observar después de animar
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar todos los elementos animados
        const allAnimated = document.querySelectorAll('.animate-on-scroll');
        allAnimated.forEach(element => {
            animationObserver.observe(element);
        });
    };

    // Inicializar animaciones de scroll
    initializeScrollAnimations();

    // --- Validación de Formulario ---
    const initializeFormValidation = () => {
        const contactForm = document.querySelector('.form');
        if (!contactForm) return;
        
        // Si es formspree, añadir validación pero permitir envío
        const isFormspree = contactForm.getAttribute('action')?.includes('formspree');
        
        // Función para mostrar error
        const showError = (input, message) => {
            const formGroup = input.closest('.form__group');
            let errorElement = formGroup.querySelector('.form__error');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'form__error';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('form__input--error');
            input.classList.remove('form__input--success');
        };
        
        // Función para mostrar éxito
        const showSuccess = (input) => {
            const formGroup = input.closest('.form__group');
            const errorElement = formGroup.querySelector('.form__error');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            input.classList.remove('form__input--error');
            input.classList.add('form__input--success');
        };
        
        // Función para limpiar validación
        const clearValidation = (input) => {
            const formGroup = input.closest('.form__group');
            const errorElement = formGroup.querySelector('.form__error');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            input.classList.remove('form__input--error', 'form__input--success');
        };
        
        // Validar edad (debe ser mayor de 21 años)
        const validateAge = (dateInput) => {
            const birthDate = new Date(dateInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 21) {
                showError(dateInput, 'Debe ser mayor de 21 años para postularse');
                return false;
            }
            
            showSuccess(dateInput);
            return true;
        };
        
        // Validar email
        const validateEmail = (emailInput) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, 'Por favor ingrese un correo electrónico válido');
                return false;
            }
            
            showSuccess(emailInput);
            return true;
        };
        
        // Validar teléfono (10 dígitos)
        const validatePhone = (phoneInput) => {
            const phoneRegex = /^\d{10}$/;
            const cleanPhone = phoneInput.value.replace(/\s|-/g, '');
            
            if (!phoneRegex.test(cleanPhone)) {
                showError(phoneInput, 'Por favor ingrese un teléfono válido de 10 dígitos');
                return false;
            }
            
            showSuccess(phoneInput);
            return true;
        };
        
        // Validar campo requerido
        const validateRequired = (input) => {
            if (input.value.trim() === '') {
                showError(input, 'Este campo es requerido');
                return false;
            }
            
            showSuccess(input);
            return true;
        };
        
        // Validar textarea (mínimo 20 caracteres)
        const validateTextarea = (textarea) => {
            if (textarea.value.trim().length < 20) {
                showError(textarea, 'Por favor proporcione al menos 20 caracteres');
                return false;
            }
            
            showSuccess(textarea);
            return true;
        };
        
        // Event listeners para validación en tiempo real
        const nombreInput = contactForm.querySelector('#nombre');
        const fechaInput = contactForm.querySelector('#fecha_nacimiento');
        const profesionInput = contactForm.querySelector('#profesion');
        const estadoCivilInput = contactForm.querySelector('#estado_civil');
        const residenciaInput = contactForm.querySelector('#residencia');
        const emailInput = contactForm.querySelector('#email');
        const telefonoInput = contactForm.querySelector('#telefono');
        const interesTextarea = contactForm.querySelector('#interes');
        const queEntiendesTextarea = contactForm.querySelector('#que_entiendes');
        
        // Validación en blur (cuando el usuario sale del campo)
        if (nombreInput) {
            nombreInput.addEventListener('blur', () => validateRequired(nombreInput));
        }
        
        if (fechaInput) {
            fechaInput.addEventListener('blur', () => validateAge(fechaInput));
        }
        
        if (profesionInput) {
            profesionInput.addEventListener('blur', () => validateRequired(profesionInput));
        }
        
        if (estadoCivilInput) {
            estadoCivilInput.addEventListener('blur', () => validateRequired(estadoCivilInput));
        }
        
        if (residenciaInput) {
            residenciaInput.addEventListener('blur', () => validateRequired(residenciaInput));
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => validateEmail(emailInput));
        }
        
        if (telefonoInput) {
            telefonoInput.addEventListener('blur', () => validatePhone(telefonoInput));
        }
        
        if (interesTextarea) {
            interesTextarea.addEventListener('blur', () => validateTextarea(interesTextarea));
        }
        
        if (queEntiendesTextarea) {
            queEntiendesTextarea.addEventListener('blur', () => validateTextarea(queEntiendesTextarea));
        }
        
        // Validación al enviar el formulario
        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Validar todos los campos
            if (nombreInput && !validateRequired(nombreInput)) isValid = false;
            if (fechaInput && !validateAge(fechaInput)) isValid = false;
            if (profesionInput && !validateRequired(profesionInput)) isValid = false;
            if (estadoCivilInput && !validateRequired(estadoCivilInput)) isValid = false;
            if (residenciaInput && !validateRequired(residenciaInput)) isValid = false;
            if (emailInput && !validateEmail(emailInput)) isValid = false;
            if (telefonoInput && !validatePhone(telefonoInput)) isValid = false;
            if (interesTextarea && !validateTextarea(interesTextarea)) isValid = false;
            if (queEntiendesTextarea && !validateTextarea(queEntiendesTextarea)) isValid = false;
            
            // Si no es válido, prevenir envío
            if (!isValid) {
                e.preventDefault();
                
                // Scroll al primer error
                const firstError = contactForm.querySelector('.form__input--error, .form__textarea--error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                
                return false;
            }
            
            // Si no es formspree, prevenir y mostrar mensaje
            if (!isFormspree) {
                e.preventDefault();
                alert('Gracias por su interés. Este formulario es una demostración. En una aplicación real, su mensaje sería enviado.');
                contactForm.reset();
                
                // Limpiar todas las validaciones
                contactForm.querySelectorAll('.form__input, .form__textarea').forEach(input => {
                    clearValidation(input);
                });
            }
            
            // Si es formspree y es válido, permitir envío normal
        });
    };
    
    // Inicializar validación de formulario
    initializeFormValidation();

    // --- FAQ Accordion ---
    const initializeFAQ = () => {
        const faqQuestions = document.querySelectorAll('.faq__question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Cerrar todas las preguntas
                document.querySelectorAll('.faq__item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                });
                
                // Abrir la pregunta clickeada si no estaba activa
                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    // Inicializar FAQ
    initializeFAQ();

    // --- Smooth Scroll Mejorado ---
    const initializeSmoothScroll = () => {
        // Obtener altura del header fijo
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const offset = headerHeight + 20; // 20px de espacio adicional

        // Seleccionar todos los enlaces que apuntan a anclajes
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Ignorar enlaces vacíos o solo "#"
                if (!href || href === '#') return;
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calcular posición con offset
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    // Scroll suave
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin saltar
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                    
                    // Cerrar menú mobile si está abierto
                    const nav = document.querySelector('.nav');
                    const hamburger = document.querySelector('.header__hamburger');
                    if (nav && nav.classList.contains('is-active')) {
                        nav.classList.remove('is-active');
                        if (hamburger) hamburger.classList.remove('is-active');
                    }
                }
            });
        });
    };

    // Inicializar smooth scroll
    initializeSmoothScroll();

    // --- Lazy Loading de Imágenes ---
    const initializeLazyLoading = () => {
        // Seleccionar todas las imágenes con data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        // Configuración del observer
        const imageObserverOptions = {
            root: null, // viewport
            rootMargin: '50px', // Cargar 50px antes de ser visible
            threshold: 0.01 // 1% visible para activar
        };
        
        // Crear observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Cargar imagen real
                    img.src = img.dataset.src;
                    
                    // Opcional: cargar srcset si existe
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    // Añadir clase loaded para animación
                    img.classList.add('loaded');
                    
                    // Dejar de observar esta imagen
                    observer.unobserve(img);
                }
            });
        }, imageObserverOptions);
        
        // Observar cada imagen lazy
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    };

    // Inicializar lazy loading
    initializeLazyLoading();

    // --- Contador Animado ---
    const initializeCounters = () => {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) return;
        
        // Función para animar un contador
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            
            const startTime = performance.now();
            const startValue = 0;
            
            // Easing function (ease-out)
            const easeOutQuad = (t) => t * (2 - t);
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Aplicar easing
                const easedProgress = easeOutQuad(progress);
                const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
                
                // Actualizar texto con formato
                counter.textContent = prefix + currentValue.toLocaleString('es-MX') + suffix;
                
                // Continuar animación si no ha terminado
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Asegurar valor final exacto
                    counter.textContent = prefix + target.toLocaleString('es-MX') + suffix;
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        // Observer para activar contadores al hacerse visibles
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    
                    // Animar solo una vez
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                        observer.unobserve(counter);
                    }
                }
            });
        }, {
            threshold: 0.5 // 50% visible para activar
        });
        
        // Observar todos los contadores
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    };

    // Inicializar contadores
    initializeCounters();

    // --- Newsletter Signup ---
    const initializeNewsletter = () => {
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;
        
        const emailInput = document.getElementById('newsletter-email');
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Por favor ingrese un correo electrónico válido');
                emailInput.focus();
                return;
            }
            
            // Crear mensaje de éxito si no existe
            let successMessage = newsletterForm.querySelector('.newsletter-success');
            if (!successMessage) {
                successMessage = document.createElement('div');
                successMessage.className = 'newsletter-success';
                newsletterForm.appendChild(successMessage);
            }
            
            // Mostrar mensaje de éxito
            successMessage.textContent = '¡Gracias por suscribirte! Pronto recibirás nuestro contenido exclusivo.';
            successMessage.classList.add('show');
            
            // Limpiar formulario
            emailInput.value = '';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            // Aquí se puede integrar con Mailchimp, Formspree, etc.
            console.log('Newsletter signup:', emailInput.value);
        });
    };
    
    // Inicializar newsletter
    initializeNewsletter();

});