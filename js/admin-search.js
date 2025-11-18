// 🔍 SISTEMA DE BÚSQUEDA Y FILTRADO OPTIMIZADO PARA MILES DE USUARIOS
// Versión 2.0 - Alto rendimiento con paginación

// Variables globales para búsqueda y paginación (solo si no existen)
if (typeof allUsersData === 'undefined') var allUsersData = [];
if (typeof allAdminsData === 'undefined') var allAdminsData = [];
if (typeof filteredUsersData === 'undefined') var filteredUsersData = [];
if (typeof filteredAdminsData === 'undefined') var filteredAdminsData = [];
if (typeof currentUsersFilter === 'undefined') var currentUsersFilter = 'all';
if (typeof currentUsersPage === 'undefined') var currentUsersPage = 1;
if (typeof currentAdminsPage === 'undefined') var currentAdminsPage = 1;
if (typeof usersPageSize === 'undefined') var usersPageSize = 10; // 10 socios por página por defecto
if (typeof adminsPageSize === 'undefined') var adminsPageSize = 50; // 50 admins por página

// 🔍 BUSCAR USUARIOS - OPTIMIZADO
function searchUsers(searchTerm) {
    const searchLower = searchTerm.toLowerCase().trim();
    const searchCount = document.getElementById('searchUsersCount');
    
    if (!searchLower && currentUsersFilter === 'all') {
        // Sin búsqueda ni filtro: mostrar todos
        filteredUsersData = allUsersData;
        searchCount.style.display = 'none';
    } else {
        // Aplicar búsqueda y filtro
        let dataToFilter = currentUsersFilter === 'all' 
            ? allUsersData 
            : allUsersData.filter(u => u.tipo_membresia === currentUsersFilter);
        
        if (searchLower) {
            filteredUsersData = dataToFilter.filter(user => {
                const numero = (user.numero_socio || '').toLowerCase();
                const nombres = (user.nombres || '').toLowerCase();
                const apellidos = (user.apellidos || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                const fullName = `${nombres} ${apellidos}`;
                
                return numero.includes(searchLower) ||
                       nombres.includes(searchLower) ||
                       apellidos.includes(searchLower) ||
                       fullName.includes(searchLower) ||
                       email.includes(searchLower);
            });
            
            searchCount.textContent = `${filteredUsersData.length} encontrado${filteredUsersData.length !== 1 ? 's' : ''}`;
            searchCount.style.display = 'block';
        } else {
            filteredUsersData = dataToFilter;
            searchCount.style.display = 'none';
        }
    }
    
    // Resetear a página 1 y renderizar
    currentUsersPage = 1;
    renderUsersPaginated();
}

// 🎯 FILTRAR POR PLAN
function filterUsersByPlan(plan) {
    currentUsersFilter = plan;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === plan) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    console.log(`🔍 Filtrando por plan: ${plan}`);
    
    if (plan === 'all') {
        filteredUsersData = [...allUsersData];
    } else {
        // Filtrar considerando variaciones (VIP, vip, Premium, premium, etc.)
        filteredUsersData = allUsersData.filter(user => {
            const userPlan = (user.tipo_membresia || 'Free').toLowerCase();
            const filterPlan = plan.toLowerCase();
            
            console.log(`  Usuario: ${user.nombres} - Plan: "${user.tipo_membresia}" (${userPlan}) vs Filtro: ${filterPlan}`);
            
            return userPlan === filterPlan;
        });
    }
    
    console.log(`✅ Usuarios filtrados: ${filteredUsersData.length} de ${allUsersData.length}`);
    
    // Resetear a la primera página
    currentUsersPage = 1;
    
    // Renderizar
    renderUsersPaginated();
}

// 📄 RENDERIZAR USUARIOS CON PAGINACIÓN
function renderUsersPaginated() {
    const totalUsers = filteredUsersData.length;
    const totalPages = Math.ceil(totalUsers / usersPageSize);
    const startIndex = (currentUsersPage - 1) * usersPageSize;
    const endIndex = Math.min(startIndex + usersPageSize, totalUsers);
    const usersToShow = filteredUsersData.slice(startIndex, endIndex);
    
    // Renderizar solo los usuarios de la página actual
    renderUsersTable(usersToShow);
    
    // Actualizar controles de paginación
    updateUsersPagination(totalUsers, totalPages, startIndex, endIndex);
}

