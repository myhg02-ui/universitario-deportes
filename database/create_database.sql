-- Script SQL para crear la base de datos del Club Universitario de Deportes
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS universitario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE universitario_db;

-- Tabla de socios
CREATE TABLE IF NOT EXISTS socios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_socio VARCHAR(20) UNIQUE NOT NULL,
    tipo_documento ENUM('DNI', 'CE', 'PASAPORTE') NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F', 'OTRO') NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    distrito VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    tipo_membresia ENUM('BASICA', 'PREMIUM', 'VIP') NOT NULL DEFAULT 'BASICA',
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') NOT NULL DEFAULT 'ACTIVO',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    acepta_comunicaciones TINYINT(1) DEFAULT 0,
    ultimo_acceso DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_numero_documento (tipo_documento, numero_documento),
    INDEX idx_numero_socio (numero_socio),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de membresías
CREATE TABLE IF NOT EXISTS historial_membresias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT NOT NULL,
    tipo_membresia ENUM('BASICA', 'PREMIUM', 'VIP') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado_pago ENUM('PENDIENTE', 'PAGADO', 'CANCELADO') DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
    INDEX idx_socio (socio_id),
    INDEX idx_estado_pago (estado_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de entradas
CREATE TABLE IF NOT EXISTS entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT NOT NULL,
    partido VARCHAR(200) NOT NULL,
    fecha_partido DATETIME NOT NULL,
    zona VARCHAR(50) NOT NULL,
    numero_asiento VARCHAR(20),
    precio DECIMAL(10, 2) NOT NULL,
    descuento_aplicado DECIMAL(5, 2) DEFAULT 0,
    codigo_qr VARCHAR(100) UNIQUE,
    utilizada TINYINT(1) DEFAULT 0,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
    INDEX idx_socio (socio_id),
    INDEX idx_fecha_partido (fecha_partido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de beneficios utilizados
CREATE TABLE IF NOT EXISTS beneficios_utilizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT NOT NULL,
    tipo_beneficio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_uso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
    INDEX idx_socio (socio_id),
    INDEX idx_fecha (fecha_uso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de sesiones (para manejo de login)
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_socio (socio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE SET NULL,
    INDEX idx_socio (socio_id),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
-- INSERT INTO socios (numero_socio, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, genero, email, telefono, direccion, departamento, password_hash, tipo_membresia, fecha_vencimiento)
-- VALUES ('U202500001', 'DNI', '12345678', 'Juan Carlos', 'García López', '1990-05-15', 'M', 'juan@ejemplo.com', '999888777', 'Av. Principal 123', 'Lima', '$2y$10$example_hash', 'PREMIUM', '2026-01-01');

-- Procedimiento almacenado para verificar vencimiento de membresías
DELIMITER //
CREATE PROCEDURE verificar_vencimientos()
BEGIN
    UPDATE socios 
    SET estado = 'INACTIVO' 
    WHERE fecha_vencimiento < CURDATE() AND estado = 'ACTIVO';
END //
DELIMITER ;

-- Evento para ejecutar verificación automática diaria
CREATE EVENT IF NOT EXISTS verificar_vencimientos_diario
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO CALL verificar_vencimientos();

-- Vista para estadísticas de socios
CREATE OR REPLACE VIEW vista_estadisticas_socios AS
SELECT 
    tipo_membresia,
    COUNT(*) as total_socios,
    COUNT(CASE WHEN estado = 'ACTIVO' THEN 1 END) as socios_activos,
    COUNT(CASE WHEN YEAR(fecha_registro) = YEAR(CURDATE()) THEN 1 END) as nuevos_este_año,
    departamento,
    COUNT(*) as total_por_departamento
FROM socios
GROUP BY tipo_membresia, departamento;

-- Trigger para registrar actividad al crear un socio
DELIMITER //
CREATE TRIGGER after_socio_insert
AFTER INSERT ON socios
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (socio_id, accion, descripcion)
    VALUES (NEW.id, 'REGISTRO', CONCAT('Nuevo socio registrado: ', NEW.nombres, ' ', NEW.apellidos));
END //
DELIMITER ;

-- Comentarios sobre las tablas
ALTER TABLE socios COMMENT = 'Tabla principal de socios del club';
ALTER TABLE historial_membresias COMMENT = 'Historial de pagos y renovaciones de membresías';
ALTER TABLE entradas COMMENT = 'Registro de entradas compradas por los socios';
ALTER TABLE beneficios_utilizados COMMENT = 'Registro de beneficios utilizados por los socios';
ALTER TABLE sesiones COMMENT = 'Gestión de sesiones activas de usuarios';
ALTER TABLE activity_logs COMMENT = 'Log de todas las actividades del sistema';

-- Mostrar información
SELECT 'Base de datos creada exitosamente' as Mensaje;
SELECT TABLE_NAME as Tabla, TABLE_ROWS as Registros 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'universitario_db';
