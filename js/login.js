// Login functionality with Firebase
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showMessage('error', 'Por favor completa todos los campos');
            return;
        }
        
        try {
            // Try Firebase login first
            if (typeof firebaseAPI !== 'undefined') {
                showMessage('info', 'Iniciando sesión...');
                
                const result = await firebaseAPI.login(email, password);
                
                if (result.success) {
                    // Save user in sessionStorage
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        uid: result.uid,
                        email: result.email,
                        nombres: result.nombres,
                        apellidos: result.apellidos,
                        numero_socio: result.numero_socio,
                        tipo_membresia: result.tipo_membresia,
                        is_admin: result.is_admin || false
                    }));
                    
                    showMessage('success', `¡Bienvenido ${result.nombres}! Redirigiendo...`);
                    
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                }
            } else {
                // Fallback to localStorage if Firebase not available
                console.warn('⚠️ Firebase no disponible, usando localStorage');
                const allUsers = getAllUsers();
                const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    showMessage('error', 'Usuario no encontrado. Por favor regístrate primero.');
                    return;
                }
                
                if (user.password_hash) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    showMessage('success', '¡Bienvenido! Redirigiendo...');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    showMessage('error', 'Contraseña incorrecta');
                }
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            // More specific error messages
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
    });
});

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
