// Sistema de autenticación unificado
(function() {
    'use strict';
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Sincronizar datos del usuario desde Firebase al cargar
        syncUserDataFromFirebase();
        
        // Actualizar header en todas las páginas
        updateHeaderAuth();
        
        // Configurar formulario de login si existe
        setupLoginForm();
        
        // Configurar botones de registro
        setupRegisterButtons();
    }
    
    // 🔄 Sincronizar datos del usuario desde Firebase cuando se carga la página
    async function syncUserDataFromFirebase() {
        // Solo ejecutar si Firebase está disponible
        if (typeof firebase === 'undefined' || !firebase.auth) {
            return;
        }
        
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        // Obtener datos actualizados desde Firestore
                        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                        
                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            
                            // Actualizar sessionStorage con datos frescos de Firestore
                            const updatedUser = {
                                uid: user.uid,
                                email: user.email,
                                nombres: userData.nombres || 'Usuario',
                                apellidos: userData.apellidos || '',
                                numero_socio: userData.numero_socio || '',
                                tipo_membresia: userData.tipo_membresia || 'free',
                                is_admin: userData.is_admin === true,
                                admin_activo: userData.admin_activo !== false,
                                rol: userData.rol || null
                            };
                            
                            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                            
                            console.log('🔄 Datos sincronizados desde Firebase:', {
                                email: updatedUser.email,
                                is_admin: updatedUser.is_admin,
                                rol: updatedUser.rol
                            });
                            
                            // Actualizar el header con los datos frescos
                            setTimeout(() => updateHeaderAuth(), 100);
                        }
                    } catch (error) {
                        console.error('❌ Error sincronizando datos:', error);
                    }
                }
                resolve();
            });
        });
    }
    
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        // Remover listeners anteriores clonando el elemento
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);
        
        newForm.addEventListener('submit', handleLoginSubmit);
    }
    
    async function handleLoginSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validación básica
        if (!email || !password) {
            showMessage('error', 'Por favor completa todos los campos');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('error', 'Por favor ingresa un email válido');
            return;
        }
        
        try {
            // Intentar login con Firebase primero
            if (typeof firebaseAPI !== 'undefined') {
                showMessage('info', 'Iniciando sesión...');
                
                const result = await firebaseAPI.login(email, password);
                
                if (result.success) {
                    // Guardar usuario en sessionStorage con TODOS los campos importantes
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        uid: result.uid,
                        email: result.email,
                        nombres: result.nombres || 'Usuario',
                        apellidos: result.apellidos || '',
                        numero_socio: result.numero_socio || '',
                        tipo_membresia: result.tipo_membresia || 'free',
                        is_admin: result.is_admin === true, // ✅ Asegurar valor booleano
                        admin_activo: result.admin_activo === true, // ✅ Estado del admin
                        rol: result.rol || null // ✅ Rol específico (super_admin, admin, null)
                    }));
                    
                    // 🔍 LOG para debugging
                    console.log('📝 Usuario guardado en sessionStorage:', {
                        email: result.email,
                        is_admin: result.is_admin === true,
                        rol: result.rol
                    });
                    
                    showMessage('success', `¡Bienvenido ${result.nombres}! Redirigiendo...`);
                    
                    // Cerrar modal
                    setTimeout(() => {
                        const modal = document.getElementById('loginModal');
                        if (modal) {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                        
                        // Actualizar header
                        updateHeaderAuth();
                        
                        // Redirigir al dashboard con ruta correcta
                        const paths = getRelativePath();
                        window.location.href = paths.dashboard;
                    }, 1000);
                }
            } else {
                // Fallback a localStorage si Firebase no está disponible
                console.warn('⚠️ Firebase no disponible, usando localStorage');
                const allUsers = getAllUsers();
                const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    showMessage('error', 'Usuario no encontrado. Por favor regístrate primero.');
                    return;
                }
                
                // Usuario encontrado - login exitoso
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                showMessage('success', `¡Bienvenido ${user.nombres}! Redirigiendo...`);
                
                setTimeout(() => {
                    const modal = document.getElementById('loginModal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                    updateHeaderAuth();
                    // Redirigir al dashboard con ruta correcta
                    const paths = getRelativePath();
                    window.location.href = paths.dashboard;
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            // Mensajes de error más específicos
            if (error.code === 'auth/user-not-found') {
                showMessage('error', 'Usuario no encontrado. Por favor regístrate primero.');
            } else if (error.code === 'auth/wrong-password') {
                showMessage('error', 'Contraseña incorrecta. Intenta nuevamente.');
            } else if (error.code === 'auth/invalid-email') {
                showMessage('error', 'Email inválido. Verifica tu correo.');
            } else if (error.code === 'auth/too-many-requests') {
                showMessage('error', 'Demasiados intentos. Intenta más tarde.');
            } else {
                showMessage('error', error.message || 'Error al iniciar sesión. Intenta nuevamente.');
            }
        }
        
        return false;
    }
    
    function setupRegisterButtons() {
        // Configurar botones de registro para redirigir a registro.html
        const registerBtns = document.querySelectorAll('.btn-register');
        registerBtns.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                window.location.href = 'registro.html';
            };
        });
    }
    
    // Función para obtener rutas relativas correctas según la ubicación actual
    function getRelativePath() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/public/')) {
            return {
                dashboard: '../src/pages/user/dashboard.html',
                perfil: '../src/pages/user/mi-cuenta.html',
                panelAdmin: '../src/pages/admin/panel-admin.html'
            };
        } else if (currentPath.includes('/pages/user/')) {
            return {
                dashboard: 'dashboard.html',
                perfil: 'mi-cuenta.html',
                panelAdmin: '../admin/panel-admin.html'
            };
        } else if (currentPath.includes('/pages/admin/')) {
            return {
                dashboard: '../user/dashboard.html',
                perfil: '../user/mi-cuenta.html',
                panelAdmin: 'panel-admin.html'
            };
        }
        return {
            dashboard: '../user/dashboard.html',
            perfil: '../user/mi-cuenta.html',
            panelAdmin: '../admin/panel-admin.html'
        };
    }
    
    function updateHeaderAuth() {
        const paths = getRelativePath();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const navAuth = document.querySelector('.nav-auth');
        
        if (!navAuth) return;
        
        if (currentUser) {
            // 🔍 LOG para debugging del menú
            console.log('🔐 Verificando permisos para menú:', {
                email: currentUser.email,
                is_admin: currentUser.is_admin,
                rol: currentUser.rol,
                numero_socio: currentUser.numero_socio
            });
            
            // Verificar si es administrador (Super Admin o Admin regular)
            const isSuperAdmin = currentUser.numero_socio === 'U202532321' || currentUser.rol === 'super_admin';
            const isAdmin = isSuperAdmin || currentUser.is_admin === true;
            
            console.log('✅ Resultado verificación:', { isSuperAdmin, isAdmin });
            
            // Usuario logueado - mostrar menú de usuario
            navAuth.innerHTML = `
                <div class="user-menu">
                    <div class="user-info">
                        <i class="fas fa-user-circle"></i>
                        <span class="user-name">${currentUser.nombres}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="user-dropdown">
                        <a href="${paths.dashboard}" class="dropdown-item" onclick="console.log('Dashboard click:', '${paths.dashboard}')">
                            <i class="fas fa-tachometer-alt"></i> Mi Dashboard
                        </a>
                        ${isAdmin ? `
                        <a href="${paths.panelAdmin}" class="dropdown-item" style="background: linear-gradient(90deg, rgba(196,30,58,0.1), rgba(212,175,55,0.1)); font-weight: 600;" onclick="console.log('Panel Admin click:', '${paths.panelAdmin}')">
                            <i class="fas fa-shield-alt" style="color: ${isSuperAdmin ? '#d4af37' : '#003278'};"></i> Panel Admin
                        </a>
                        ` : ''}
                        <a href="../src/pages/user/mis-datos.html?v=20251116" class="dropdown-item" onclick="console.log('MIS DATOS CLICK')">
                            <i class="fas fa-id-card"></i> Mis Datos
                        </a>
                        <a href="../src/pages/user/test.html?v=20251116" class="dropdown-item" onclick="console.log('TEST CLICK')">
                            <i class="fas fa-flask"></i> TEST
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout-item" onclick="window.authSystem.logout(event)">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </a>
                    </div>
                </div>
            `;
            
            // Configurar evento del dropdown
            const userInfo = navAuth.querySelector('.user-info');
            const userDropdown = navAuth.querySelector('.user-dropdown');
            
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
                <button class="btn-login" onclick="window.openModal('loginModal')">
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
        
        // Usar el modal profesional si está disponible
        if (window.modalSystem && typeof window.modalSystem.showProfileModal === 'function') {
            window.modalSystem.showProfileModal();
            return;
        }
        
        // Fallback al alert anterior si el modal no está cargado
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (currentUser) {
            const membershipName = {
                'free': 'Free',
                'basica': 'Básica',
                'premium': 'Premium',
                'vip': 'VIP'
            };
            
            // Determinar el rol más alto
            const isSuperAdmin = currentUser.numero_socio === 'U202532321';
            const isAdmin = currentUser.is_admin === true;
            
            let roleText = '👤 Socio';
            if (isSuperAdmin) {
                roleText = '👑 SUPER ADMIN';
            } else if (isAdmin) {
                roleText = '🛡️ Administrador';
            }
            
            // Estado de membresía
            const membershipStatus = currentUser.membresia_revocada 
                ? '❌ Revocada' 
                : '✅ Activa';
            
            alert(`═══════════════════════════════════\n` +
                  `    PERFIL DE USUARIO\n` +
                  `═══════════════════════════════════\n\n` +
                  `👤 Nombre: ${currentUser.nombres} ${currentUser.apellidos}\n\n` +
                  `🔰 Rol: ${roleText}\n\n` +
                  `🎫 Socio N°: ${currentUser.numero_socio}\n\n` +
                  `📧 Email: ${currentUser.email}\n\n` +
                  `💎 Membresía: ${membershipName[currentUser.tipo_membresia] || 'Free'}\n\n` +
                  `📊 Estado: ${membershipStatus}\n\n` +
                  `═══════════════════════════════════`);
        }
    }
    
    async function logout(event) {
        event.preventDefault();
        
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            try {
                // Cerrar sesión en Firebase si está disponible
                if (typeof firebaseAPI !== 'undefined' && typeof firebase !== 'undefined') {
                    await firebase.auth().signOut();
                    console.log('✅ Sesión de Firebase cerrada');
                }
                
                // Limpiar storage local
                sessionStorage.removeItem('currentUser');
                localStorage.removeItem('currentUser');
                
                showMessage('success', 'Sesión cerrada exitosamente');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('❌ Error al cerrar sesión:', error);
                showMessage('error', 'Error al cerrar sesión');
            }
        }
    }
    
    // Funciones auxiliares
    function getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_')) {
                try {
                    const user = JSON.parse(localStorage.getItem(key));
                    users.push(user);
                } catch (e) {
                    console.error('Error parsing user:', e);
                }
            }
        }
        return users;
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function showMessage(type, message) {
        // Remover mensaje anterior si existe
        hideMessage();
        
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'info': '#17a2b8'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'auth-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || '#17a2b8'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideDown 0.3s ease;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };
        const icon = icons[type] || 'fa-info-circle';
        messageDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        
        document.body.appendChild(messageDiv);
    }
    
    function hideMessage() {
        const existingMessage = document.getElementById('auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    // Exponer funciones globalmente para uso en HTML
    window.authSystem = {
        updateHeaderAuth: updateHeaderAuth,
        viewProfile: viewProfile,
        logout: logout
    };
    
})();
