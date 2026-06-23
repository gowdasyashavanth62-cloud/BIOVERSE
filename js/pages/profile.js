import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { getUserInitials, getAvatarColor, formatDate } from '../auth.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { renderAchievementBadge, renderPremiumTierBadge } from '../components/badges.js';

export function render() {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  const progress = Store.getProgress();
  const xp = user.xp || progress.xp || 0;
  const studyHours = user.studyHours || Math.round((progress.videosWatched?.length || 0) * 0.5) || 0;
  const streak = user.streak || progress.streak || 0;
  const videosWatchedCount = progress.videosWatched?.length || 0;
  const notesReadCount = progress.notesRead?.length || 0;

  // Mock Achievements
  const achievements = [
    { id: 'first_login', title: 'First Steps', icon: '<i data-lucide="footprints"></i>', date: user.createdAt },
    { id: 'streak_3', title: '3-Day Streak', icon: '<i data-lucide="flame"></i>', date: streak >= 3 ? Date.now() : null },
    { id: 'vid_10', title: 'Avid Watcher (10 Videos)', icon: '<i data-lucide="video"></i>', date: videosWatchedCount >= 10 ? Date.now() : null },
    { id: 'notes_5', title: 'Bookworm (5 Notes)', icon: '<i data-lucide="book-open"></i>', date: notesReadCount >= 5 ? Date.now() : null },
    { id: 'xp_500', title: 'XP Master (500 XP)', icon: '<i data-lucide="star"></i>', date: xp >= 500 ? Date.now() : null }
  ];

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
          <h1>👤 My Profile</h1>
          <p>Manage your account, view your statistics, and check out your unlocked badges.</p>
        </div>

        <div class="profile-layout animate-fade-in">
          <!-- Profile Card -->
          <div class="profile-card card" style="text-align:center;">
            <div class="profile-avatar" style="background:${getAvatarColor(user.name)}; margin: 0 auto;">
              ${getUserInitials(user.name)}
            </div>
            <h2>${user.name}</h2>
            <p class="text-muted">${user.email}</p>
            <div class="profile-badges flex-row justify-center gap-sm mt-sm">
              <span class="badge badge-primary">${user.class || 'Student'}</span>
              ${renderPremiumTierBadge(user.subscription || 'free')}
            </div>
            <p class="text-muted" style="margin-top:1rem;">Member since ${formatDate(user.createdAt)}</p>
            ${user.subscription !== 'premium' ? `<button class="btn btn-primary btn-block" style="margin-top:1rem;" onclick="navigateTo('/pricing')">Upgrade to Premium</button>` : ''}
          </div>

          <!-- Edit Profile & Stats -->
          <div class="profile-forms" style="display:flex; flex-direction:column; gap:1.5rem;">
            
            <!-- Statistics Card -->
            <div class="card bg-surface">
              <h3><i data-lucide="bar-chart-2"></i> Study Statistics</h3>
              <div class="flex-row gap-md justify-between mt-sm" style="flex-wrap:wrap;">
                <div class="stat-item flex-col align-center p-md rounded border" style="flex:1; background:var(--background-color);">
                  <strong class="text-xl text-amber">${xp}</strong>
                  <span class="text-sm text-muted">Total XP</span>
                </div>
                <div class="stat-item flex-col align-center p-md rounded border" style="flex:1; background:var(--background-color);">
                  <strong class="text-xl text-orange">${streak}</strong>
                  <span class="text-sm text-muted">Day Streak</span>
                </div>
                <div class="stat-item flex-col align-center p-md rounded border" style="flex:1; background:var(--background-color);">
                  <strong class="text-xl text-blue">${studyHours}</strong>
                  <span class="text-sm text-muted">Study Hours</span>
                </div>
              </div>
            </div>

            <!-- Achievements Card -->
            <div class="card bg-surface">
              <h3><i data-lucide="award"></i> Achievements</h3>
              <div class="achievements-grid mt-sm" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:1rem;">
                ${achievements.map(ach => renderAchievementBadge(ach.id, ach.title, ach.icon, ach.date)).join('')}
              </div>
            </div>

            <div class="card">
              <h3>Edit Profile</h3>
              <form id="profileForm">
                <div class="form-group">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-input" id="profileName" value="${user.name}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-input" id="profilePhone" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Class</label>
                  <select class="form-select" id="profileClass">
                    <option value="1st PU" ${user.class === '1st PU' ? 'selected' : ''}>1st PU</option>
                    <option value="2nd PU" ${user.class === '2nd PU' ? 'selected' : ''}>2nd PU</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>

            <div class="card">
              <h3>Change Password</h3>
              <form id="passwordForm">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input type="password" class="form-input" id="currentPass" required>
                </div>
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input type="password" class="form-input" id="newPass" required minlength="6">
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <input type="password" class="form-input" id="confirmPass" required>
                </div>
                <button type="submit" class="btn btn-secondary">Update Password</button>
              </form>
            </div>

            <div class="card">
              <h3>Account Actions</h3>
              <div class="account-actions">
                <button class="btn btn-outline btn-block" id="logoutBtn"><i data-lucide="log-out"></i> Logout</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    Store.updateProfile({
      name: document.getElementById('profileName').value,
      phone: document.getElementById('profilePhone').value,
      class: document.getElementById('profileClass').value
    });
    showToast('Profile updated!', 'success');
  });

  document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('newPass').value;
    if (newPass !== document.getElementById('confirmPass').value) {
      showToast('Passwords do not match', 'error');
      return;
    }
    const result = Store.changePassword(document.getElementById('currentPass').value, newPass);
    if (result.error) { showToast(result.error, 'error'); return; }
    showToast('Password changed!', 'success');
    document.getElementById('passwordForm').reset();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    Store.logout();
    navigateTo('/');
    showToast('Logged out', 'info');
  });
}
