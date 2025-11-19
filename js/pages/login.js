// 🚀 Login functionality with Firebase - ENHANCED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let loginAttempts = 0;
    const MAX_ATTEMPTS = 5;
    
    // Real-time email validation
    emailInput?.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.classList.add('invalid');
            showFieldError(this, 'Correo electrónico inválido');
        } else {
            this.classList.remove('invalid');
            clearFieldError(this);
        }
    });
    
    // Clear error on input
    [emailInput, passwordInput].forEach(input => {
        input?.addEventListener('input', function() {
            this.classList.remove('invalid');
            clearFieldError(this);
        });
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate inputs
        if (!email || !password) {
            showMessage('error', 'Por favor completa todos los campos');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            emailInput.classList.add('invalid');
            showFieldError(emailInput, 'Correo electrónico inválido');
            showMessage('error', 'Por favor ingresa un correo válido');
            return;
        }
        
        // Check login attempts
        if (loginAttempts >= MAX_ATTEMPTS) {
            showMessage('error', `Demasiados intentos. Espera 5 minutos.`);
            return;
        }
        
        loginAttempts++;
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            submitBtn.disabled = true;
            
            // Try Firebase login first
            if (typeof firebaseAPI !== 'undefined') {
                const result = await firebaseAPI.login(email, password);
                
                if (result.success) {
                    // Reset attempts on success
                    loginAttempts = 0;
                    
                    // Save user in sessionStorage with ALL data
                    const userData = {
                        uid: result.uid,
                        email: result.email,
                        nombres: result.nombres || 'Usuario',
                        apellidos: result.apellidos || '',
                        numero_socio: result.numero_socio || '',
                        tipo_membresia: result.tipo_membresia || 'free',
                        is_admin: result.is_admin === true,
                        admin_activo: result.admin_activo !== false,
                        rol: result.rol || null,
                        fecha_registro: result.fecha_registro || new Date().toISOString()
                    };
                    
                    sessionStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Success animation
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Éxito!';
                    submitBtn.style.background = '#28a745';
                    
                    showMessage('success', `¡Bienvenido ${result.nombres}! Redirigiendo...`);
                    
                    // Log for debugging
                    console.log('✅ Login exitoso:', {
                        email: userData.email,
                        is_admin: userData.is_admin,
                        rol: userData.rol
                    });
                    
                    setTimeout(() => {
                        // Redirigir según rol
                        if (userData.is_admin && userData.admin_activo) {
                            window.location.href = '/universitario-deportes/admin/panel-admin.html';
                        } else {
                            window.location.href = '/universitario-deportes/user/dashboard.html';
                        }
                    }, 1500);
                } else {
                    throw new Error('Login fallido');
                }
            } else {
                // Fallback to localStorage if Firebase not available
                console.warn('⚠️ Firebase no disponible, usando localStorage');
                const allUsers = getAllUsers();
                const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    throw { code: 'auth/user-not-found' };
                }
                
                if (user.password_hash) {
                    loginAttempts = 0;
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    showMessage('success', `¡Bienvenido ${user.nombres}! Redirigiendo...`);
                    setTimeout(() => {
                        window.location.href = '/universitario-deportes/user/dashboard.html';
                    }, 1500);
                } else {
                    throw { code: 'auth/wrong-password' };
                }
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            // Restore button
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            
            // Enhanced error messages
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = '❌ Usuario no encontrado. ¿No tienes cuenta? Regístrate primero.';
                emailInput.classList.add('invalid');
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = '❌ Contraseña incorrecta. Verifica e intenta nuevamente.';
                passwordInput.classList.add('invalid');
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = '❌ Correo electrónico inválido. Verifica el formato.';
                emailInput.classList.add('invalid');
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = '🚫 Demasiados intentos fallidos. Espera unos minutos.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = '🌐 Error de conexión. Verifica tu internet.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showMessage('error', errorMessage);
            
            // Shake animation for error
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    });
});

// Helper function for email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show field-specific errors
function showFieldError(field, message) {
    clearFieldError(field);
    const error = document.createElement('small');
    error.className = 'field-error';
    error.style.cssText = 'color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
    error.textContent = message;
    field.parentElement.appendChild(error);
}

function clearFieldError(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.remove();
}

// Get all users from localStorage (simulating database)
function getAllUsers() {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
            const user = JSON.parse(localStorage.getItem(key));
            users.push(user);
        }
    }
    return users;
}

// Show password toggle
function togglePassword() {
    const field = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show message
function showMessage(type, message) {
    const messageContainer = document.getElementById('mensaje-container');
    const messageDiv = document.getElementById('mensaje');
    
    messageDiv.className = `mensaje ${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle'
    };
    const icon = icons[type] || 'fa-info-circle';
    messageDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    messageContainer.style.display = 'block';
    
    // Auto-hide after 5 seconds for errors
    if (type === 'error') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}
