// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Debes iniciar sesión para acceder al dashboard');
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData(currentUser);
    loadMembershipHistory(currentUser);
    
    // Setup payment form
    setupPaymentForm();
    setupCardFormatting();
});

// Membership plans data
const membershipPlans = {
    free: {
        name: 'Free',
        price: 0,
        icon: 'user',
        benefits: [
            'Acceso al portal de socios',
            'Noticias y novedades del club',
            'Opción de actualizar a planes premium'
        ]
    },
    basica: {
        name: 'Básica',
        price: 120,
        icon: 'star',
        benefits: [
            '10% descuento en merchandising oficial',
            'Prioridad en compra de entradas',
            'Boletín mensual exclusivo'
        ]
    },
    premium: {
        name: 'Premium',
        price: 300,
        icon: 'gem',
        benefits: [
            'Todo lo de Básica +',
            '20% descuento en merchandising',
            '2 entradas gratis al año',
            'Acceso a eventos exclusivos',
            'Meet & Greet con jugadores',
            'Bufanda oficial de regalo'
        ]
    },
    vip: {
        name: 'VIP',
        price: 800,
        icon: 'crown',
        benefits: [
            'Todo lo de Premium +',
            '30% descuento en merchandising',
            '4 entradas VIP al año',
            'Acceso al Palco VIP',
            'Camiseta oficial firmada',
            'Invitación a entrenamientos',
            'Pack de bienvenida premium',
            'Atención prioritaria 24/7'
        ]
    }
};

// Load user data
function loadUserData(user) {
    // Display user name
    document.getElementById('userName').textContent = user.nombres + ' ' + user.apellidos;
    document.getElementById('memberNumber').textContent = user.numero_socio || 'U2025XXXXX';
    
    // Display member since date
    const memberSince = new Date(user.fecha_registro).getFullYear();
    document.getElementById('memberSince').textContent = memberSince;
    
    // Display current membership
    const currentPlan = user.tipo_membresia || 'free';
    const planData = membershipPlans[currentPlan];
    
    document.getElementById('currentPlanName').textContent = `Membresía ${planData.name}`;
    
    // Show "Gratis" for free plan, or price for paid plans
    if (currentPlan === 'free') {
        document.getElementById('currentPlanPrice').textContent = 'Gratis';
    } else {
        document.getElementById('currentPlanPrice').textContent = `S/ ${planData.price.toFixed(2)} / año`;
    }
    
    // Display expiry date (only for paid plans)
    const expiryDate = user.fecha_vencimiento ? new Date(user.fecha_vencimiento).toLocaleDateString('es-PE') : 'Sin vencimiento';
    document.getElementById('expiryDate').textContent = expiryDate;
    
    // Update membership badge icon
    const badgeIcon = document.querySelector('.membership-badge i');
    badgeIcon.className = `fas fa-${planData.icon}`;
    
    // Display current benefits
    const benefitsList = document.getElementById('currentBenefitsList');
    benefitsList.innerHTML = '';
    planData.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${benefit}`;
        benefitsList.appendChild(li);
    });
    
    // Update membership card style based on plan
    const membershipCard = document.getElementById('currentMembershipCard');
    membershipCard.classList.remove('basica', 'premium', 'vip');
    membershipCard.classList.add(currentPlan);
    
    // Hide upgrade options if already VIP
    if (currentPlan === 'vip') {
        document.getElementById('upgradeSection').innerHTML = `
            <h2 class="section-title">Tienes la Membresía Máxima 👑</h2>
            <p class="section-subtitle">Ya disfrutas de todos los beneficios exclusivos</p>
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 5rem; color: #d4af37; margin-bottom: 20px;">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3 style="font-size: 2rem; color: #c41e3a; margin-bottom: 15px;">
                    ¡Eres un Socio VIP!
                </h3>
                <p style="font-size: 1.2rem; color: #666;">
                    Gracias por tu apoyo incondicional al club
                </p>
            </div>
        `;
    } else {
        // Hide lower tier options (show only higher tiers)
        const upgradeCards = document.querySelectorAll('.upgrade-card');
        upgradeCards.forEach(card => {
            const cardPlan = card.getAttribute('data-plan');
            const planHierarchy = { free: -1, basica: 0, premium: 1, vip: 2 };
            const currentTier = planHierarchy[currentPlan] || -1;
            const cardTier = planHierarchy[cardPlan];
            
            if (cardTier <= currentTier) {
                card.style.display = 'none';
            }
        });
    }
}

// Load membership history
function loadMembershipHistory(user) {
    const historyBody = document.getElementById('historyTableBody');
    
    // Get history from localStorage or create initial entry
    let history = JSON.parse(localStorage.getItem(`history_${user.email}`)) || [];
    
    // If no history, add initial registration
    if (history.length === 0) {
        history = [{
            fecha: user.fecha_registro || new Date().toISOString(),
            tipo: membershipPlans[user.tipo_membresia || 'basica'].name,
            monto: membershipPlans[user.tipo_membresia || 'basica'].price,
            estado: 'Completado'
        }];
        localStorage.setItem(`history_${user.email}`, JSON.stringify(history));
    }
    
    // Display history
    historyBody.innerHTML = '';
    history.reverse().forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(item.fecha).toLocaleDateString('es-PE')}</td>
            <td>${item.tipo}</td>
            <td>S/ ${item.monto.toFixed(2)}</td>
            <td><span class="status-badge completed">${item.estado}</span></td>
        `;
        historyBody.appendChild(tr);
    });
}

// Open upgrade modal
let selectedPlan = '';
let selectedAmount = 0;

function openUpgradeModal(plan, amount) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPlan = currentUser.tipo_membresia || 'basica';
    
    selectedPlan = plan;
    selectedAmount = amount;
    
    document.getElementById('modalCurrentPlan').textContent = membershipPlans[currentPlan].name;
    document.getElementById('modalNewPlan').textContent = membershipPlans[plan].name;
    document.getElementById('modalAmount').textContent = `S/ ${amount.toFixed(2)}`;
    
    document.getElementById('upgradeModal').style.display = 'block';
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
    document.getElementById('paymentForm').reset();
}

// Setup payment form
function setupPaymentForm() {
    const form = document.getElementById('paymentForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Simulate payment processing
        processPayment();
    });
}

// Process payment (simulation)
function processPayment() {
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit-payment');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Update user membership
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const oldPlan = currentUser.tipo_membresia || 'basica';
        
        currentUser.tipo_membresia = selectedPlan;
        
        // Update expiry date (1 year from now)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        currentUser.fecha_vencimiento = expiryDate.toISOString();
        
        // Save updated user
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update history
        let history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`)) || [];
        history.push({
            fecha: new Date().toISOString(),
            tipo: membershipPlans[selectedPlan].name,
            monto: selectedAmount,
            estado: 'Completado'
        });
        localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(history));
        
        // Close upgrade modal
        closeUpgradeModal();
        
        // Show success modal
        document.getElementById('successPlanName').textContent = membershipPlans[selectedPlan].name;
        document.getElementById('successModal').style.display = 'block';
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    // Reload page to show updated data
    location.reload();
}

// Setup card number formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    
    // Format card number
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Format expiry date
    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
    
    // Only numbers for CVV
    cardCVV.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Logout function
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const upgradeModal = document.getElementById('upgradeModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target == upgradeModal) {
        closeUpgradeModal();
    }
    if (event.target == successModal) {
        closeSuccessModal();
    }
}
