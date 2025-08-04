/**
 * Comité de Investigación - Programa de Microbiología
 * JavaScript Principal
 */

// Configuración global
const CONFIG = {
    animationDuration: 300,
    counterDuration: 2000,
    scrollOffset: 100,
    toastDuration: 5000
};

// Clase principal para manejar la aplicación
class MicrobiologyApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeTooltips();
        this.initializeForms();
        this.initializeCounters();
        this.initializeResourceButtons();
        this.initializeSmoothScrolling();
        this.initializeAccessibility();
    }

    // Navegación entre secciones
    initializeNavigation() {
        window.showSection = (sectionId) => {
            this.showSection(sectionId);
        };
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('section-active');
            section.classList.add('section-hidden');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('section-hidden');
            targetSection.classList.add('section-active');
        }

        this.updateNavigation(sectionId);
        this.scrollToTop();
    }

    updateNavigation(sectionId) {
        // Actualizar navegación de escritorio
        const navButtons = document.querySelectorAll('.nav-pills .nav-link');
        navButtons.forEach(button => {
            button.classList.remove('active');
        });

        const activeButton = document.getElementById('nav-' + sectionId);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Actualizar navegación móvil
        const mobileNavLinks = document.querySelectorAll('#mobileMenu .nav-link');
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.onclick && link.onclick.toString().includes(sectionId)) {
                link.classList.add('active');
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Animaciones de entrada
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        document.querySelectorAll('.card, .research-card, .fade-in').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Tooltips de Bootstrap
    initializeTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );

        this.tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Manejo de formularios
    initializeForms() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();

        // Validación básica
        if (!this.validateForm(e.target)) {
            this.showToast('Por favor, complete todos los campos requeridos.', 'warning');
            return;
        }

        // Mostrar toast de éxito
        this.showToast(
            '¡Gracias por tu mensaje! Te contactaremos pronto.<br><small>Nota: Este es un sitio de demostración.</small>',
            'success'
        );

        // Resetear formulario
        e.target.reset();
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Sistema de notificaciones toast
    showToast(message, type = 'info') {
        const toastColors = {
            success: 'bg-success',
            warning: 'bg-warning text-dark',
            danger: 'bg-danger',
            info: 'bg-info'
        };

        const toastIcons = {
            success: 'bi-check-circle',
            warning: 'bi-exclamation-triangle',
            danger: 'bi-x-circle',
            info: 'bi-info-circle'
        };

        const toastId = 'toast_' + Date.now();
        const toastHtml = `
            <div class="toast align-items-center text-white ${toastColors[type]} border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${toastIcons[type]} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close ${type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto" 
                            data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        // Crear o usar contenedor de toasts existente
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1055';
            document.body.appendChild(toastContainer);
        }

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: CONFIG.toastDuration
        });
        toast.show();

        // Limpiar toast después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Contadores animados para estadísticas
    initializeCounters() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const targetText = entry.target.textContent;
                    const target = parseInt(targetText.replace('+', ''));
                    const hasPlus = targetText.includes('+');

                    entry.target.dataset.animated = 'true';
                    this.animateCounter(entry.target, target, hasPlus);
                }
            });
        }, {threshold: 0.5});

        document.querySelectorAll('.stats-number').forEach(el => {
            statsObserver.observe(el);
        });
    }

    animateCounter(element, target, hasPlus = false) {
        const duration = CONFIG.counterDuration;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }, 16);
    }

    // Botones de recursos (descargas)
    initializeResourceButtons() {
        document.querySelectorAll('button').forEach(button => {
            const buttonText = button.textContent || button.innerText;
            const resourceKeywords = ['Formulario', 'Guía', 'Cronograma', 'Descargar'];

            if (resourceKeywords.some(keyword => buttonText.includes(keyword))) {
                button.addEventListener('click', (e) => {
                    if (!button.getAttribute('data-bs-toggle') && !button.getAttribute('onclick')) {
                        e.preventDefault();
                        this.showToast(
                            'Funcionalidad de descarga disponible en la versión final del sitio web.',
                            'info'
                        );
                    }
                });
            }
        });
    }

    // Desplazamiento suave para enlaces ancla
    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Mejoras de accesibilidad
    initializeAccessibility() {
        // Manejo de teclado para navegación
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Mejorar el contraste de focus
        this.enhanceFocusIndicators();

        // Anunciar cambios de sección a lectores de pantalla
        this.setupScreenReaderAnnouncements();
    }

    handleKeyboardNavigation(e) {
        // Navegación con teclas de flecha en la barra de navegación
        if (e.target.classList.contains('nav-link')) {
            const navLinks = Array.from(document.querySelectorAll('.nav-pills .nav-link'));
            const currentIndex = navLinks.indexOf(e.target);

            let nextIndex = currentIndex;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (currentIndex + 1) % navLinks.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                    break;
                case 'Home':
                    e.preventDefault();
                    nextIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    nextIndex = navLinks.length - 1;
                    break;
            }

            if (nextIndex !== currentIndex) {
                navLinks[nextIndex].focus();
            }
        }
    }

    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .nav-link:focus-visible,
            .btn:focus-visible,
            .form-control:focus-visible,
            .form-select:focus-visible {
                outline: 2px solid var(--secondary-color);
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    setupScreenReaderAnnouncements() {
        // Crear elemento para anuncios
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'screen-reader-announcer';
        document.body.appendChild(announcer);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    // Utilidades para gestión de estado
    saveState(key, value) {
        try {
            sessionStorage.setItem(`microbiologia_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('No se pudo guardar el estado:', e);
        }
    }

    loadState(key) {
        try {
            const item = sessionStorage.getItem(`microbiologia_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('No se pudo cargar el estado:', e);
            return null;
        }
    }

    // Gestión de errores
    handleError(error, context = 'general') {
        console.error(`Error en ${context}:`, error);

        this.showToast(
            'Ha ocurrido un error. Por favor, intenta nuevamente.',
            'danger'
        );
    }

    // Método para limpiar recursos
    destroy() {
        // Limpiar tooltips
        if (this.tooltipList) {
            this.tooltipList.forEach(tooltip => tooltip.dispose());
        }

        // Limpiar event listeners si es necesario
        // (En este caso, la mayoría están en elementos que se destruirán con la página)
    }
}

// Utilidades adicionales
const Utils = {
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para eventos de scroll
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Formatear números
    formatNumber(num) {
        return new Intl.NumberFormat('es-CO').format(num);
    },

    // Validar email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Sanitizar entrada de texto
    sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Módulo para manejo de modales
const ModalManager = {
    // Mejorar accesibilidad de modales
    init() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('shown.bs.modal', this.onModalShown);
            modal.addEventListener('hidden.bs.modal', this.onModalHidden);
        });
    },

    onModalShown(e) {
        // Enfocar el primer elemento focusable
        const focusableElements = e.target.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    },

    onModalHidden(e) {
        // Restaurar el foco al elemento que abrió el modal
        const trigger = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
};

// Módulo para gestión de temas (preparado para futuras implementaciones)
const ThemeManager = {
    init() {
        this.detectSystemPreference();
        this.setupThemeToggle();
    },

    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Preparado para modo oscuro
            document.documentElement.setAttribute('data-theme', 'auto');
        }
    },

    setupThemeToggle() {
        // Preparado para futuro toggle de tema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(this.detectSystemPreference.bind(this));
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia principal de la aplicación
    window.microbiologyApp = new MicrobiologyApp();

    // Inicializar módulos adicionales
    ModalManager.init();
    ThemeManager.init();

    // Configurar manejo global de errores
    window.addEventListener('error', (e) => {
        window.microbiologyApp.handleError(e.error, 'global');
    });

    // Configurar manejo de errores de promesas no capturadas
    window.addEventListener('unhandledrejection', (e) => {
        window.microbiologyApp.handleError(e.reason, 'promise');
    });
});

// Limpiar recursos antes de cerrar/recargar la página
window.addEventListener('beforeunload', () => {
    if (window.microbiologyApp) {
        window.microbiologyApp.destroy();
    }
});

// Exportar para uso global si es necesario
window.MicrobiologyUtils = {
    Utils,
    ModalManager,
    ThemeManager
};

// Módulo para el carrusel personalizado
document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    const totalCards = 8;
    const visibleCards = window.innerWidth >= 768 ? 3 : 1;
    const maxIndex = totalCards - visibleCards;

    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.carousel-indicators button');

    if (!track || !prevBtn || !nextBtn) {
        console.error('Carousel elements not found');
        return;
    }

    function updateCarousel() {
        const cardWidth = 100 / visibleCards;
        const translateX = -(currentIndex * cardWidth);
        track.style.transform = `translateX(${translateX}%)`;

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }

    // Previous button
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Next button
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (index <= maxIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Initialize
    updateCarousel();
});

// load table from md
// document.addEventListener('DOMContentLoaded', function () {
//     fetch('tables/cronograma.md')
//         .then(response => response.text())
//         .then(markdown => {
//             const html = marked.parse(markdown);
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(html, 'text/html');
//             const table = doc.querySelector('table');
//             const container = document.getElementById('markdown-table');

//             if (table) {
//                 container.appendChild(table);
//             } else {
//                 container.innerHTML = '<p>No se encontró una tabla en el archivo Markdown.</p>';
//             }
//         })
//         .catch(error => {
//             console.error('Error al cargar el archivo Markdown:', error);
//             document.getElementById('markdown-table').innerHTML = '<p>Error al cargar la tabla.</p>';
//         });
// });