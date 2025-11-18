// 🛡️ GESTIÓN DE ADMINISTRADORES
// Sistema completo de administración de roles y permisos

// Referencias a Firebase (NO declarar const db para evitar conflictos)
// Usar directamente firebase.firestore() o window.db si existe
if (!window.db) {
    window.db = firebase.firestore();
}

// Helper para obtener la referencia de Firestore
function getDb() {
    return window.db || firebase.firestore();
}

// Helper para mostrar alertas (usa modalSystem si está disponible, sino alert nativo)
function showAlert(title, message) {
    if (typeof modalSystem !== 'undefined' && modalSystem.showAlert) {
        return modalSystem.showAlert(title, message);
    } else {
        alert(`${title}\n\n${message}`);
        return Promise.resolve();
    }
}

// Helper para mostrar confirmaciones (usa modalSystem si está disponible, sino confirm nativo)
function showConfirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    if (typeof modalSystem !== 'undefined' && modalSystem.showConfirm) {
        return modalSystem.showConfirm(title, message, confirmText, cancelText);
    } else {
        return Promise.resolve(confirm(`${title}\n\n${message}`));
    }
}

// 👑 AGREGAR NUEVO ADMINISTRADOR (Solo Super Admin)
async function addNewAdmin() {
    console.log('👑 addNewAdmin: Iniciando...');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    console.log('🔐 Usuario actual:', currentUser);
    
    // Verificar que sea Super Admin (verificar tanto numero_socio como rol)
    const isSuperAdmin = currentUser.numero_socio === 'U202532321' || currentUser.rol === 'super_admin';
    
    if (!isSuperAdmin) {
        console.warn('❌ Acceso denegado: No es Super Admin');
        await showAlert('❌ Error', 'Solo el Super Admin puede agregar administradores.');
        return;
    }
    
    const newAdminId = document.getElementById('newAdminId').value.trim();
    console.log('📝 Número de socio ingresado:', newAdminId);
    
    if (!newAdminId) {
        console.warn('⚠️ Campo vacío');
        await showAlert('⚠️ Advertencia', 'Por favor ingresa el número de socio del nuevo administrador.');
        return;
    }
    
    try {
        console.log('🔍 Buscando usuario con numero_socio:', newAdminId);
        
        // Verificar si el usuario existe
        const userQuery = getDb().collection('users')
            .where('numero_socio', '==', newAdminId);
        
        const userDoc = await userQuery.get();
        
        console.log('📊 Resultado de búsqueda:', {
            empty: userDoc.empty,
            size: userDoc.size,
            docs: userDoc.docs.length
        });
        
        if (userDoc.empty) {
            console.warn('❌ Usuario no encontrado');
            await showAlert('❌ Error', `No se encontró ningún usuario con el número de socio: ${newAdminId}`);
            return;
        }
        
        const userData = userDoc.docs[0].data();
        const userId = userDoc.docs[0].id; // ✅ Corregido: .id en lugar de .id()
        
        console.log('✅ Usuario encontrado:', { userId, nombre: userData.nombres });
        
        // Verificar si ya es admin
        if (userData.is_admin === true) {
            await showAlert('⚠️ Advertencia', `${userData.nombres || 'Este usuario'} ya es administrador.`);
            return;
        }
        
        // Confirmar acción
        const confirmed = await showConfirm(
            '👑 Confirmar Promoción',
            `¿Deseas promover a ${userData.nombres || 'este usuario'} como administrador?`,
            'Sí, promover',
            'Cancelar'
        );
        
        if (!confirmed) {
            console.log('❌ Promoción cancelada por el usuario');
            return;
        }
        
        console.log('⏳ Actualizando permisos de administrador...');
        
        // Actualizar usuario a admin
        await getDb().collection('users').doc(userId).update({
            is_admin: true,
            admin_activo: true,
            admin_desde: firebase.firestore.FieldValue.serverTimestamp(),
            fecha_promocion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Usuario actualizado exitosamente');
        
        // Limpiar campo
        document.getElementById('newAdminId').value = '';
        
        console.log('🔄 Recargando lista de administradores...');
        
        // Recargar lista de admins
        await loadAdminsList();
        
        await showAlert('✅ Éxito', `${userData.nombres || 'Usuario'} ahora es administrador.`);
        
    } catch (error) {
        console.error('💥 ERROR en addNewAdmin:', error);
        await showAlert('❌ Error', `Error al agregar administrador: ${error.message}`);
    }
}

// 🗑️ REMOVER ADMINISTRADOR (Solo Super Admin)
async function removeAdmin(adminId) {
    console.log('🗑️ removeAdmin: Iniciando...', adminId);
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    // Verificar que sea Super Admin (verificar tanto numero_socio como rol)
    const isSuperAdmin = currentUser.numero_socio === 'U202532321' || currentUser.rol === 'super_admin';
    
    if (!isSuperAdmin) {
        await showAlert('❌ Error', 'Solo el Super Admin puede remover administradores.');
        return;
    }
    
    try {
        // Obtener datos del admin
        const adminDoc = await getDb().collection('users').doc(adminId).get();
        
        if (!adminDoc.exists) {
            await showAlert('❌ Error', 'Administrador no encontrado.');
            return;
        }
        
        const adminData = adminDoc.data();
        
        // Confirmar acción
        const confirmed = await showConfirm(
            '⚠️ Remover Administrador',
            `¿Estás seguro de remover los permisos de administrador a ${adminData.nombres || 'este usuario'}?`,
            'Remover',
            'Cancelar'
        );
        
        if (!confirmed) return;
        
        // Remover permisos de admin
        await getDb().collection('users').doc(adminId).update({
            is_admin: false,
            admin_activo: false,
            fecha_revocacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Recargar lista de admins
        await loadAdminsList();
        
        await showAlert('✅ Éxito', `${adminData.nombres || 'Usuario'} ya no es administrador.`);
        
    } catch (error) {
        console.error('💥 ERROR en removeAdmin:', error);
        await showAlert('❌ Error', `Error al remover administrador: ${error.message}`);
        await modalSystem.showAlert('❌ Error', `Error al remover administrador: ${error.message}`);
    }
}

// 📋 CARGAR LISTA DE ADMINISTRADORES
async function loadAdminsList() {
    console.log('📋 loadAdminsList: Iniciando...');
    
    try {
        // Verificar que Firebase esté listo
        if (!getDb()) {
            console.error('❌ Firebase no está listo para admin list');
            throw new Error('Firebase no inicializado');
        }
        
        // ⚡ OPTIMIZACIÓN: Usar los datos ya cargados por loadAllAdmins() en panel-admin.html
        // Solo recargar si realmente es necesario
        if (typeof allAdminsData !== 'undefined' && allAdminsData.length > 0) {
            console.log('✅ Usando datos de admins ya cargados (cache)');
            filteredAdminsData = allAdminsData;
            renderAdminsTable(allAdminsData);
            return;
        }
        
        // Mostrar loading en tabla de admins
        const adminsTableBody = document.getElementById('adminsTableBody');
        if (adminsTableBody) {
            adminsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #003278;"></i>
                        <p style="margin-top: 0.5rem; color: #666;">Cargando administradores...</p>
                    </td>
                </tr>
            `;
        }
        
        console.log('📥 Consultando administradores en Firestore...');
        
        // Obtener solo usuarios que son admins
        const adminsQuery = await getDb().collection('users')
            .where('is_admin', '==', true)
            .get();
        
        console.log(`✅ Encontrados ${adminsQuery.size} administradores`);
        
        const adminsData = [];
        adminsQuery.forEach(doc => {
            const adminData = doc.data();
            adminsData.push({
                id: doc.id,
                ...adminData
            });
        });
        
        // Guardar en variables globales
        if (typeof allAdminsData !== 'undefined') {
            allAdminsData = adminsData;
        }
        filteredAdminsData = adminsData;
        
        // Renderizar lista de admins
        renderAdminsTable(adminsData);
        
        console.log('✅ loadAdminsList: Completado exitosamente!');
        
    } catch (error) {
        console.error('💥 ERROR en loadAdminsList:', error);
        
        const adminsTableBody = document.getElementById('adminsTableBody');
        if (adminsTableBody) {
            adminsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #c41e3a;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                        <p style="margin-top: 1rem;">Error al cargar administradores.</p>
                    </td>
                </tr>
            `;
        }
    }
}

// 🛡️ RENDERIZAR TABLA DE ADMINISTRADORES
function renderAdminsTable(admins) {
    const adminsTableBody = document.getElementById('adminsTableBody');
    
    if (!adminsTableBody) {
        console.error('❌ No se encontró elemento adminsTableBody');
        return;
    }
    
    if (admins.length === 0) {
        adminsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-user-shield" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; display: block;"></i>
                    <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">No hay administradores registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const isSuperAdmin = currentUser.rol === 'super_admin' || currentUser.numero_socio === 'U202532321';
    
    adminsTableBody.innerHTML = admins.map(admin => {
        const isSuperAdminUser = admin.rol === 'super_admin' || admin.numero_socio === 'U202532321';
        
        // Obtener estado de presencia completo (igual que en admin-search.js)
        const presenceData = window.userPresenceData?.[admin.id];
        const presenceState = presenceData?.state || 'offline';
        
        let statusClass;
        if (presenceState === 'online') {
            statusClass = 'status-online';
        } else if (presenceState === 'away') {
            statusClass = 'status-away';
        } else {
            statusClass = 'status-offline';
        }
        
        // Formatear fecha
        let adminDesde = 'N/A';
        if (admin.admin_desde) {
            if (admin.admin_desde.seconds) {
                adminDesde = new Date(admin.admin_desde.seconds * 1000).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } else if (admin.admin_desde.toDate) {
                adminDesde = admin.admin_desde.toDate().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        }
        
        // Rol con estilo
        const rolBadge = isSuperAdminUser 
            ? '<span style="background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); color: #000; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fas fa-crown"></i> SUPER</span>'
            : '<span style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700;"><i class="fas fa-shield-alt"></i> Admin</span>';
        
        // Botones de acción
        let actionButtons = `
            <button class="btn-action btn-view" onclick="viewUserDetails('${admin.id}')" title="Ver detalles">
                <i class="fas fa-eye"></i> Ver
            </button>
        `;
        
        // Super Admin puede gestionar todos los admins (excepto a sí mismo)
        if (isSuperAdmin && !isSuperAdminUser) {
            actionButtons += `
                <button class="btn-action" style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); color: white;" 
                        onclick="manageAdminRole('${admin.id}')" title="Gestionar rol y permisos">
                    <i class="fas fa-user-shield"></i> Gestionar
                </button>
                <button class="btn-action btn-delete" onclick="removeAdmin('${admin.id}')" title="Remover administrador">
                    <i class="fas fa-user-minus"></i> Remover
                </button>
            `;
        }
        
        return `
            <tr style="transition: all 0.2s;">
                <td>
                    <div class="status-indicator">
                        <span class="status-dot ${statusClass}"></span>
                    </div>
                </td>
                <td style="font-weight: 600; color: #003278;">${admin.numero_socio || 'N/A'}</td>
                <td style="font-weight: 500;">${admin.nombres || ''} ${admin.apellidos || ''}</td>
                <td style="color: #666;">${admin.email || 'N/A'}</td>
                <td style="text-align: center;">${rolBadge}</td>
                <td style="color: #666;">${adminDesde}</td>
                <td>
                    ${actionButtons}
                </td>
            </tr>
        `;
    }).join('');
}

// 👑 GESTIONAR ROLES DE ADMINISTRADOR (Solo Super Admin)
async function manageAdminRole(adminId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    // Verificar que sea Super Admin
    const currentUserDoc = await getDb().collection('users').doc(currentUser.uid).get();
    const currentUserData = currentUserDoc.data();
    
    if (currentUserData.rol !== 'super_admin' && currentUser.numero_socio !== 'U202532321') {
        alert('❌ Solo el Super Admin puede gestionar roles de administradores.');
        return;
    }
    
    try {
        // Obtener datos del admin
        const adminDoc = await getDb().collection('users').doc(adminId).get();
        
        if (!adminDoc.exists) {
            alert('❌ Administrador no encontrado.');
            return;
        }
        
        const adminData = adminDoc.data();
        const isSuperAdmin = adminData.rol === 'super_admin';
        const isAdmin = adminData.is_admin === true;
        const isActive = adminData.admin_activo !== false;
        
        // Formatear fecha de promoción
        let adminSince = 'N/A';
        if (adminData.admin_desde) {
            if (adminData.admin_desde.seconds) {
                adminSince = new Date(adminData.admin_desde.seconds * 1000).toLocaleDateString('es-ES');
            } else if (adminData.admin_desde.toDate) {
                adminSince = adminData.admin_desde.toDate().toLocaleDateString('es-ES');
            }
        }
        
        const modalHtml = `
            <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); color: #000; padding: 1.5rem; margin: -1rem -1rem 1.5rem -1rem; border-radius: 10px 10px 0 0;">
                    <h2 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-crown"></i>
                        Gestionar Rol de Administrador
                    </h2>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-weight: 600;">${adminData.nombres} ${adminData.apellidos}</p>
                </div>
                
                <!-- Estado Actual -->
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; color: #333; font-size: 1rem;">📊 Estado Actual</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">ROL ACTUAL</p>
                            <p style="margin: 0.3rem 0 0 0; font-size: 1.1rem; font-weight: 700; color: ${isSuperAdmin ? '#d4af37' : '#2196f3'};">
                                ${isSuperAdmin ? '👑 Super Admin' : '🛡️ Administrador'}
                            </p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">ESTADO</p>
                            <p style="margin: 0.3rem 0 0 0; font-size: 1.1rem; font-weight: 700; color: ${isActive ? '#4caf50' : '#f44336'};">
                                ${isActive ? '✅ Activo' : '❌ Inactivo'}
                            </p>
                        </div>
                    </div>
                    <div style="margin-top: 1rem;">
                        <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">ADMIN DESDE</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; color: #666;">${adminSince}</p>
                    </div>
                </div>
                
                ${!isSuperAdmin ? `
                    <!-- Cambiar Rol -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                            <i class="fas fa-user-shield"></i> Tipo de Administrador
                        </label>
                        <select id="adminRoleType" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: white;">
                            <option value="admin" ${!isSuperAdmin ? 'selected' : ''}>🛡️ Administrador Regular</option>
                            <option value="super_admin" ${isSuperAdmin ? 'selected' : ''}>👑 Super Admin</option>
                        </select>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #666;">
                            <i class="fas fa-info-circle"></i> Los Super Admins tienen acceso total al sistema
                        </p>
                    </div>
                    
                    <!-- Activar/Desactivar -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                            <i class="fas fa-power-off"></i> Estado del Administrador
                        </label>
                        <div style="display: flex; gap: 1rem;">
                            <label style="flex: 1; padding: 1rem; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="adminStatus" value="active" ${isActive ? 'checked' : ''} style="margin-right: 0.5rem;">
                                <span style="font-weight: 600; color: #4caf50;">✅ Activo</span>
                            </label>
                            <label style="flex: 1; padding: 1rem; border: 2px solid #f44336; border-radius: 8px; cursor: pointer; text-align: center;">
                                <input type="radio" name="adminStatus" value="inactive" ${!isActive ? 'checked' : ''} style="margin-right: 0.5rem;">
                                <span style="font-weight: 600; color: #f44336;">❌ Inactivo</span>
                            </label>
                        </div>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #666;">
                            <i class="fas fa-info-circle"></i> Los admins inactivos pierden temporalmente sus permisos
                        </p>
                    </div>
                    
                    <!-- Motivo del Cambio -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                            <i class="fas fa-comment"></i> Motivo del Cambio (Opcional)
                        </label>
                        <textarea id="adminChangeReason" rows="3" placeholder="Ej: Promoción a Super Admin, Suspensión temporal, Cambio de responsabilidades..." style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>
                    </div>
                ` : `
                    <!-- Mensaje para Super Admin -->
                    <div style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(255,215,0,0.05) 100%); padding: 1.5rem; border-radius: 10px; border-left: 4px solid #d4af37; margin-bottom: 1.5rem;">
                        <p style="margin: 0; color: #d4af37; font-weight: 700;">
                            <i class="fas fa-crown"></i> SUPER ADMINISTRADOR
                        </p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">
                            Este usuario tiene el rol más alto del sistema. Solo otro Super Admin puede modificar estos permisos.
                        </p>
                    </div>
                `}
                
                <!-- Opciones de Acción -->
                <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #e65100; font-size: 0.9rem;">
                        <i class="fas fa-exclamation-triangle"></i> ZONA DE PELIGRO
                    </h4>
                    <button onclick="revokeAdminPermissions('${adminId}')" style="width: 100%; padding: 0.8rem; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='#d32f2f'" onmouseout="this.style.background='#f44336'">
                        <i class="fas fa-user-times"></i> Revocar TODOS los Permisos de Admin
                    </button>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #666;">
                        Esta acción convertirá al usuario en un socio regular
                    </p>
                </div>
                
                <!-- Botones de Acción -->
                <div style="display: flex; gap: 1rem;">
                    <button onclick="document.getElementById('manageAdminRoleModal').remove()" style="flex: 1; padding: 1rem; background: #e0e0e0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    ${!isSuperAdmin ? `
                        <button onclick="saveAdminRoleChanges('${adminId}')" style="flex: 2; padding: 1rem; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'manageAdminRoleModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 2rem;';
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                ${modalHtml}
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
    } catch (error) {
        console.error('Error gestionando rol de admin:', error);
        alert('❌ Error al cargar información del administrador: ' + error.message);
    }
}

// 💾 GUARDAR CAMBIOS DE ROL DE ADMINISTRADOR
async function saveAdminRoleChanges(adminId) {
    const roleType = document.getElementById('adminRoleType')?.value;
    const statusRadio = document.querySelector('input[name="adminStatus"]:checked');
    const status = statusRadio ? statusRadio.value : 'active';
    const reason = document.getElementById('adminChangeReason')?.value || '';
    
    try {
        const updateData = {
            admin_activo: status === 'active',
            ultima_actualizacion_admin: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (roleType === 'super_admin') {
            updateData.rol = 'super_admin';
        } else {
            updateData.rol = 'admin';
        }
        
        // Guardar historial
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const historyEntry = {
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            super_admin_id: currentUser.uid,
            super_admin_nombre: currentUser.displayName || 'Super Admin',
            accion: `Rol: ${roleType === 'super_admin' ? 'Super Admin' : 'Admin'}, Estado: ${status === 'active' ? 'Activo' : 'Inactivo'}`,
            motivo: reason || 'No especificado'
        };
        
        // Actualizar
        await getDb().collection('users').doc(adminId).update(updateData);
        
        // Guardar historial
        await getDb().collection('users').doc(adminId)
            .collection('historial_admin').add(historyEntry);
        
        // Cerrar modal
        document.getElementById('manageAdminRoleModal').remove();
        
        alert(`✅ Rol de administrador actualizado\n\nNuevo rol: ${roleType === 'super_admin' ? 'Super Admin' : 'Administrador'}\nEstado: ${status === 'active' ? 'Activo' : 'Inactivo'}`);
        
        // Recargar datos
        allAdminsData = [];
        if (typeof loadAllAdmins === 'function') {
            await loadAllAdmins();
        }
        
    } catch (error) {
        console.error('Error guardando cambios de rol:', error);
        alert('❌ Error al guardar cambios: ' + error.message);
    }
}

// 🚫 REVOCAR TODOS LOS PERMISOS DE ADMINISTRADOR
async function revokeAdminPermissions(adminId) {
    const confirmed = confirm('⚠️ ¿ESTÁS SEGURO?\n\nEsta acción REVOCARÁ TODOS los permisos de administrador de este usuario y lo convertirá en un socio regular.\n\nEsta acción es irreversible y quedará registrada.');
    
    if (!confirmed) return;
    
    const reason = prompt('Por favor indica el motivo de la revocación:');
    if (!reason) {
        alert('Se requiere un motivo para realizar esta acción.');
        return;
    }
    
    try {
        const updateData = {
            is_admin: false,
            admin_activo: false,
            rol: firebase.firestore.FieldValue.delete(),
            fecha_revocacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Guardar historial
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const historyEntry = {
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            super_admin_id: currentUser.uid,
            super_admin_nombre: currentUser.displayName || 'Super Admin',
            accion: 'REVOCACIÓN TOTAL DE PERMISOS',
            motivo: reason
        };
        
        await getDb().collection('users').doc(adminId).update(updateData);
        await getDb().collection('users').doc(adminId)
            .collection('historial_admin').add(historyEntry);
        
        document.getElementById('manageAdminRoleModal').remove();
        
        alert('✅ Permisos revocados exitosamente\n\nEl usuario ya no es administrador.');
        
        // Recargar
        allAdminsData = [];
        if (typeof loadAllAdmins === 'function') {
            await loadAllAdmins();
        }
        
    } catch (error) {
        console.error('Error revocando permisos:', error);
        alert('❌ Error al revocar permisos: ' + error.message);
    }
}

console.log('✅ admin-management.js cargado - Sistema de gestión de administradores');
