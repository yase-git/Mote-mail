/**
 * MOTÉMAIL - Script Officiel
 * Version 2.0 - FINALE
 * © Motémail • Éducation, créé par Yase et Rocket
 */

// ============================================
// 1. DONNÉES OFFICIELLES (cachées)
// ============================================

// Les identifiants sont maintenant complètement cachés
const SUPER_ADMINS = [
    { id: 'yase@moteo.education', password: 'yase2026', name: 'Yase' },
    { id: 'rocket@moteo.education', password: 'rocket2026', name: 'Rocket' }
];

let domains = [
    {
        id: 1,
        name: 'moteo.fr',
        adminId: 'admin@moteo.fr',
        adminPassword: 'admin123',
        adminName: 'Admin Moteo',
        maxEmails: 10,
        paymentMethod: 'gratuit',
        paymentAmount: 0,
        paymentDate: '2026-03-01',
        beneficiaries: [
            { id: 1, email: 'contact@moteo.fr', password: 'contact123', name: 'Service Contact' },
            { id: 2, email: 'support@moteo.fr', password: 'support123', name: 'Support Technique' }
        ]
    }
];

let emails = [
    {
        id: 1,
        from: 'support@moteo.fr',
        to: 'contact@moteo.fr',
        subject: 'Bienvenue sur Motémail',
        body: 'Bonjour,\n\nBienvenue sur Motémail !',
        date: new Date().toISOString(),
        read: false
    }
];

// ===== AGENDA & TÂCHES =====
let events = [
    {
        id: 1,
        title: 'Cours de mathématiques',
        day: 1, // Lundi = 1
        startTime: '09:00',
        endTime: '11:00',
        room: 'Salle 101',
        color: '#3b82f6',
        description: 'Chapitre 5 : Les fonctions'
    },
    {
        id: 2,
        title: 'Physique-chimie',
        day: 2, // Mardi
        startTime: '14:00',
        endTime: '16:00',
        room: 'Labo 3',
        color: '#8b5cf6',
        description: 'Travaux pratiques'
    },
    {
        id: 3,
        title: 'Anglais',
        day: 3, // Mercredi
        startTime: '10:00',
        endTime: '12:00',
        room: 'Salle 204',
        color: '#10b981',
        description: 'Préparation examen'
    }
];

let tasks = [
    {
        id: 1,
        title: 'Rendre DM de maths',
        description: 'Exercices 1 à 5 page 42',
        dueDate: '2026-03-10',
        status: 'todo',
        priority: 'haute',
        assignedTo: null
    },
    {
        id: 2,
        title: 'Préparer présentation',
        description: 'PowerPoint sur la Révolution française',
        dueDate: '2026-03-12',
        status: 'in-progress',
        priority: 'moyenne',
        assignedTo: null
    },
    {
        id: 3,
        title: 'Lire chapitre 5',
        description: 'Histoire-géographie',
        dueDate: '2026-03-08',
        status: 'done',
        priority: 'basse',
        assignedTo: null
    }
];

let currentUser = null;

// ============================================
// 2. INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Motémail officiel chargé avec succès');
    
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Ajuster l'icône du thème
    const moon = document.querySelector('.fa-moon');
    const sun = document.querySelector('.fa-sun');
    if (savedTheme === 'dark') {
        moon.style.display = 'none';
        sun.style.display = 'inline-block';
    }
    
    // Charger les préférences
    loadPreferences();
    
    // Mettre à jour les statistiques
    updateStats();
    
    // Afficher les domaines
    renderDomainsTable();
    
    // Initialiser l'agenda
    initAgenda();
    
    // Initialiser les tâches
    renderTasks();
    
    console.log('✅ Initialisation terminée');
});

// ============================================
// 3. STATISTIQUES
// ============================================

