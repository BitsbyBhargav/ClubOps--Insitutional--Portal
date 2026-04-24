/* ============================================================
   ClubOps – Club Administration System
   js/script.js
   Supabase-ready frontend logic
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   SUPABASE CONFIG PLACEHOLDER
   Replace the values below and uncomment to enable Supabase.
   ──────────────────────────────────────────────────────────── */
// const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
// const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
// const { createClient } = supabase;
// const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ────────────────────────────────────────────────────────────
   MOCK DATA STORE
   Structure mirrors Supabase tables so swap is drop-in.
   ──────────────────────────────────────────────────────────── */
const MOCK_USERS = [
  { id: 'u1', name: 'Dr. Rohidas Sangore',   email: 'admin@clubops.edu',    password: 'admin123',   role: 'ADMIN',     club: null },
  { id: 'u2', name: 'Priya Sharma',       email: 'priya@clubops.edu',    password: 'club123',    role: 'CLUB_HEAD', club: 'Photography Club' },
  { id: 'u3', name: 'Aman Verma',         email: 'aman@clubops.edu',     password: 'club123',    role: 'CLUB_HEAD', club: 'Robotics Club' },
  { id: 'u4', name: 'Sneha Patel',        email: 'sneha@clubops.edu',    password: 'club123',    role: 'CLUB_HEAD', club: 'Cultural Committee' },
  { id: 'u5', name: 'Bhargav Sonawane',   email: 'bhargav@clubops.edu',    password: 'club123',    role: 'CLUB_HEAD', club: 'Google Gemini Student Club' },

];

const DEFAULT_EVENTS = [
  { id: 'e1', name: 'Annual Photography Exhibition', club: 'Photography Club', clubHeadId: 'u2', date: '2025-08-15', description: 'Showcase of best student photographs', status: 'approved',  createdAt: '2025-07-01' },
  { id: 'e2', name: 'Robotics Battle Royale',         club: 'Robotics Club',     clubHeadId: 'u3', date: '2025-09-10', description: 'Inter-college robotics competition', status: 'pending',   createdAt: '2025-07-05' },
  { id: 'e3', name: 'Cultural Night 2025',             club: 'Cultural Committee',clubHeadId: 'u4', date: '2025-10-05', description: 'Annual cultural celebration night',  status: 'pending',   createdAt: '2025-07-08' },
  { id: 'e4', name: 'Photography Workshop',            club: 'Photography Club',  clubHeadId: 'u2', date: '2025-08-20', description: 'Beginner photography techniques',    status: 'rejected',  createdAt: '2025-07-02' },
  { id: 'e5', name: 'AI & Robotics Seminar',           club: 'Robotics Club',     clubHeadId: 'u3', date: '2025-09-25', description: 'Guest lectures on AI topics',         status: 'approved',  createdAt: '2025-07-06' },
];

const DEFAULT_BUDGETS = [
  { id: 'b1', eventId: 'e1', eventName: 'Annual Photography Exhibition', club: 'Photography Club', clubHeadId: 'u2', amount: 25000, description: 'Printing, framing, venue setup',     status: 'approved', createdAt: '2025-07-02' },
  { id: 'b2', eventId: 'e2', eventName: 'Robotics Battle Royale',         club: 'Robotics Club',    clubHeadId: 'u3', amount: 80000, description: 'Robot parts, arena, trophies',       status: 'pending',  createdAt: '2025-07-06' },
  { id: 'b3', eventId: 'e3', eventName: 'Cultural Night 2025',             club: 'Cultural Committee',clubHeadId: 'u4',amount: 60000, description: 'Stage, sound, costumes, catering',  status: 'pending',  createdAt: '2025-07-09' },
  { id: 'b4', eventId: 'e5', eventName: 'AI & Robotics Seminar',           club: 'Robotics Club',    clubHeadId: 'u3', amount: 15000, description: 'Speaker fees, refreshments',         status: 'approved', createdAt: '2025-07-07' },
];

const DEFAULT_RESOURCES = [
  { id: 'r1', name: 'Auditorium A',   type: 'Venue',     eventId: 'e1', eventName: 'Annual Photography Exhibition', assignedAt: '2025-07-03' },
  { id: 'r2', name: 'Projector Set',  type: 'Equipment', eventId: 'e5', eventName: 'AI & Robotics Seminar',         assignedAt: '2025-07-08' },
  { id: 'r3', name: 'PA Sound System',type: 'Equipment', eventId: 'e1', eventName: 'Annual Photography Exhibition', assignedAt: '2025-07-03' },
];

