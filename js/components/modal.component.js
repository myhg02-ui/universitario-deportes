// 🎨 Sistema de Modales Profesionales
// Reemplaza alerts simples por modales elegantes

(function() {
    'use strict';
    
    // Crear modal base
    function createModal(options = {}) {
        const {
            title = 'Modal',
            icon = 'fa-info-circle',
            content = '',
            buttons = [],
            size = 'medium', // small, medium, large
            className = ''
        } = options;
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = `modal-overlay ${className}`;
        
        // Crear contenido del modal
        const modalContent = document.createElement('div');
        modalContent.className = `modal-content modal-${size}`;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>
                    <i class="fas ${icon}"></i>
                    ${title}
                </h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${buttons.length > 0 ? `
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn-modal ${btn.className || 'btn-modal-primary'}" 
                                data-action="${btn.action || ''}">
                            ${btn.icon ? `<i class="fas ${btn.icon}"></i>` : ''}
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);
        
        // Agregar event listeners a botones
        buttons.forEach((btn, index) => {
            const btnElement = modalContent.querySelectorAll('.btn-modal')[index];
            if (btnElement && btn.onClick) {
                btnElement.addEventListener('click', () => {
                    btn.onClick(overlay);
                });
            }
        });
        
        // Cerrar al hacer click fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Animar entrada
        setTimeout(() => overlay.classList.add('active'), 10);
        
        return overlay;
    }
    
    // Modal de perfil profesional
    function showProfileModal() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            showAlert('No hay usuario logueado', 'error');
            return;
        }
        
        // Determinar rol
        const isSuperAdmin = currentUser.numero_socio === 'U202532321';
        const isAdmin = currentUser.is_admin === true;
        
        let roleHTML = '';
        if (isSuperAdmin) {
            roleHTML = '<span class="profile-role-badge super-admin"><i class="fas fa-crown"></i> SUPER ADMIN</span>';
        } else if (isAdmin) {
            roleHTML = '<span class="profile-role-badge admin"><i class="fas fa-shield-alt"></i> Administrador</span>';
        } else {
            roleHTML = '<span class="profile-role-badge user"><i class="fas fa-user"></i> Socio</span>';
        }
        
        // Membresía
        const membershipNames = {
            'free': 'Free',
            'basica': 'Básica',
            'premium': 'Premium',
            'vip': 'VIP'
        };
        const membershipName = membershipNames[currentUser.tipo_membresia] || 'Free';
        
        // Estado
        const isActive = !currentUser.membresia_revocada;
        const statusHTML = isActive 
            ? '<span class="profile-status-badge online">Activa</span>'
            : '<span class="profile-status-badge offline">Revocada</span>';
        
        // Iniciales para avatar
        const initials = (currentUser.nombres?.[0] || '') + (currentUser.apellidos?.[0] || '');
        
        const content = `
            <div class="user-avatar">${initials}</div>
            
            <div class="profile-info-grid">
                <div class="profile-info-item">
                    <div class="profile-info-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="profile-info-content">
                        <div class="profile-info-label">Nombre Completo</div>
                        <div class="profile-info-value">${currentUser.nombres || ''} ${currentUser.apellidos || ''}</div>
                    </div>
                </div>
                
                <div class="profile-info-item">
                    <div class="profile-info-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="profile-info-content">
                        <div class="profile-info-label">Rol en el Sistema</div>
                        <div class="profile-info-value">${roleHTML}</div>
                    </div>
                </div>
                
                <div class="profile-info-item">
                    <div class="profile-info-icon">
                        <i class="fas fa-id-card"></i>
                    </div>
                    <div class="profile-info-content">
                        <div class="profile-info-label">Número de Socio</div>
                        <div class="profile-info-value">${currentUser.numero_socio || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="profile-info-item">
                    <div class="profile-info-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="profile-info-content">
                        <div class="profile-info-label">Correo Electrónico</div>
                        <div class="profile-info-value">${currentUser.email || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="profile-membership-card">
                <div class="membership-type">💎 ${membershipName}</div>
                <div class="membership-status">
                    ${statusHTML}
                </div>
            </div>
        `;
        
        createModal({
            title: 'Mi Perfil',
            icon: 'fa-user-circle',
            content: content,
            size: 'medium',
            className: 'profile-modal',
            buttons: [
                {
                    text: 'Cerrar',
                    className: 'btn-modal-secondary',
                    onClick: (modal) => modal.remove()
                }
            ]
        });
    }
    
    // Modal de detalles de usuario (para admins)
    function showUserDetailsModal(userId) {
        if (!userId) return;
        
        const db = firebase.firestore();
        
        // Mostrar loading
        const loadingModal = createModal({
            title: 'Cargando...',
            icon: 'fa-spinner fa-spin',
            content: '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #003278;"></i></div>',
            size: 'small'
        });
        
        // Cargar datos del usuario
        db.collection('users').doc(userId).get()
            .then(doc => {
                loadingModal.remove();
                
                if (!doc.exists) {
                    showAlert('Usuario no encontrado', 'error');
                    return;
                }
                
                const userData = doc.data();
                const initials = (userData.nombres?.[0] || '') + (userData.apellidos?.[0] || '');
                
                const membershipNames = {
                    'free': 'Free',
                    'basica': 'Básica',
                    'premium': 'Premium',
                    'vip': 'VIP'
                };
                
                const content = `
                    <div class="user-details-header">
                        <div class="user-details-avatar">${initials}</div>
                        <div class="user-details-info">
                            <h3>${userData.nombres || ''} ${userData.apellidos || ''}</h3>
                            <div class="user-details-meta">
                                <span class="badge badge-${userData.tipo_membresia || 'free'}">${membershipNames[userData.tipo_membresia] || 'Free'}</span>
                                ${userData.is_admin ? '<span class="badge" style="background: #003278; color: white;">Admin</span>' : ''}
                                ${userData.membresia_revocada ? '<span class="badge" style="background: #dc3545; color: white;">Revocada</span>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Información Personal</h4>
                        <div class="detail-grid">
                            <div class="detail-row">
                                <span class="detail-label">N° de Socio:</span>
                                <span class="detail-value">${userData.numero_socio || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${userData.email || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Documento:</span>
                                <span class="detail-value">${userData.tipo_documento || 'DNI'}: ${userData.numero_documento || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Teléfono:</span>
                                <span class="detail-value">${userData.telefono || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-crown"></i> Membresía</h4>
                        <div class="detail-grid">
                            <div class="detail-row">
                                <span class="detail-label">Tipo:</span>
                                <span class="detail-value">${membershipNames[userData.tipo_membresia] || 'Free'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Estado:</span>
                                <span class="detail-value">${userData.membresia_revocada ? '❌ Revocada' : '✅ Activa'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Fecha de Registro:</span>
                                <span class="detail-value">${userData.fecha_registro ? new Date(userData.fecha_registro.toDate()).toLocaleDateString('es-PE') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                createModal({
                    title: 'Detalles del Usuario',
                    icon: 'fa-user',
                    content: content,
                    size: 'large',
                    buttons: [
                        {
                            text: 'Editar',
                            icon: 'fa-edit',
                            className: 'btn-modal-primary',
                            onClick: (modal) => {
                                modal.remove();
                                // Aquí puedes implementar el modal de edición
                                showAlert('Función de edición próximamente', 'info');
                            }
                        },
                        {
                            text: 'Cerrar',
                            className: 'btn-modal-secondary',
                            onClick: (modal) => modal.remove()
                        }
                    ]
                });
            })
            .catch(error => {
                loadingModal.remove();
                console.error('Error cargando usuario:', error);
                showAlert('Error al cargar datos del usuario', 'error');
            });
    }
    
    // Alert simple y elegante
    function showAlert(message, type = 'info') {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            border-left: 4px solid ${colors[type]};
            animation: slideInRight 0.3s ease;
        `;
        
        alertDiv.innerHTML = `
            <i class="fas ${icons[type]}" style="font-size: 1.5rem; color: ${colors[type]};"></i>
            <span style="flex: 1; color: #333; font-weight: 500;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; color: #999; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            alertDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
    
    // Exponer funciones globalmente
    window.modalSystem = {
        createModal,
        showProfileModal,
        showUserDetailsModal,
        showAlert
    };
    
})();

// Animaciones CSS (agregar al head si no existe)
if (!document.getElementById('modal-animations')) {
    const style = document.createElement('style');
    style.id = 'modal-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
