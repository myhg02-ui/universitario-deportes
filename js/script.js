// Website Universitario de Deportes
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sitio cargado correctamente');
    
    // 🔐 VERIFICAR SESIÓN INMEDIATAMENTE
    checkUserSession();
    
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Gracias por tu mensaje. Te contactaremos pronto.');
            this.reset();
        });
    }
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
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

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    setTimeout(() => openModal(toModalId), 300);
}

// Cookie notice
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const notice = document.getElementById('cookieNotice');
    if (notice) {
        notice.style.display = 'none';
    }
}

// Check cookies on load
if (!localStorage.getItem('cookiesAccepted')) {
    const notice = document.getElementById('cookieNotice');
    if (notice) {
        setTimeout(() => {
            notice.style.display = 'block';
        }, 2000);
    }
}

// ============================================
// GESTIÓN DE SESIÓN Y HEADER DINÁMICO
// ============================================

function checkUserSession() {
    console.log('🔍 Verificando sesión...');
    
    // Verificar sessionStorage PRIMERO (instantáneo)
    const sessionUser = sessionStorage.getItem('currentUser');
    
    if (sessionUser) {
        try {
            const user = JSON.parse(sessionUser);
            console.log('✅ Usuario logueado:', user.email);
            updateHeaderWithUser(user);
            return; // Ya está logueado, no hacer nada más
        } catch (e) {
            console.error('❌ Error en sessionStorage');
            sessionStorage.removeItem('currentUser');
        }
    }
    
    // Si no hay sesión, mostrar botones de login
    console.log('❌ Sin sesión activa');
    updateHeaderWithoutUser();
    
    // Verificar Firebase en background (solo para sincronizar)
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log('🔄 Sincronizando con Firebase...');
                try {
                    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        const currentUser = {
                            uid: user.uid,
                            email: user.email,
                            nombres: userData.nombres || 'Usuario',
                            apellidos: userData.apellidos || '',
                            is_admin: userData.is_admin || false
                        };
                        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                        updateHeaderWithUser(currentUser);
                    }
                } catch (error) {
                    console.error('❌ Error Firebase:', error);
                }
            } else {
                // Usuario deslogueado en Firebase
                if (sessionUser) {
                    sessionStorage.removeItem('currentUser');
                    updateHeaderWithoutUser();
                }
            }
        });
    }
}

function updateHeaderWithUser(user) {
    console.log('👤 Actualizando header para usuario:', user.nombres || user.email);
    
    const navAuth = document.querySelector('.nav-auth');
    if (!navAuth) return;
    
    // Crear nombre para mostrar
    const displayName = user.nombres || user.email.split('@')[0];
    const firstName = displayName.split(' ')[0];
    
    // Usar rutas relativas simples según la ubicación
    const pathname = window.location.pathname;
    let userPath, adminPath;
    
    if (pathname.endsWith('index.html') || pathname.endsWith('github-copilot/')) {
        // Estamos en la raíz
        userPath = 'user/';
        adminPath = 'admin/';
    } else if (pathname.includes('/user/') || pathname.includes('/admin/') || pathname.includes('/info/')) {
        // Estamos en una subcarpeta
        userPath = '../user/';
        adminPath = '../admin/';
    } else if (pathname.includes('/auth/')) {
        // Estamos en auth
        userPath = '../user/';
        adminPath = '../admin/';
    } else {
        // Por defecto (raíz)
        userPath = 'user/';
        adminPath = 'admin/';
    }
    
    // HTML del header para usuario logueado
    navAuth.innerHTML = `
        <div class="user-menu">
            <button class="user-info" onclick="toggleUserDropdown()" aria-label="Menú de usuario">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${firstName}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <a href="${userPath}dashboard.html">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
                <a href="${userPath}mis-datos.html">
                    <i class="fas fa-user-edit"></i> Mis Datos
                </a>
                <a href="${userPath}test.html">
                    <i class="fas fa-flask"></i> TEST
                </a>
                ${user.is_admin ? `
                <hr class="dropdown-divider">
                <a href="${adminPath}panel-admin.html">
                    <i class="fas fa-shield-alt"></i> Panel Admin
                </a>` : ''}
                <hr class="dropdown-divider">
                <a href="#" onclick="logout(event)" class="logout-item">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
            </div>
        </div>
    `;
    
    // Hacer visible el nav-auth
    navAuth.classList.add('loaded');
    
    console.log('✅ Header actualizado con menú de usuario');
}

function updateHeaderWithoutUser() {
    console.log('🔓 Actualizando header para usuario no autenticado');
    
    const navAuth = document.querySelector('.nav-auth');
    if (!navAuth) return;
    
    // Usar rutas relativas simples según la ubicación
    const pathname = window.location.pathname;
    let loginPath, registerPath;
    
    if (pathname.endsWith('index.html') || pathname.endsWith('github-copilot/')) {
        // Estamos en la raíz
        loginPath = 'auth/login.html';
        registerPath = 'auth/registro.html';
    } else if (pathname.includes('/user/') || pathname.includes('/admin/') || pathname.includes('/info/')) {
        // Estamos en una subcarpeta
        loginPath = '../auth/login.html';
        registerPath = '../auth/registro.html';
    } else if (pathname.includes('/auth/')) {
        // Ya estamos en auth
        loginPath = 'login.html';
        registerPath = 'registro.html';
    } else {
        // Por defecto (raíz)
        loginPath = 'auth/login.html';
        registerPath = 'auth/registro.html';
    }
    
    console.log('🔗 Login Path:', loginPath);
    console.log('🔗 Register Path:', registerPath);
    
    navAuth.innerHTML = `
        <button class="btn-login" onclick="window.location.href='${loginPath}'">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
        </button>
        <button class="btn-register" onclick="window.location.href='${registerPath}'">
            <i class="fas fa-user-plus"></i> Registrarse
        </button>
    `;
    
    // Hacer visible el nav-auth
    navAuth.classList.add('loaded');
    
    console.log('✅ Header actualizado con botones de login/registro');
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/auth/')) return '../';
    if (path.includes('/user/')) return '../';
    if (path.includes('/admin/')) return '../';
    if (path.includes('/info/')) return '../';
    return '';
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Cerrar dropdown si se hace clic fuera
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (dropdown && !userMenu?.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

async function logout(event) {
    if (event) event.preventDefault();
    
    console.log('🚪 Cerrando sesión...');
    
    try {
        // 1. Cerrar sesión en Firebase
        if (typeof firebase !== 'undefined' && firebase.auth) {
            await firebase.auth().signOut();
            console.log('✅ Sesión cerrada en Firebase');
        }
        
        // 2. Limpiar sessionStorage
        sessionStorage.removeItem('currentUser');
        
        // 3. Mostrar mensaje
        alert('Sesión cerrada correctamente');
        
        // 4. Redirigir a inicio
        window.location.href = getBasePath() + 'index.html';
        
    } catch (error) {
        console.error('❌ Error cerrando sesión:', error);
        // Limpiar de todas formas
        sessionStorage.removeItem('currentUser');
        window.location.href = getBasePath() + 'index.html';
    }
}