// 📊 ACTUALIZAR CONTROLES DE PAGINACIÓN
function updateUsersPagination(total, totalPages, startIndex, endIndex) {
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) {
        console.warn('⚠️ No se encontró contenedor de paginación');
        return;
    }
    
    // Actualizar info (siempre visible)
    const info = `Mostrando ${startIndex + 1}-${endIndex} de ${total} socios`;
    const infoElement = document.getElementById('usersPaginationInfo');
    if (infoElement) {
        infoElement.textContent = info;
    }
    
    // Las flechitas SIEMPRE están visibles
    paginationContainer.style.display = 'flex';
    
    // Actualizar estado de los botones (habilitados/deshabilitados)
    const firstBtn = document.getElementById('btnFirstUsers');
    const prevBtn = document.getElementById('btnPrevUsers');
    const nextBtn = document.getElementById('btnNextUsers');
    const lastBtn = document.getElementById('btnLastUsers');
    const currentPageSpan = document.getElementById('currentUserPage');
    
    // Deshabilitar botones cuando no hay más páginas en esa dirección
    if (firstBtn) firstBtn.disabled = currentUsersPage === 1;
    if (prevBtn) prevBtn.disabled = currentUsersPage === 1;
    if (nextBtn) nextBtn.disabled = currentUsersPage >= totalPages || totalPages === 0;
    if (lastBtn) lastBtn.disabled = currentUsersPage >= totalPages || totalPages === 0;
    
    if (currentPageSpan) {
        currentPageSpan.textContent = totalPages > 0 ? `Página ${currentUsersPage} de ${totalPages}` : 'Página 1 de 1';
    }
}


// ⏭️ CAMBIAR PÁGINA DE USUARIOS
function changeUsersPage(action) {
    const totalPages = Math.ceil(filteredUsersData.length / usersPageSize);
    
    switch (action) {
        case 'first':
            currentUsersPage = 1;
            break;
        case 'prev':
            if (currentUsersPage > 1) currentUsersPage--;
            break;
        case 'next':
            if (currentUsersPage < totalPages) currentUsersPage++;
            break;
        case 'last':
            currentUsersPage = totalPages;
            break;
        default:
            currentUsersPage = parseInt(action);
    }
    
    renderUsersPaginated();
    
    // Scroll suave a la tabla
    document.querySelector('.modern-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 📏 CAMBIAR TAMAÑO DE PÁGINA
function changeUsersPageSize(newSize) {
    usersPageSize = parseInt(newSize);
    currentUsersPage = 1;
    renderUsersPaginated();
}

// 🔍 BUSCAR ADMINISTRADORES
function searchAdmins(searchTerm) {
    const searchLower = searchTerm.toLowerCase().trim();
    const searchCount = document.getElementById('searchAdminsCount');
    
    if (!searchLower) {
        filteredAdminsData = allAdminsData;
        searchCount.style.display = 'none';
    } else {
        filteredAdminsData = allAdminsData.filter(admin => {
            const numero = (admin.numero_socio || '').toLowerCase();
            const nombres = (admin.nombres || '').toLowerCase();
            const apellidos = (admin.apellidos || '').toLowerCase();
            const email = (admin.email || '').toLowerCase();
            const fullName = `${nombres} ${apellidos}`;
            
            return numero.includes(searchLower) ||
                   nombres.includes(searchLower) ||
                   apellidos.includes(searchLower) ||
                   fullName.includes(searchLower) ||
                   email.includes(searchLower);
        });
        
        searchCount.textContent = `${filteredAdminsData.length} encontrado${filteredAdminsData.length !== 1 ? 's' : ''}`;
        searchCount.style.display = 'block';
    }
    
    renderAdminsTable(filteredAdminsData);
}

// ⚡ FUNCIÓN DE ACTUALIZACIÓN (Refresca datos)
async function refreshData() {
    const btn = event.target.closest('.btn-action');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    }
    
    try {
        // Limpiar caché y recargar
        cachedUsersData = null;
        cacheTimestamp = null;
        
        await loadAdminData(true);
        await loadAdminsList();
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        }
        
        // Mostrar mensaje de éxito
        if (window.modalSystem) {
            await modalSystem.showAlert('✅ Actualizado', 'Datos actualizados correctamente');
        }
    } catch (error) {
        console.error('Error al refrescar:', error);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        }
    }
}

