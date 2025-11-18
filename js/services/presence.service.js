// 🌐 SISTEMA DE PRESENCIA GLOBAL
// Este archivo maneja la detección de presencia en tiempo real para todos los usuarios
// Se ejecuta automáticamente en todas las páginas (dashboard, panel-admin, etc.)

(function() {
    'use strict';
    
    let presenceInitialized = false;
    let currentUserPresenceRef = null;
    let inactivityTimeout = null;
    let awayTimeout = null;
    
    const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos (aumentado de 3)
    const AWAY_DELAY = 5000; // 5 segundos
    
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
    
    // Resetear timer de inactividad
    function resetInactivityTimer() {
        if (!currentUserPresenceRef) return;
        
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            if (!document.hidden && currentUserPresenceRef) {
                const isAwayData = {
                    state: 'away',
                    last_changed: firebase.database.ServerValue.TIMESTAMP,
                };
                
                currentUserPresenceRef.set(isAwayData).then(() => {
                    console.log('🟠 Usuario inactivo por 5 minutos - marcado como AUSENTE');
                    console.log('📍 La pestaña está visible pero no hay actividad');
                    updateStatusIndicator('away');
                }).catch((error) => {
                    console.error('❌ Error al marcar como ausente por inactividad:', error);
                });
            } else if (document.hidden) {
                console.log('⚠️ Timer de inactividad expiró pero la pestaña está oculta');
            }
        }, INACTIVITY_TIME);
        
        console.log('⏱️ Timer de inactividad reiniciado (5 minutos)');
    }
    
    // Configurar detección de visibilidad
    function setupVisibilityDetection() {
        if (!currentUserPresenceRef) return;
        
        document.addEventListener('visibilitychange', () => {
            const isOnlineData = {
                state: 'online',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            
            const isAwayData = {
                state: 'away',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            
            if (document.hidden) {
                // Usuario cambió de pestaña - marcar como ausente después del delay
                awayTimeout = setTimeout(() => {
                    if (currentUserPresenceRef) {
                        currentUserPresenceRef.set(isAwayData).then(() => {
                            console.log('🟠 Usuario cambió de ventana - marcado como AUSENTE');
                            updateStatusIndicator('away');
                        }).catch((error) => {
                            console.error('❌ Error al marcar como ausente:', error);
                        });
                    }
                }, AWAY_DELAY);
            } else {
                // Usuario regresó a la pestaña - cancelar timeout y marcar como online
                clearTimeout(awayTimeout);
                if (currentUserPresenceRef) {
                    currentUserPresenceRef.set(isOnlineData).then(() => {
                        console.log('🟢 Usuario regresó - marcado como ONLINE');
                        updateStatusIndicator('online');
                        resetInactivityTimer();
                    }).catch((error) => {
                        console.error('❌ Error al marcar como online:', error);
                    });
                }
            }
        });
    }
    
    // Configurar eventos de actividad
    function setupActivityListeners() {
        let lastActivityUpdate = Date.now();
        let activityLogThrottle = 0;
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, () => {
                const now = Date.now();
                
                // Log de actividad (throttled a cada 30 segundos para no saturar consola)
                if (now - activityLogThrottle > 30000) {
                    console.log('👆 Actividad detectada - timer reiniciado');
                    activityLogThrottle = now;
                }
                
                // Si el usuario está ausente y hace una actividad, marcarlo como online
                if (currentUserPresenceRef && !document.hidden) {
                    // Solo verificar el estado cada 5 segundos para evitar sobrecarga
                    if (now - lastActivityUpdate > 5000) {
                        lastActivityUpdate = now;
                        
                        currentUserPresenceRef.once('value', (snapshot) => {
                            const currentState = snapshot.val();
                            if (currentState && currentState.state === 'away') {
                                const isOnlineData = {
                                    state: 'online',
                                    last_changed: firebase.database.ServerValue.TIMESTAMP,
                                };
                                
                                currentUserPresenceRef.set(isOnlineData).then(() => {
                                    console.log('🟢 Usuario volvió a estar activo - marcado como ONLINE');
                                    updateStatusIndicator('online');
                                }).catch((error) => {
                                    console.error('❌ Error al actualizar estado:', error);
                                });
                            }
                        });
                    }
                }
                
                // Siempre resetear el timer de inactividad
                resetInactivityTimer();
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
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
        
        const isOfflineData = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
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
                console.log('✅ onDisconnect configurado correctamente');
                
                currentUserPresenceRef.set(isOnlineData).then(() => {
                    console.log('✅ Presencia registrada correctamente:', userId);
                    console.log('📊 Estado inicial: ONLINE');
                    console.log('⏱️ Iniciando timer de inactividad (5 minutos)');
                    updateStatusIndicator('online');
                    resetInactivityTimer();
                    presenceInitialized = true;
                }).catch((error) => {
                    console.error('❌ Error al establecer presencia:', error);
                    updateStatusIndicator('offline');
                });
            }).catch((error) => {
                console.error('❌ Error al configurar onDisconnect:', error);
                updateStatusIndicator('offline');
            });
        });
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
