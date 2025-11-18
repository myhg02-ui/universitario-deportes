// 🚀 SCRIPT PARA CREAR TU USUARIO ADMIN EN FIRESTORE
// Copia y pega TODO esto en la consola del navegador (F12) en admin.html

(async function crearUsuarioAdmin() {
    console.clear();
    console.log('🚀 CREANDO USUARIO ADMIN EN FIRESTORE...\n');
    
    try {
        const db = firebase.firestore();
        const auth = firebase.auth();
        
        // Verificar si ya hay un usuario autenticado
        let currentUser = auth.currentUser;
        
        if (!currentUser) {
            console.log('⚠️ No hay usuario autenticado en Firebase');
            console.log('📝 Creando usuario...\n');
            
            // Crear usuario en Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(
                'myhg02@gmail.com',
                'Admin123456'  // ⚠️ CAMBIA ESTA CONTRASEÑA después
            );
            
            currentUser = userCredential.user;
            console.log('✅ Usuario creado en Firebase Auth');
            console.log('   UID:', currentUser.uid);
            console.log('   Email:', currentUser.email);
        } else {
            console.log('✅ Usuario ya autenticado');
            console.log('   UID:', currentUser.uid);
            console.log('   Email:', currentUser.email);
        }
        
        // Crear documento en Firestore
        const userData = {
            uid: currentUser.uid,
            email: 'myhg02@gmail.com',
            numero_socio: 'U202532321',
            nombres: 'Jair Matias',
            apellidos: 'Huayanay Gamarra',
            tipo_documento: 'DNI',
            numero_documento: '12345678',
            fecha_nacimiento: '1990-01-01',
            genero: 'M',
            telefono: '999999999',
            direccion: 'Lima, Perú',
            departamento: 'Lima',
            distrito: 'Lima',
            tipo_membresia: 'vip',
            fecha_registro: firebase.firestore.FieldValue.serverTimestamp(),
            fecha_vencimiento: new Date('2025-12-31'),
            
            // ⭐ PERMISOS DE SUPER ADMIN
            is_admin: true,
            admin_activo: true,
            admin_desde: firebase.firestore.FieldValue.serverTimestamp(),
            rol: 'super_admin'
        };
        
        // Guardar en Firestore
        await db.collection('users').doc(currentUser.uid).set(userData);
        
        console.log('\n✅ Usuario creado en Firestore');
        console.log('📊 Datos guardados:', userData);
        
        // Guardar en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            uid: currentUser.uid,
            ...userData
        }));
        
        console.log('\n✅ SessionStorage actualizado');
        
        // Verificar que se guardó
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            console.log('\n🎉 ¡TODO LISTO!');
            console.log('👤 Usuario Super Admin creado exitosamente');
            console.log('📧 Email: myhg02@gmail.com');
            console.log('🔑 Password: Admin123456');
            console.log('👑 Rol: SUPER ADMIN');
            console.log('🆔 Número Socio: U202532321');
            console.log('\n🔄 Recargando página en 3 segundos...');
            
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.code);
        console.error('💬 Mensaje:', error.message);
        
        if (error.code === 'auth/email-already-in-use') {
            console.log('\n⚠️ El email ya está en uso');
            console.log('📝 Intentando solo crear el documento en Firestore...');
            
            // Intentar crear documento con el usuario actual
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const userData = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    numero_socio: 'U202532321',
                    nombres: 'Jair Matias',
                    apellidos: 'Huayanay Gamarra',
                    tipo_membresia: 'vip',
                    is_admin: true,
                    admin_activo: true,
                    admin_desde: firebase.firestore.FieldValue.serverTimestamp(),
                    rol: 'super_admin',
                    fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await firebase.firestore().collection('users').doc(currentUser.uid).set(userData);
                
                console.log('✅ Documento creado en Firestore');
                console.log('🔄 Recargando...');
                setTimeout(() => location.reload(), 2000);
            }
        }
    }
})();
