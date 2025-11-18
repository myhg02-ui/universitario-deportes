// 🔔 SISTEMA DE NOTIFICACIONES MEJORADO
// ========================================

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.init();
    }
    
    init() {
        // Crear contenedor de notificaciones
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 5000, options = {}) {
        // Limitar número de notificaciones
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            oldest.element.remove();
        }
        
        const notification = this.createNotification(message, type, options);
        this.container.appendChild(notification.element);
        this.notifications.push(notification);
        
        // Auto-remover después de duration
        if (duration > 0) {
            notification.timer = setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }
    
    createNotification(message, type, options) {
        const colors = {
            success: { bg: '#28a745', icon: 'fa-check-circle' },
            error: { bg: '#dc3545', icon: 'fa-exclamation-circle' },
            warning: { bg: '#ffc107', icon: 'fa-exclamation-triangle', textColor: '#000' },
            info: { bg: '#17a2b8', icon: 'fa-info-circle' }
        };
        
        const config = colors[type] || colors.info;
        const textColor = config.textColor || '#fff';
        
        const element = document.createElement('div');
        element.className = 'notification animate-slide-in-right';
        element.style.cssText = `
            background: ${config.bg};
            color: ${textColor};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
            transition: all 0.3s;
        `;
        
        element.innerHTML = `
            <i class="fas ${config.icon}" style="font-size: 1.5rem;"></i>
            <div style="flex: 1;">
                ${options.title ? `<div style="font-weight: 700; margin-bottom: 4px;">${options.title}</div>` : ''}
                <div style="font-size: 0.95rem;">${message}</div>
            </div>
            <button class="notification-close" style="
                background: none;
                border: none;
                color: ${textColor};
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateX(-5px)';
            element.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateX(0)';
            element.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });
        
        const notification = {
            element,
            type,
            message,
            timer: null
        };
        
        // Close button
        const closeBtn = element.querySelector('.notification-close');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
            closeBtn.style.background = 'rgba(0,0,0,0.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.7';
            closeBtn.style.background = 'none';
        });
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification);
        });
        
        // Click to dismiss
        element.addEventListener('click', () => {
            if (options.onClick) {
                options.onClick();
            }
            this.remove(notification);
        });
        
        return notification;
    }
    
    remove(notification) {
        if (notification.timer) {
            clearTimeout(notification.timer);
        }
        
        notification.element.style.animation = 'slideOutRight 0.3s ease';
        
        setTimeout(() => {
            notification.element.remove();
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    // Métodos helper
    success(message, options = {}) {
        return this.show(message, 'success', options.duration, options);
    }
    
    error(message, options = {}) {
        return this.show(message, 'error', options.duration || 7000, options);
    }
    
    warning(message, options = {}) {
        return this.show(message, 'warning', options.duration, options);
    }
    
    info(message, options = {}) {
        return this.show(message, 'info', options.duration, options);
    }
    
    clearAll() {
        this.notifications.forEach(notification => {
            notification.element.remove();
            if (notification.timer) {
                clearTimeout(notification.timer);
            }
        });
        this.notifications = [];
    }
}

// Crear instancia global
const notifications = new NotificationSystem();

// Exportar
if (typeof window !== 'undefined') {
    window.notifications = notifications;
    window.NotificationSystem = NotificationSystem;
}

// Añadir estilos de animación si no existen
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(120%);
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
                transform: translateX(120%);
                opacity: 0;
            }
        }
        
        @media (max-width: 480px) {
            #notification-container {
                left: 10px;
                right: 10px;
                top: 10px;
                max-width: none !important;
            }
            
            .notification {
                min-width: 100% !important;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Sistema de notificaciones mejorado cargado');
