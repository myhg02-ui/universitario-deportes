/**
 * 🎯 COMPONENTE: HEADER DINÁMICO
 * 
 * Detecta si el usuario está autenticado y cambia el Header 1:
 * - Si NO está logeado: Muestra botones "Iniciar Sesión | Registrarse"
 * - Si SÍ está logeado: Muestra dropdown con "👤 Usuario ▼"
 * 
 * USO: Incluir este script en TODAS las páginas con Header 1
 */

// ============================================================================
// FUNCIÓN: Inicializar Header Dinámico
// ============================================================================
function initDynamicHeader() {
    // Verificar que Firebase esté cargado
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no está cargado. Asegúrate de incluir firebase-config.js antes de este script.');
        return;
    }

    // Escuchar cambios en el estado de autenticación
    firebase.auth().onAuthStateChanged((user) => {
        const navAuth = document.getElementById('navAuth');
        
        if (!navAuth) {
            console.warn('⚠️ No se encontró el elemento #navAuth en el header');
            return;
        }

        if (user) {
            // ✅ Usuario AUTENTICADO → Mostrar dropdown
            renderUserDropdown(user, navAuth);
        } else {
            // ❌ Usuario NO AUTENTICADO → Mostrar botones de auth
            renderAuthButtons(navAuth);
        }
    });
}

// ============================================================================
// FUNCIÓN: Renderizar Dropdown de Usuario
// ============================================================================
function renderUserDropdown(user, container) {
    // Obtener datos del usuario
    const displayName = user.displayName || user.email?.split('@')[0] || 'Usuario';
    
    // Obtener ruta base según ubicación actual
    const currentPath = window.location.pathname;
    let basePath = '';
    
    if (currentPath.includes('/info/') || currentPath.includes('/user/') || currentPath.includes('/auth/')) {
        basePath = '../';
    }

    // HTML del dropdown de usuario
    container.innerHTML = `
        <div class="user-menu">
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${displayName}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-dropdown">
                <a href="${basePath}user/dashboard.html" class="dropdown-link">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
                <a href="${basePath}user/mi-cuenta.html" class="dropdown-link">
                    <i class="fas fa-user-cog"></i> Mi Cuenta
                </a>
                <a href="${basePath}user/mis-datos.html" class="dropdown-link">
                    <i class="fas fa-id-card"></i> Mis Datos
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" onclick="logoutUser(event)" class="dropdown-link logout-link">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
            </div>
        </div>
    `;

    // Agregar estilos dinámicos si no existen
    if (!document.getElementById('dynamic-header-styles')) {
        addDynamicStyles();
    }
}

// ============================================================================
// FUNCIÓN: Renderizar Botones de Autenticación
// ============================================================================
function renderAuthButtons(container) {
    // Obtener ruta base según ubicación actual
    const currentPath = window.location.pathname;
    let basePath = '';
    
    if (currentPath.includes('/info/') || currentPath.includes('/user/') || currentPath.includes('/auth/')) {
        basePath = '../';
    }

    // HTML de botones de autenticación
    container.innerHTML = `
        <button class="btn-login" onclick="window.location.href='${basePath}auth/login.html'">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
        </button>
        <button class="btn-register" onclick="window.location.href='${basePath}auth/registro.html'">
            <i class="fas fa-user-plus"></i> Registrarse
        </button>
    `;
}

// ============================================================================
// FUNCIÓN: Cerrar Sesión
// ============================================================================
function logoutUser(event) {
    if (event) {
        event.preventDefault();
    }

    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        firebase.auth().signOut()
            .then(() => {
                console.log('✅ Sesión cerrada correctamente');
                // Redirigir al inicio
                window.location.href = window.location.origin + '/index.html';
            })
            .catch((error) => {
                console.error('❌ Error al cerrar sesión:', error);
                alert('Error al cerrar sesión. Por favor intenta de nuevo.');
            });
    }
}

// ============================================================================
// FUNCIÓN: Agregar Estilos Dinámicos
// ============================================================================
function addDynamicStyles() {
    const styles = document.createElement('style');
    styles.id = 'dynamic-header-styles';
    styles.textContent = `
        /* ===== MENÚ DE USUARIO ===== */
        .user-menu {
            position: relative;
            display: inline-block;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.7rem 1.2rem;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 25px;
            cursor: pointer;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .user-info:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .user-info i:first-child {
            font-size: 1.3rem;
        }
        
        .user-info i:last-child {
            font-size: 0.8rem;
            transition: transform 0.3s ease;
        }
        
        .user-menu:hover .user-info i:last-child {
            transform: rotate(180deg);
        }
        
        .user-name {
            color: white;
            font-weight: 600;
        }
        
        /* ===== DROPDOWN ===== */
        .user-dropdown {
            position: absolute;
            top: calc(100% + 0.5rem);
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 50, 120, 0.2);
            min-width: 220px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
            overflow: hidden;
        }
        
        .user-menu:hover .user-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.9rem 1.2rem;
            color: #1a1a1a;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }
        
        .dropdown-link:hover {
            background: linear-gradient(90deg, #f0f7ff 0%, #e6f2ff 100%);
            border-left-color: #003278;
            color: #003278;
        }
        
        .dropdown-link i {
            width: 20px;
            text-align: center;
            color: #003278;
        }
        
        .dropdown-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
            margin: 0.5rem 0;
        }
        
        .logout-link {
            color: #c41e3a;
        }
        
        .logout-link:hover {
            background: linear-gradient(90deg, #fff0f0 0%, #ffe6e6 100%);
            border-left-color: #c41e3a;
        }
        
        .logout-link i {
            color: #c41e3a;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .user-dropdown {
                right: -1rem;
                min-width: 200px;
            }
        }
    `;
    document.head.appendChild(styles);
}

// ============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================================
// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicHeader);
} else {
    // DOM ya está listo
    initDynamicHeader();
}

// Exportar funciones para uso global
window.initDynamicHeader = initDynamicHeader;
window.logoutUser = logoutUser;
