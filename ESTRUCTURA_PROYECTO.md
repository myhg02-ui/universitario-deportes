# 🏆 Universitario de Deportes - Plataforma Web Oficial

## 📁 Estructura del Proyecto

```
universitario-deportes/
│
├── 📄 index.html                    # Página principal (Inicio)
├── 📄 package.json                  # Dependencias del proyecto
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 .env.example                  # Variables de entorno (ejemplo)
│
├── 📂 admin/                        # Panel administrativo
│   └── panel-admin.html             # Dashboard de administración
│
├── 📂 auth/                         # Sistema de autenticación
│   ├── login.html                   # Página de inicio de sesión
│   ├── registro.html                # Página de registro de socios
│   └── reauth.html                  # Reautenticación de usuarios
│
├── 📂 user/                         # Páginas de usuario autenticado
│   ├── dashboard.html               # Dashboard principal del socio
│   ├── mis-datos.html               # Perfil y datos personales
│   ├── beneficios.html              # Beneficios exclusivos
│   ├── perfil.html                  # Perfil detallado
│   ├── mi-cuenta.html               # Gestión de cuenta
│   ├── mi-perfil.html               # Edición de perfil
│   ├── pago.html                    # Pasarela de pagos
│   └── test.html                    # Documentación del sistema
│
├── 📂 info/                         # Páginas informativas
│   ├── club.html                    # Historia del club
│   ├── noticias.html                # Noticias y novedades
│   ├── privacidad.html              # Política de privacidad
│   ├── terminos.html                # Términos y condiciones
│   └── libro-reclamaciones.html     # Libro de reclamaciones
│
├── 📂 assets/                       # Recursos estáticos
│   └── images/
│       ├── hero/                    # Imágenes principales
│       │   ├── estadio.png          # Estadio Monumental (hero)
│       │   └── estadio2.png         # Estadio (sponsors)
│       ├── logos/
│       │   └── logo.png             # Escudo del club
│       ├── trofeos/
│       │   ├── tricampeon .png      # Trofeo tricampeón
│       │   └── trofeos.png          # Vitrina de trofeos
│       └── sponsors/                # Logos de sponsors
│           ├── sponsor_marathon_*.png
│           ├── sponsor_apuestatotal_*.png
│           ├── sponsor_cristal_*.png
│           └── ... (20+ sponsors)
│
├── 📂 css/                          # Estilos
│   ├── styles.css                   # Estilos globales principales
│   ├── universitario-theme.css      # Tema institucional
│   ├── auth-forms.css               # Formularios de autenticación
│   ├── auth-header.css              # Header de autenticación
│   ├── dashboard.css                # Estilos del dashboard
│   ├── registro.css                 # Estilos de registro
│   ├── modal-system.css             # Sistema de modales
│   ├── placeholders.css             # Placeholders personalizados
│   ├── base/                        # Estilos base
│   │   ├── reset.css                # Reset CSS
│   │   └── global-enhancements.css  # Mejoras globales
│   ├── components/                  # Componentes reutilizables
│   │   ├── header.css
│   │   ├── header-publico-unificado.css
│   │   ├── smooth-header.css
│   │   └── modal.css
│   ├── pages/                       # Estilos por página
│   │   ├── dashboard.css
│   │   ├── dashboard-pro.css
│   │   ├── mis-datos-pro.css
│   │   └── registro.css
│   └── themes/                      # Temas
│       ├── universitario.css
│       └── theme-unified.css
│
├── 📂 js/                           # JavaScript
│   ├── firebase-config.js           # Configuración Firebase
│   ├── presence-system.js           # Sistema de presencia en tiempo real
│   ├── script.js                    # Scripts principales
│   ├── script-new.js                # Scripts nuevos
│   ├── login.js                     # Lógica de login
│   ├── registro.js                  # Lógica de registro
│   ├── dashboard.js                 # Lógica del dashboard
│   ├── auth-system.js               # Sistema de autenticación
│   ├── auth-header.js               # Header dinámico
│   ├── admin-management.js          # Gestión de administradores
│   ├── admin-search.js              # Búsqueda en panel admin
│   ├── modal-system.js              # Sistema de modales
│   ├── api.js                       # API calls
│   ├── components/                  # Componentes JS
│   │   ├── dynamic-header.js
│   │   ├── header.component.js
│   │   ├── modal.component.js
│   │   └── search.component.js
│   ├── core/                        # Núcleo del sistema
│   │   ├── firebase-config.js
│   │   └── smooth-navigation.js
│   ├── pages/                       # Lógica por página
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── registro.js
│   │   ├── dashboard.js
│   │   └── dashboard-fixed.js
│   ├── services/                    # Servicios
│   │   ├── auth.service.js          # Servicio de autenticación
│   │   ├── admin.service.js         # Servicio de administración
│   │   ├── api.service.js           # Servicio API
│   │   ├── presence.service.js      # Servicio de presencia
│   │   └── auth-protection.js       # Protección de rutas
│   └── utils/                       # Utilidades
│       ├── helpers.js               # Funciones auxiliares
│       ├── form-validator.js        # Validación de formularios
│       └── notifications.js         # Sistema de notificaciones
│
├── 📂 config/                       # Configuraciones
│   ├── constants.js                 # Constantes globales
│   └── environments/                # Entornos
│       ├── env.development.js
│       └── env.production.js
│
└── 📂 scripts/                      # Scripts auxiliares
    └── setup/
        └── setup-admin.js           # Setup inicial de admin

```

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- Login con Firebase Authentication
- Registro de nuevos socios
- Roles: Usuario, Admin, Super Admin
- Sistema de sesiones persistente
- Reautenticación automática

