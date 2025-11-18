/**
 * 🔐 PROTECCIÓN DE PÁGINAS AUTENTICADAS
 * 
 * Este script PROTEGE páginas que requieren autenticación (Header 3).
 * Si el usuario NO está logeado, lo redirige automáticamente a login.
 * 
 * PÁGINAS PROTEGIDAS:
 * - user/dashboard.html
 * - user/perfil.html
 * - user/mi-cuenta.html
 * - user/mis-datos.html
 * - admin/panel-admin.html
 * 
 * USO: Incluir este script al INICIO de las páginas protegidas
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const AUTH_CONFIG = {
    loginUrl: '../auth/login.html',
    redirectDelay: 1500, // milisegundos
    showAlert: true,
    checkInterval: 100, // ms para verificar si Firebase está cargado
    maxAttempts: 50 // intentos máximos (5 segundos total)
};

// ============================================================================
// FUNCIÓN: Verificar Autenticación
// ============================================================================
function checkAuthentication() {
    let attempts = 0;

    // Función para intentar verificar auth
    const attemptCheck = () => {
        attempts++;

        // Verificar si Firebase está disponible
        if (typeof firebase === 'undefined' || !firebase.auth) {
            if (attempts < AUTH_CONFIG.maxAttempts) {
                // Reintentar
                setTimeout(attemptCheck, AUTH_CONFIG.checkInterval);
                return;
            } else {
                // Firebase no se cargó a tiempo
                console.error('❌ Firebase no se pudo cargar. Redirigiendo a login...');
                redirectToLogin('Firebase no está disponible');
                return;
            }
        }

        // Firebase está disponible, verificar autenticación
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                // ❌ Usuario NO autenticado
                console.warn('⚠️ Acceso denegado: Usuario no autenticado');
                
                if (AUTH_CONFIG.showAlert) {
                    showAuthAlert();
                }
                
                // Redirigir a login después de un breve delay
                setTimeout(() => {
                    redirectToLogin('No autenticado');
                }, AUTH_CONFIG.redirectDelay);
            } else {
                // ✅ Usuario autenticado
                console.log('✅ Usuario autenticado:', user.email);
                onUserAuthenticated(user);
            }
        });
    };

    // Iniciar verificación
    attemptCheck();
}

// ============================================================================
// FUNCIÓN: Mostrar Alerta de Autenticación
// ============================================================================
function showAuthAlert() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'auth-alert-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 50, 120, 0.95);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;

    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 3rem 2.5rem;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;

    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-lock" style="font-size: 4rem; color: #c41e3a;"></i>
        </div>
        <h2 style="color: #003278; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 800;">
            Acceso Restringido
        </h2>
        <p style="color: #555; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Debes <strong style="color: #003278;">iniciar sesión</strong> para acceder a esta página.
        </p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #888; font-size: 0.9rem;">
            <i class="fas fa-sync fa-spin"></i>
            <span>Redirigiendo al login...</span>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Agregar animaciones CSS
    addAuthAlertStyles();
}

// ============================================================================
// FUNCIÓN: Redirigir a Login
// ============================================================================
function redirectToLogin(reason) {
    console.log(`🔄 Redirigiendo a login. Razón: ${reason}`);
    
    // Guardar URL actual para redirigir después del login
    const currentUrl = window.location.href;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    
    // Calcular ruta relativa al login
    const currentPath = window.location.pathname;
    let loginPath = AUTH_CONFIG.loginUrl;
    
    // Ajustar ruta según ubicación
    if (currentPath.includes('/user/') || currentPath.includes('/admin/')) {
        loginPath = '../auth/login.html';
    } else if (currentPath.includes('/info/')) {
        loginPath = '../auth/login.html';
    } else {
        loginPath = 'auth/login.html';
    }
    
    // Redirigir
    window.location.href = loginPath;
}

// ============================================================================
// FUNCIÓN: Usuario Autenticado (Callback)
// ============================================================================
function onUserAuthenticated(user) {
    // Esta función se puede sobrescribir en cada página
    // para ejecutar lógica específica después de autenticar
    console.log('✅ Protección de página: Usuario verificado');
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('userAuthenticated', { 
        detail: { user } 
    }));
}

// ============================================================================
// FUNCIÓN: Verificar Rol de Administrador
// ============================================================================
async function checkAdminRole() {
    const user = firebase.auth().currentUser;
    
    if (!user) {
        redirectToLogin('No autenticado');
        return false;
    }

    try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.error('❌ Documento de usuario no encontrado');
            return false;
        }

        const userData = userDoc.data();
        const isAdmin = userData.is_admin === true || userData.rol === 'admin' || userData.rol === 'super_admin';

        if (!isAdmin) {
            console.warn('⚠️ Acceso denegado: Usuario no es administrador');
            
            if (AUTH_CONFIG.showAlert) {
                showAdminAlert();
            }
            
            // Redirigir al dashboard de usuario
            setTimeout(() => {
                window.location.href = '../user/dashboard.html';
            }, AUTH_CONFIG.redirectDelay);
            
            return false;
        }

        console.log('✅ Usuario es administrador');
        return true;

    } catch (error) {
        console.error('❌ Error al verificar rol de administrador:', error);
        return false;
    }
}

// ============================================================================
// FUNCIÓN: Mostrar Alerta de Admin
// ============================================================================
function showAdminAlert() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(196, 30, 58, 0.95);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 3rem 2.5rem;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-user-shield" style="font-size: 4rem; color: #c41e3a;"></i>
        </div>
        <h2 style="color: #c41e3a; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 800;">
            Acceso Solo para Administradores
        </h2>
        <p style="color: #555; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            No tienes permisos de <strong>administrador</strong> para acceder a esta sección.
        </p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #888; font-size: 0.9rem;">
            <i class="fas fa-sync fa-spin"></i>
            <span>Redirigiendo a tu dashboard...</span>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// ============================================================================
// FUNCIÓN: Agregar Estilos de Animación
// ============================================================================
function addAuthAlertStyles() {
    if (document.getElementById('auth-alert-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'auth-alert-styles';
    styles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(styles);
}

// ============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================================
// Ejecutar verificación inmediatamente
checkAuthentication();

// Exportar funciones para uso global
window.checkAuthentication = checkAuthentication;
window.checkAdminRole = checkAdminRole;
window.onUserAuthenticated = onUserAuthenticated;
