// 🛠️ UTILITY HELPERS - Sistema de utilidades mejorado
// =======================================================

/**
 * Utilidades de validación
 */
const Validator = {
    // Validar email
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Validar DNI peruano (8 dígitos)
    dni: (dni) => {
        return /^\d{8}$/.test(dni);
    },
    
    // Validar teléfono peruano
    phone: (phone) => {
        return /^(\+51)?9\d{8}$/.test(phone.replace(/\s/g, ''));
    },
    
    // Validar contraseña fuerte
    password: (password) => {
        // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    },
    
    // Validar edad mínima (18 años)
    age: (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    },
    
    // Validar longitud de texto
    length: (text, min, max) => {
        const len = text.trim().length;
        return len >= min && len <= max;
    }
};

/**
 * Utilidades de formato
 */
const Formatter = {
    // Formatear fecha a español
    date: (date, format = 'long') => {
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('es-PE', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        }
        
        return d.toLocaleDateString('es-PE', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    },
    
    // Formatear moneda peruana
    currency: (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    },
    
    // Capitalizar primera letra
    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    // Capitalizar cada palabra
    titleCase: (text) => {
        return text.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    
    // Formatear teléfono
    phone: (phone) => {
        const clean = phone.replace(/\D/g, '');
        if (clean.length === 9) {
            return `+51 ${clean.slice(0,3)} ${clean.slice(3,6)} ${clean.slice(6)}`;
        }
        return phone;
    },
    
    // Truncar texto con ellipsis
    truncate: (text, length = 50) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
};

/**
 * Utilidades de almacenamiento
 */
const Storage = {
    // Guardar en localStorage con manejo de errores
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    },
    
    // Obtener de localStorage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error leyendo de localStorage:', error);
            return defaultValue;
        }
    },
    
    // Remover de localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removiendo de localStorage:', error);
            return false;
        }
    },
    
    // Limpiar localStorage
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
            return false;
        }
    },
    
    // Lo mismo para sessionStorage
    session: {
        set: (key, value) => {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error guardando en sessionStorage:', error);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error leyendo de sessionStorage:', error);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removiendo de sessionStorage:', error);
                return false;
            }
        },
        
        clear: () => {
            try {
                sessionStorage.clear();
                return true;
            } catch (error) {
                console.error('Error limpiando sessionStorage:', error);
                return false;
            }
        }
    }
};

/**
 * Utilidades de UI
 */
const UI = {
    // Mostrar notificación toast
    toast: (message, type = 'info', duration = 3000) => {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        
        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    // Mostrar loading spinner
    showLoading: (target = document.body) => {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Cargando...</p>
            </div>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        target.appendChild(loading);
        return loading;
    },
    
    // Ocultar loading
    hideLoading: () => {
        const loading = document.querySelector('.loading-overlay');
        if (loading) loading.remove();
    },
    
    // Confirmar acción
    confirm: async (message, title = '¿Estás seguro?') => {
        return window.confirm(`${title}\n\n${message}`);
    },
    
    // Animar scroll suave
    scrollTo: (element, offset = 0) => {
        const el = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
        
        if (el) {
            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }
};

/**
 * Utilidades de fecha
 */
const DateUtils = {
    // Obtener fecha actual en formato ISO
    now: () => new Date().toISOString(),
    
    // Sumar días a una fecha
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    // Calcular diferencia en días
    diffDays: (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = Math.abs(d2 - d1);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    
    // Verificar si una fecha expiró
    isExpired: (date) => {
        return new Date(date) < new Date();
    },
    
    // Obtener días restantes
    daysUntil: (date) => {
        const now = new Date();
        const target = new Date(date);
        const diff = target - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
};

/**
 * Utilidades de seguridad
 */
const Security = {
    // Escapar HTML para prevenir XSS
    escapeHTML: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Sanitizar input
    sanitize: (text) => {
        return text.trim().replace(/[<>]/g, '');
    },
    
    // Generar ID único
    generateId: () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Hash simple (no usar para contraseñas reales)
    simpleHash: (text) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
};

/**
 * Utilidades de performance
 */
const Performance = {
    // Debounce para optimizar eventos
    debounce: (func, delay = 300) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    // Throttle para limitar frecuencia de ejecución
    throttle: (func, limit = 1000) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Lazy load de imágenes
    lazyLoadImages: () => {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Añadir animaciones CSS
const cssAnimations = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = cssAnimations;
document.head.appendChild(style);

// Exportar utilidades
if (typeof window !== 'undefined') {
    window.Validator = Validator;
    window.Formatter = Formatter;
    window.Storage = Storage;
    window.UI = UI;
    window.DateUtils = DateUtils;
    window.Security = Security;
    window.Performance = Performance;
}

console.log('✅ Utilidades del sistema cargadas');
