# Sistema de Registro - Club Universitario de Deportes

## 📋 Descripción

Sistema profesional de registro de socios para el Club Universitario de Deportes con validación completa y almacenamiento en base de datos MySQL.

## 🚀 Características

- ✅ Validación completa de formularios (frontend y backend)
- ✅ Validación de DNI, email, teléfono
- ✅ Verificación de edad (mayor de 18 años)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sistema de membresías (Básica, Premium, VIP)
- ✅ Generación automática de número de socio
- ✅ Diseño responsivo y profesional
- ✅ Protección contra SQL injection
- ✅ Mensajes de error y éxito
- ✅ Toggle para mostrar/ocultar contraseñas

## 📦 Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- XAMPP, WAMP, LAMP o similar (recomendado para desarrollo local)

## 🔧 Instalación

### Paso 1: Configurar el servidor

1. Instala XAMPP desde: https://www.apachefriends.org/
2. Inicia Apache y MySQL desde el panel de control de XAMPP

### Paso 2: Crear la base de datos

1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Crea una nueva base de datos llamada `universitario_db`
3. Importa el archivo `database/create_database.sql` en la base de datos

O ejecuta el script SQL directamente:

```sql
-- Copia y pega el contenido de database/create_database.sql en phpMyAdmin
```

### Paso 3: Configurar la conexión a la base de datos

Edita el archivo `php/register.php` y ajusta las credenciales si es necesario:

```php
$db_host = 'localhost';
$db_name = 'universitario_db';
$db_user = 'root';
$db_pass = '';  // Dejar vacío si usas XAMPP por defecto
```

### Paso 4: Copiar archivos al servidor

Copia todos los archivos del proyecto a la carpeta `htdocs` de XAMPP:

```
C:\xampp\htdocs\universitario\
```

### Paso 5: Acceder al sistema

Abre tu navegador y visita:

```
http://localhost/universitario/registro.html
```

## 📁 Estructura de archivos

```
universitario/
├── registro.html           # Página de registro
├── css/
│   ├── styles.css         # Estilos generales
│   └── registro.css       # Estilos del formulario
├── js/
│   └── registro.js        # Validación JavaScript
├── php/
│   └── register.php       # Backend de registro
├── database/
│   └── create_database.sql # Script SQL
└── images/
    └── logo.png           # Logo del club
```

## 🗄️ Estructura de la base de datos

### Tabla: socios

Campos principales:
- `id`: ID único autoincrementable
- `numero_socio`: Número de socio único (formato: U2025XXXXX)
- `tipo_documento`: DNI, CE o PASAPORTE
- `numero_documento`: Número del documento
- `nombres`: Nombres del socio
- `apellidos`: Apellidos del socio
- `fecha_nacimiento`: Fecha de nacimiento
- `genero`: M, F, OTRO
- `email`: Correo electrónico (único)
- `telefono`: Teléfono/celular
- `direccion`: Dirección completa
- `departamento`: Departamento de Perú
- `distrito`: Distrito
- `password_hash`: Contraseña hasheada
- `tipo_membresia`: BASICA, PREMIUM, VIP
- `estado`: ACTIVO, INACTIVO, SUSPENDIDO
- `fecha_registro`: Fecha de registro
- `fecha_vencimiento`: Fecha de vencimiento (1 año)
- `acepta_comunicaciones`: Si acepta recibir emails

### Otras tablas:
- `historial_membresias`: Historial de pagos
- `entradas`: Entradas compradas
- `beneficios_utilizados`: Beneficios usados
- `sesiones`: Control de sesiones
- `activity_logs`: Registro de actividades

## 🔒 Seguridad

El sistema incluye:
- Validación de datos en frontend y backend
- Protección contra SQL injection (PDO prepared statements)
- Contraseñas hasheadas con bcrypt
- Sanitización de inputs
- Validación de edad, email y documentos
- Prevención de registros duplicados

## 💰 Tipos de Membresía

1. **Básica** - S/ 120/año
   - Carnet digital
   - Descuentos en tienda
   - Newsletter exclusivo

2. **Premium** - S/ 300/año (Más Popular)
   - Todo lo de Básica
   - 20% descuento en entradas
   - Acceso a zonas VIP
   - Camiseta oficial gratis

3. **VIP** - S/ 800/año
   - Todo lo de Premium
   - Entradas gratis todo el año
   - Meet & Greet con jugadores
   - Kit completo del hincha
   - Invitaciones a eventos

## 🎨 Personalización

Para cambiar colores, edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #c41e3a;  /* Rojo crema */
    --secondary-color: #d4af37; /* Dorado */
}
```

## 📧 Configurar envío de emails

Para activar el envío de emails de bienvenida, edita `php/register.php`:

1. Instala PHPMailer:
```bash
composer require phpmailer/phpmailer
```

2. Configura SMTP en la función `enviarEmailBienvenida()`

## 🐛 Solución de problemas

### Error: "No se puede conectar a la base de datos"
- Verifica que MySQL esté corriendo en XAMPP
- Revisa las credenciales en `php/register.php`
- Asegúrate de que la base de datos `universitario_db` exista

### Error: "Archivo no encontrado"
- Verifica que todos los archivos estén en la carpeta correcta
- Revisa las rutas en los archivos HTML

### El formulario no envía datos
- Abre la consola del navegador (F12) para ver errores JavaScript
- Verifica que el archivo `js/registro.js` esté cargando
- Revisa los permisos de la carpeta `php/`

## 📱 Responsive Design

El formulario es completamente responsive y se adapta a:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔄 Actualizaciones futuras

- [ ] Panel de administración
- [ ] Sistema de login
- [ ] Recuperación de contraseña
- [ ] Carnet digital descargable
- [ ] Integración con pasarela de pagos
- [ ] App móvil

## 👨‍💻 Soporte

Para soporte técnico:
- Email: soporte@universitario.pe
- WhatsApp: +51 999 999 999

## 📄 Licencia

© 2025 Club Universitario de Deportes. Todos los derechos reservados.

---

**¡Arriba la U! 🏆**