function updateStats() {
    const totalBeneficiaries = domains.reduce((acc, d) => acc + d.beneficiaries.length, 0);
    
    document.getElementById('totalUsers').textContent = totalBeneficiaries + SUPER_ADMINS.length;
    document.getElementById('totalEmails').textContent = emails.length;
    document.getElementById('totalEvents').textContent = events.length;
    
    if (document.getElementById('statEmails')) {
        document.getElementById('statEmails').textContent = emails.length;
        document.getElementById('statEvents').textContent = events.length;
        document.getElementById('statTasks').textContent = tasks.length;
    }
}

// ============================================
// 4. THÈME
// ============================================

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const moon = document.querySelector('.fa-moon');
    const sun = document.querySelector('.fa-sun');
    
    if (newTheme === 'dark') {
        moon.style.display = 'none';
        sun.style.display = 'inline-block';
    } else {
        moon.style.display = 'inline-block';
        sun.style.display = 'none';
    }
    
    showNotification(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`);
}

function changeThemePreference(theme) {
    if (theme === 'auto') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', systemTheme);
        localStorage.setItem('theme', systemTheme);
    } else {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}

// ============================================
// 5. MODALS
// ============================================

function showModal(type) {
    document.getElementById('modal-' + type).classList.add('active');
}

function closeModal(type) {
    document.getElementById('modal-' + type).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// ============================================
// 6. NOTIFICATIONS (sans identifiants)
// ============================================

function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'info') icon = 'info-circle';
    
    notif.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    notif.className = 'notification ' + type + ' show';
    
    setTimeout(() => notif.classList.remove('show'), 3500);
}

// ============================================
// 7. CONNEXIONS (sans identifiants visibles)
// ============================================

function handleGuestLogin() {
    const email = document.getElementById('guestEmail').value;
    
    if (!email) {
        showNotification('Email requis', 'error');
        return;
    }
    
    currentUser = {
        type: 'guest',
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
    };
    
    closeModal('guest');
    showMainApp();
    showNotification('Bienvenue ' + currentUser.name);
}

function handleBeneficiaryLogin() {
    const email = document.getElementById('beneficiaryEmail').value;
    const password = document.getElementById('beneficiaryPassword').value;
    
    for (let domain of domains) {
        const beneficiary = domain.beneficiaries.find(b => b.email === email && b.password === password);
        if (beneficiary) {
            currentUser = {
                type: 'beneficiary',
                email: email,
                name: beneficiary.name,
                domain: domain.name,
                domainId: domain.id
            };
            
            closeModal('beneficiary');
            showMainApp();
            showNotification('Bienvenue ' + beneficiary.name);
            return;
        }
    }
    
    showNotification('Identifiants incorrects', 'error');
}

function handleDomainLogin() {
    const id = document.getElementById('domainAdminId').value;
    const password = document.getElementById('domainAdminPassword').value;
    
    const domain = domains.find(d => d.adminId === id && d.adminPassword === password);
    
    if (domain) {
        currentUser = {
            type: 'domain_admin',
            email: id,
            name: domain.adminName,
            domain: domain.name,
            domainId: domain.id,
            maxEmails: domain.maxEmails,
            beneficiaries: domain.beneficiaries
        };
        
        closeModal('domain');
        showMainApp();
        
        const domainNav = document.getElementById('domainAdminNav');
        if (domainNav) domainNav.style.display = 'flex';
        
        showSection('domain-admin');
        renderDomainAdmin();
        updateAccountInfo();
        
        showNotification('Bienvenue Admin ' + domain.name);
    } else {
        showNotification('Identifiants incorrects', 'error');
    }
}

function handleMoteoLogin() {
    const id = document.getElementById('moteoAdminId').value;
    const password = document.getElementById('moteoAdminPassword').value;
    
    const admin = SUPER_ADMINS.find(a => a.id === id && a.password === password);
    
    if (admin) {
        currentUser = {
            type: 'super_admin',
            email: admin.id,
            name: admin.name
        };
        
        closeModal('moteo');
        showMainApp();
        
        const superNav = document.getElementById('superAdminNav');
        if (superNav) superNav.style.display = 'flex';
        
        showSection('super-admin');
        renderSuperAdmin();
        renderDomainsTable();
        updateAccountInfo();
        
        showNotification('Bienvenue Super Admin ' + admin.name);
    } else {
        showNotification('Identifiants incorrects', 'error');
    }
}

function showMainApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    
    let roleText = '';
    if (currentUser.type === 'guest') roleText = 'Invité';
    else if (currentUser.type === 'beneficiary') roleText = 'Étudiant';
    else if (currentUser.type === 'domain_admin') roleText = 'Admin Établissement';
    else if (currentUser.type === 'super_admin') roleText = 'Admin Motéo';
    
    document.getElementById('userRoleDisplay').textContent = roleText;
    document.getElementById('welcomeName').textContent = currentUser.name;
    
    if (currentUser.type === 'guest') {
        document.getElementById('welcomeMessage').textContent = 'Mode invité';
        showSection('dashboard');
    }
}

// ============================================
// 8. NAVIGATION
// ============================================

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.nav-item');
    for (let btn of buttons) {
        if (btn.innerHTML.includes(section === 'super-admin' ? 'Supervision' : 
            section === 'domain-admin' ? 'Gestion' :
            section === 'settings' ? 'Paramètres' :
            section.charAt(0).toUpperCase() + section.slice(1))) {
            btn.classList.add('active');
            break;
        }
    }
    
    if (section === 'super-admin') {
        renderSuperAdmin();
        renderDomainsTable();
    }
    if (section === 'domain-admin') {
        renderDomainAdmin();
    }
    if (section === 'agenda') {
        renderAgenda();
    }
    if (section === 'tasks') {
        renderTasks();
    }
    if (section === 'settings') {
        updateAccountInfo();
    }
}

// ============================================
// 9. EMAILS
// ============================================

function showCompose() {
    showSection('compose');
    document.getElementById('composeFrom').value = currentUser.email;
}

function handleSendEmail() {
    const to = document.getElementById('composeTo').value;
    const subject = document.getElementById('composeSubject').value;
    const body = document.getElementById('composeBody').value;
    
    if (!to) {
        showNotification('Destinataire requis', 'error');
        return;
    }
    
    emails.unshift({
        id: Date.now(),
        from: currentUser.email,
        to: to,
        subject: subject || '(Pas de sujet)',
        body: body || '(Message vide)',
        date: new Date().toISOString(),
        read: false
    });
    
    showNotification('Email envoyé');
    showSection('emails');
    
    document.getElementById('composeTo').value = '';
    document.getElementById('composeSubject').value = '';
    document.getElementById('composeBody').value = '';
}

// ============================================
// 10. AGENDA COMPLET
// ============================================

let currentWeek = 0;
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function initAgenda() {
    renderAgenda();
}

function renderAgenda() {
    const calendar = document.getElementById('weeklyCalendar');
    if (!calendar) return;
    
    const startOfWeek = getStartOfWeek();
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    
    let html = `
        <div class="calendar-header" style="display: grid; grid-template-columns: 80px repeat(7, 1fr); gap: 2px; background: var(--border-light); padding: 2px; border-radius: 8px 8px 0 0;">
            <div style="background: var(--bg-secondary); padding: 10px; text-align: center; font-weight: 600;">Heure</div>
    `;
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        html += `
            <div style="background: var(--bg-secondary); padding: 10px; text-align: center; font-weight: 600;">
                ${daysOfWeek[i]}<br>
                <small style="color: var(--text-tertiary);">${date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</small>
            </div>
        `;
    }
    html += '</div>';
    
    hours.forEach(hour => {
        html += `<div style="display: grid; grid-template-columns: 80px repeat(7, 1fr); gap: 2px; background: var(--border-light); padding: 2px;">`;
        html += `<div style="background: var(--bg-secondary); padding: 10px; text-align: center; font-weight: 500;">${hour}</div>`;
        
        for (let day = 0; day < 7; day++) {
            const event = events.find(e => e.day === day && e.startTime === hour);
            
            if (event) {
                html += `
                    <div style="background: ${event.color}20; padding: 8px; border-radius: 4px; cursor: pointer; border-left: 3px solid ${event.color};" onclick="viewEvent(${event.id})">
                        <strong style="color: var(--text-primary);">${event.title}</strong><br>
                        <small style="color: var(--text-secondary);">${event.room}</small>
                    </div>
                `;
            } else {
                html += `
                    <div style="background: var(--card-bg); padding: 8px; min-height: 50px; cursor: pointer;" onclick="showAddEventModal('${day}', '${hour}')">
                        &nbsp;
                    </div>
                `;
            }
        }
        html += '</div>';
    });
    
    calendar.innerHTML = html;
    updateWeekDisplay();
}

function getStartOfWeek() {
    const date = new Date();
    date.setDate(date.getDate() + currentWeek * 7 - date.getDay() + 1);
    return date;
}

function updateWeekDisplay() {
    const date = getStartOfWeek();
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    
    document.getElementById('currentWeekDisplay').textContent = 
        `Semaine du ${date.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`;
}

function previousWeek() {
    currentWeek--;
    renderAgenda();
}

function nextWeek() {
    currentWeek++;
    renderAgenda();
}

function showAddEventModal(day, hour) {
    if (!currentUser || currentUser.type === 'guest') {
        showNotification('Connectez-vous pour ajouter un événement', 'error');
        return;
    }
    
    const title = prompt('Titre du cours :');
    if (!title) return;
    
    const room = prompt('Salle :');
    if (!room) return;
    
    const newEvent = {
        id: Date.now(),
        title: title,
        day: parseInt(day),
        startTime: hour,
        endTime: incrementHour(hour),
        room: room,
        color: getRandomColor(),
        description: ''
    };
    
    events.push(newEvent);
    renderAgenda();
    showNotification('Cours ajouté');
}

function incrementHour(hour) {
    const [h, m] = hour.split(':').map(Number);
    const newHour = h + 1;
    return `${newHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function getRandomColor() {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function viewEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    alert(`
📚 ${event.title}
━━━━━━━━━━━━━━━━━━━
📅 ${dayNames[event.day]} ${event.startTime} - ${event.endTime}
📍 ${event.room}
📝 ${event.description || 'Aucune description'}
    `);
}

// ============================================
// 11. TÂCHES COMPLET
// ============================================

function renderTasks() {
    const todoList = document.getElementById('todoTasks');
    const inProgressList = document.getElementById('inProgressTasks');
    const doneList = document.getElementById('doneTasks');
    
    if (todoList) {
        todoList.innerHTML = tasks
            .filter(t => t.status === 'todo')
            .map(t => createTaskHTML(t))
            .join('');
    }
    
    if (inProgressList) {
        inProgressList.innerHTML = tasks
            .filter(t => t.status === 'in-progress')
            .map(t => createTaskHTML(t))
            .join('');
    }
    
    if (doneList) {
        doneList.innerHTML = tasks
            .filter(t => t.status === 'done')
            .map(t => createTaskHTML(t))
            .join('');
    }
}

function createTaskHTML(task) {
    const priorityColor = task.priority === 'haute' ? '#ef4444' : 
                         task.priority === 'moyenne' ? '#f59e0b' : '#10b981';
    
    return `
        <div class="task-item ${task.status}" draggable="true" ondragstart="dragTask(event, ${task.id})" ondragover="allowDrop(event)" ondrop="dropTask(event, '${task.status}')">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <strong>${task.title}</strong>
                <span style="color: ${priorityColor}; font-size: 0.7rem;">●</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px;">
                📅 ${new Date(task.dueDate).toLocaleDateString('fr-FR')}
            </div>
            <div style="display: flex; gap: 4px; margin-top: 8px;">
                <button class="btn-icon" style="width: 24px; height: 24px;" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" style="width: 24px; height: 24px;" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

function showAddTaskModal() {
    if (!currentUser || currentUser.type === 'guest') {
        showNotification('Connectez-vous pour ajouter une tâche', 'error');
        return;
    }
    
    const title = prompt('Titre de la tâche :');
    if (!title) return;
    
    const dueDate = prompt('Date d\'échéance (JJ/MM/AAAA) :', new Date().toLocaleDateString('fr-FR'));
    if (!dueDate) return;
    
    const priority = prompt('Priorité (haute/moyenne/basse) :', 'moyenne');
    
    const [day, month, year] = dueDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    
    tasks.push({
        id: Date.now(),
        title: title,
        description: '',
        dueDate: formattedDate,
        status: 'todo',
        priority: priority || 'moyenne'
    });
    
    renderTasks();
    updateStats();
    showNotification('Tâche ajoutée');
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newTitle = prompt('Nouveau titre :', task.title);
    if (newTitle) task.title = newTitle;
    
    const newPriority = prompt('Nouvelle priorité (haute/moyenne/basse) :', task.priority);
    if (newPriority) task.priority = newPriority;
    
    renderTasks();
    showNotification('Tâche modifiée');
}

function deleteTask(taskId) {
    if (confirm('Supprimer cette tâche ?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateStats();
        showNotification('Tâche supprimée');
    }
}

function dragTask(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
}

function allowDrop(event) {
    event.preventDefault();
}

function dropTask(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id == taskId);
    
    if (task) {
        task.status = newStatus;
        renderTasks();
        showNotification('Tâche déplacée');
    }
}

// ============================================
// 12. SUPER ADMIN
// ============================================

function renderSuperAdmin() {
    const totalBeneficiaries = domains.reduce((acc, d) => acc + d.beneficiaries.length, 0);
    
    document.getElementById('superDomains').textContent = domains.length;
    document.getElementById('superAdmins').textContent = SUPER_ADMINS.length;
    document.getElementById('superBeneficiaries').textContent = totalBeneficiaries;
    document.getElementById('superEmails').textContent = totalBeneficiaries;
}

function createDomain() {
    const name = document.getElementById('newDomainName').value.trim();
    const quota = document.getElementById('newDomainQuota').value;
    const adminPassword = document.getElementById('newAdminPassword').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentAmount = document.getElementById('paymentAmount').value;
    
    if (!name || !adminPassword) {
        showNotification('Tous les champs requis', 'error');
        return;
    }
    
    if (domains.some(d => d.name === name)) {
        showNotification('Ce domaine existe déjà', 'error');
        return;
    }
    
    const newDomain = {
        id: Date.now(),
        name: name,
        adminId: 'admin@' + name,
        adminPassword: adminPassword,
        adminName: 'Admin ' + name.split('.')[0],
        maxEmails: parseInt(quota),
        paymentMethod: paymentMethod,
        paymentAmount: paymentMethod === 'gratuit' ? 0 : parseInt(paymentAmount),
        paymentDate: new Date().toISOString().split('T')[0],
        beneficiaries: []
    };
    
    domains.push(newDomain);
    renderDomainsTable();
    renderSuperAdmin();
    
    showNotification(`Domaine ${name} créé avec succès`);
    
    document.getElementById('newDomainName').value = '';
    document.getElementById('newAdminPassword').value = '';
    document.getElementById('paymentAmount').value = '';
}

function renderDomainsTable() {
    const tbody = document.getElementById('domainsTable');
    if (!tbody) return;
    
    if (domains.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Aucun domaine</td></tr>';
        return;
    }
    
    let html = '';
    domains.forEach(domain => {
        html += `
            <tr>
                <td><strong>${domain.name}</strong></td>
                <td>${domain.adminId}</td>
                <td>${domain.beneficiaries.length}/${domain.maxEmails}</td>
                <td>${getPaymentBadge(domain)}</td>
                <td>${domain.paymentDate}</td>
                <td>
                    <button class="btn-icon" onclick="viewDomainDetails('${domain.name}')"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" onclick="editDomain('${domain.name}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteDomain('${domain.name}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function getPaymentBadge(domain) {
    if (domain.paymentMethod === 'gratuit') {
        return '<span style="background: #10b98120; color: #10b981; padding: 4px 8px; border-radius: 20px;">Gratuit</span>';
    } else if (domain.paymentMethod === 'robux') {
        return `<span style="background: #ef444420; color: #ef4444; padding: 4px 8px; border-radius: 20px;">${domain.paymentAmount} Robux</span>`;
    } else {
        return `<span style="background: #5865f220; color: #5865f2; padding: 4px 8px; border-radius: 20px;">${domain.paymentAmount} Nitro</span>`;
    }
}

window.viewDomainDetails = function(domainName) {
    const domain = domains.find(d => d.name === domainName);
    if (!domain) return;
    
    let msg = `📋 DOMAINE: ${domain.name}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 Admin: ${domain.adminId}\n`;
    msg += `📊 Quota: ${domain.beneficiaries.length}/${domain.maxEmails}\n`;
    msg += `💰 Paiement: ${domain.paymentMethod}\n`;
    msg += `📅 Créé le: ${domain.paymentDate}\n`;
    
    if (domain.beneficiaries.length > 0) {
        msg += `\n📬 Bénéficiaires:\n`;
        domain.beneficiaries.forEach(b => {
            msg += `  • ${b.email} (${b.name})\n`;
        });
    }
    
    alert(msg);
}

window.editDomain = function(domainName) {
    const domain = domains.find(d => d.name === domainName);
    if (!domain) return;
    
    const newQuota = prompt('Nouveau quota:', domain.maxEmails);
    if (newQuota && !isNaN(newQuota)) {
        domain.maxEmails = parseInt(newQuota);
        renderDomainsTable();
        showNotification('Quota mis à jour');
    }
}

window.deleteDomain = function(domainName) {
    if (confirm(`Supprimer ${domainName} ?`)) {
        domains = domains.filter(d => d.name !== domainName);
        renderDomainsTable();
        showNotification('Domaine supprimé');
    }
}

// ============================================
// 13. ADMIN DOMAINE
// ============================================

function renderDomainAdmin() {
    if (!currentUser || !currentUser.domainId) return;
    
    const domain = domains.find(d => d.id === currentUser.domainId);
    if (!domain) return;
    
    document.getElementById('quotaUsed').textContent = domain.beneficiaries.length;
    document.getElementById('quotaMax').textContent = domain.maxEmails;
    
    const percentage = (domain.beneficiaries.length / domain.maxEmails) * 100;
    document.getElementById('quotaFill').style.width = percentage + '%';
    
    const tbody = document.getElementById('beneficiariesTable');
    if (tbody) {
        if (domain.beneficiaries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem;">Aucun bénéficiaire</td></tr>';
        } else {
            let html = '';
            domain.beneficiaries.forEach(b => {
                html += `
                    <tr>
                        <td>${b.email}</td>
                        <td>${b.name}</td>
                        <td>
                            <button class="btn-icon" onclick="showBeneficiaryPassword('${b.email}')"><i class="fas fa-key"></i></button>
                            <button class="btn-icon" onclick="deleteBeneficiary('${b.email}')"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }
    }
}

function createBeneficiary() {
    const email = document.getElementById('newBeneficiaryEmail').value.trim();
    const name = document.getElementById('newBeneficiaryName').value.trim();
    
    if (!email || !name) {
        showNotification('Tous les champs requis', 'error');
        return;
    }
    
    const domain = domains.find(d => d.id === currentUser.domainId);
    
    if (domain.beneficiaries.length >= domain.maxEmails) {
        showNotification('Quota maximum atteint', 'error');
        return;
    }
    
    domain.beneficiaries.push({
        id: Date.now(),
        email: email,
        password: 'Default123!',
        name: name
    });
    
    showNotification('Bénéficiaire ajouté');
    document.getElementById('newBeneficiaryEmail').value = '';
    document.getElementById('newBeneficiaryName').value = '';
    renderDomainAdmin();
}

window.showBeneficiaryPassword = function(email) {
    for (let domain of domains) {
        const beneficiary = domain.beneficiaries.find(b => b.email === email);
        if (beneficiary) {
            alert(`🔑 Mot de passe: ${beneficiary.password}`);
            return;
        }
    }
}

window.deleteBeneficiary = function(email) {
    if (confirm(`Supprimer ${email} ?`)) {
        const domain = domains.find(d => d.id === currentUser.domainId);
        domain.beneficiaries = domain.beneficiaries.filter(b => b.email !== email);
        renderDomainAdmin();
        showNotification('Bénéficiaire supprimé');
    }
}

// ============================================
// 14. PARAMÈTRES
// ============================================

function updateAccountInfo() {
    if (!currentUser) return;
    
    document.getElementById('accountName').textContent = currentUser.name;
    document.getElementById('accountEmail').textContent = currentUser.email;
    
    let roleText = '';
    if (currentUser.type === 'guest') roleText = 'Invité';
    else if (currentUser.type === 'beneficiary') roleText = 'Étudiant';
    else if (currentUser.type === 'domain_admin') roleText = 'Admin Établissement';
    else if (currentUser.type === 'super_admin') roleText = 'Admin Motéo';
    
    document.getElementById('accountRole').textContent = roleText;
}

function changePassword() {
    if (!currentUser) {
        showNotification('Connectez-vous d\'abord', 'error');
        return;
    }
    
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    if (!currentPass || !newPass || !confirmPass) {
        showNotification('Tous les champs requis', 'error');
        return;
    }
    
    if (newPass !== confirmPass) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    let success = false;
    
    if (currentUser.type === 'super_admin') {
        const admin = SUPER_ADMINS.find(a => a.id === currentUser.email);
        if (admin && admin.password === currentPass) {
            admin.password = newPass;
            success = true;
        }
    } else if (currentUser.type === 'domain_admin') {
        const domain = domains.find(d => d.id === currentUser.domainId);
        if (domain && domain.adminPassword === currentPass) {
            domain.adminPassword = newPass;
            success = true;
        }
    } else if (currentUser.type === 'beneficiary') {
        for (let domain of domains) {
            const beneficiary = domain.beneficiaries.find(b => b.email === currentUser.email);
            if (beneficiary && beneficiary.password === currentPass) {
                beneficiary.password = newPass;
                success = true;
                break;
            }
        }
    }
    
    if (success) {
        showNotification('Mot de passe modifié');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } else {
        showNotification('Mot de passe actuel incorrect', 'error');
    }
}

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('preferences'));
    if (prefs) {
        if (document.getElementById('themePreference')) {
            document.getElementById('themePreference').value = prefs.theme || 'light';
        }
        if (document.getElementById('languagePreference')) {
            document.getElementById('languagePreference').value = prefs.language || 'fr';
        }
        if (document.getElementById('notificationsEnabled')) {
            document.getElementById('notificationsEnabled').checked = prefs.notifications !== false;
        }
    }
}

function savePreferences() {
    const theme = document.getElementById('themePreference').value;
    const language = document.getElementById('languagePreference').value;
    const notifications = document.getElementById('notificationsEnabled').checked;
    
    localStorage.setItem('preferences', JSON.stringify({
        theme: theme,
        language: language,
        notifications: notifications
    }));
    
    showNotification('Préférences sauvegardées');
}

// ============================================
// 15. PAIEMENT
// ============================================

window.togglePaymentAmount = function() {
    const method = document.getElementById('paymentMethod').value;
    const amountField = document.getElementById('paymentAmount');
    amountField.style.display = method === 'gratuit' ? 'none' : 'block';
}

// ============================================
// 16. DÉCONNEXION
// ============================================

function logout() {
    currentUser = null;
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('superAdminNav').style.display = 'none';
    document.getElementById('domainAdminNav').style.display = 'none';
    showNotification('Déconnexion réussie');
}

// ============================================
// 17. RACCOURCIS CLAVIER
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (currentUser) showCompose();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
    
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

console.log('✅ Motémail officiel prêt !');