class EnhancedInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.initButtonRedirects();
        this.initKeyboardNavigation();
        this.initAccessibilityFeatures();
        this.initTooltips();
        this.initImageInteractions();
        this.initFormInteractions();
    }

    initButtonRedirects() {
        const buttons = [
            { id: 'createArtCTA', url: './src/create/', event: 'create-art' },
            { id: 'exploreCTA', url: './src/gallery/', event: 'explore-gallery' },
            { id: 'discordBotRedirect', url: '../jackey.elixpo/', event: 'discord-bot' },
            { id: 'chromeExtensionRedirect', url: '../elixpo-art-chrome-extension/', event: 'chrome-extension' },
            { id: 'apiRedirect', url: '../blogs.elixpo/', event: 'api-docs' }
        ];

        buttons.forEach(({ id, url, event }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    this.handleRedirect(url, event, e);
                });
            }
        });
    }

    handleRedirect(url, eventName, event) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'navigation',
                event_label: eventName,
                value: 1
            });
        }

        const button = event?.target?.closest('button, a');
        if (button) this.addLoadingState(button);

        setTimeout(() => (window.location.href = url), 150);
    }

    addLoadingState(button) {
        const originalContent = button.innerHTML;
        button.classList.add('loading');
        button.disabled = true;

        const spinner = document.createElement('div');
        spinner.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
        button.innerHTML = '';
        button.appendChild(spinner);

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('loading');
            button.disabled = false;
        }, 300);
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape': this.handleEscapeKey(); break;
                case 'Tab': this.handleTabNavigation(e); break;
                case 'Enter':
                case ' ': this.handleEnterSpace(e); break;
            }
        });
    }

    handleEscapeKey() {
        const activeModal = document.querySelector('.modal.active');
        const activeMobileMenu = document.querySelector('.nav-mobile.active');

        if (activeModal) activeModal.classList.remove('active');
        if (activeMobileMenu && window.enhancedNavigation) {
            window.enhancedNavigation.closeMobileMenu();
        }
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(`
            a[href]:not([disabled]),
            button:not([disabled]),
            textarea:not([disabled]),
            input:not([disabled]),
            select:not([disabled]),
            [tabindex]:not([tabindex="-1"])
        `);

        const visibleElements = Array.from(focusableElements).filter(el => el.offsetParent !== null);
        if (!visibleElements.length) return;

        const first = visibleElements[0];
        const last = visibleElements[visibleElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    }

    handleEnterSpace(e) {
        const target = e.target;
        if (target.classList.contains('feature-card') || target.classList.contains('ecosystem-card')) {
            e.preventDefault();
            this.handleCardInteraction(target);
        }
    }

    handleCardInteraction(card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => (card.style.transform = ''), 150);
        const button = card.querySelector('button, a');
        if (button) button.click();
    }

    initAccessibilityFeatures() {
        this.enhanceAccessibility();

        if (window.matchMedia('(prefers-contrast: high)').matches)
            document.body.classList.add('high-contrast');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            document.body.classList.add('reduced-motion');

        this.initFocusManagement();
    }

    enhanceAccessibility() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', () => (skipLink.style.top = '6px'));
        skipLink.addEventListener('blur', () => (skipLink.style.top = '-40px'));
        document.body.insertBefore(skipLink, document.body.firstChild);

        const hero = document.querySelector('.hero-section');
        if (hero && !document.getElementById('main-content')) {
            hero.id = 'main-content';
            hero.setAttribute('role', 'main');
        }

        document.querySelectorAll('.feature-card, .ecosystem-card').forEach((card, i) => {
            if (!card.getAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'article');
                const title = card.querySelector('h3');
                if (title) {
                    const id = `card-title-${i}`;
                    title.id = id;
                    card.setAttribute('aria-labelledby', id);
                }
            }
        });
    }

    initFocusManagement() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--color-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(el => this.createTooltip(el));
    }

    createTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            pointerEvents: 'none',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            whiteSpace: 'nowrap'
        });
        document.body.appendChild(tooltip);

        const show = () => {
            const rect = element.getBoundingClientRect();
            let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
            left = Math.max(8, Math.min(left, window.innerWidth - tooltip.offsetWidth - 8));
            tooltip.style.left = left + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        };
        const hide = () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        };

        element.addEventListener('mouseenter', show);
        element.addEventListener('mouseleave', hide);
        element.addEventListener('focus', show);
        element.addEventListener('blur', hide);
    }

    initImageInteractions() {
        const img = document.querySelector('.showcase-img');
        if (!img) return;

        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('click', () => this.openImageModal(img.src));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openImageModal(img.src);
            }
        });
    }

    openImageModal(src) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            opacity: 0,
            transition: 'opacity 0.3s ease'
        });

        const img = document.createElement('img');
        img.src = src;
        Object.assign(img.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            borderRadius: '12px'
        });

        const close = document.createElement('button');
        close.innerHTML = '&times;';
        Object.assign(close.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer'
        });

        modal.append(img, close);
        document.body.appendChild(modal);
        requestAnimationFrame(() => (modal.style.opacity = '1'));

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
            document.removeEventListener('keydown', onEsc);
        };

        const onEsc = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        close.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', onEsc);
    }

    initFormInteractions() {
        document.querySelectorAll('form').forEach(form => {
            form.querySelectorAll('input, textarea, select').forEach(field => {
                if (!field.parentNode.classList.contains('form-field-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'form-field-wrapper';
                    field.parentNode.insertBefore(wrapper, field);
                    wrapper.appendChild(field);
                }
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearValidationFeedback(field));
            });
        });
    }

    validateField(field) {
        const valid = field.checkValidity();
        field.classList.toggle('valid', valid);
        field.classList.toggle('invalid', !valid);
        return valid;
    }

    clearValidationFeedback(field) {
        field.classList.remove('valid', 'invalid');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.enhancedInteractions) {
        window.enhancedInteractions = new EnhancedInteractions();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedInteractions;
}
