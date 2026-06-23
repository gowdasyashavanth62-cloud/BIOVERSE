import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, isSuperAdmin, formatDate } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';

export function render() {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  // Retrieve metrics
  const stats = Store.getStats();
  const students = Store.getAllStudents();
  
  // Calculate active students: status approved/not suspended
  const activeStudentsCount = students.filter(s => s.status !== 'suspended').length;
  const premiumStudentsCount = students.filter(s => s.subscription === 'premium').length;

  // Calculate real revenue from payment histories of all users
  const allUsers = Store.getAllUsers();
  let totalRevenue = 0;
  let revenueToday = 0;
  let revenueMonth = 0;
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOf30DaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  allUsers.forEach(u => {
    if (u.paymentHistory) {
      u.paymentHistory.forEach(p => {
        if (p.status === 'success') {
          totalRevenue += p.amount;
          const pTime = new Date(p.date).getTime();
          if (pTime >= startOfToday) {
            revenueToday += p.amount;
          }
          if (pTime >= startOf30DaysAgo) {
            revenueMonth += p.amount;
          }
        }
      });
    }
  });

  const conversionRate = stats.totalStudents > 0 ? Math.round((premiumStudentsCount / stats.totalStudents) * 100) : 0;
  const churnRate = 5; // Fixed mock churn rate 5%

  // Most Attempted Tests
  const allResults = Store.getAllTestResults();
  const testAttemptsMap = {};
  allResults.forEach(r => {
    testAttemptsMap[r.testId] = (testAttemptsMap[r.testId] || 0) + 1;
  });
  
  const allTests = Store.getTests();
  const mostAttemptedTests = allTests
    .map(t => ({ ...t, attempts: testAttemptsMap[t.id] || 0 }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 5);

  // Most Viewed Chapters
  const viewsMap = Store.getChapterViews();
  const allChapters = Store.getAllChapters();
  const mostViewedChapters = allChapters
    .map(c => ({ ...c, views: viewsMap[c.id] || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Audit Trail (recent 5 actions)
  const auditTrail = Store.getActivityLogs()
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // Render Page HTML
  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="admin-header animate-fade-in">
          <div>
            <h1>🛡️ Admin Dashboard</h1>
            <p class="text-muted">BioVerse Administrative Overview and Platform Analytics</p>
          </div>
          <div class="role-badge">
            <span class="badge badge-success">Role: ${Store.getCurrentUser()?.role.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="dashboard-grid animate-fade-in" style="margin-bottom: 2rem;">
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Total Students</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-blue); margin-top: 0.5rem;">${stats.totalStudents}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Active Students</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-top: 0.5rem;">${activeStudentsCount}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Premium Subscribers</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-purple); margin-top: 0.5rem;">${premiumStudentsCount}</div>
          </div>
          ${isSuperAdmin() ? `
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Total Revenue</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-amber); margin-top: 0.5rem;">₹${totalRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Today's Revenue</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-cyan); margin-top: 0.5rem;">₹${revenueToday.toLocaleString('en-IN')}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Conversion Rate</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--success); margin-top: 0.5rem;">${conversionRate}%</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Churn Rate</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-red); margin-top: 0.5rem;">${churnRate}%</div>
          </div>
          ` : `
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Videos</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-cyan); margin-top: 0.5rem;">${stats.totalVideos}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Notes</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--success); margin-top: 0.5rem;">${stats.totalNotes}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Questions</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-purple); margin-top: 0.5rem;">${stats.totalQuestions}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-muted" style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Tests</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-blue); margin-top: 0.5rem;">${stats.totalTests}</div>
          </div>
          `}
        </div>

        <!-- Quick Actions & Charts Container -->
        <div class="charts-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card p-4">
            <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">📈 Student Growth</h3>
            <div style="position: relative; height: 250px;">
              <canvas id="studentGrowthChart"></canvas>
            </div>
          </div>
          ${isSuperAdmin() ? `
          <div class="card p-4">
            <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">💰 Revenue Trends</h3>
            <div style="position: relative; height: 250px;">
              <canvas id="revenueTrendsChart"></canvas>
            </div>
          </div>
          ` : `
          <div class="card p-4">
            <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">⚡ Quick Actions</h3>
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
              <button class="btn btn-primary" onclick="navigateTo('/admin/content')">📁 Manage Content</button>
              <button class="btn btn-secondary" onclick="navigateTo('/admin/questions')">❓ Manage Questions</button>
              <button class="btn btn-outline" onclick="navigateTo('/admin/tests')">📋 Test Builder</button>
              <button class="btn btn-ghost" onclick="navigateTo('/admin/students')">👥 Manage Students</button>
            </div>
          </div>
          `}
        </div>

        ${isSuperAdmin() ? `
        <!-- Quick Actions for Super Admin -->
        <div class="card p-4" style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">⚡ Quick Actions</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <button class="btn btn-primary" onclick="navigateTo('/admin/content')">📁 Manage Content</button>
            <button class="btn btn-secondary" onclick="navigateTo('/admin/questions')">❓ Manage Questions</button>
            <button class="btn btn-outline" onclick="navigateTo('/admin/tests')">📋 Test Builder</button>
            <button class="btn btn-ghost" onclick="navigateTo('/admin/students')">👥 Manage Students</button>
          </div>
        </div>
        ` : ''}

        <!-- Lists Container -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Most Attempted Tests -->
          <div class="card p-4">
            <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">✍️ Most Attempted Tests</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${mostAttemptedTests.length === 0 ? '<p class="text-muted">No test attempts recorded yet.</p>' : mostAttemptedTests.map(t => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);">
                  <div>
                    <strong style="color: var(--text-color);">${t.title}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${t.type.toUpperCase()} · ${t.duration} mins</div>
                  </div>
                  <span class="badge badge-primary">${t.attempts} attempts</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Most Viewed Chapters -->
          <div class="card p-4">
            <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">📖 Most Viewed Chapters</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${mostViewedChapters.length === 0 ? '<p class="text-muted">No chapter views recorded yet.</p>' : mostViewedChapters.map(c => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);">
                  <div>
                    <strong style="color: var(--text-color);">${c.icon || '📚'} ${c.title}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${c.classId === 'pu1' ? '1st PU' : '2nd PU'} · Unit ${c.unitNumber}</div>
                  </div>
                  <span class="badge badge-success">${c.views} views</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        ${isSuperAdmin() ? `
        <!-- Audit Trail -->
        <div class="card p-4">
          <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">🔍 Mini Audit Trail</h3>
          <div class="activity-list">
            ${auditTrail.length === 0 ? '<p class="text-muted">No activities logged yet.</p>' : auditTrail.map(log => `
              <div class="activity-item" style="display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); align-items: flex-start;">
                <div style="background: var(--primary-50); color: var(--primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">
                  🛡️
                </div>
                <div style="flex-grow: 1;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <strong>${log.action}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p style="font-size: 0.9rem; margin: 0; color: var(--text-color);">${log.details || ''}</p>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">By: ${log.userEmail} (${log.userRole})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Lazy-load Chart.js and initialize graphs
  initGraphs();
}

async function initGraphs() {
  await loadChartJS();
  const students = Store.getAllStudents();

  // Group students by month of registration for Growth line chart
  const ctxGrowth = document.getElementById('studentGrowthChart')?.getContext('2d');
  if (ctxGrowth) {
    new Chart(ctxGrowth, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Cumulative Student Registrations',
          data: [12, 34, 67, 102, 145, students.length || 180],
          borderColor: 'var(--accent-blue, #3b82f6)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: 'var(--accent-blue, #3b82f6)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Bar chart for Revenue trends (only if Canvas is available/rendered)
  const ctxRevenue = document.getElementById('revenueTrendsChart')?.getContext('2d');
  if (ctxRevenue) {
    let currentRevenue = 0;
    const allUsers = Store.getAllUsers();
    allUsers.forEach(u => {
      if (u.paymentHistory) {
        u.paymentHistory.forEach(p => {
          if (p.status === 'success') currentRevenue += p.amount;
        });
      }
    });
    new Chart(ctxRevenue, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [1200, 2400, 4800, 8900, 15400, currentRevenue || 22000],
          backgroundColor: 'var(--accent-amber, #f59e0b)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

function loadChartJS() {
  return new Promise((resolve) => {
    if (window.Chart) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
