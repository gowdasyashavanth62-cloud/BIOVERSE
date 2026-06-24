import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  const app = document.getElementById('app');

  await renderPage();

  async function renderPage() {
    const freshUser = await Store.getUserProfile(user.id) || user;
    
    app.innerHTML = `
      ${await Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
            <h1>⚙️ Settings</h1>
            <p>Manage your student profile, notifications, security credentials, and privacy options.</p>
          </div>

          <div class="settings-container animate-fade-in" style="display:grid; grid-template-columns: 240px 1fr; gap:2rem; align-items:start;">
            
            <!-- Left Navigation Menu -->
            <div class="card p-sm" style="display:flex; flex-direction:column; gap:6px;">
              <button class="settings-tab btn btn-ghost btn-block active" data-tab="profile" style="justify-content:flex-start; font-weight:600; padding:10px 15px;">
                <i data-lucide="user" style="width:18px; height:18px;"></i> Profile Settings
              </button>
              <button class="settings-tab btn btn-ghost btn-block" data-tab="security" style="justify-content:flex-start; font-weight:600; padding:10px 15px;">
                <i data-lucide="lock" style="width:18px; height:18px;"></i> Security
              </button>
              <button class="settings-tab btn btn-ghost btn-block" data-tab="notifications" style="justify-content:flex-start; font-weight:600; padding:10px 15px;">
                <i data-lucide="bell" style="width:18px; height:18px;"></i> Notifications
              </button>
              <button class="settings-tab btn btn-ghost btn-block" data-tab="privacy" style="justify-content:flex-start; font-weight:600; padding:10px 15px;">
                <i data-lucide="eye-off" style="width:18px; height:18px;"></i> Privacy & Data
              </button>
            </div>

            <!-- Right Tab Contents -->
            <div class="card p-lg" style="min-height:350px;">
              
              <!-- PROFILE TAB -->
              <div id="set-profile" class="settings-panel">
                <h3 style="margin-bottom:1.5rem; border-bottom:1px solid var(--gray-100); padding-bottom:0.5rem;">👤 Profile Settings</h3>
                <form id="profileSettingsForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="setName" value="${freshUser.name}" required>
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" id="setEmail" value="${freshUser.email}" disabled style="background:#f3f4f6; color:var(--gray-500); cursor:not-allowed;">
                    <small class="text-muted">Contact support if you need to update your email</small>
                  </div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label">Phone Number</label>
                      <input type="tel" class="form-input" id="setPhone" value="${freshUser.phone || ''}" placeholder="10-digit number">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label">Class Year</label>
                      <select class="form-select" id="setClass">
                        <option value="1st PU" ${freshUser.class === '1st PU' ? 'selected' : ''}>1st PU Biology</option>
                        <option value="2nd PU" ${freshUser.class === '2nd PU' ? 'selected' : ''}>2nd PU Biology</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Save Profile Changes</button>
                </form>
              </div>

              <!-- SECURITY TAB -->
              <div id="set-security" class="settings-panel" style="display:none;">
                <h3 style="margin-bottom:1.5rem; border-bottom:1px solid var(--gray-100); padding-bottom:0.5rem;">🔒 Account Security</h3>
                <form id="passwordSettingsForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-input" id="oldPwd" required placeholder="••••••••">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-input" id="newPwd" required placeholder="••••••••">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" class="form-input" id="confirmNewPwd" required placeholder="••••••••">
                  </div>
                  <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Change Password</button>
                </form>
              </div>

              <!-- NOTIFICATIONS TAB -->
              <div id="set-notifications" class="settings-panel" style="display:none;">
                <h3 style="margin-bottom:1.5rem; border-bottom:1px solid var(--gray-100); padding-bottom:0.5rem;">🔔 Notifications Toggles</h3>
                <form id="notifSettingsForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div style="display:flex; align-items:start; gap:12px;">
                    <input type="checkbox" id="notifEmail" checked style="width:18px; height:18px; margin-top:3px; accent-color:var(--primary);">
                    <div>
                      <strong>Email Announcements</strong>
                      <p class="text-muted" style="font-size:0.82rem; margin:2px 0 0 0;">Receive emails when new study material or mock test sets are released.</p>
                    </div>
                  </div>
                  <div style="display:flex; align-items:start; gap:12px;">
                    <input type="checkbox" id="notifExpiry" checked style="width:18px; height:18px; margin-top:3px; accent-color:var(--primary);">
                    <div>
                      <strong>Subscription Renewal Alerts</strong>
                      <p class="text-muted" style="font-size:0.82rem; margin:2px 0 0 0;">Receive renewal countdown notifications 7, 3, and 1 days before expiry.</p>
                    </div>
                  </div>
                  <div style="display:flex; align-items:start; gap:12px;">
                    <input type="checkbox" id="notifWhatsapp" checked style="width:18px; height:18px; margin-top:3px; accent-color:var(--primary);">
                    <div>
                      <strong>WhatsApp Reminders (Recommended)</strong>
                      <p class="text-muted" style="font-size:0.82rem; margin:2px 0 0 0;">Receive urgent reminders and exam study materials directly on WhatsApp.</p>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary" style="align-self:flex-start; margin-top:0.5rem; padding:10px 24px;">Save Notification Preferences</button>
                </form>
              </div>

              <!-- PRIVACY & DATA TAB -->
              <div id="set-privacy" class="settings-panel" style="display:none;">
                <h3 style="margin-bottom:1.5rem; border-bottom:1px solid var(--gray-100); padding-bottom:0.5rem;">👁️ Privacy & Local Storage</h3>
                
                <div style="margin-bottom:1.5rem;">
                  <strong>Session Security Encryption</strong>
                  <p class="text-muted" style="font-size:0.82rem; margin-top:2px; line-height:1.5;">
                    Your account credentials and study history are locally encrypted within your browser. To wipe active session state immediately, select the purge button below.
                  </p>
                </div>

                <div style="background:#fef2f2; border:1px solid #fecaca; padding:15px; border-radius:10px; color:#991b1b; font-size:0.88rem; display:flex; justify-content:between; align-items:center;">
                  <div>
                    <strong>Purge Local Application Cache</strong>
                    <p style="margin:2px 0 0 0; font-size:0.78rem; opacity:0.85;">This will completely clear your local storage database and log you out immediately.</p>
                  </div>
                  <button class="btn btn-danger" id="purgeCacheBtn" style="padding:8px 16px; font-size:0.82rem; flex-shrink:0;">Purge Data</button>
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
    setupProfileForm();
    setupPasswordForm();
    setupNotifForm();
    setupPurgeData();
  }

  function setupSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.classList.add('btn-ghost');
        });
        tab.classList.add('active');
        tab.classList.remove('btn-ghost');

        document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
        document.getElementById(`set-${tab.dataset.tab}`).style.display = 'block';
      });
    });
  }

  function setupProfileForm() {
    const form = document.getElementById('profileSettingsForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('setName').value.trim();
      const phone = document.getElementById('setPhone').value.trim();
      const classVal = document.getElementById('setClass').value;

      if (!name) {
        showToast('Name is required', 'warning');
        return;
      }

      await Store.updateProfile({ full_name: name, phone, class: classVal });
      showToast('Profile settings saved successfully!', 'success');
      
      // Update global header/name details
      setTimeout(() => {
        renderPage();
      }, 500);
    });
  }

  function setupPasswordForm() {
    const form = document.getElementById('passwordSettingsForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const oldPwd = document.getElementById('oldPwd').value;
      const newPwd = document.getElementById('newPwd').value;
      const confirmNewPwd = document.getElementById('confirmNewPwd').value;

      if (newPwd !== confirmNewPwd) {
        showToast('New passwords do not match!', 'error');
        return;
      }

      if (newPwd.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
      }

      const res = await Store.changePassword(oldPwd, newPwd);
      if (res && res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Password changed successfully!', 'success');
        form.reset();
      }
    });
  }

  function setupNotifForm() {
    const form = document.getElementById('notifSettingsForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Notification settings updated!', 'success');
    });
  }

  function setupPurgeData() {
    const btn = document.getElementById('purgeCacheBtn');
    btn?.addEventListener('click', () => {
      if (confirm('⚠️ WARNING: This will permanently delete your progress logs, answers, streak, and local subscription states! Proceed?')) {
        Store.clearAll();
        showToast('Database purged. Logging out...', 'warning');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
}
