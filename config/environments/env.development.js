// Configuración de entorno de DESARROLLO
const ENV_CONFIG = {
    environment: 'development',
    apiUrl: 'http://localhost:3000',
    firebase: {
        useEmulator: true,
        emulatorHost: 'localhost',
        emulatorPort: 8080
    },
    logging: {
        level: 'debug',
        enableConsole: true
    },
    features: {
        enableDebugMode: true,
        showPerformanceMetrics: true
    }
};

export default ENV_CONFIG;