### 👥 Sistema de Presencia en Tiempo Real
- Detección de estado: Online, Ausente, Desconectado
- Sincronización con Firebase Realtime Database
- Última conexión registrada
- Funciona en todas las páginas del sitio

### 👨‍💼 Panel de Administración
- Gestión completa de socios
- Gestión de administradores
- Búsqueda y filtrado avanzado
- Edición de datos de usuarios
- Activación/suspensión de cuentas
- Eliminación de permisos de admin
- Visualización de última conexión

### 🎫 Área de Usuario
- Dashboard personalizado
- Gestión de datos personales
- Visualización de beneficios
- Sistema de membresías (Free, Premium, VIP)
- Historial de pagos

### 🎨 Diseño
- Tema institucional: Crema (#d4af37) y Rojo (#c41e3a)
- Responsive design
- Animaciones suaves
- Imágenes optimizadas
- Background del estadio con opacidad

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase
  - Authentication (Auth)
  - Firestore (Base de datos)
  - Realtime Database (Presencia)
- **Estilos**: CSS Modular + Variables CSS
- **Fuentes**: Montserrat (Google Fonts)
- **Iconos**: Font Awesome 6.0

## 📊 Base de Datos (Firestore)

### Colección: `users`
```javascript
{
  id: string,
  email: string,
  nombres: string,
  apellidos: string,
  dni: string,
  telefono: string,
  numero_socio: string,
  departamento: string,
  distrito: string,
  direccion: string,
  tipo_membresia: 'Free' | 'Premium' | 'VIP',
  fecha_vencimiento: timestamp,
  is_admin: boolean,
  admin_activo: boolean,
  rol: 'admin' | 'super_admin',
  ultima_conexion: timestamp,
  fecha_registro: timestamp
}
```

### Realtime Database: `/presence/{userId}`
```javascript
{
  state: 'online' | 'away' | 'offline',
  lastChanged: timestamp
}
```

## 🎯 Rutas Principales

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| `/index.html` | Página principal | No |
| `/auth/login.html` | Iniciar sesión | No |
| `/auth/registro.html` | Registro de socio | No |
| `/user/dashboard.html` | Dashboard del usuario | Sí |
| `/user/mis-datos.html` | Perfil del usuario | Sí |
| `/admin/panel-admin.html` | Panel administrativo | Sí (Admin) |
| `/info/club.html` | Historia del club | No |
| `/info/noticias.html` | Noticias | No |

## 🔒 Niveles de Acceso

1. **Visitante**: Acceso a páginas públicas (inicio, club, noticias)
2. **Usuario**: Acceso a dashboard y área personal
3. **Admin**: Gestión de usuarios + acceso de usuario
4. **Super Admin**: Gestión completa + protección especial

## 📦 Instalación

1. Clonar el repositorio
2. Configurar Firebase:
   - Crear proyecto en Firebase Console
   - Habilitar Authentication (Email/Password)
   - Crear Firestore Database
   - Habilitar Realtime Database
3. Actualizar `js/firebase-config.js` con tus credenciales
4. Abrir `index.html` en el navegador

## 🔥 Firebase Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true;
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 🎨 Colores del Tema

```css
:root {
  --primary-color: #c41e3a;      /* Rojo Universitario */
  --secondary-color: #d4af37;    /* Dorado */
  --dark-color: #2c3e50;         /* Azul Oscuro */
  --light-color: #f8f9fa;        /* Gris Claro */
  --success-color: #10b981;      /* Verde */
  --warning-color: #f59e0b;      /* Naranja */
  --danger-color: #ef4444;       /* Rojo */
}
```

## 📝 Sistema de Estados

### Presencia
- 🟢 **Online**: Usuario activo en cualquier página
- 🟠 **Away**: Pestaña abierta pero no visible
- ⚫ **Offline**: Usuario desconectado

### Membresía
- 🆓 **Free**: Acceso básico
- 💎 **Premium**: Beneficios adicionales
- 👑 **VIP**: Acceso completo

## 🚀 Próximas Mejoras

- [ ] Sistema de notificaciones push
- [ ] Chat en tiempo real
- [ ] Integración con pasarela de pagos
- [ ] App móvil (PWA)
- [ ] Sistema de tickets
- [ ] Galería de fotos y videos
- [ ] Calendario de eventos

## 📄 Licencia

© 2025 Club Universitario de Deportes. Todos los derechos reservados.

---

**Desarrollado para el club más grande del Perú 🏆⚽**
