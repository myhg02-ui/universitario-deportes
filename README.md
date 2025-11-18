# ⚽ Universitario de Deportes - Portal de Socios

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

> Sistema de gestión de membresías para socios del Club Universitario de Deportes

## 📋 Características

- 🔐 **Autenticación Segura** - Sistema de login con Firebase Authentication
- 👥 **Gestión de Socios** - Administración completa de usuarios y membresías
- 💳 **Planes de Membresía** - Free, Básica, Premium y VIP
- 🛡️ **Panel de Administración** - Control total para administradores
- 📊 **Dashboard Interactivo** - Información en tiempo real
- 🌐 **Sistema de Presencia** - Estado online/offline de usuarios
- 📱 **Diseño Responsivo** - Compatible con dispositivos móviles

## 🚀 Inicio Rápido

### Prerrequisitos

- Navegador web moderno (Chrome, Firefox, Edge)
- Cuenta de Firebase configurada
- Editor de código (recomendado: VS Code)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/myhg02-ui/universitario-deportes.git
   cd universitario-deportes
   ```

2. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilita Authentication (Email/Password)
   - Habilita Firestore Database
   - Habilita Realtime Database
   - Copia tu configuración a `assets/js/firebase-config.js`

3. **Configura las reglas de seguridad**
   - Firestore: Usa `config/firestore.rules`
   - Realtime Database: Usa `config/database.rules.json`
   - Storage: Usa `config/storage.rules`

4. **Abre el proyecto**
   - Abre `index.html` en tu navegador
   - O usa Live Server para desarrollo

## 📁 Estructura del Proyecto (Profesional)

```
universitario-deportes/
│
├── � public/                        # Assets públicos optimizados
│   ├── index.html                    # Landing page
│   └── assets/
│       ├── images/                   # Imágenes optimizadas
│       ├── fonts/                    # Fuentes web
│       └── icons/                    # Iconos/favicon
│
├── 📂 src/                           # CÓDIGO FUENTE
│   ├── 📂 pages/                     # Páginas HTML por módulo
│   │   ├── auth/                     # Autenticación
│   │   │   ├── login.html
│   │   │   ├── registro.html
│   │   │   └── reauth.html
│   │   ├── user/                     # Usuario
│   │   │   ├── dashboard.html
│   │   │   ├── pago.html
│   │   │   └── beneficios.html
│   │   ├── admin/                    # Administración
│   │   │   └── panel-admin.html
│   │   └── info/                     # Información
│   │       ├── club.html
│   │       ├── noticias.html
│   │       └── ...
│   │
│   ├── 📂 js/                        # JavaScript organizado
│   │   ├── core/                     # Core (firebase-config, app)
│   │   ├── services/                 # Servicios (auth, user, admin, presence, api)
│   │   ├── components/               # Componentes (modal, header, search)
│   │   ├── utils/                    # Utilidades (validators, formatters, helpers)
│   │   └── pages/                    # Lógica por página
│   │
│   └── 📂 css/                       # Estilos organizados
│       ├── base/                     # Base (reset, variables, typography)
│       ├── components/               # Componentes (modal, header, buttons)
│       ├── pages/                    # Páginas (login, dashboard, admin)
│       └── themes/                   # Temas (universitario)
│
├── 📂 config/                        # CONFIGURACIÓN
│   ├── firebase/                     # Firebase rules
│   ├── environments/                 # Entornos (dev, staging, prod)
│   └── constants.js                  # Constantes globales
│
├── 📂 scripts/                       # SCRIPTS
│   ├── setup/                        # Setup (admin, firebase)
│   ├── deploy/                       # Deploy (dev, staging, prod)
│   └── build/                        # Build (optimize, minify)
│
├── 📂 tests/                         # PRUEBAS
│   ├── unit/                         # Tests unitarios
│   ├── integration/                  # Tests integración
│   └── e2e/                          # Tests end-to-end
│
├── 📂 docs/                          # DOCUMENTACIÓN
│   ├── ARCHITECTURE.md               # Arquitectura del sistema
│   ├── DEPLOYMENT.md                 # Guía de deployment
│   └── API.md                        # Documentación de servicios
│
├── 📄 .env.example                   # Variables de entorno ejemplo
├── 📄 README.md                      # Documentación principal
├── 📄 package.json                   # Dependencias
└── 📄 .gitignore                     # Git ignore
```

## 👤 Roles y Permisos

### Super Admin
- ✅ Control total del sistema
- ✅ Gestionar administradores (agregar/remover)
- ✅ Modificar roles de otros admins
- ✅ Acceso a todos los datos

### Administrador
- ✅ Ver todos los socios
- ✅ Gestionar membresías
- ✅ Ver estadísticas
- ❌ No puede agregar/remover otros admins

### Usuario/Socio
- ✅ Ver su perfil
- ✅ Actualizar datos personales
- ✅ Gestionar su membresía
- ❌ Sin acceso al panel admin

## 🔥 Configuración de Firebase

### Firestore Collections

**users**
```javascript
{
  uid: string,
  email: string,
  nombres: string,
  apellidos: string,
  numero_socio: string,
  tipo_membresia: 'Free' | 'Básica' | 'Premium' | 'VIP',
  is_admin: boolean,
  admin_activo: boolean,
  rol: 'super_admin' | 'admin' | 'user',
  fecha_registro: timestamp
}
```

**Subcollecciones**
- `historial_membresia` - Historial de cambios de plan
- `historial_admin` - Registro de acciones administrativas

### Realtime Database

**presence/{userId}**
```json
{
  "state": "online" | "away" | "offline",
  "last_changed": timestamp
}
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase (BaaS)
  - Authentication
  - Firestore Database
  - Realtime Database
  - Cloud Storage
- **Iconos**: Font Awesome 6.4
- **Fuentes**: Segoe UI, system fonts

## 🎨 Páginas Disponibles

- `index.html` - Página de inicio
- `login.html` - Autenticación
- `registro.html` - Registro de nuevos socios
- `dashboard.html` - Panel de usuario
- `panel-admin.html` - Panel de administración
- `beneficios.html` - Beneficios por plan
- `club.html` - Información del club
- `noticias.html` - Noticias y actualizaciones
- `pago.html` - Gestión de pagos
- `privacidad.html` - Política de privacidad
- `terminos.html` - Términos y condiciones
- `libro-reclamaciones.html` - Libro de reclamaciones

## 🔒 Seguridad

- Autenticación requerida para acceso
- Verificación de roles en cada página
- Reglas de seguridad en Firestore y Realtime DB
- Validación de datos en cliente y servidor
- Protección contra inyección de código

## 📝 Crear Super Admin

Para crear el primer Super Admin, ejecuta el script:

```bash
node scripts/setup-admin.js
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece al Club Universitario de Deportes.

## 👥 Autores

- **Equipo de Desarrollo** - [GitHub](https://github.com/myhg02-ui)

## 🙏 Agradecimientos

- Club Universitario de Deportes
- Comunidad de Firebase
- Font Awesome por los iconos

---

<div align="center">
  <strong>⚽ ¡Arriba la U! ⚽</strong>
  <br>
  Hecho con ❤️ para la hinchada crema
</div>
