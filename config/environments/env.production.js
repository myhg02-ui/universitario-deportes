// Configuración de entorno de PRODUCCIÓN
const ENV_CONFIG = {
    environment: 'production',
    apiUrl: 'https://universitario-deportes.com/api',
    firebase: {
        useEmulator: false
    },
    logging: {
        level: 'error',
        enableConsole: false
    },
    features: {
        enableDebugMode: false,
        showPerformanceMetrics: false
    }
};

export default ENV_CONFIG;
