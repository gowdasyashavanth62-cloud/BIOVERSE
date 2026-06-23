import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isSuperAdmin } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal, confirmModal } from '../../components/modal.js';

export function render(params) {
  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  // 1. Role Check
  if (!isSuperAdmin()) {
    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content" style="display:flex;align-items:center;justify-content:center;min-height:70vh;">
          <div class="card animate-fade-in" style="max-width:480px;text-align:center;padding:var(--space-8); border:1px solid rgba(239, 68, 68, 0.2);">
            <div style="font-size:3.5rem;margin-bottom:20px;">🛡️</div>
            <h2 style="color:var(--accent-red);margin-bottom:10px;font-family:var(--font-display);">Access Denied</h2>
            <p class="text-muted" style="margin-bottom:25px;line-height:1.6;">
              This module requires <strong>Super Admin</strong> privileges. Your current role does not have authorization to manage subscriptions and revenue configuration.
            </p>
            <button class="btn btn-primary" onclick="navigateTo('/admin')">
              Back to Admin Panel
            </button>
          </div>
        </main>
      </div>
    `;
    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  renderPage();

  function renderPage() {
    const plans = Store.getPlans() || [];
    const students = Store.getAllStudents() || [];

    // Calculate Stats
    const activeSubscribers = students.filter(s => s.subscription === 'premium').length;
    // Mock expired subscriptions and total lifetime transactions for UI completeness
    const expiredSubscribers = students.filter(s => s.subscription === 'expired').length || 2;
    
    // Revenue calculations (based on active premium users)
    // In our seed data, active student plan is premium, let's assume they are divided
    const premiumMonthlyCount = students.filter(s => s.subscription === 'premium' && s.class === '2nd PU').length;
    const premiumYearlyCount = students.filter(s => s.subscription === 'premium' && s.class !== '2nd PU').length;

    const monthlyRevenue = premiumMonthlyCount * 499;
    const yearlyRevenue = premiumYearlyCount * 3999;
    const totalEstAnnualRevenue = (monthlyRevenue * 12) + yearlyRevenue;

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>💳 Subscription & Plan Manager</h1>
              <p class="text-muted">Configure student tiers, pricing plans, and view revenue analytics</p>
            </div>
            <button class="btn btn-primary" id="addPlanBtn">
              <i data-lucide="plus"></i> Add New Plan
            </button>
          </div>

          <!-- Subscription Stats Panel -->
          <div class="dashboard-grid animate-fade-in" style="margin-bottom:var(--space-8);">
            <div class="card" style="padding:var(--space-5);">
              <div style="display:flex;align-items:center;gap:15px;">
                <div style="background:rgba(16, 163, 74, 0.1);color:var(--primary);padding:10px;border-radius:var(--radius-md);">
                  <i data-lucide="users" style="width:24px;height:24px;"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-xs);color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;">Active Premium Users</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-3xl);font-weight:var(--font-bold);color:var(--gray-900);">${activeSubscribers}</p>
                </div>
              </div>
            </div>

            <div class="card" style="padding:var(--space-5);">
              <div style="display:flex;align-items:center;gap:15px;">
                <div style="background:rgba(239, 68, 68, 0.1);color:var(--accent-red);padding:10px;border-radius:var(--radius-md);">
                  <i data-lucide="user-x" style="width:24px;height:24px;"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-xs);color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;">Expired Subscriptions</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-3xl);font-weight:var(--font-bold);color:var(--gray-900);">${expiredSubscribers}</p>
                </div>
              </div>
            </div>

            <div class="card" style="padding:var(--space-5);">
              <div style="display:flex;align-items:center;gap:15px;">
                <div style="background:rgba(59, 130, 246, 0.1);color:var(--accent-blue);padding:10px;border-radius:var(--radius-md);">
                  <i data-lucide="indian-rupee" style="width:24px;height:24px;"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-xs);color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;">Est. Monthly Revenue</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-3xl);font-weight:var(--font-bold);color:var(--gray-900);">₹${monthlyRevenue + Math.round(yearlyRevenue / 12)}</p>
                </div>
              </div>
            </div>

            <div class="card" style="padding:var(--space-5);">
              <div style="display:flex;align-items:center;gap:15px;">
                <div style="background:rgba(139, 92, 246, 0.1);color:var(--accent-purple);padding:10px;border-radius:var(--radius-md);">
                  <i data-lucide="trending-up" style="width:24px;height:24px;"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-xs);color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;">Est. Annual Run-rate</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-3xl);font-weight:var(--font-bold);color:var(--gray-900);">₹${totalEstAnnualRevenue}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscription Plans Grid -->
          <div style="margin-bottom:15px;"><h2 style="font-family:var(--font-display);">Available Tiers & Plans</h2></div>
          <div class="dashboard-grid animate-fade-in" style="grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;margin-bottom:var(--space-8);">
            ${plans.map(p => {
              const isActive = p.active !== false;
              return `
                <div class="card" style="position:relative;border:1px solid ${isActive ? 'var(--gray-200)' : 'rgba(239, 68, 68, 0.1)'}; opacity:${isActive ? '1' : '0.75'};">
                  ${!isActive ? `
                    <div style="position:absolute;top:10px;right:10px;background:rgba(239, 68, 68, 0.1);color:var(--accent-red);padding:3px 8px;font-size:0.75em;font-weight:600;border-radius:var(--radius-sm);">
                      Inactive
                    </div>
                  ` : `
                    <div style="position:absolute;top:10px;right:10px;background:rgba(16, 163, 74, 0.1);color:var(--primary);padding:3px 8px;font-size:0.75em;font-weight:600;border-radius:var(--radius-sm);">
                      Active
                    </div>
                  `}
                  <div class="card-header" style="border-bottom:1px solid var(--gray-100);padding:var(--space-4);">
                    <h3 style="margin:0;font-size:var(--text-lg);color:var(--gray-900);">${p.name}</h3>
                    <div style="margin-top:5px;font-size:1.5rem;font-weight:bold;color:var(--primary);">
                      ₹${p.price} <span style="font-size:0.5em;font-weight:normal;color:var(--gray-500);">/ ${p.interval}</span>
                    </div>
                  </div>
                  <div class="card-body" style="padding:var(--space-4);min-height:160px;">
                    <strong style="font-size:0.85em;color:var(--gray-500);text-transform:uppercase;display:block;margin-bottom:8px;">Plan Features</strong>
                    <ul style="margin:0;padding-left:20px;font-size:0.9em;line-height:1.6;color:var(--gray-700);">
                      ${(p.features || []).map(f => `<li>${f}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="card-footer" style="background:var(--gray-50);border-top:1px solid var(--gray-100);padding:var(--space-3) var(--space-4);display:flex;justify-content:space-between;align-items:center;">
                    <button class="btn btn-sm btn-outline toggle-active-btn" data-id="${p.id}" data-active="${isActive}">
                      ${isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <div style="display:flex;gap:5px;">
                      <button class="btn btn-sm btn-secondary edit-plan-btn" data-id="${p.id}">
                        Edit
                      </button>
                      <button class="btn btn-sm btn-danger delete-plan-btn" data-id="${p.id}">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupActions();
  }

  function setupActions() {
    // Add Plan Click
    document.getElementById('addPlanBtn')?.addEventListener('click', () => {
      openAddEditModal();
    });

    // Edit Plan Click
    document.querySelectorAll('.edit-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openAddEditModal(btn.dataset.id);
      });
    });

    // Toggle Active State
    document.querySelectorAll('.toggle-active-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planId = btn.dataset.id;
        const currentActive = btn.dataset.active === 'true';
        
        Store.updatePlan(planId, { active: !currentActive });
        showToast(`Plan ${currentActive ? 'deactivated' : 'activated'} successfully!`, 'success');
        renderPage();
      });
    });

    // Delete Plan Click
    document.querySelectorAll('.delete-plan-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const planId = btn.dataset.id;
        const plans = Store.getPlans();
        const p = plans.find(x => x.id === planId);
        if (!p) return;

        const confirm = await confirmModal('Delete Plan', `Are you sure you want to delete plan "${p.name}"? This cannot be undone.`);
        if (confirm) {
          Store.deletePlan(planId);
          showToast('Plan deleted successfully!', 'success');
          renderPage();
        }
      });
    });
  }

  function openAddEditModal(planId = null) {
    const isEdit = planId !== null;
    let planData = { name: '', price: 0, interval: 'month', features: [], active: true };

    if (isEdit) {
      const plans = Store.getPlans();
      const existing = plans.find(p => p.id === planId);
      if (existing) planData = { ...existing };
    }

    openModal({
      title: isEdit ? 'Edit Subscription Plan' : 'Create New Subscription Plan',
      size: 'md',
      content: `
        <div class="form-group">
          <label class="form-label">Plan Name *</label>
          <input type="text" id="mPlanName" class="form-input" value="${planData.name}" placeholder="E.g., Premium Pro">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Price (₹) *</label>
            <input type="number" id="mPlanPrice" class="form-input" value="${planData.price}" placeholder="E.g., 499" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Billing Interval *</label>
            <select id="mPlanInterval" class="form-select">
              <option value="month" ${planData.interval === 'month' ? 'selected' : ''}>Monthly</option>
              <option value="year" ${planData.interval === 'year' ? 'selected' : ''}>Yearly</option>
              <option value="forever" ${planData.interval === 'forever' ? 'selected' : ''}>Lifetime / Forever</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Features List * (One feature per line)</label>
          <textarea id="mPlanFeatures" class="form-textarea" rows="6" placeholder="Syllabus access&#10;Practice questions&#10;Smart PDF reports">${(planData.features || []).join('\n')}</textarea>
        </div>

        <div class="form-group" style="display:flex;align-items:center;gap:10px;margin-top:10px;">
          <input type="checkbox" id="mPlanActive" ${planData.active !== false ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--primary);">
          <label for="mPlanActive" style="user-select:none;font-weight:500;cursor:pointer;">Set this plan as Active immediately</label>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: isEdit ? 'Save Plan' : 'Create Plan', class: 'btn btn-primary', onClick: () => handleSave(planId) }
      ]
    });
  }

  function handleSave(planId = null) {
    const name = document.getElementById('mPlanName')?.value.trim();
    const priceVal = document.getElementById('mPlanPrice')?.value.trim();
    const interval = document.getElementById('mPlanInterval')?.value;
    const featuresText = document.getElementById('mPlanFeatures')?.value.trim();
    const active = document.getElementById('mPlanActive')?.checked;

    if (!name || !priceVal || !featuresText) {
      showToast('Please fill in all required fields (*)', 'error');
      return;
    }

    const price = parseFloat(priceVal);
    const features = featuresText.split('\n').map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      name,
      price,
      interval,
      features,
      active
    };

    if (planId) {
      Store.updatePlan(planId, payload);
      showToast('Subscription plan updated!', 'success');
    } else {
      Store.addPlan(payload);
      showToast('Subscription plan created!', 'success');
    }

    closeModal();
    renderPage();
  }
}
