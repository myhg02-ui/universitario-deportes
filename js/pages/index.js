// ============================================
// INDEX.JS - Script principal para index.html
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Index.js cargado correctamente');
    
    // Inicializar funcionalidades
    initNavigation();
    initHamburgerMenu();
    initScrollEffects();
    initContactForm();
    initCookieNotice();
    initBackToTop();
});

// ============================================
// NAVEGACIÓN Y MENÚ
// ============================================

function initNavigation() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú hamburguesa si está abierto
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu && hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Actualizar aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ============================================
// EFECTOS DE SCROLL
// ============================================

function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Agregar clase cuando se hace scroll
        if (currentScroll > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                name: document.getElementById('contactName')?.value,
                email: document.getElementById('contactEmail')?.value,
                phone: document.getElementById('contactPhone')?.value,
                subject: document.getElementById('contactSubject')?.value,
                message: document.getElementById('contactMessage')?.value
            };
            
            console.log('📧 Formulario de contacto enviado:', formData);
            
            // Simular envío
            showMessage('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
        });
    }
}

// ============================================
// COOKIE NOTICE
// ============================================

function initCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    
    if (cookieNotice) {
        // Verificar si ya se aceptaron las cookies
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        
        if (!cookiesAccepted) {
            // Mostrar aviso después de 2 segundos
            setTimeout(() => {
                cookieNotice.style.display = 'block';
            }, 2000);
        }
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieNotice = document.getElementById('cookieNotice');
    if (cookieNotice) {
        cookieNotice.style.display = 'none';
    }
}

// Hacer función global
window.acceptCookies = acceptCookies;

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Scroll al hacer clic
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function showMessage(message, type = 'success') {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('message-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'message-toast-styles';
        style.textContent = `
            .message-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            .message-toast.message-success {
                border-left: 4px solid #4caf50;
            }
            .message-toast.message-error {
                border-left: 4px solid #f44336;
            }
            .message-toast i {
                font-size: 1.5rem;
            }
            .message-toast.message-success i {
                color: #4caf50;
            }
            .message-toast.message-error i {
                color: #f44336;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al body
    document.body.appendChild(messageDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ============================================
// ANIMACIONES DE ENTRADA
// ============================================

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos con clase .animate-on-scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

console.log('🎉 Sistema de navegación e interacciones del index inicializado');

// ============================================
// FUNCIONES DE MODAL
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchModal(closeModalId, openModalId) {
    closeModal(closeModalId);
    setTimeout(() => {
        openModal(openModalId);
    }, 300);
}

// Hacer funciones globales
if (typeof window !== 'undefined') {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.switchModal = switchModal;
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
