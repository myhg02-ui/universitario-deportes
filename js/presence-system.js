// 🌐 SISTEMA DE PRESENCIA GLOBAL
// Este archivo maneja la detección de presencia en tiempo real para todos los usuarios
// Se ejecuta automáticamente en todas las páginas (dashboard, panel-admin, etc.)

(function() {
    'use strict';
    
    let presenceInitialized = false;
    let currentUserPresenceRef = null;
    let awayTimeout = null;
    
    const AWAY_DELAY = 2000; // 2 segundos para marcar como ausente
    
    // Actualizar indicador visual de estado (si existe en la página)
    function updateStatusIndicator(status) {
        const statusDot = document.getElementById('userStatusDot');
        const statusText = document.getElementById('userStatusText');
        
        if (statusDot && statusText) {
            if (status === 'online') {
                statusDot.style.background = '#4caf50';
                statusDot.style.animation = 'pulse 2s infinite';
                statusText.textContent = 'Conectado';
                statusText.style.color = '#2e7d32';
                statusText.closest('span').style.background = '#e8f5e9';
            } else if (status === 'away') {
                statusDot.style.background = '#ff9800';
                statusDot.style.animation = 'pulse 2s infinite';
                statusText.textContent = 'Ausente';
                statusText.style.color = '#e65100';
                statusText.closest('span').style.background = '#fff3e0';
            } else {
                statusDot.style.background = '#9e9e9e';
                statusDot.style.animation = 'none';
                statusText.textContent = 'Desconectado';
                statusText.style.color = '#616161';
                statusText.closest('span').style.background = '#f5f5f5';
            }
        }
    }
    
    // Configurar detección de visibilidad
    function setupVisibilityDetection() {
        if (!currentUserPresenceRef) return;
        
        document.addEventListener('visibilitychange', () => {
            const isOnlineData = {
                state: 'online',
                lastChanged: firebase.database.ServerValue.TIMESTAMP,
            };
            
            const isAwayData = {
                state: 'away',
                lastChanged: firebase.database.ServerValue.TIMESTAMP,
            };
            
            if (document.hidden) {
                // Usuario cambió de pestaña - marcar como ausente después del delay
                console.log('👁️ Pestaña oculta - marcando como AUSENTE en 2 segundos...');
                awayTimeout = setTimeout(() => {
                    if (currentUserPresenceRef) {
                        currentUserPresenceRef.set(isAwayData).then(() => {
                            console.log('🟠 AUSENTE - Usuario cambió de ventana (pestaña abierta pero no visible)');
                            updateStatusIndicator('away');
                            
                            // Actualizar Firestore
                            if (firebase.firestore && firebase.auth().currentUser) {
                                firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
                                    ultima_conexion: firebase.firestore.FieldValue.serverTimestamp()
                                }).catch(err => console.warn('⚠️ Firestore update:', err));
                            }
                        }).catch((error) => {
                            console.error('❌ Error al marcar como ausente:', error);
                        });
                    }
                }, AWAY_DELAY);
            } else {
                // Usuario regresó a la pestaña - marcar como online INMEDIATAMENTE
                console.log('👁️ Pestaña visible - marcando como ONLINE');
                clearTimeout(awayTimeout);
                if (currentUserPresenceRef) {
                    currentUserPresenceRef.set(isOnlineData).then(() => {
                        console.log('🟢 CONECTADO - Usuario volvió a la pestaña');
                        updateStatusIndicator('online');
                        
                        // Actualizar Firestore
                        if (firebase.firestore && firebase.auth().currentUser) {
                            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
                                ultima_conexion: firebase.firestore.FieldValue.serverTimestamp()
                            }).catch(err => console.warn('⚠️ Firestore update:', err));
                        }
                    }).catch((error) => {
                        console.error('❌ Error al marcar como online:', error);
                    });
                }
            }
        });
        
        console.log('✅ Detección de visibilidad configurada');
    }
    
    // Configurar eventos de actividad (ya no necesarios para cambiar estado, solo para logging)
    function setupActivityListeners() {
        let activityLogThrottle = 0;
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, () => {
                const now = Date.now();
                
                // Log de actividad (throttled a cada 30 segundos para no saturar consola)
                if (now - activityLogThrottle > 30000) {
                    if (!document.hidden) {
                        console.log('👆 Actividad detectada - usuario activo en la página');
                    }
                    activityLogThrottle = now;
                }
            }, true);
        });
        
        console.log('✅ Listeners de actividad configurados');
    }
    
    // Inicializar sistema de presencia global
    function initGlobalPresence(userId) {
        if (presenceInitialized) {
            console.log('✅ Sistema de presencia ya inicializado');
            return;
        }
        
        if (!firebase.database) {
            console.error('❌ Firebase Realtime Database NO está disponible');
            updateStatusIndicator('offline');
            return;
        }
        
        console.log('🔄 Inicializando sistema de presencia global para:', userId);
        
        currentUserPresenceRef = firebase.database().ref('/presence/' + userId);
        
        const isOnlineData = {
            state: 'online',
            lastChanged: firebase.database.ServerValue.TIMESTAMP,
        };
        
        const isOfflineData = {
            state: 'offline',
            lastChanged: firebase.database.ServerValue.TIMESTAMP,
        };
        
        // Configurar detección de visibilidad y actividad
        setupVisibilityDetection();
        setupActivityListeners();
        
        // Monitorear conexión a Firebase
        firebase.database().ref('.info/connected').on('value', (snapshot) => {
            const isConnected = snapshot.val();
            
            if (isConnected === false) {
                console.log('⚠️ No hay conexión a Firebase Realtime Database');
                updateStatusIndicator('offline');
                return;
            }
            
            console.log('✅ Conectado a Firebase Realtime Database');
            
            // Configurar el estado cuando hay conexión
            currentUserPresenceRef.onDisconnect().set(isOfflineData).then(() => {
                console.log('✅ onDisconnect configurado - se marcará como DESCONECTADO al cerrar');
                
                // También actualizar Firestore cuando se desconecte
                if (firebase.firestore) {
                    currentUserPresenceRef.onDisconnect().cancel(); // Cancelar el anterior
                    currentUserPresenceRef.onDisconnect().set(isOfflineData);
                    
                    // Configurar actualización de Firestore al desconectar
                    firebase.firestore().collection('users').doc(userId).update({
                        ultima_conexion: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(err => console.warn('⚠️ Firestore update on disconnect:', err));
                }
            
                
                // Verificar si la pestaña está visible
                const initialState = document.hidden ? 'away' : 'online';
                const initialData = {
                    state: initialState,
                    lastChanged: firebase.database.ServerValue.TIMESTAMP,
                };
                
                currentUserPresenceRef.set(initialData).then(() => {
                    console.log('✅ Presencia registrada correctamente:', userId);
                    console.log('📊 Estado inicial:', initialState === 'online' ? '🟢 CONECTADO' : '🟠 AUSENTE');
                    updateStatusIndicator(initialState);
                    presenceInitialized = true;
                    
                    // También guardar en Firestore para respaldo
                    if (firebase.firestore) {
                        firebase.firestore().collection('users').doc(userId).update({
                            ultima_conexion: firebase.firestore.FieldValue.serverTimestamp()
                        }).catch(err => console.warn('⚠️ No se pudo actualizar Firestore:', err));
                    }
                }).catch((error) => {
                    console.error('❌ Error al establecer presencia:', error);
                    updateStatusIndicator('offline');
                });
            }).catch((error) => {
                console.error('❌ Error al configurar onDisconnect:', error);
                updateStatusIndicator('offline');
            });
        });
        
        console.log('');
        console.log('📋 REGLAS DEL SISTEMA DE PRESENCIA:');
        console.log('🟢 CONECTADO = Pestaña visible y activa en cualquier página del sitio');
        console.log('🟠 AUSENTE = Pestaña abierta pero usuario cambió a otra ventana/pestaña');
        console.log('🔴 DESCONECTADO = Usuario cerró la pestaña o navegador');
        console.log('');
    }
    
    // Función para inicializar presencia cuando el usuario esté autenticado
    function setupGlobalPresenceSystem() {
        if (!firebase || !firebase.auth) {
            console.error('❌ Firebase Auth no disponible');
            return;
        }
        
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('👤 Usuario autenticado:', user.uid);
                initGlobalPresence(user.uid);
            } else {
                console.log('⚫ Usuario no autenticado');
                updateStatusIndicator('offline');
                presenceInitialized = false;
                currentUserPresenceRef = null;
            }
        });
    }
    
    // Auto-inicializar cuando Firebase esté listo
    function waitForFirebase() {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.database) {
            console.log('🔥 Firebase disponible, inicializando presencia...');
            setupGlobalPresenceSystem();
        } else {
            console.log('⏳ Esperando a que Firebase esté disponible...');
            setTimeout(waitForFirebase, 100);
        }
    }
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForFirebase);
    } else {
        waitForFirebase();
    }
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('presence-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'presence-pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
})();
