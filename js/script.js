/**
 * Research Committee - Department of Microbiology
 * Main JavaScript
 */

// Global configuration
const CONFIG = {
    animationDuration: 300,
    counterDuration: 2000,
    scrollOffset: 100,
    toastDuration: 5000
};

// Main class to handle the application
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

    // Navigation between sections
    initializeNavigation() {
        window.showSection = (sectionId) => {
            this.showSection(sectionId);
        };
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('section-active');
            section.classList.add('section-hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('section-hidden');
            targetSection.classList.add('section-active');
        }

        this.updateNavigation(sectionId);
        this.scrollToTop();
    }

    updateNavigation(sectionId) {
        // Update desktop navigation
        const navButtons = document.querySelectorAll('.nav-pills .nav-link');
        navButtons.forEach(button => {
            button.classList.remove('active');
        });

        const activeButton = document.getElementById('nav-' + sectionId);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Update mobile navigation
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

    // Entry animations
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

        // Observe elements for animation
        document.querySelectorAll('.card, .research-card, .fade-in').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Bootstrap tooltips
    initializeTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );

        this.tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Form handling
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

        // Basic validation
        if (!this.validateForm(e.target)) {
            this.showToast('Please complete all required fields.', 'warning');
            return;
        }

        // Show success toast
        this.showToast(
            'Thank you for your message! We will contact you soon.<br><small>Note: This is a demo site.</small>',
            'success'
        );

        // Reset form
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

    // Toast notification system
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

        // Create or use existing toast container
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

        // Clean up toast after hiding
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Animated counters for statistics
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

    // Resource buttons (downloads)
    initializeResourceButtons() {
        document.querySelectorAll('button').forEach(button => {
            const buttonText = button.textContent || button.innerText;
            const resourceKeywords = ['Formulario', 'Guía', 'Cronograma', 'Descargar'];

            if (resourceKeywords.some(keyword => buttonText.includes(keyword))) {
                button.addEventListener('click', (e) => {
                    if (!button.getAttribute('data-bs-toggle') && !button.getAttribute('onclick')) {
                        e.preventDefault();
                        this.showToast(
                            'Download functionality available in the final version of the website.',
                            'info'
                        );
                    }
                });
            }
        });
    }

    // Smooth scrolling for anchor links
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

    // Accessibility improvements
    initializeAccessibility() {
        // Keyboard handling for navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Improve focus contrast
        this.enhanceFocusIndicators();

        // Announce section changes to screen readers
        this.setupScreenReaderAnnouncements();
    }

    handleKeyboardNavigation(e) {
        // Arrow key navigation in navigation bar
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
        // Create element for announcements
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

    // Utilities for state management
    saveState(key, value) {
        try {
            sessionStorage.setItem(`microbiologia_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save state:', e);
        }
    }

    loadState(key) {
        try {
            const item = sessionStorage.getItem(`microbiologia_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Could not load state:', e);
            return null;
        }
    }

    // Error handling
    handleError(error, context = 'general') {
        console.error(`Error in ${context}:`, error);

        this.showToast(
            'An error occurred. Please try again.',
            'danger'
        );
    }

    // Method to clean up resources
    destroy() {
        // Clean up tooltips
        if (this.tooltipList) {
            this.tooltipList.forEach(tooltip => tooltip.dispose());
        }

        // Clean up event listeners if needed
        // (In this case, most are on elements that will be destroyed with the page)
    }
}

// Additional utilities
const Utils = {
    // Debounce to optimize events
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

    // Throttle for scroll events
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

    // Format numbers
    formatNumber(num) {
        return new Intl.NumberFormat('es-CO').format(num);
    },

    // Validate email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Sanitize text input
    sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Module for modal handling
const ModalManager = {
    // Improve modal accessibility
    init() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('shown.bs.modal', this.onModalShown);
            modal.addEventListener('hidden.bs.modal', this.onModalHidden);
        });
    },

    onModalShown(e) {
        // Focus first focusable element
        const focusableElements = e.target.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    },

    onModalHidden(e) {
        // Restore focus to element that opened the modal
        const trigger = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
};

// Module for theme management (prepared for future implementations)
const ThemeManager = {
    init() {
        this.detectSystemPreference();
        this.setupThemeToggle();
    },

    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Prepared for dark mode
            document.documentElement.setAttribute('data-theme', 'auto');
        }
    },

    setupThemeToggle() {
        // Prepared for future theme toggle
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(this.detectSystemPreference.bind(this));
    }
};

// Initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create main application instance
    window.microbiologyApp = new MicrobiologyApp();

    // Initialize additional modules
    ModalManager.init();
    ThemeManager.init();

    // Configure global error handling
    window.addEventListener('error', (e) => {
        window.microbiologyApp.handleError(e.error, 'global');
    });

    // Configure unhandled promise error handling
    window.addEventListener('unhandledrejection', (e) => {
        window.microbiologyApp.handleError(e.reason, 'promise');
    });
});

// Clean up resources before closing/reloading the page
window.addEventListener('beforeunload', () => {
    if (window.microbiologyApp) {
        window.microbiologyApp.destroy();
    }
});

// Export for global use if needed
window.MicrobiologyUtils = {
    Utils,
    ModalManager,
    ThemeManager
};

// Module for custom carousel
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

// Load table from markdown (commented out)
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
//                 container.innerHTML = '<p>No table found in the Markdown file.</p>';
//             }
//         })
//         .catch(error => {
//             console.error('Error loading Markdown file:', error);
//             document.getElementById('markdown-table').innerHTML = '<p>Error loading table.</p>';
//         });
// });