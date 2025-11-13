# 🏆 Sistema de Suscripciones - Universitario de Deportes

## ✨ Funcionalidades Implementadas

### 1. **Sistema de Registro**
- ✅ Formulario completo de registro en `registro.html`
- ✅ Validación de datos (DNI, edad 18+, email, contraseña fuerte)
- ✅ 3 tipos de membresía: Básica (S/120), Premium (S/300), VIP (S/800)
- ✅ Generación automática de número de socio único
- ✅ Almacenamiento en localStorage (simula base de datos)

### 2. **Sistema de Login**
- ✅ Página de inicio de sesión en `login.html`
- ✅ Validación de credenciales
- ✅ Sesión persistente con localStorage
- ✅ Redirección automática al dashboard

### 3. **Dashboard de Usuario**
- ✅ Panel personalizado con información del socio
- ✅ Visualización de membresía actual
- ✅ Lista de beneficios según el plan
- ✅ Fecha de vencimiento
- ✅ Historial de membresías

### 4. **Sistema de Upgrades**
- ✅ Actualización de Básica → Premium o VIP
- ✅ Actualización de Premium → VIP
- ✅ Tarjetas interactivas con comparación de beneficios
- ✅ Bloqueo automático si ya eres VIP

### 5. **Simulador de Pagos**
- ✅ Formulario realista de tarjeta de crédito
- ✅ Formateo automático de número de tarjeta
- ✅ Validación de campos
- ✅ Mensaje claro: "Esta es una simulación"
- ✅ Proceso de pago con loading state
- ✅ Modal de confirmación exitosa

## 📁 Archivos Creados/Modificados

```
github-copilot/
├── dashboard.html          ← NUEVO: Panel de usuario
├── css/
│   └── dashboard.css       ← NUEVO: Estilos del dashboard
├── js/
│   ├── dashboard.js        ← NUEVO: Lógica del dashboard y upgrades
│   ├── login.js            ← NUEVO: Lógica de inicio de sesión
│   └── registro.js         ← MODIFICADO: Guardado en localStorage
└── README_SUSCRIPCIONES.md ← Este archivo
```

## 🚀 Cómo Funciona

### **Paso 1: Registro de Usuario**

1. Ve a `registro.html`
2. Llena el formulario con tus datos
3. Selecciona tu membresía inicial (Básica, Premium o VIP)
4. Click en "Completar Registro"
5. Se te asignará un número de socio único (ej: U202512345)
6. Redirige automáticamente al dashboard

**Datos de prueba:**
```
Nombres: Juan Carlos
Apellidos: Rodríguez Pérez
DNI: 12345678
Email: juan@correo.com
Contraseña: Crema2025
Membresía: Básica
```

### **Paso 2: Dashboard**

En el dashboard verás:
- ✅ Tu información personal
- ✅ Tu número de socio
- ✅ Membresía actual con beneficios
- ✅ Fecha de vencimiento
- ✅ Opciones para mejorar tu plan

### **Paso 3: Upgrade de Membresía**

1. En el dashboard, ve a la sección "Mejora tu Membresía"
2. Verás solo las opciones superiores a tu plan actual
3. Click en "Actualizar a Premium" o "Actualizar a VIP"
4. Se abre el modal de pago simulado

### **Paso 4: Simulación de Pago**

1. Completa el formulario con datos ficticios:
   ```
   Número de tarjeta: 1234 5678 9012 3456
   Vencimiento: 12/26
   CVV: 123
   Nombre: TU NOMBRE
   ```
2. Acepta términos y condiciones
3. Click en "Confirmar Pago (Simulación)"
4. Espera 2 segundos (simula procesamiento)
5. ¡Actualización exitosa! 🎉

### **Paso 5: Verificación**

- Tu membresía se actualiza instantáneamente
- Se guarda en el historial
- Los beneficios cambian según tu nuevo plan
- Si eres VIP, no verás más opciones de upgrade

