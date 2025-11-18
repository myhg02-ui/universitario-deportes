// 📝 SISTEMA DE VALIDACIÓN DE FORMULARIOS EN TIEMPO REAL
// =========================================================

class FormValidator {
    constructor(formElement, rules, options = {}) {
        this.form = formElement;
        this.rules = rules;
        this.options = {
            realTime: true,
            showSuccess: true,
            submitOnValid: false,
            ...options
        };
        this.errors = {};
        this.touched = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Prevenir submit por defecto
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
        
        // Configurar validación en tiempo real
        if (this.options.realTime) {
            Object.keys(this.rules).forEach(fieldName => {
                const field = this.form.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    // Validar al perder foco
                    field.addEventListener('blur', () => {
                        this.touched[fieldName] = true;
                        this.validateField(fieldName);
                    });
                    
                    // Limpiar error al escribir
                    field.addEventListener('input', () => {
                        if (this.touched[fieldName]) {
                            this.validateField(fieldName);
                        }
                    });
                }
            });
        }
    }
    
    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return true;
        
        const value = field.value;
        const fieldRules = this.rules[fieldName];
        let error = null;
        
        // Validar cada regla
        for (const rule of fieldRules) {
            if (rule.required && !value.trim()) {
                error = rule.message || 'Este campo es obligatorio';
                break;
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                error = rule.message || `Mínimo ${rule.minLength} caracteres`;
                break;
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                error = rule.message || `Máximo ${rule.maxLength} caracteres`;
                break;
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                error = rule.message || 'Formato inválido';
                break;
            }
            
            if (rule.email && !this.isValidEmail(value)) {
                error = rule.message || 'Correo electrónico inválido';
                break;
            }
            
            if (rule.phone && !this.isValidPhone(value)) {
                error = rule.message || 'Teléfono inválido';
                break;
            }
            
            if (rule.dni && !this.isValidDNI(value)) {
                error = rule.message || 'DNI inválido (8 dígitos)';
                break;
            }
            
            if (rule.match) {
                const matchField = this.form.querySelector(`[name="${rule.match}"]`);
                if (matchField && value !== matchField.value) {
                    error = rule.message || 'Los campos no coinciden';
                    break;
                }
            }
            
            if (rule.custom && typeof rule.custom === 'function') {
                const customResult = rule.custom(value, this.form);
                if (customResult !== true) {
                    error = customResult || 'Validación fallida';
                    break;
                }
            }
        }
        
        if (error) {
            this.errors[fieldName] = error;
            this.showError(field, error);
            return false;
        } else {
            delete this.errors[fieldName];
            this.clearError(field);
            if (this.options.showSuccess && this.touched[fieldName]) {
                this.showSuccess(field);
            }
            return true;
        }
    }
    
    validateAll() {
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            this.touched[fieldName] = true;
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    handleSubmit(e) {
        const isValid = this.validateAll();
        
        if (isValid) {
            if (this.options.onSubmit) {
                this.options.onSubmit(this.getFormData(), e);
            }
            
            if (this.options.submitOnValid) {
                this.form.submit();
            }
        } else {
            // Scroll al primer error
            const firstErrorField = Object.keys(this.errors)[0];
            if (firstErrorField) {
                const field = this.form.querySelector(`[name="${firstErrorField}"]`);
                if (field) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
            
            if (this.options.onError) {
                this.options.onError(this.errors);
            }
        }
    }
    
    showError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        // Remover error anterior si existe
        this.clearError(field);
        
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            animation: slideInDown 0.3s ease;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Insertar después del campo
        const wrapper = field.parentElement;
        wrapper.appendChild(errorDiv);
        
        // Shake animation
        field.style.animation = 'shake 0.3s';
        setTimeout(() => {
            field.style.animation = '';
        }, 300);
    }
    
    showSuccess(field) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        
        // Agregar icono de éxito
        let successIcon = field.parentElement.querySelector('.success-icon');
        if (!successIcon) {
            successIcon = document.createElement('i');
            successIcon.className = 'fas fa-check-circle success-icon';
            successIcon.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #28a745;
                font-size: 1.2rem;
                animation: zoomIn 0.3s ease;
            `;
            
            // Asegurar que el wrapper sea relativo
            field.parentElement.style.position = 'relative';
            field.parentElement.appendChild(successIcon);
        }
    }
    
    clearError(field) {
        field.classList.remove('invalid', 'valid');
        
        // Remover mensaje de error
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        // Remover icono de éxito
        const successIcon = field.parentElement.querySelector('.success-icon');
        if (successIcon) {
            successIcon.remove();
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    reset() {
        this.errors = {};
        this.touched = {};
        this.form.reset();
        
        // Limpiar todos los errores visuales
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.clearError(field);
            }
        });
    }
    
    // Validadores helper
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^(\+51)?9\d{8}$/.test(phone.replace(/\s/g, ''));
    }
    
    isValidDNI(dni) {
        return /^\d{8}$/.test(dni);
    }
}

// Helper function para crear validadores fácilmente
function createValidator(formSelector, rules, options = {}) {
    const form = typeof formSelector === 'string' 
        ? document.querySelector(formSelector) 
        : formSelector;
    
    if (!form) {
        console.error('Formulario no encontrado:', formSelector);
        return null;
    }
    
    return new FormValidator(form, rules, options);
}

// Reglas de validación predefinidas
const ValidationRules = {
    required: (message = 'Este campo es obligatorio') => ({
        required: true,
        message
    }),
    
    email: (message = 'Correo electrónico inválido') => ({
        email: true,
        message
    }),
    
    phone: (message = 'Teléfono inválido') => ({
        phone: true,
        message
    }),
    
    dni: (message = 'DNI inválido (8 dígitos)') => ({
        dni: true,
        message
    }),
    
    minLength: (length, message) => ({
        minLength: length,
        message: message || `Mínimo ${length} caracteres`
    }),
    
    maxLength: (length, message) => ({
        maxLength: length,
        message: message || `Máximo ${length} caracteres`
    }),
    
    match: (fieldName, message) => ({
        match: fieldName,
        message: message || 'Los campos no coinciden'
    }),
    
    pattern: (regex, message = 'Formato inválido') => ({
        pattern: regex,
        message
    }),
    
    custom: (validator, message) => ({
        custom: validator,
        message
    })
};

// Exportar
if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
    window.createValidator = createValidator;
    window.ValidationRules = ValidationRules;
}

// Añadir estilos CSS
if (!document.getElementById('form-validator-styles')) {
    const style = document.createElement('style');
    style.id = 'form-validator-styles';
    style.textContent = `
        .form-input.invalid,
        .form-select.invalid,
        .form-textarea.invalid {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .form-input.valid,
        .form-select.valid,
        .form-textarea.valid {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Sistema de validación de formularios cargado');