/* ────────────────────────────────────────────────────────────
   DATA LAYER  (localStorage ↔ Supabase swap point)
   ──────────────────────────────────────────────────────────── */
const DB = {
  _get(key, def) {
    try { return JSON.parse(localStorage.getItem('clubops_' + key)) ?? def; }
    catch { return def; }
  },
  _set(key, val) { localStorage.setItem('clubops_' + key, JSON.stringify(val)); },

  getEvents()   { return this._get('events',   DEFAULT_EVENTS);   },
  getBudgets()  { return this._get('budgets',  DEFAULT_BUDGETS);  },
  getResources(){ return this._get('resources',DEFAULT_RESOURCES); },

  saveEvents(v)   { this._set('events',   v); },
  saveBudgets(v)  { this._set('budgets',  v); },
  saveResources(v){ this._set('resources',v); },

  addEvent(evt)     { const a = this.getEvents();    a.push(evt);    this.saveEvents(a);    },
  addBudget(b)      { const a = this.getBudgets();   a.push(b);      this.saveBudgets(a);   },
  addResource(r)    { const a = this.getResources(); a.push(r);      this.saveResources(a); },

  updateEventStatus(id, status) {
    const a = this.getEvents().map(e => e.id === id ? { ...e, status } : e);
    this.saveEvents(a);
  },
  updateBudgetStatus(id, status) {
    const a = this.getBudgets().map(b => b.id === id ? { ...b, status } : b);
    this.saveBudgets(a);
  },

  /* ── Supabase equivalents (uncomment & fill when ready) ──
  async getEventsRemote() {
    const { data, error } = await sb.from('events').select('*');
    if (error) throw error; return data;
  },
  async updateEventStatusRemote(id, status) {
    const { error } = await sb.from('events').update({ status }).eq('id', id);
    if (error) throw error;
  },
  ─────────────────────────────────────────────────────────── */
};

/* ────────────────────────────────────────────────────────────
   SESSION / AUTH
   ──────────────────────────────────────────────────────────── */
const Auth = {
  login(email, password) {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) return null;
    sessionStorage.setItem('clubops_session', JSON.stringify({ ...user, password: undefined }));
    return user;
  },
  logout() {
    sessionStorage.removeItem('clubops_session');
    window.location.href = 'index.html';
  },
  current() {
    try { return JSON.parse(sessionStorage.getItem('clubops_session')); }
    catch { return null; }
  },
  require(role) {
    const u = this.current();
    if (!u) { window.location.href = 'index.html'; return null; }
    if (role && u.role !== role) {
      window.location.href = u.role === 'ADMIN' ? 'admin.html' : 'clubhead.html';
      return null;
    }
    return u;
  }
};

/* ────────────────────────────────────────────────────────────
   UTILITIES
   ──────────────────────────────────────────────────────────── */
function genId(prefix) { return prefix + Date.now() + Math.random().toString(36).slice(2, 6); }
function fmtDate(d)    { if (!d) return '—'; return new Date(d + 'T00:00').toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function fmtCurrency(n){ return '₹' + Number(n).toLocaleString('en-IN'); }
function initials(name){ return name?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?'; }

function badge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

/* ── Toast ── */
function toast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

/* ── Sidebar toggle ── */
function initSidebar() {
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.querySelector('.sidebar-overlay');
  const hamburger = document.querySelector('.hamburger');
  if (!sidebar) return;
  const close = () => { sidebar.classList.remove('open'); overlay && (overlay.style.display = 'none'); };
  hamburger?.addEventListener('click', () => {
    sidebar.classList.add('open');
    if (overlay) overlay.style.display = 'block';
  });
  overlay?.addEventListener('click', close);
}

/* ── Active nav ── */
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

/* ── Populate sidebar user info ── */
function populateSidebarUser(user) {
  const av = document.querySelector('.sidebar-avatar');
  const nm = document.querySelector('.user-name');
  const rl = document.querySelector('.user-role');
  if (av) av.textContent = initials(user.name);
  if (nm) nm.textContent = user.name;
  if (rl) rl.textContent = user.role === 'ADMIN' ? 'Administrator' : 'Club Head';
}

/* ────────────────────────────────────────────────────────────
   PAGE: LOGIN  (index.html)
   ──────────────────────────────────────────────────────────── */
function initLogin() {
  let selectedRole = 'ADMIN';

  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role;
    });
  });

  document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errEl    = document.getElementById('login-error');

    const user = Auth.login(email, password);
    if (!user) {
      errEl.textContent = 'Invalid credentials. Please try again.';
      errEl.classList.add('show');
      return;
    }
    if (user.role !== selectedRole) {
      errEl.textContent = `This account is not a ${selectedRole.replace('_', ' ')}. Please select the correct role.`;
      errEl.classList.add('show');
      return;
    }
    errEl.classList.remove('show');
    toast('Login successful! Redirecting…', 'success');
    setTimeout(() => {
      window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'clubhead.html';
    }, 700);
  });
}