## 💾 Almacenamiento de Datos

Todo se guarda en **localStorage del navegador**:

```javascript
// Usuarios registrados
localStorage.setItem('user_juan@correo.com', JSON.stringify(userData))

// Sesión actual
localStorage.setItem('currentUser', JSON.stringify(userData))

// Historial de membresías
localStorage.setItem('history_juan@correo.com', JSON.stringify(history))
```

## 🎨 Planes de Membresía

### **Básica - S/ 120/año**
- 10% descuento en merchandising
- Prioridad en compra de entradas
- Boletín mensual exclusivo

### **Premium - S/ 300/año**
- Todo lo de Básica +
- 20% descuento en merchandising
- 2 entradas gratis al año
- Acceso a eventos exclusivos
- Meet & Greet con jugadores
- Bufanda oficial de regalo

### **VIP - S/ 800/año** 👑
- Todo lo de Premium +
- 30% descuento en merchandising
- 4 entradas VIP al año
- Acceso al Palco VIP
- Camiseta oficial firmada
- Invitación a entrenamientos
- Pack de bienvenida premium
- Atención prioritaria 24/7

## 🔒 Seguridad (Simulada)

- ✅ Contraseñas con hash simulado
- ✅ Validación de edad (18+)
- ✅ Validación de email único
- ✅ Sesiones con localStorage
- ✅ Formulario de pago con validaciones

**Nota:** En producción real usarías:
- Backend con PHP/Node.js
- Base de datos MySQL/PostgreSQL
- Bcrypt para passwords
- JWT para sesiones
- Stripe/PayPal para pagos reales

## 🧪 Pruebas

### Caso 1: Registro + Upgrade a VIP
```
1. Regístrate como Básica
2. Login
3. Ve al dashboard
4. Actualiza a Premium
5. Actualiza a VIP
6. Verifica que no hay más opciones de upgrade
```

### Caso 2: Múltiples Usuarios
```
1. Abre ventana incógnita
2. Registra Usuario 1 (Básica)
3. Registra Usuario 2 (Premium)
4. Registra Usuario 3 (VIP)
5. Cada uno tendrá su propia sesión
```

### Caso 3: Historial
```
1. Regístrate
2. Haz 2 upgrades
3. Ve a "Historial de Membresías"
4. Verás 3 registros (registro inicial + 2 upgrades)
```

## 📱 Responsive

El sistema funciona perfecto en:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🎯 Próximos Pasos (Para Producción)

1. **Backend Real**
   - PHP con PDO
   - Base de datos MySQL
   - API RESTful

2. **Pagos Reales**
   - Integración con Culqi/Niubiz (Perú)
   - Webhooks para confirmación
   - Facturas electrónicas

3. **Email**
   - Confirmación de registro
   - Confirmación de pago
   - Recordatorio de vencimiento

4. **Seguridad**
   - HTTPS obligatorio
   - Tokens CSRF
   - Rate limiting
   - 2FA opcional

## 🐛 Troubleshooting

**Problema:** No aparecen mis datos en el dashboard
- **Solución:** Verifica que completaste el registro o login

**Problema:** No se guarda mi upgrade
- **Solución:** Asegúrate de completar el formulario de pago

**Problema:** Perdí mi sesión
- **Solución:** Vuelve a hacer login con tu email

**Problema:** Quiero empezar de cero
- **Solución:** 
  ```javascript
  // Abre la consola del navegador (F12) y ejecuta:
  localStorage.clear();
  location.reload();
  ```

## 📞 Soporte

Si tienes dudas sobre cómo funciona el sistema:
- Revisa este README
- Inspecciona el código en `js/dashboard.js`
- Abre la consola del navegador para ver los datos

---

**¡Arriba la U! 🔴⚪ 🏆**

Desarrollado por: Jair Matias Huayanay Gamarra
GitHub: @myhg02-ui
Email: U24311974@utp.edu.pe
