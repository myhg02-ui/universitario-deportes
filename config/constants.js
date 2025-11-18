// Constantes globales del proyecto
export const APP_NAME = 'Universitario de Deportes';
export const APP_VERSION = '1.0.0';

// Roles de usuario
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user'
};

// Tipos de membresía
export const MEMBERSHIP_TYPES = {
    FREE: 'Free',
    BASICA: 'Básica',
    PREMIUM: 'Premium',
    VIP: 'VIP'
};

// Estados de presencia
export const PRESENCE_STATES = {
    ONLINE: 'online',
    AWAY: 'away',
    OFFLINE: 'offline'
};

// Timeouts
export const TIMEOUTS = {
    INACTIVITY: 5 * 60 * 1000, // 5 minutos
    CACHE: 30 * 1000, // 30 segundos
    SESSION: 24 * 60 * 60 * 1000 // 24 horas
};

// Rutas de navegación
export const ROUTES = {
    HOME: '/public/index.html',
    LOGIN: '/src/pages/auth/login.html',
    REGISTRO: '/src/pages/auth/registro.html',
    DASHBOARD: '/src/pages/user/dashboard.html',
    ADMIN_PANEL: '/src/pages/admin/panel-admin.html'
};

// Mensajes de error
export const ERROR_MESSAGES = {
    AUTH_FAILED: 'Error de autenticación',
    NETWORK_ERROR: 'Error de conexión',
    PERMISSION_DENIED: 'Acceso denegado',
    INVALID_INPUT: 'Datos inválidos'
};

export default {
    APP_NAME,
    APP_VERSION,
    USER_ROLES,
    MEMBERSHIP_TYPES,
    PRESENCE_STATES,
    TIMEOUTS,
    ROUTES,
    ERROR_MESSAGES
};
