// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showMessage('error', 'Por favor completa todos los campos');
            return;
        }
        
        // Get all registered users from localStorage
        const allUsers = getAllUsers();
        
        // Find user by email
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            showMessage('error', 'Usuario no encontrado. Por favor regístrate primero.');
            return;
        }
        
        // In real app, you'd verify password with bcrypt
        // For simulation, we check if password exists (simplified)
        if (user.password_hash) {
            // User exists, simulate successful login
            // Save current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            showMessage('success', '¡Bienvenido! Redirigiendo...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage('error', 'Contraseña incorrecta');
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
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    messageDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    messageContainer.style.display = 'block';
    
    // Auto-hide after 5 seconds for errors
    if (type === 'error') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}