/* ────────────────────────────────────────────────────────────
   PAGE: ADMIN DASHBOARD  (admin.html)
   ──────────────────────────────────────────────────────────── */
function initAdminDashboard() {
  const user = Auth.require('ADMIN'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('admin-dashboard');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  refreshAdminDashboard();
  initResourceAllocation();
}

function refreshAdminDashboard() {
  const events  = DB.getEvents();
  const budgets = DB.getBudgets();

  const total    = events.length;
  const approved = events.filter(e => e.status === 'approved').length;
  const pending  = events.filter(e => e.status === 'pending').length;
  const totalBudget = budgets.filter(b => b.status === 'approved').reduce((s, b) => s + b.amount, 0);

  setEl('stat-total',    total);
  setEl('stat-approved', approved);
  setEl('stat-pending',  pending);
  setEl('stat-budget',   fmtCurrency(totalBudget));

  /* Approved events list */
  renderEventList('approved-events-list', events.filter(e => e.status === 'approved').slice(0, 5));
  /* Pending requests */
  renderPendingTable('pending-requests-table', events.filter(e => e.status === 'pending'));
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderEventList(containerId, evts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!evts.length) { el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No events here yet.</p></div>`; return; }
  el.innerHTML = evts.map(e => `
    <div class="resource-item">
      <div class="resource-icon">🗓️</div>
      <div class="resource-info">
        <div class="resource-name">${e.name}</div>
        <div class="resource-meta">${e.club} · ${fmtDate(e.date)}</div>
      </div>
      ${badge(e.status)}
    </div>`).join('');
}

function renderPendingTable(containerId, evts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!evts.length) { el.innerHTML = `<div class="empty-state"><div class="empty-icon">✅</div><p>All caught up! No pending requests.</p></div>`; return; }
  el.innerHTML = `
    <div class="table-wrap">
    <table>
      <thead><tr><th>Event</th><th>Club</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        ${evts.map(e => `
          <tr>
            <td><strong>${e.name}</strong></td>
            <td>${e.club}</td>
            <td>${fmtDate(e.date)}</td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm btn-success" onclick="approveEvent('${e.id}')">✔ Approve</button>
                <button class="btn btn-sm btn-danger"  onclick="rejectEvent('${e.id}')">✖ Reject</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table></div>`;
}

window.approveEvent = function(id) {
  DB.updateEventStatus(id, 'approved');
  toast('Event approved!', 'success');
  if (typeof refreshAdminDashboard === 'function') refreshAdminDashboard();
  if (typeof refreshEventRegistry  === 'function') refreshEventRegistry();
};
window.rejectEvent = function(id) {
  DB.updateEventStatus(id, 'rejected');
  toast('Event rejected.', 'error');
  if (typeof refreshAdminDashboard === 'function') refreshAdminDashboard();
  if (typeof refreshEventRegistry  === 'function') refreshEventRegistry();
};
window.approveBudget = function(id) {
  DB.updateBudgetStatus(id, 'approved');
  toast('Budget approved!', 'success');
  if (typeof refreshBudgetPage === 'function') refreshBudgetPage();
};
window.rejectBudget = function(id) {
  DB.updateBudgetStatus(id, 'rejected');
  toast('Budget rejected.', 'error');
  if (typeof refreshBudgetPage === 'function') refreshBudgetPage();
};

/* ── Resource Allocation Panel ── */
function initResourceAllocation() {
  refreshResourceList();

  document.getElementById('resource-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('res-name').value.trim();
    const type    = document.getElementById('res-type').value;
    const eventId = document.getElementById('res-event').value;
    if (!name || !eventId) { toast('Please fill all fields.', 'error'); return; }
    const events  = DB.getEvents();
    const evt     = events.find(ev => ev.id === eventId);
    DB.addResource({ id: genId('r'), name, type, eventId, eventName: evt?.name || '', assignedAt: new Date().toISOString().split('T')[0] });
    toast(`Resource "${name}" allocated!`, 'success');
    this.reset();
    refreshResourceList();
  });

  /* Populate event dropdown */
  const sel = document.getElementById('res-event');
  if (sel) {
    const approved = DB.getEvents().filter(e => e.status === 'approved');
    sel.innerHTML = `<option value="">— Select Event —</option>` + approved.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }
}

function refreshResourceList() {
  const el = document.getElementById('resource-list');
  if (!el) return;
  const resources = DB.getResources();
  if (!resources.length) { el.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><p>No resources allocated yet.</p></div>`; return; }
  const icons = { Venue: '🏛️', Equipment: '🎛️', Staff: '👤', Transport: '🚌', Other: '📦' };
  el.innerHTML = resources.map(r => `
    <div class="resource-item">
      <div class="resource-icon">${icons[r.type] || '📦'}</div>
      <div class="resource-info">
        <div class="resource-name">${r.name} <span class="text-sm text-muted">(${r.type})</span></div>
        <div class="resource-meta">${r.eventName} · Assigned ${fmtDate(r.assignedAt)}</div>
      </div>
    </div>`).join('');
}

/* ────────────────────────────────────────────────────────────
   PAGE: EVENT REGISTRY  (events.html)
   ──────────────────────────────────────────────────────────── */
function initEventRegistry() {
  const user = Auth.require('ADMIN'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('event-registry');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
  refreshEventRegistry();

  /* Filter */
  document.getElementById('status-filter')?.addEventListener('change', refreshEventRegistry);
  document.getElementById('search-events')?.addEventListener('input', refreshEventRegistry);
}

function refreshEventRegistry() {
  const events  = DB.getEvents();
  const filter  = document.getElementById('status-filter')?.value || 'all';
  const search  = document.getElementById('search-events')?.value.toLowerCase() || '';

  const filtered = events
    .filter(e => filter === 'all' || e.status === filter)
    .filter(e => e.name.toLowerCase().includes(search) || e.club.toLowerCase().includes(search));

  const tbody = document.getElementById('events-tbody');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🔍</div><p>No events match your filter.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td><strong>${e.name}</strong></td>
      <td>${e.club}</td>
      <td>${fmtDate(e.date)}</td>
      <td>${badge(e.status)}</td>
      <td>
        <div class="btn-group">
          ${e.status !== 'approved' ? `<button class="btn btn-sm btn-success" onclick="approveEvent('${e.id}')">✔ Approve</button>` : ''}
          ${e.status !== 'rejected' ? `<button class="btn btn-sm btn-danger"  onclick="rejectEvent('${e.id}')">✖ Reject</button>` : ''}
          ${e.status === 'rejected' || e.status === 'approved' ? '' : ''}
        </div>
      </td>
    </tr>`).join('');

  /* Update count badges */
  setEl('total-count',    events.length);
  setEl('pending-count',  events.filter(e=>e.status==='pending').length);
  setEl('approved-count', events.filter(e=>e.status==='approved').length);
  setEl('rejected-count', events.filter(e=>e.status==='rejected').length);
}

/* ────────────────────────────────────────────────────────────
   PAGE: BUDGET APPROVAL  (budget.html)
   ──────────────────────────────────────────────────────────── */
function initBudgetPage() {
  const user = Auth.require('ADMIN'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('budget-approval');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
  refreshBudgetPage();
  document.getElementById('budget-filter')?.addEventListener('change', refreshBudgetPage);
}

function refreshBudgetPage() {
  const budgets = DB.getBudgets();
  const filter  = document.getElementById('budget-filter')?.value || 'all';
  const filtered = budgets.filter(b => filter === 'all' || b.status === filter);

  /* Summary */
  const totalReq  = budgets.reduce((s,b) => s+b.amount, 0);
  const totalAppr = budgets.filter(b=>b.status==='approved').reduce((s,b)=>s+b.amount,0);
  const pending   = budgets.filter(b=>b.status==='pending').length;
  setEl('budget-total-req',  fmtCurrency(totalReq));
  setEl('budget-total-appr', fmtCurrency(totalAppr));
  setEl('budget-pending',    pending);

  const tbody = document.getElementById('budget-tbody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">💰</div><p>No budget requests found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td><strong>${b.eventName}</strong></td>
      <td>${b.club}</td>
      <td>${fmtCurrency(b.amount)}</td>
      <td class="text-sm text-muted">${b.description}</td>
      <td>${badge(b.status)}</td>
      <td>
        <div class="btn-group">
          ${b.status==='pending' ? `<button class="btn btn-sm btn-success" onclick="approveBudget('${b.id}')">✔ Approve</button>` : ''}
          ${b.status==='pending' ? `<button class="btn btn-sm btn-danger"  onclick="rejectBudget('${b.id}')">✖ Reject</button>` : ''}
          ${b.status!=='pending' ? `<span class="text-muted text-sm">—</span>` : ''}
        </div>
      </td>
    </tr>`).join('');
}

/* ────────────────────────────────────────────────────────────
   PAGE: ADMIN PROFILE  (admin_profile.html)
   ──────────────────────────────────────────────────────────── */
function initAdminProfile() {
  const user = Auth.require('ADMIN'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('admin-profile');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  setEl('profile-initials', initials(user.name));
  setEl('profile-name',     user.name);
  setEl('profile-email',    user.email);
  setEl('profile-role',     'Administrator');
  const ra = document.getElementById('profile-role-badge');
  if (ra) ra.textContent = 'Administrator';
  document.getElementById('logout-profile-btn')?.addEventListener('click', () => Auth.logout());
}

/* ────────────────────────────────────────────────────────────
   PAGE: CLUB HEAD DASHBOARD  (clubhead.html)
   ──────────────────────────────────────────────────────────── */
function initClubDashboard() {
  const user = Auth.require('CLUB_HEAD'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('ch-dashboard');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
  setEl('club-name-heading', user.club);
  setEl('topbar-club', user.club);

  const myEvents  = DB.getEvents().filter(e => e.clubHeadId === user.id);
  const myBudgets = DB.getBudgets().filter(b => b.clubHeadId === user.id);

  setEl('my-total-events',    myEvents.length);
  setEl('my-approved-events', myEvents.filter(e=>e.status==='approved').length);
  setEl('my-pending-events',  myEvents.filter(e=>e.status==='pending').length);
  setEl('my-budget-approved', fmtCurrency(myBudgets.filter(b=>b.status==='approved').reduce((s,b)=>s+b.amount,0)));

  /* Recent submitted events */
  const el = document.getElementById('my-events-list');
  if (el) {
    if (!myEvents.length) { el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No events submitted yet.</p></div>`; }
    else el.innerHTML = myEvents.slice(0,4).map(e => `
      <div class="resource-item">
        <div class="resource-icon">🗓️</div>
        <div class="resource-info">
          <div class="resource-name">${e.name}</div>
          <div class="resource-meta">${fmtDate(e.date)}</div>
        </div>
        ${badge(e.status)}
      </div>`).join('');
  }

  /* Budget status */
  const bl = document.getElementById('my-budgets-list');
  if (bl) {
    if (!myBudgets.length) { bl.innerHTML = `<div class="empty-state"><div class="empty-icon">💰</div><p>No budget requests yet.</p></div>`; }
    else bl.innerHTML = myBudgets.slice(0,3).map(b => `
      <div class="resource-item">
        <div class="resource-icon">💵</div>
        <div class="resource-info">
          <div class="resource-name">${b.eventName}</div>
          <div class="resource-meta">${fmtCurrency(b.amount)}</div>
        </div>
        ${badge(b.status)}
      </div>`).join('');
  }
}

/* ────────────────────────────────────────────────────────────
   PAGE: EVENT PROPOSAL  (inside clubhead.html tabs or separate)
   ──────────────────────────────────────────────────────────── */
function initEventProposal() {
  const user = Auth.require('CLUB_HEAD'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('ch-propose-event');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  document.getElementById('event-proposal-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('ep-name').value.trim();
    const desc = document.getElementById('ep-desc').value.trim();
    const date = document.getElementById('ep-date').value;
    if (!name || !date) { toast('Please fill all required fields.', 'error'); return; }

    const newEvent = {
      id: genId('e'), name, description: desc, date,
      club: user.club, clubHeadId: user.id,
      status: 'pending', createdAt: new Date().toISOString().split('T')[0]
    };
    DB.addEvent(newEvent);
    toast('Event proposal submitted successfully!', 'success');
    this.reset();
    setEl('proposal-status', 'pending');
    document.getElementById('proposal-result')?.classList.remove('hidden');
  });
}

/* ────────────────────────────────────────────────────────────
   PAGE: BUDGET PROPOSAL  (clubhead_budget.html or tab)
   ──────────────────────────────────────────────────────────── */
function initBudgetProposal() {
  const user = Auth.require('CLUB_HEAD'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('ch-budget');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  /* Populate event dropdown with this club's approved events */
  const sel = document.getElementById('bp-event');
  if (sel) {
    const myEvents = DB.getEvents().filter(e => e.clubHeadId === user.id && e.status === 'approved');
    sel.innerHTML = `<option value="">— Select an approved event —</option>` +
      myEvents.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }

  document.getElementById('budget-proposal-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const eventId = document.getElementById('bp-event').value;
    const amount  = parseFloat(document.getElementById('bp-amount').value);
    const desc    = document.getElementById('bp-desc').value.trim();
    if (!eventId || !amount || !desc) { toast('Please fill all required fields.', 'error'); return; }

    const events  = DB.getEvents();
    const evt     = events.find(ev => ev.id === eventId);
    DB.addBudget({
      id: genId('b'), eventId, eventName: evt?.name || '',
      club: user.club, clubHeadId: user.id,
      amount, description: desc, status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    });
    toast('Budget request submitted!', 'success');
    this.reset();
  });
}

/* ────────────────────────────────────────────────────────────
   PAGE: SUBMISSION TRACKING  (submissions.html)
   ──────────────────────────────────────────────────────────── */
function initSubmissionTracking() {
  const user = Auth.require('CLUB_HEAD'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('ch-submissions');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  const myEvents  = DB.getEvents().filter(e => e.clubHeadId === user.id);
  const myBudgets = DB.getBudgets().filter(b => b.clubHeadId === user.id);

  /* Events table */
  const et = document.getElementById('submissions-events-tbody');
  if (et) {
    if (!myEvents.length) et.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📋</div><p>No events submitted yet.</p></div></td></tr>`;
    else et.innerHTML = myEvents.map(e => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td>${fmtDate(e.date)}</td>
        <td>${fmtDate(e.createdAt)}</td>
        <td>${badge(e.status)}</td>
      </tr>`).join('');
  }

  /* Budgets table */
  const bt = document.getElementById('submissions-budgets-tbody');
  if (bt) {
    if (!myBudgets.length) bt.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">💰</div><p>No budget requests submitted yet.</p></div></td></tr>`;
    else bt.innerHTML = myBudgets.map(b => `
      <tr>
        <td><strong>${b.eventName}</strong></td>
        <td>${fmtCurrency(b.amount)}</td>
        <td>${fmtDate(b.createdAt)}</td>
        <td>${badge(b.status)}</td>
      </tr>`).join('');
  }
}

/* ────────────────────────────────────────────────────────────
   PAGE: CLUB HEAD PROFILE  (clubhead_profile.html)
   ──────────────────────────────────────────────────────────── */
function initClubHeadProfile() {
  const user = Auth.require('CLUB_HEAD'); if (!user) return;
  populateSidebarUser(user);
  setActiveNav('ch-profile');
  initSidebar();
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

  setEl('profile-initials', initials(user.name));
  setEl('profile-name',     user.name);
  setEl('profile-email',    user.email);
  setEl('profile-club',     user.club);
  setEl('profile-role',     'Club Head');
  const ra = document.getElementById('profile-role-badge');
  if (ra) ra.textContent = 'Club Head';
  document.getElementById('logout-profile-btn')?.addEventListener('click', () => Auth.logout());
}

/* ────────────────────────────────────────────────────────────
   SUPABASE API HELPER  (ready to use — uncomment when sb is set up)
   ──────────────────────────────────────────────────────────── */
/*
const API = {
  async getEvents() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/events?select=*`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    return res.json();
  },
  async updateEvent(id, data) {
    return fetch(`${SUPABASE_URL}/rest/v1/events?id=eq.${id}`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(data)
    });
  },
  async insertEvent(data) {
    return fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(data)
    });
  }
};
*/

/* ────────────────────────────────────────────────────────────
   AUTO-INIT  based on current page
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const init = {
    'login':              initLogin,
    'admin-dashboard':    initAdminDashboard,
    'event-registry':     initEventRegistry,
    'budget-approval':    initBudgetPage,
    'admin-profile':      initAdminProfile,
    'ch-dashboard':       initClubDashboard,
    'ch-propose-event':   initEventProposal,
    'ch-budget':          initBudgetProposal,
    'ch-submissions':     initSubmissionTracking,
    'ch-profile':         initClubHeadProfile,
  };
  init[page]?.();
});
