// ===================================
// PÁGINA WEB PROFESIONAL - UNIVERSITARIO DE DEPORTES
// Sistema completo de funcionalidades para producción
// ===================================

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    showCookieNotice();
    initializeBackToTop();
});

function initializeWebsite() {
    initializeNavigation();
    initializeModals();
    initializeForms();
    initializeAnimations();
    initializeLazyLoading();
    
    console.log('🔥 ¡Página de Universitario de Deportes lista para producción! 🔥');
}

// ===================
// NAVEGACIÓN
// ===================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ===================
// MODALES
// ===================

function initializeModals() {
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, 150);
}

// ===================
// FORMULARIOS
// ===================

function initializeForms() {
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearErrors);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validateEmail(email)) {
        showError('loginEmail', 'Por favor ingresa un email válido');
        return;
    }
    
    if (password.length < 6) {
        showError('loginPassword', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    showLoading('Iniciando sesión...');
    
    setTimeout(() => {
        hideLoading();
        showNotification('¡Bienvenido de vuelta, hincha crema! 🔥', 'success');
        closeModal('loginModal');
        updateUIForLoggedUser(email);
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (name.length < 2) {
        showError('registerName', 'El nombre debe tener al menos 2 caracteres');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('registerEmail', 'Por favor ingresa un email válido');
        return;
    }
    
    if (!validatePhone(phone)) {
        showError('registerPhone', 'Por favor ingresa un teléfono válido');
        return;
    }
    
    if (password.length < 6) {
        showError('registerPassword', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Las contraseñas no coinciden');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    showLoading('Creando tu cuenta...');
    
    setTimeout(() => {
        hideLoading();
        showNotification('¡Bienvenido a la familia crema! Tu cuenta ha sido creada exitosamente. 🎉', 'success');
        closeModal('registerModal');
        updateUIForLoggedUser(email);
    }, 2000);
}

function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !subject || !message) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }
    
    showLoading('Enviando mensaje...');
    
    setTimeout(() => {
        hideLoading();
        showNotification('¡Mensaje enviado correctamente! Te responderemos pronto. 📧', 'success');
        e.target.reset();
    }, 1500);
}

// ===================
// VALIDACIONES
// ===================

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearErrors(e);
    
    if (input.type === 'email' && value && !validateEmail(value)) {
        showError(input.id, 'Email no válido');
    }
    
    if (input.type === 'tel' && value && !validatePhone(value)) {
        showError(input.id, 'Teléfono no válido');
    }
    
    if (input.type === 'password' && value && value.length < 6) {
        showError(input.id, 'Mínimo 6 caracteres');
    }
}

function clearErrors(e) {
    const input = e.target;
    const errorElement = document.querySelector(`#${input.id}-error`);
    if (errorElement) {
        errorElement.remove();
    }
    input.style.borderColor = '#eee';
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    clearErrors({ target: input });
    
    input.style.borderColor = '#e74c3c';
    
    const errorElement = document.createElement('div');
    errorElement.id = `${inputId}-error`;
    errorElement.className = 'error-message';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,15}$/;
    return phoneRegex.test(phone);
}

// ===================
// UI UTILITIES
// ===================

function showLoading(message = 'Cargando...') {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; color: white; font-size: 1.2rem;">
            <div style="text-align: center;">
                <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #8B0000; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingElement);
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function updateUIForLoggedUser(email) {
    const authButtons = document.querySelector('.nav-auth');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-menu" style="display: flex; align-items: center; gap: 1rem;">
                <span style="color: var(--primary-color); font-weight: 500;">
                    <i class="fas fa-user"></i> ${email.split('@')[0]}
                </span>
                <button class="btn-logout" onclick="logout()" style="background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-sign-out-alt"></i> Salir
                </button>
            </div>
        `;
    }
}

function logout() {
    showLoading('Cerrando sesión...');
    
    setTimeout(() => {
        hideLoading();
        showNotification('¡Hasta pronto, hincha crema! 👋', 'info');
        
        const authButtons = document.querySelector('.nav-auth');
        if (authButtons) {
            authButtons.innerHTML = `
                <button class="btn-login" onclick="openModal('loginModal')">
                    <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                </button>
                <button class="btn-register" onclick="openModal('registerModal')">
                    <i class="fas fa-user-plus"></i> Registrarse
                </button>
            `;
        }
    }, 1000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===================
// ANIMACIONES
// ===================

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.club-card, .benefit-card, .feature-card, .tech-card, .news-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    if (!document.getElementById('animation-styles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .club-card:nth-child(1), .benefit-card:nth-child(1), .feature-card:nth-child(1) { transition-delay: 0.1s; }
            .club-card:nth-child(2), .benefit-card:nth-child(2), .feature-card:nth-child(2) { transition-delay: 0.2s; }
            .club-card:nth-child(3), .benefit-card:nth-child(3), .feature-card:nth-child(3) { transition-delay: 0.3s; }
            .club-card:nth-child(4), .benefit-card:nth-child(4), .feature-card:nth-child(4) { transition-delay: 0.4s; }
            .benefit-card:nth-child(5), .feature-card:nth-child(5) { transition-delay: 0.5s; }
            .benefit-card:nth-child(6), .feature-card:nth-child(6) { transition-delay: 0.6s; }
        `;
        document.head.appendChild(animationStyles);
    }
}

// ===================
// LAZY LOADING
// ===================

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================
// COOKIES Y PRIVACIDAD
// ===================

function showCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    
    if (!cookieAccepted && cookieNotice) {
        setTimeout(() => {
            cookieNotice.style.display = 'block';
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieAccepted', 'true');
    const cookieNotice = document.getElementById('cookieNotice');
    if (cookieNotice) {
        cookieNotice.style.display = 'none';
    }
    showNotification('Preferencias de cookies guardadas', 'success');
}

// ===================
// BACK TO TOP
// ===================

function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================
// FUNCIONES GLOBALES
// ===================

window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.scrollToSection = scrollToSection;
window.logout = logout;
window.acceptCookies = acceptCookies;

console.log('💪 ¡VAMOS UNIVERSITARIO! 🔥 - Sistema listo para producción');
