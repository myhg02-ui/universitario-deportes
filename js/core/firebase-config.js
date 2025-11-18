// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3W8ZzBxKPlPwVmhhIg9OU3tKqR-7mr9Y",
    authDomain: "universitario-deportes.firebaseapp.com",
    databaseURL: "https://universitario-deportes-default-rtdb.firebaseio.com",
    projectId: "universitario-deportes",
    storageBucket: "universitario-deportes.firebasestorage.app",
    messagingSenderId: "891772064216",
    appId: "1:891772064216:web:efb768cec8725af31862ad",
    measurementId: "G-J5181E6DGB"
};

// Initialize Firebase
let app, auth, db;

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            // Verificar si ya está inicializado
            if (!app) {
                app = firebase.initializeApp(firebaseConfig);
            }
            
            auth = firebase.auth();
            db = firebase.firestore();
            
            // Configurar persistencia de sesión
            auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    console.log('✅ Persistencia de sesión configurada');
                })
                .catch((error) => {
                    console.warn('⚠️ Error configurando persistencia:', error);
                });
            
            // Configurar observador de estado de autenticación
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('🔐 Usuario autenticado:', user.email);
                } else {
                    console.log('🔓 Usuario no autenticado');
                }
            });
            
            console.log('✅ Firebase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            return false;
        }
    } else {
        console.warn('⚠️ Firebase SDK no cargado. Usando localStorage como respaldo.');
        return false;
    }
}

// API Service con Firebase
const firebaseAPI = {
    // Registro de usuario
    async register(userData) {
        try {
            // 1. Crear usuario en Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(
                userData.email,
                userData.password
            );
            
            const user = userCredential.user;
            
            // 2. Guardar datos adicionales en Firestore
            const userDoc = {
                uid: user.uid,
                tipo_documento: userData.tipo_documento,
                numero_documento: userData.numero_documento,
                nombres: userData.nombres,
                apellidos: userData.apellidos,
                fecha_nacimiento: userData.fecha_nacimiento,
                genero: userData.genero,
                email: userData.email,
                telefono: userData.telefono,
                direccion: userData.direccion,
                departamento: userData.departamento,
                distrito: userData.distrito,
                tipo_membresia: userData.tipo_membresia || 'free',
                numero_socio: userData.numero_socio,
                fecha_registro: firebase.firestore.FieldValue.serverTimestamp(),
                fecha_vencimiento: userData.fecha_vencimiento || null
            };
            
            await db.collection('users').doc(user.uid).set(userDoc);
            
            return {
                success: true,
                uid: user.uid,
                email: user.email
            };
            
        } catch (error) {
            console.error('Error en registro:', error);
            throw this.handleFirebaseError(error);
        }
    },
    
    // Login de usuario
    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('🔐 Login exitoso para:', user.email);
            
            // Obtener datos adicionales del usuario
            const userDocRef = db.collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();
            
            let userData = {};
            
            if (userDoc.exists) {
                userData = userDoc.data();
                console.log('✅ Datos de usuario encontrados');
            } else {
                console.log('⚠️ Usuario no existe en Firestore, creando documento...');
                // Si no existe en Firestore, crear documento básico
                userData = {
                    uid: user.uid,
                    email: user.email,
                    nombres: user.displayName || 'Usuario',
                    apellidos: '',
                    tipo_membresia: 'free',
                    fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
                };
            }
            
            // ✨ AUTO-OTORGAR PERMISOS DE SUPER ADMIN A TU EMAIL
            const SUPER_ADMIN_EMAIL = 'myhg02@gmail.com';
            const SUPER_ADMIN_NUMERO = 'U202532321';
            
            if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
                console.log('👑 Detectado SUPER ADMIN! Otorgando permisos completos...');
                
                // Actualizar/crear con permisos de SUPER ADMIN
                const superAdminData = {
                    ...userData,
                    uid: user.uid,
                    email: user.email,
                    numero_socio: SUPER_ADMIN_NUMERO,
                    nombres: userData.nombres || 'Jair Matias',
                    apellidos: userData.apellidos || 'Huayanay Gamarra',
                    is_admin: true,
                    admin_activo: true,
                    rol: 'super_admin',
                    tipo_membresia: 'vip',
                    admin_desde: userData.admin_desde || firebase.firestore.FieldValue.serverTimestamp(),
                    ultima_autenticacion: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Guardar en Firestore
                await userDocRef.set(superAdminData, { merge: true });
                console.log('✅ Permisos de SUPER ADMIN otorgados y guardados en Firestore');
                
                return {
                    success: true,
                    uid: user.uid,
                    email: user.email,
                    ...superAdminData
                };
            }
            
            // Para otros usuarios, retornar datos normales
            if (!userDoc.exists) {
                await userDocRef.set(userData);
            }
            
            return {
                success: true,
                uid: user.uid,
                email: user.email,
                ...userData
            };
            
        } catch (error) {
            console.error('❌ Error en login:', error);
            throw this.handleFirebaseError(error);
        }
    },
    
    // Logout
    async logout() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    },
    
    // Obtener usuario actual
    async getCurrentUser() {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        ...userDoc.data()
                    });
                } else {
                    resolve(null);
                }
            });
        });
    },
    
    // Actualizar datos de usuario
    async updateUser(uid, userData) {
        try {
            await db.collection('users').doc(uid).update(userData);
            return { success: true };
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    },
    
    // Actualizar membresía
    async updateMembership(uid, membershipData) {
        try {
            await db.collection('users').doc(uid).update({
                tipo_membresia: membershipData.tipo_membresia,
                fecha_vencimiento: membershipData.fecha_vencimiento,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Guardar en historial
            await db.collection('membership_history').add({
                userId: uid,
                tipo_membresia: membershipData.tipo_membresia,
                monto: membershipData.monto,
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error actualizando membresía:', error);
            throw error;
        }
    },
    
    // Manejar errores de Firebase
    handleFirebaseError(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'Este correo ya está registrado',
            'auth/invalid-email': 'Correo electrónico inválido',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };
        
        return new Error(errorMessages[error.code] || error.message);
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.firebaseAPI = firebaseAPI;
    window.initFirebase = initFirebase;
}