// 📋 RENDERIZAR TABLA DE USUARIOS
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) {
        console.error('❌ No se encontró el elemento usersTableBody');
        return;
    }
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-users" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; display: block;"></i>
                    <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">No se encontraron socios</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; opacity: 0.7;">Intenta con otro filtro o búsqueda</p>
                </td>
            </tr>
        `;
        return;
    }
    
    const rows = users.map(user => {
        const plan = user.tipo_membresia || 'Free';
        const planClass = `plan-${plan.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
        
        // Obtener estado de presencia completo
        const presenceData = window.userPresenceData?.[user.id];
        const presenceState = presenceData?.state || 'offline';
        const lastChanged = presenceData?.last_changed;
        
        let statusText, statusClass, statusIcon;
        if (presenceState === 'online') {
            statusText = 'Online';
            statusClass = 'status-online';
            statusIcon = '🟢';
        } else if (presenceState === 'away') {
            statusText = 'Ausente';
            statusClass = 'status-away';
            statusIcon = '🟠';
        } else {
            statusText = 'Offline';
            statusClass = 'status-offline';
            statusIcon = '⚫';
            
            // Mostrar última conexión si está offline
            if (lastChanged) {
                const lastDate = new Date(lastChanged);
                const now = new Date();
                const diffMs = now - lastDate;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);
                
                if (diffMins < 1) {
                    statusText = 'Hace un momento';
                } else if (diffMins < 60) {
                    statusText = `Hace ${diffMins} min`;
                } else if (diffHours < 24) {
                    statusText = `Hace ${diffHours}h`;
                } else if (diffDays < 7) {
                    statusText = `Hace ${diffDays} días`;
                } else {
                    statusText = lastDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                }
            }
        }
        
        // Formatear fecha de registro
        let fechaRegistro = 'N/A';
        if (user.fecha_registro) {
            if (user.fecha_registro.seconds) {
                fechaRegistro = new Date(user.fecha_registro.seconds * 1000).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } else if (user.fecha_registro.toDate) {
                fechaRegistro = user.fecha_registro.toDate().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        }
        
        return `
            <tr style="transition: all 0.2s;">
                <td>
                    <div class="status-indicator" title="${statusIcon} ${statusText}">
                        <span class="status-dot ${statusClass}"></span>
                    </div>
                </td>
                <td style="font-weight: 600; color: #003278;">${user.numero_socio || 'N/A'}</td>
                <td style="font-weight: 500;">${user.nombres || ''} ${user.apellidos || ''}</td>
                <td style="color: #666;">${user.email || 'N/A'}</td>
                <td>
                    <span class="plan-badge ${planClass}">${plan}</span>
                </td>
                <td style="color: #666;">${fechaRegistro}</td>
                <td>
                    <button class="btn-action btn-view" onclick="viewUserDetails('${user.id}')" title="Ver detalles completos">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-action" onclick="manageUserMembership('${user.id}')" title="Gestionar membresía" style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);">
                        <i class="fas fa-edit"></i> Gestionar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
}

// 👁️ VER DETALLES DE USUARIO
function viewUserDetails(userId) {
    const user = allUsersData.find(u => u.id === userId);
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    // Obtener estado de presencia completo
    const presenceData = window.userPresenceData?.[userId];
    const presenceState = presenceData?.state || 'offline';
    const lastChanged = presenceData?.last_changed;
    
    let statusIcon, statusText, statusDetail;
    if (presenceState === 'online') {
        statusIcon = '🟢';
        statusText = 'Conectado';
        statusDetail = 'El usuario está activo en este momento';
    } else if (presenceState === 'away') {
        statusIcon = '🟠';
        statusText = 'Ausente';
        statusDetail = 'El usuario está inactivo o cambió de pestaña';
    } else {
        statusIcon = '⚫';
        statusText = 'Desconectado';
        
        // Calcular última conexión si está offline
        if (lastChanged) {
            const lastDate = new Date(lastChanged);
            const now = new Date();
            const diffMs = now - lastDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            let timeAgo;
            if (diffMins < 1) {
                timeAgo = 'Hace un momento';
            } else if (diffMins < 60) {
                timeAgo = `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
            } else if (diffHours < 24) {
                timeAgo = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
            } else if (diffDays < 7) {
                timeAgo = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
            } else {
                timeAgo = lastDate.toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            statusDetail = `Última conexión: ${timeAgo}`;
        } else {
            statusDetail = 'El usuario no se ha conectado recientemente';
        }
    }
    
    // Formatear fecha de registro
    let fechaRegistro = 'N/A';
    if (user.fecha_registro) {
        if (user.fecha_registro.seconds) {
            fechaRegistro = new Date(user.fecha_registro.seconds * 1000).toLocaleString('es-ES');
        } else if (user.fecha_registro.toDate) {
            fechaRegistro = user.fecha_registro.toDate().toLocaleString('es-ES');
        }
    }
    
    // Formatear fecha de vencimiento
    let fechaVencimiento = 'Sin vencimiento';
    if (user.fecha_vencimiento) {
        if (user.fecha_vencimiento.seconds) {
            fechaVencimiento = new Date(user.fecha_vencimiento.seconds * 1000).toLocaleDateString('es-ES');
        } else if (user.fecha_vencimiento.toDate) {
            fechaVencimiento = user.fecha_vencimiento.toDate().toLocaleDateString('es-ES');
        }
    }
    
    // Mostrar modal con detalles
    const modalHtml = `
        <div style="text-align: left; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #003278 0%, #005bb5 100%); color: white; padding: 1.5rem; margin: -1rem -1rem 1.5rem -1rem; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user-circle"></i>
                    ${user.nombres} ${user.apellidos}
                </h2>
            </div>
            
            <div style="background: ${presenceState === 'online' ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(56,142,60,0.05) 100%)' : presenceState === 'away' ? 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(245,124,0,0.05) 100%)' : 'linear-gradient(135deg, rgba(158,158,158,0.1) 0%, rgba(97,97,97,0.05) 100%)'}; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid ${presenceState === 'online' ? '#4caf50' : presenceState === 'away' ? '#ff9800' : '#9e9e9e'};">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">${statusIcon}</span>
                    <div>
                        <p style="margin: 0; font-weight: 700; font-size: 1.1rem; color: ${presenceState === 'online' ? '#2e7d32' : presenceState === 'away' ? '#e65100' : '#616161'};">${statusText}</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.85rem; color: #666;">${statusDetail}</p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">CÓDIGO DE SOCIO</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: 700; color: #003278;">${user.numero_socio || 'N/A'}</p>
                </div>
                
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">PLAN ACTUAL</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: 700; color: #7b1fa2;">${user.tipo_membresia || 'Free'}</p>
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; border-top: 2px solid #e0e0e0; padding-top: 1.5rem;">
                <div style="margin-bottom: 1rem;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">📧 EMAIL</p>
                    <p style="margin: 0.3rem 0 0 0; font-size: 1rem;">${user.email || 'N/A'}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">📱 TELÉFONO</p>
                    <p style="margin: 0.3rem 0 0 0; font-size: 1rem;">${user.telefono || 'No registrado'}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">🎂 FECHA DE NACIMIENTO</p>
                    <p style="margin: 0.3rem 0 0 0; font-size: 1rem;">${user.fecha_nacimiento || 'No registrada'}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">📍 DIRECCIÓN</p>
                    <p style="margin: 0.3rem 0 0 0; font-size: 1rem;">${user.direccion || 'No registrada'}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">📅 REGISTRO</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem;">${fechaRegistro}</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #666; font-size: 0.85rem; font-weight: 600;">⏰ VENCIMIENTO</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem;">${fechaVencimiento}</p>
                    </div>
                </div>
                
                ${user.is_admin ? `
                <div style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(255,215,0,0.05) 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #d4af37;">
                    <p style="margin: 0; color: #d4af37; font-weight: 700;"><i class="fas fa-crown"></i> ADMINISTRADOR DEL SISTEMA</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Rol: ${user.rol || 'Admin'}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Mostrar modal (si existe modalSystem, usarlo; si no, usar alert)
    if (window.modalSystem) {
        modalSystem.showAlert('Detalles del Usuario', modalHtml);
    } else {
        // Crear modal simple
        const modal = document.createElement('div');
        modal.id = 'userDetailModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 2rem;';
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                ${modalHtml}
                <button onclick="document.getElementById('userDetailModal').remove()" style="margin-top: 1.5rem; padding: 0.8rem 2rem; background: #003278; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; transition: background 0.3s;" onmouseover="this.style.background='#005bb5'" onmouseout="this.style.background='#003278'">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// 🎫 GESTIONAR MEMBRESÍA DE USUARIO
function manageUserMembership(userId) {
    const user = allUsersData.find(u => u.id === userId);
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    const currentPlan = user.tipo_membresia || 'Free';
    const currentStatus = user.membresia_activa !== false ? 'activa' : 'suspendida';
    
    // Formatear fecha de vencimiento actual
    let currentExpiry = 'Sin vencimiento';
    if (user.fecha_vencimiento) {
        if (user.fecha_vencimiento.seconds) {
            currentExpiry = new Date(user.fecha_vencimiento.seconds * 1000).toLocaleDateString('es-ES');
        } else if (user.fecha_vencimiento.toDate) {
            currentExpiry = user.fecha_vencimiento.toDate().toLocaleDateString('es-ES');
        }
    }
    
    const modalHtml = `
        <div style="text-align: left; max-width: 650px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); color: white; padding: 1.5rem; margin: -1rem -1rem 1.5rem -1rem; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user-cog"></i>
                    Gestionar Membresía
                </h2>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">${user.nombres} ${user.apellidos}</p>
            </div>
            
            <!-- Estado Actual -->
            <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 1rem 0; color: #333; font-size: 1rem;">📊 Estado Actual</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div>
                        <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">PLAN ACTUAL</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 1.1rem; font-weight: 700; color: #7b1fa2;">${currentPlan}</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">ESTADO</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 1.1rem; font-weight: 700; color: ${currentStatus === 'activa' ? '#4caf50' : '#f44336'};">${currentStatus === 'activa' ? '✅ Activa' : '❌ Suspendida'}</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #666; font-size: 0.75rem; font-weight: 600;">VENCIMIENTO</p>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; font-weight: 600; color: #666;">${currentExpiry}</p>
                    </div>
                </div>
            </div>
            
            <!-- Cambiar Plan -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                    <i class="fas fa-star"></i> Cambiar Plan de Membresía
                </label>
                <select id="newMembershipPlan" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: white;">
                    <option value="Free" ${currentPlan === 'Free' ? 'selected' : ''}>🆓 Free</option>
                    <option value="Básica" ${currentPlan === 'Básica' || currentPlan === 'basica' ? 'selected' : ''}>🎫 Básica</option>
                    <option value="Premium" ${currentPlan === 'Premium' ? 'selected' : ''}>💎 Premium</option>
                    <option value="VIP" ${currentPlan === 'VIP' ? 'selected' : ''}>⭐ VIP</option>
                </select>
            </div>
            
            <!-- Activar/Desactivar Membresía -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                    <i class="fas fa-power-off"></i> Estado de Membresía
                </label>
                <div style="display: flex; gap: 1rem;">
                    <label style="flex: 1; padding: 1rem; border: 2px solid #4caf50; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s;">
                        <input type="radio" name="membershipStatus" value="active" ${currentStatus === 'activa' ? 'checked' : ''} style="margin-right: 0.5rem;">
                        <span style="font-weight: 600; color: #4caf50;">✅ Activa</span>
                    </label>
                    <label style="flex: 1; padding: 1rem; border: 2px solid #f44336; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s;">
                        <input type="radio" name="membershipStatus" value="suspended" ${currentStatus === 'suspendida' ? 'checked' : ''} style="margin-right: 0.5rem;">
                        <span style="font-weight: 600; color: #f44336;">❌ Suspendida</span>
                    </label>
                </div>
            </div>
            
            <!-- Establecer Fecha de Vencimiento -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                    <i class="fas fa-calendar-alt"></i> Fecha de Vencimiento
                </label>
                <input type="date" id="newExpiryDate" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
            </div>
            
            <!-- Extender Membresía -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                    <i class="fas fa-clock"></i> O Extender Membresía
                </label>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
                    <input type="number" id="extensionAmount" placeholder="Cantidad" min="1" style="padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                    <select id="extensionUnit" style="padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: white;">
                        <option value="days">Días</option>
                        <option value="months" selected>Meses</option>
                        <option value="years">Años</option>
                    </select>
                </div>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #666;">
                    <i class="fas fa-info-circle"></i> Se agregará al vencimiento actual o a la fecha de hoy
                </p>
            </div>
            
            <!-- Motivo del Cambio -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">
                    <i class="fas fa-comment"></i> Motivo del Cambio (Opcional)
                </label>
                <textarea id="changeReason" rows="3" placeholder="Ej: Actualización por pago, Promoción especial, Suspensión por falta de pago..." style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>
            </div>
            
            <!-- Botones de Acción -->
            <div style="display: flex; gap: 1rem;">
                <button onclick="document.getElementById('manageMembershipModal').remove()" style="flex: 1; padding: 1rem; background: #e0e0e0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button onclick="saveMembershipChanges('${userId}')" style="flex: 2; padding: 1rem; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </div>
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'manageMembershipModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 2rem;';
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            ${modalHtml}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 💾 GUARDAR CAMBIOS DE MEMBRESÍA
async function saveMembershipChanges(userId) {
    const newPlan = document.getElementById('newMembershipPlan').value;
    const statusRadio = document.querySelector('input[name="membershipStatus"]:checked');
    const newStatus = statusRadio ? statusRadio.value : 'active';
    const newExpiryDate = document.getElementById('newExpiryDate').value;
    const extensionAmount = parseInt(document.getElementById('extensionAmount').value) || 0;
    const extensionUnit = document.getElementById('extensionUnit').value;
    const changeReason = document.getElementById('changeReason').value;
    
    try {
        // Preparar datos para actualizar
        const updateData = {
            tipo_membresia: newPlan,
            membresia_activa: newStatus === 'active',
            ultima_actualizacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Calcular fecha de vencimiento
        let expiryDate = null;
        
        if (newExpiryDate) {
            // Si se especificó una fecha exacta
            expiryDate = new Date(newExpiryDate + 'T23:59:59');
        } else if (extensionAmount > 0) {
            // Si se va a extender
            const user = allUsersData.find(u => u.id === userId);
            let baseDate = new Date();
            
            // Si ya tiene fecha de vencimiento, extender desde ahí
            if (user.fecha_vencimiento) {
                if (user.fecha_vencimiento.seconds) {
                    baseDate = new Date(user.fecha_vencimiento.seconds * 1000);
                } else if (user.fecha_vencimiento.toDate) {
                    baseDate = user.fecha_vencimiento.toDate();
                }
            }
            
            // Agregar tiempo
            if (extensionUnit === 'days') {
                expiryDate = new Date(baseDate.getTime() + (extensionAmount * 24 * 60 * 60 * 1000));
            } else if (extensionUnit === 'months') {
                expiryDate = new Date(baseDate);
                expiryDate.setMonth(expiryDate.getMonth() + extensionAmount);
            } else if (extensionUnit === 'years') {
                expiryDate = new Date(baseDate);
                expiryDate.setFullYear(expiryDate.getFullYear() + extensionAmount);
            }
        }
        
        if (expiryDate) {
            updateData.fecha_vencimiento = firebase.firestore.Timestamp.fromDate(expiryDate);
        }
        
        // Guardar historial de cambios
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const historyEntry = {
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            admin_id: currentUser.uid || 'unknown',
            admin_nombre: currentUser.displayName || 'Administrador',
            cambio: `Plan: ${newPlan}, Estado: ${newStatus === 'active' ? 'Activa' : 'Suspendida'}`,
            motivo: changeReason || 'No especificado'
        };
        
        // Actualizar usuario
        await firebase.firestore().collection('users').doc(userId).update(updateData);
        
        // Guardar en historial
        await firebase.firestore().collection('users').doc(userId)
            .collection('historial_membresia').add(historyEntry);
        
        // Cerrar modal
        document.getElementById('manageMembershipModal').remove();
        
        // Mostrar mensaje de éxito
        alert(`✅ Membresía actualizada correctamente\n\nNuevo plan: ${newPlan}\nEstado: ${newStatus === 'active' ? 'Activa' : 'Suspendida'}${expiryDate ? '\nVence: ' + expiryDate.toLocaleDateString('es-ES') : ''}`);
        
        // Recargar datos
        allUsersData = []; // Limpiar caché
        await loadAllUsers();
        
    } catch (error) {
        console.error('Error actualizando membresía:', error);
        alert('❌ Error al actualizar la membresía: ' + error.message);
    }
}

console.log('✅ admin-search.js cargado - Sistema de búsqueda optimizado');
