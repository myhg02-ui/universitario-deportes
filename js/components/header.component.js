// Sistema de autenticación dinámica para el header
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderAuth();
});

// Función para obtener rutas relativas correctas según la ubicación actual
function getRelativePath() {
    const currentPath = window.location.pathname;
    
    // Detectar desde dónde se está llamando
    if (currentPath.includes('/public/')) {
        // Desde index.html (public/)
        return {
            dashboard: '../src/pages/user/dashboard.html',
            perfil: '../src/pages/user/mi-cuenta.html',
            index: 'index.html'
        };
    } else if (currentPath.includes('/pages/auth/')) {
        // Desde login.html o registro.html (src/pages/auth/)
        return {
            dashboard: '../user/dashboard.html',
            perfil: '../user/mi-cuenta.html',
            index: '../../../public/index.html'
        };
    } else if (currentPath.includes('/pages/user/')) {
        // Desde dashboard, perfil, etc. (src/pages/user/)
        return {
            dashboard: 'dashboard.html',
            perfil: 'mi-cuenta.html',
            index: '../../../public/index.html'
        };
    } else if (currentPath.includes('/pages/info/')) {
        // Desde club.html, noticias.html, etc. (src/pages/info/)
        return {
            dashboard: '../user/dashboard.html',
            perfil: '../user/mi-cuenta.html',
            index: '../../../public/index.html'
        };
    } else if (currentPath.includes('/pages/admin/')) {
        // Desde panel-admin.html (src/pages/admin/)
        return {
            dashboard: '../user/dashboard.html',
            perfil: '../user/mi-cuenta.html',
            index: '../../../public/index.html'
        };
    }
    
    // Default (desde raíz o desconocido)
    return {
        dashboard: 'src/pages/user/dashboard.html',
        perfil: 'src/pages/user/mi-cuenta.html',
        index: 'index.html'
    };
}

function updateHeaderAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navAuth = document.querySelector('.nav-auth');
    
    if (!navAuth) return;
    
    const paths = getRelativePath();
    
    if (currentUser) {
        // Usuario está logueado - mostrar menú de usuario
        navAuth.innerHTML = `
            <div class="user-menu">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span class="user-name">${currentUser.nombres}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-dropdown">
                    <a href="${paths.dashboard}" class="dropdown-item">
                        <i class="fas fa-tachometer-alt"></i> Mi Dashboard
                    </a>
                    <a href="${paths.perfil}" class="dropdown-item">
                        <i class="fas fa-user"></i> Mi Perfil
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout-item" onclick="logout(event)">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </div>
            </div>
        `;
        
        // Agregar event listener para el dropdown
        const userInfo = document.querySelector('.user-info');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userInfo && userDropdown) {
            userInfo.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-menu')) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    } else {
        // Usuario no logueado - mostrar botones de login/registro
        navAuth.innerHTML = `
            <button class="btn-login" onclick="openModal('loginModal')">
                <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </button>
            <button class="btn-register" onclick="window.location.href='registro.html'">
                <i class="fas fa-user-plus"></i> Registrarse
            </button>
        `;
    }
}

function viewProfile(event) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        alert(`Perfil de ${currentUser.nombres} ${currentUser.apellidos}\n\nSocio N°: ${currentUser.numero_socio}\nEmail: ${currentUser.email}\nMembresía: ${currentUser.tipo_membresia.toUpperCase()}`);
    }
}

function logout(event) {
    event.preventDefault();
    
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        
        // Mostrar mensaje
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        message.innerHTML = '<i class="fas fa-check-circle"></i> Sesión cerrada exitosamente';
        document.body.appendChild(message);
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}
