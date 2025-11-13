<?php
/**
 * Archivo de configuración para la base de datos
 * Copia este archivo como config.php y ajusta los valores según tu entorno
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'universitario_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración del sitio
define('SITE_NAME', 'Club Universitario de Deportes');
define('SITE_URL', 'http://localhost/universitario');
define('SITE_EMAIL', 'noreply@universitario.pe');

// Configuración de seguridad
define('PASSWORD_MIN_LENGTH', 8);
define('SESSION_LIFETIME', 3600); // 1 hora en segundos
define('MAX_LOGIN_ATTEMPTS', 5);

// Configuración de email (para envío de correos)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'tu_email@gmail.com');
define('SMTP_PASS', 'tu_contraseña_de_aplicación');
define('SMTP_ENCRYPTION', 'tls');

// Configuración de membresías
define('MEMBRESIA_BASICA_PRECIO', 120.00);
define('MEMBRESIA_PREMIUM_PRECIO', 300.00);
define('MEMBRESIA_VIP_PRECIO', 800.00);

// Tiempo de zona
date_default_timezone_set('America/Lima');

// Modo de desarrollo (cambiar a false en producción)
define('DEBUG_MODE', true);

// Mostrar errores solo en modo desarrollo
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

/**
 * Función para obtener la conexión PDO
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        if (DEBUG_MODE) {
            die('Error de conexión: ' . $e->getMessage());
        } else {
            die('Error de conexión a la base de datos');
        }
    }
}
?>
