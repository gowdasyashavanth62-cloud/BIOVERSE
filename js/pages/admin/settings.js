import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isSuperAdmin, formatDate } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';

export function render(params) {
  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  // 1. Role verification
  const currentUser = Store.getCurrentUser();
  if (!isSuperAdmin()) {
    const userEmail = currentUser ? currentUser.email : 'Anonymous';
    const userRole = currentUser ? currentUser.role : 'Guest';
    
    Store.logActivity(
      'Security Alert: Unauthorized Settings Access', 
      `User ${userEmail} (role: ${userRole}) attempted to access System Settings.`
    );

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content" style="display:flex;align-items:center;justify-content:center;min-height:70vh;">
          <div class="card animate-fade-in" style="max-width:480px;text-align:center;padding:var(--space-8); border:1px solid rgba(239, 68, 68, 0.2);">
            <div style="font-size:3.5rem;margin-bottom:20px;">🚨</div>
            <h2 style="color:var(--accent-red);margin-bottom:10px;font-family:var(--font-display);">Security Warning</h2>
            <p class="text-muted" style="margin-bottom:25px;line-height:1.6;">
              Access to System Settings and Security Audit Trail is restricted to <strong>Super Admins</strong>. 
              This unauthorized access attempt has been logged in the security audit trail.
            </p>
            <button class="btn btn-primary" onclick="navigateTo('/admin')">Back to Admin Panel</button>
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
    const logs = Store.getActivityLogs() || [];
    const announcements = Store.getAnnouncements() || [];
    const coupons = Store.getCoupons() || [];
    const testimonials = Store.getTestimonials() || [];
    const paymentSet = Store.getPaymentSettings();
    const plans = Store.getPlans();
    
    const monthlyPlan = plans.find(p => p.id === 'plan_monthly') || { price: 299 };
    const yearlyPlan = plans.find(p => p.id === 'plan_yearly') || { price: 2499 };

    // Sort descending
    const sortedLogs = logs.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const sortedAnnouncements = announcements.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>⚙️ Global Console Settings</h1>
              <p class="text-muted">Broadcast announcements, moderate testimonials, edit subscription packages, and audit logs.</p>
            </div>
          </div>

          <!-- Tabs menu for settings -->
          <div class="chapter-tabs animate-fade-in" id="settingsConsoleTabs" style="margin-bottom:1.5rem;">
            <button class="tab-item active" data-tab="ann-logs">📣 Announcements & Audit</button>
            <button class="tab-item" data-tab="payments">💳 Payments Setup</button>
            <button class="tab-item" data-tab="plans">💎 Subscription Tiers</button>
            <button class="tab-item" data-tab="coupons">🎟️ Promo Coupons</button>
            <button class="tab-item" data-tab="testimonials">⭐ Testimonials Moderation</button>
          </div>

          <div class="chapter-content">
            
            <!-- ANNOUNCEMENTS & SECURITY AUDIT PANEL -->
            <div class="tab-panel active" id="panel-ann-logs">
              <div class="admin-grid" style="margin-bottom:2rem; align-items:start;">
                <!-- Announcement Form -->
                <div class="card">
                  <div class="card-header" style="border-bottom:1px solid var(--gray-100);">
                    <h3>📢 Broadcast Announcement</h3>
                  </div>
                  <div class="card-body" style="padding:var(--space-5);">
                    <form id="announcementForm" style="display:flex;flex-direction:column;gap:15px;">
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Announcement Title *</label>
                        <input type="text" id="annTitle" class="form-input" placeholder="Enter headline or title" required>
                      </div>
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Content / Body *</label>
                        <textarea id="annContent" class="form-textarea" rows="3" placeholder="Enter details..." required></textarea>
                      </div>
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Broadcast Channels</label>
                        <div style="display:flex;gap:20px;margin-top:5px;">
                          <label style="display:flex;align-items:center;gap:8px;font-size:0.9em;cursor:pointer;user-select:none;">
                            <input type="checkbox" id="chanInApp" checked style="width:16px;height:16px;accent-color:var(--primary);">
                            <span>In-app Notification</span>
                          </label>
                          <label style="display:flex;align-items:center;gap:8px;font-size:0.9em;cursor:pointer;user-select:none;">
                            <input type="checkbox" id="chanEmail" style="width:16px;height:16px;accent-color:var(--primary);">
                            <span>Email Broadcast</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary" style="align-self:flex-start;display:flex;align-items:center;gap:8px;">
                        <i data-lucide="send" style="width:16px;height:16px;"></i> Broadcast
                      </button>
                    </form>
                  </div>
                </div>

                <!-- Recent announcements list -->
                <div class="card">
                  <div class="card-header" style="border-bottom:1px solid var(--gray-100);">
                    <h3>Recent Announcements</h3>
                  </div>
                  <div class="card-body" style="padding:var(--space-4); max-height:280px; overflow-y:auto;">
                    ${sortedAnnouncements.length === 0 ? `
                      <p class="text-muted text-center" style="padding:40px 0;">No announcements sent yet.</p>
                    ` : `
                      <div class="activity-list">
                        ${sortedAnnouncements.map(ann => `
                          <div class="activity-item" style="padding:10px 0;align-items:start;">
                            <div class="activity-icon" style="background:var(--primary-50);color:var(--primary);">
                              <i data-lucide="bell" style="width:16px;height:16px;"></i>
                            </div>
                            <div class="activity-info">
                              <strong style="font-size:0.95em;">${ann.title}</strong>
                              <p style="margin:4px 0; font-size:0.85em; color:var(--gray-600); line-height:1.4;">${ann.content}</p>
                            </div>
                            <span class="text-muted" style="font-size:0.75em;white-space:nowrap;margin-left:10px;">
                              ${new Date(ann.timestamp).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}
                            </span>
                          </div>
                        `).join('')}
                      </div>
                    `}
                  </div>
                </div>
              </div>

              <!-- Security Audit Trail -->
              <div style="margin-bottom:10px;"><h2 style="font-family:var(--font-display);">🛡️ Security Audit Trail</h2></div>
              <div class="admin-table-container standalone">
                <div class="admin-table-responsive" style="max-height:300px; overflow-y:auto;">
                  <table class="table admin-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${sortedLogs.length === 0 ? `
                        <tr><td colspan="5" style="text-align:center;padding:40px;" class="text-muted">No activity found.</td></tr>
                      ` : sortedLogs.map(log => {
                        const dateObj = new Date(log.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('en-IN', {day:'numeric', month:'short'}) + ' ' + 
                                              dateObj.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
                        
                        let roleBadge = 'badge-ghost';
                        if (log.userRole === 'admin' || log.userRole === 'super_admin') roleBadge = 'badge-danger';
                        else if (log.userRole === 'content_manager') roleBadge = 'badge-primary';
                        else if (log.userRole === 'teacher') roleBadge = 'badge-warning';

                        const isWarning = log.action.toLowerCase().includes('warning') || log.action.toLowerCase().includes('security');

                        return `
                          <tr ${isWarning ? 'style="background:rgba(239, 68, 68, 0.03);"' : ''}>
                            <td style="font-size:0.8em;white-space:nowrap;">${formattedDate}</td>
                            <td style="font-weight:600; font-size:0.88rem;">${log.userEmail}</td>
                            <td><span class="badge ${roleBadge}" style="font-size:0.75em;text-transform:capitalize;">${log.userRole}</span></td>
                            <td><span style="font-weight:600; color:${isWarning ? 'var(--accent-red)' : 'var(--gray-900)'};">${log.action}</span></td>
                            <td style="font-size:0.85em;max-width:250px;">${log.details || ''}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- PAYMENTS SETUP TAB -->
            <div class="tab-panel" id="panel-payments">
              <div class="card p-lg" style="max-width:600px;">
                <h3 style="margin-bottom:1.2rem;"><i data-lucide="credit-card" class="text-primary"></i> Payment Gateway Setup (Razorpay)</h3>
                <form id="paymentSettingsForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Razorpay Key ID</label>
                    <input type="text" class="form-input" id="setPayKeyId" value="${paymentSet.keyId || ''}" required placeholder="rzp_test_...">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Razorpay Key Secret</label>
                    <input type="password" class="form-input" id="setPayKeySecret" value="${paymentSet.keySecret || ''}" required placeholder="••••••••••••••">
                  </div>
                  <div style="display:flex; align-items:center; gap:8px; margin-top:0.5rem;">
                    <input type="checkbox" id="setPayLiveMode" ${paymentSet.liveMode ? 'checked' : ''} style="width:16px; height:16px; accent-color:var(--primary);">
                    <label for="setPayLiveMode" style="font-size:0.9rem; font-weight:600; cursor:pointer;">Enable Live Mode (Checkout Real Payments)</label>
                  </div>
                  <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Save Configs</button>
                </form>
              </div>
            </div>

            <!-- SUBSCRIPTION TIERS TAB -->
            <div class="tab-panel" id="panel-plans">
              <div class="card p-lg" style="max-width:600px;">
                <h3 style="margin-bottom:1.2rem;"><i data-lucide="crown" class="text-primary"></i> Subscription Pricing Plans</h3>
                <form id="plansSettingsForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Premium Monthly Plan Price (INR) *</label>
                    <input type="number" class="form-input" id="setPriceMonthly" value="${monthlyPlan.price}" required min="0">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Premium Yearly Plan Price (INR) *</label>
                    <input type="number" class="form-input" id="setPriceYearly" value="${yearlyPlan.price}" required min="0">
                  </div>
                  <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Update Plan Prices</button>
                </form>
              </div>
            </div>

            <!-- PROMO COUPONS TAB -->
            <div class="tab-panel" id="panel-coupons">
              <div class="admin-grid" style="align-items:start; gap:2rem;">
                <!-- Add Coupon Form -->
                <div class="card p-lg">
                  <h3 style="margin-bottom:1.2rem;"><i data-lucide="tag" class="text-primary"></i> Create Promo Coupon</h3>
                  <form id="addCouponForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label">Coupon Code (Alphanumeric)</label>
                      <input type="text" class="form-input" id="newCpnCode" required placeholder="e.g. BIO50" style="text-transform:uppercase;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Discount Type</label>
                        <select class="form-select" id="newCpnType">
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Discount Value</label>
                        <input type="number" class="form-input" id="newCpnVal" required min="1">
                      </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Usage Limit (Total)</label>
                        <input type="number" class="form-input" id="newCpnLimit" placeholder="No limit" min="1">
                      </div>
                      <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Expiry Date</label>
                        <input type="date" class="form-input" id="newCpnExpiry" required>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Create Coupon</button>
                  </form>
                </div>

                <!-- Coupons list -->
                <div class="card p-lg">
                  <h3 style="margin-bottom:1.2rem;">Active Coupons</h3>
                  <div class="admin-table-responsive" style="max-height:350px; overflow-y:auto;">
                    <table class="table admin-table" style="font-size:0.85rem;">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Expiry</th>
                          <th>Used</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${coupons.length === 0 ? `
                          <tr><td colspan="6" style="text-align:center; padding:30px;" class="text-muted">No coupons found.</td></tr>
                        ` : coupons.map(c => `
                          <tr>
                            <td class="cell-bold">${c.code}</td>
                            <td>${c.type === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                            <td style="font-weight:600;">${c.type === 'percentage' ? c.value + '%' : '₹' + c.value}</td>
                            <td>${c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN', {day:'numeric', month:'short'}) : '—'}</td>
                            <td>${c.usedCount} / ${c.usageLimit || '∞'}</td>
                            <td>
                              <button class="btn btn-sm btn-ghost delete-cpn-btn" data-cpn-id="${c.id}" style="color:var(--accent-red); padding:3px 8px;">Delete</button>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- TESTIMONIALS MODERATION TAB -->
            <div class="tab-panel" id="panel-testimonials">
              <div class="card p-lg">
                <h3 style="margin-bottom:1.2rem;"><i data-lucide="star" class="text-primary"></i> Testimonials Moderation Queue</h3>
                
                <div class="admin-table-responsive">
                  <table class="table admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Rating</th>
                        <th>Review Text</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${testimonials.length === 0 ? `
                        <tr><td colspan="6" style="text-align:center; padding:40px;" class="text-muted">No testimonials submitted yet.</td></tr>
                      ` : testimonials.slice().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(t => `
                        <tr>
                          <td style="font-size:0.85rem; white-space:nowrap;">${new Date(t.timestamp).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</td>
                          <td>
                            <strong>${t.studentName}</strong>
                            <div class="text-muted" style="font-size:0.75rem;">${t.email}</div>
                          </td>
                          <td style="color:var(--accent-amber); font-weight:700;">${'⭐'.repeat(t.rating)}</td>
                          <td style="font-size:0.85rem; max-width:300px;" title="${t.content}">${t.content}</td>
                          <td>
                            <span class="badge ${t.status === 'approved' ? 'badge-success' : 'badge-warning'}">
                              ${t.status}
                            </span>
                          </td>
                          <td>
                            <div style="display:flex; gap:6px;">
                              ${t.status === 'pending' ? `
                                <button class="btn btn-sm approve-tst-btn" data-tst-id="${t.id}" style="background:var(--success); color:white; padding:3px 8px;">Approve</button>
                              ` : ''}
                              <button class="btn btn-sm btn-ghost delete-tst-btn" data-tst-id="${t.id}" style="color:var(--accent-red); padding:3px 8px;">Delete</button>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupSettingsTabs();
    setupAnnouncementForm();
    setupPaymentForm();
    setupPlansForm();
    setupCouponsForm();
    setupTestimonialsActions();
  }

  function setupSettingsTabs() {
    const tabs = document.querySelectorAll('#settingsConsoleTabs .tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const panel = document.getElementById('panel-' + tab.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function setupAnnouncementForm() {
    const form = document.getElementById('announcementForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('annTitle').value.trim();
      const content = document.getElementById('annContent').value.trim();
      const chanInApp = document.getElementById('chanInApp').checked;
      const chanEmail = document.getElementById('chanEmail').checked;

      const channels = [];
      if (chanInApp) channels.push('in-app');
      if (chanEmail) channels.push('email');

      if (channels.length === 0) {
        showToast('Please select at least one broadcast channel.', 'error');
        return;
      }

      Store.sendAnnouncement(title, content, channels);
      showToast('Announcement broadcasted successfully!', 'success');
      renderPage();
    });
  }

  function setupPaymentForm() {
    const form = document.getElementById('paymentSettingsForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyId = document.getElementById('setPayKeyId').value.trim();
      const keySecret = document.getElementById('setPayKeySecret').value.trim();
      const liveMode = document.getElementById('setPayLiveMode').checked;

      Store.savePaymentSettings({ keyId, keySecret, liveMode });
      showToast('Razorpay Gateway setup keys updated!', 'success');
      renderPage();
    });
  }

  function setupPlansForm() {
    const form = document.getElementById('plansSettingsForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const priceMonthly = parseFloat(document.getElementById('setPriceMonthly').value);
      const priceYearly = parseFloat(document.getElementById('setPriceYearly').value);

      Store.updatePlan('plan_monthly', { price: priceMonthly });
      Store.updatePlan('plan_yearly', { price: priceYearly });
      
      showToast('Package subscription pricing tiers updated!', 'success');
      renderPage();
    });
  }

  function setupCouponsForm() {
    const form = document.getElementById('addCouponForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('newCpnCode').value.trim().toUpperCase();
      const type = document.getElementById('newCpnType').value;
      const value = parseFloat(document.getElementById('newCpnVal').value);
      const usageLimit = document.getElementById('newCpnLimit').value ? parseInt(document.getElementById('newCpnLimit').value) : null;
      const expiryDate = document.getElementById('newCpnExpiry').value;

      const newCoupon = Store.addCoupon({ code, type, value, usageLimit, expiryDate });
      if (newCoupon) {
        showToast(`Coupon ${code} created successfully!`, 'success');
        renderPage();
      }
    });

    document.querySelectorAll('.delete-cpn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cpnId;
        if (confirm('Are you sure you want to delete this coupon?')) {
          Store.deleteCoupon(id);
          showToast('Coupon deleted', 'warning');
          renderPage();
        }
      });
    });
  }

  function setupTestimonialsActions() {
    document.querySelectorAll('.approve-tst-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tstId;
        Store.approveTestimonial(id);
        showToast('Testimonial approved & published!', 'success');
        renderPage();
      });
    });

    document.querySelectorAll('.delete-tst-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tstId;
        if (confirm('Delete this testimonial entry?')) {
          Store.deleteTestimonial(id);
          showToast('Testimonial deleted', 'warning');
          renderPage();
        }
      });
    });
  }
}
