// Validación y manejo del formulario de registro

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const numeroDocumento = document.getElementById('numero_documento');
    const tipoDocumento = document.getElementById('tipo_documento');
    const fechaNacimiento = document.getElementById('fecha_nacimiento');
    const password = document.getElementById('password');
    const confirmarPassword = document.getElementById('confirmar_password');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');

    // Validar formato de documento según tipo
    numeroDocumento.addEventListener('input', function() {
        const tipo = tipoDocumento.value;
        let maxLength = 12;
        
        if (tipo === 'DNI') {
            maxLength = 8;
            this.value = this.value.replace(/\D/g, '').slice(0, maxLength);
        } else if (tipo === 'CE') {
            maxLength = 12;
            this.value = this.value.replace(/[^A-Za-z0-9]/g, '').slice(0, maxLength);
        }
    });

    tipoDocumento.addEventListener('change', function() {
        numeroDocumento.value = '';
        numeroDocumento.focus();
    });

    // Validar fecha de nacimiento (mayor de 18 años)
    fechaNacimiento.addEventListener('change', function() {
        const hoy = new Date();
        const fechaNac = new Date(this.value);
        const edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        if (edad < 18) {
            mostrarError(this, 'Debes ser mayor de 18 años para registrarte');
        } else {
            limpiarError(this);
        }
    });

    // Establecer fecha máxima (hace 18 años)
    const hoy = new Date();
    const hace18 = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    fechaNacimiento.max = hace18.toISOString().split('T')[0];

    // Validar formato de teléfono
    telefono.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+\s-]/g, '');
    });

    // Validar contraseña
    password.addEventListener('input', function() {
        validarPassword(this.value);
    });

    confirmarPassword.addEventListener('input', function() {
        if (this.value !== password.value) {
            mostrarError(this, 'Las contraseñas no coinciden');
        } else {
            limpiarError(this);
        }
    });

    // Validar email en tiempo real
    email.addEventListener('blur', function() {
        if (!validarEmail(this.value)) {
            mostrarError(this, 'Ingresa un correo electrónico válido');
        } else {
            limpiarError(this);
        }
    });

    // Submit del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            enviarFormulario();
        }
    });

    function validarFormulario() {
        let valido = true;
        
        // Validar campos requeridos
        const camposRequeridos = form.querySelectorAll('[required]');
        camposRequeridos.forEach(campo => {
            if (!campo.value.trim()) {
                mostrarError(campo, 'Este campo es obligatorio');
                valido = false;
            }
        });

        // Validar DNI
        const tipoDoc = tipoDocumento.value;
        const numDoc = numeroDocumento.value;
        
        if (tipoDoc === 'DNI' && numDoc.length !== 8) {
            mostrarError(numeroDocumento, 'El DNI debe tener 8 dígitos');
            valido = false;
        }

        // Validar email
        if (!validarEmail(email.value)) {
            mostrarError(email, 'Ingresa un correo electrónico válido');
            valido = false;
        }

        // Validar contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password.value)) {
            mostrarError(password, 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
            valido = false;
        }

        // Validar confirmación de contraseña
        if (password.value !== confirmarPassword.value) {
            mostrarError(confirmarPassword, 'Las contraseñas no coinciden');
            valido = false;
        }

        // Validar edad
        const fechaNac = new Date(fechaNacimiento.value);
        const edad = calcularEdad(fechaNac);
        if (edad < 18) {
            mostrarError(fechaNacimiento, 'Debes ser mayor de 18 años');
            valido = false;
        }

        return valido;
    }

    async function enviarFormulario() {
        const submitBtn = form.querySelector('.btn-submit');
        const formData = new FormData(form);
        
        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Preparar datos del usuario
        const userData = {
            tipo_documento: formData.get('tipo_documento'),
            numero_documento: formData.get('numero_documento'),
            nombres: formData.get('nombres'),
            apellidos: formData.get('apellidos'),
            fecha_nacimiento: formData.get('fecha_nacimiento'),
            genero: formData.get('genero'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            direccion: formData.get('direccion'),
            departamento: formData.get('departamento'),
            distrito: formData.get('distrito'),
            tipo_membresia: 'free', // Todos los nuevos usuarios comienzan con plan gratuito
            password: formData.get('password'),
            numero_socio: 'U2025' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
            fecha_vencimiento: null // Los usuarios free no tienen vencimiento
        };
        
        try {
            // 🔥 GUARDAR EN FIREBASE (EN LA NUBE DE GOOGLE)
            if (typeof firebaseAPI !== 'undefined') {
                const result = await firebaseAPI.register(userData);
                
                if (result.success) {
                    // ✅ DATOS GUARDADOS EN LA NUBE PARA SIEMPRE
                    console.log('✅ Usuario guardado en Firebase:', result.uid);
                    
                    // Guardar sesión local (solo referencia)
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        uid: result.uid,
                        email: result.email,
                        nombres: userData.nombres
                    }));
                    
                    // Mostrar mensaje de éxito
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    
                    mostrarMensaje('success', `¡Registro exitoso! Tu número de socio es: ${userData.numero_socio}. Redirigiendo a tu dashboard...`);
                    form.reset();
                    
                    // Redirigir al dashboard después de 2 segundos
                    // Desde src/pages/auth/registro.html hacia src/pages/user/dashboard.html
                    setTimeout(() => {
                        window.location.href = '/universitario-deportes/user/dashboard.html';
                    }, 2000);
                }
            } else {
                // Fallback: usar localStorage si Firebase no está disponible
                console.warn('⚠️ Firebase no disponible, usando localStorage');
                localStorage.setItem(`user_${userData.email}`, JSON.stringify(userData));
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                mostrarMensaje('success', `¡Registro exitoso! Tu número de socio es: ${userData.numero_socio}. Redirigiendo a tu dashboard...`);
                form.reset();
                
                // Desde src/pages/auth/registro.html hacia src/pages/user/dashboard.html
                setTimeout(() => {
                    window.location.href = '/universitario-deportes/user/dashboard.html';
                }, 2000);
            }
        } catch (error) {
            console.error('❌ Error en registro:', error);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            mostrarMensaje('error', error.message || 'Error al registrar usuario. Por favor, intenta de nuevo.');
        }
    }

    function validarPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const passwordField = document.getElementById('password');
        
        if (!passwordRegex.test(password)) {
            mostrarError(passwordField, 'Debe contener al menos 8 caracteres, una mayúscula y un número');
        } else {
            limpiarError(passwordField);
        }
    }

    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    }

    function mostrarError(campo, mensaje) {
        campo.classList.add('error');
        campo.classList.remove('success');
        
        let errorDiv = campo.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            campo.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = mensaje;
        campo.parentElement.classList.add('has-error');
    }

    function limpiarError(campo) {
        campo.classList.remove('error');
        campo.classList.add('success');
        campo.parentElement.classList.remove('has-error');
        
        const errorDiv = campo.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function mostrarMensaje(tipo, mensaje) {
        const mensajeContainer = document.getElementById('mensaje-container');
        const mensajeDiv = document.getElementById('mensaje');
        
        mensajeDiv.className = `mensaje ${tipo}`;
        
        const icono = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        mensajeDiv.innerHTML = `<i class="fas ${icono}"></i> ${mensaje}`;
        
        mensajeContainer.style.display = 'block';
        
        // Scroll al mensaje
        mensajeContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            mensajeContainer.style.display = 'none';
        }, 5000);
    }
});

// Función para mostrar/ocultar contraseña
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
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

// Limpiar errores al escribir
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorDiv = this.parentElement.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.remove();
                }
                this.parentElement.classList.remove('has-error');
            }
        });
    });
});
