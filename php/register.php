<?php
// Configuración de la base de datos
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de base de datos
$db_host = 'localhost';
$db_name = 'universitario_db';
$db_user = 'root';
$db_pass = '';

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
    exit();
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit();
}

// Obtener datos del formulario
$tipo_documento = filter_input(INPUT_POST, 'tipo_documento', FILTER_SANITIZE_STRING);
$numero_documento = filter_input(INPUT_POST, 'numero_documento', FILTER_SANITIZE_STRING);
$nombres = filter_input(INPUT_POST, 'nombres', FILTER_SANITIZE_STRING);
$apellidos = filter_input(INPUT_POST, 'apellidos', FILTER_SANITIZE_STRING);
$fecha_nacimiento = filter_input(INPUT_POST, 'fecha_nacimiento', FILTER_SANITIZE_STRING);
$genero = filter_input(INPUT_POST, 'genero', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING);
$direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_STRING);
$departamento = filter_input(INPUT_POST, 'departamento', FILTER_SANITIZE_STRING);
$distrito = filter_input(INPUT_POST, 'distrito', FILTER_SANITIZE_STRING);
$password = $_POST['password'] ?? '';
$tipo_membresia = filter_input(INPUT_POST, 'tipo_membresia', FILTER_SANITIZE_STRING);
$acepta_comunicaciones = isset($_POST['acepta_comunicaciones']) ? 1 : 0;

// Validaciones
$errores = [];

// Validar campos obligatorios
if (empty($tipo_documento) || empty($numero_documento) || empty($nombres) || empty($apellidos) ||
    empty($fecha_nacimiento) || empty($genero) || empty($email) || empty($telefono) ||
    empty($direccion) || empty($departamento) || empty($password) || empty($tipo_membresia)) {
    $errores[] = 'Todos los campos obligatorios deben ser completados';
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'El correo electrónico no es válido';
}

// Validar DNI (si es tipo DNI, debe tener 8 dígitos)
if ($tipo_documento === 'DNI' && !preg_match('/^\d{8}$/', $numero_documento)) {
    $errores[] = 'El DNI debe tener 8 dígitos';
}

// Validar edad (mayor de 18)
$fecha_nac = new DateTime($fecha_nacimiento);
$hoy = new DateTime();
$edad = $hoy->diff($fecha_nac)->y;
if ($edad < 18) {
    $errores[] = 'Debes ser mayor de 18 años para registrarte';
}

// Validar contraseña
if (strlen($password) < 8) {
    $errores[] = 'La contraseña debe tener al menos 8 caracteres';
}
if (!preg_match('/[A-Z]/', $password)) {
    $errores[] = 'La contraseña debe contener al menos una letra mayúscula';
}
if (!preg_match('/[0-9]/', $password)) {
    $errores[] = 'La contraseña debe contener al menos un número';
}

// Si hay errores, retornar
if (!empty($errores)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errores)
    ]);
    exit();
}

try {
    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT id FROM socios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'El correo electrónico ya está registrado'
        ]);
        exit();
    }
    
    // Verificar si el documento ya existe
    $stmt = $pdo->prepare("SELECT id FROM socios WHERE tipo_documento = ? AND numero_documento = ?");
    $stmt->execute([$tipo_documento, $numero_documento]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'El número de documento ya está registrado'
        ]);
        exit();
    }
    
    // Hashear contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Generar número de socio único
    $numero_socio = generarNumeroSocio($pdo);
    
    // Calcular fecha de vencimiento (1 año desde hoy)
    $fecha_vencimiento = date('Y-m-d', strtotime('+1 year'));
    
    // Insertar nuevo socio
    $sql = "INSERT INTO socios (
        numero_socio,
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        fecha_nacimiento,
        genero,
        email,
        telefono,
        direccion,
        departamento,
        distrito,
        password_hash,
        tipo_membresia,
        estado,
        fecha_registro,
        fecha_vencimiento,
        acepta_comunicaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO', NOW(), ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $resultado = $stmt->execute([
        $numero_socio,
        $tipo_documento,
        $numero_documento,
        $nombres,
        $apellidos,
        $fecha_nacimiento,
        $genero,
        $email,
        $telefono,
        $direccion,
        $departamento,
        $distrito,
        $password_hash,
        $tipo_membresia,
        $fecha_vencimiento,
        $acepta_comunicaciones
    ]);
    
    if ($resultado) {
        // Enviar email de confirmación (aquí deberías implementar el envío real)
        enviarEmailBienvenida($email, $nombres, $numero_socio);
        
        echo json_encode([
            'success' => true,
            'message' => '¡Registro exitoso! Bienvenido a la familia crema. Tu número de socio es: ' . $numero_socio,
            'numero_socio' => $numero_socio
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al registrar el socio'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}

// Función para generar número de socio único
function generarNumeroSocio($pdo) {
    $año = date('Y');
    $prefijo = 'U' . $año;
    
    // Obtener el último número de socio del año
    $stmt = $pdo->prepare("SELECT numero_socio FROM socios WHERE numero_socio LIKE ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$prefijo . '%']);
    $ultimo = $stmt->fetch();
    
    if ($ultimo) {
        $numero = intval(substr($ultimo['numero_socio'], -5)) + 1;
    } else {
        $numero = 1;
    }
    
    return $prefijo . str_pad($numero, 5, '0', STR_PAD_LEFT);
}

// Función para enviar email de bienvenida
function enviarEmailBienvenida($email, $nombre, $numero_socio) {
    // Aquí deberías implementar el envío real del email
    // Por ejemplo, usando PHPMailer o la función mail() de PHP
    
    $asunto = "¡Bienvenido a Universitario de Deportes!";
    $mensaje = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background: #c41e3a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>¡Bienvenido a la Familia Crema!</h1>
        </div>
        <div class='content'>
            <p>Hola $nombre,</p>
            <p>¡Felicidades! Ya eres parte oficial del club más grande del Perú.</p>
            <p><strong>Tu número de socio es: $numero_socio</strong></p>
            <p>Con tu membresía ahora puedes disfrutar de todos los beneficios exclusivos que tenemos para ti.</p>
            <p>¡Arriba la U!</p>
        </div>
        <div class='footer'>
            <p>Club Universitario de Deportes © 2025</p>
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@universitario.pe" . "\r\n";
    
    // mail($email, $asunto, $mensaje, $headers);
    
    return true;
}
?>
