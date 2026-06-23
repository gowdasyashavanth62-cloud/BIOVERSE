import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, formatDate } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal, confirmModal } from '../../components/modal.js';

export function render() {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return;
  }
  const app = document.getElementById('app');
  window.navigateTo = navigateTo;
  renderPage();

  function renderPage() {
    const students = Store.getAllStudents();

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>👥 Manage Students</h1>
              <p class="text-muted">Monitor student activities, manage subscription levels, and moderate accounts</p>
            </div>
            <span class="badge badge-primary" style="font-size: 1rem; padding: 0.5rem 1rem;">${students.length} Students Total</span>
          </div>

          <div class="table-responsive animate-fade-in" style="margin-top: 1.5rem;">
            ${students.length === 0 ? `
              <div class="card p-4 text-center">
                <h3>No students registered yet</h3>
              </div>
            ` : `
            <table class="table admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Streak</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => {
                  let statusBadge = 'badge-success';
                  let statusText = 'Approved';
                  if (s.status === 'pending') {
                    statusBadge = 'badge-warning';
                    statusText = 'Pending';
                  } else if (s.status === 'suspended') {
                    statusBadge = 'badge-danger';
                    statusText = 'Suspended';
                  }

                  return `
                    <tr>
                      <td><strong>${s.name}</strong></td>
                      <td>${s.email}</td>
                      <td>${s.class || '1st PU'}</td>
                      <td>
                        <span class="badge ${statusBadge}">${statusText}</span>
                      </td>
                      <td>
                        <select class="form-select form-select-sm sub-toggle" data-uid="${s.id}" style="width:auto; padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                          <option value="free" ${s.subscription === 'free' ? 'selected' : ''}>Free</option>
                          <option value="premium" ${s.subscription === 'premium' ? 'selected' : ''}>Premium</option>
                        </select>
                      </td>
                      <td>🔥 ${s.streak || 0} days</td>
                      <td>${formatDate(s.createdAt)}</td>
                      <td>
                        <div style="display: flex; gap: 0.25rem;">
                          <button class="btn btn-sm btn-outline view-student" data-uid="${s.id}">View Details</button>
                          
                          ${s.status === 'pending' ? `
                            <button class="btn btn-sm btn-success approve-student" data-uid="${s.id}">Approve</button>
                          ` : `
                            <button class="btn btn-sm ${s.status === 'suspended' ? 'btn-success' : 'btn-warning'} toggle-suspend" data-uid="${s.id}">
                              ${s.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          `}
                          
                          <button class="btn btn-sm btn-danger delete-student" data-uid="${s.id}">Delete</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            `}
          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Toggle Subscription
    document.querySelectorAll('.sub-toggle').forEach(sel => {
      sel.addEventListener('change', () => {
        Store.updateStudentSubscription(sel.dataset.uid, sel.value);
        showToast(`Subscription plan updated to ${sel.value.toUpperCase()}`, 'success');
      });
    });

    // Approve Student
    document.querySelectorAll('.approve-student').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.approveStudent(btn.dataset.uid);
        showToast('Student account approved successfully', 'success');
        renderPage();
      });
    });

    // Toggle Suspend
    document.querySelectorAll('.toggle-suspend').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.dataset.uid;
        const targetStudent = Store.getAllStudents().find(s => s.id === uid);
        const actionWord = targetStudent?.status === 'suspended' ? 'activate' : 'suspend';
        
        Store.toggleStudentSuspension(uid);
        showToast(`Student account ${actionWord}d successfully`, 'success');
        renderPage();
      });
    });

    // Delete Student
    document.querySelectorAll('.delete-student').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = btn.dataset.uid;
        if (await confirmModal('Delete Student', 'This will permanently delete this student, their test records, and progress logs. Continue?')) {
          Store.deleteStudent(uid);
          showToast('Student deleted successfully', 'success');
          renderPage();
        }
      });
    });

    // View Student Details Modal
    document.querySelectorAll('.view-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.dataset.uid;
        openStudentDetailsModal(uid);
      });
    });
  }

  function openStudentDetailsModal(studentId) {
    const student = Store.getAllUsers().find(u => u.id === studentId);
    if (!student) return;

    const progress = Store.getProgress(studentId);
    const testResults = Store.getTestResultsForUser(studentId);
    const studentLogs = Store.getActivityLogs()
      .filter(log => log.userEmail === student.email)
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    openModal({
      title: `Student Profile: ${student.name}`,
      size: 'lg',
      content: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <strong>Email:</strong> ${student.email}<br>
            <strong>Phone:</strong> ${student.phone || 'N/A'}<br>
            <strong>Class:</strong> ${student.class || '1st PU'}
          </div>
          <div>
            <strong>Status:</strong> <span class="badge ${student.status === 'suspended' ? 'badge-danger' : student.status === 'pending' ? 'badge-warning' : 'badge-success'}">${student.status || 'Approved'}</span><br>
            <strong>Plan Level:</strong> <span class="badge badge-outline">${(student.subscription || 'free').toUpperCase()}</span><br>
            <strong>Current Streak:</strong> 🔥 ${student.streak || 0} days
          </div>
        </div>

        <!-- Progress Metrics -->
        <h3 style="margin-bottom: 1rem;">📊 Course Progress Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div class="card p-3 text-center" style="background: var(--bg-hover);">
            <div class="text-muted" style="font-size: 0.8rem; text-transform: uppercase;">Videos Watched</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-cyan);">${progress.videosWatched?.length || 0}</div>
          </div>
          <div class="card p-3 text-center" style="background: var(--bg-hover);">
            <div class="text-muted" style="font-size: 0.8rem; text-transform: uppercase;">Notes Read</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);">${progress.notesRead?.length || 0}</div>
          </div>
          <div class="card p-3 text-center" style="background: var(--bg-hover);">
            <div class="text-muted" style="font-size: 0.8rem; text-transform: uppercase;">Tests Completed</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-blue);">${progress.testsCompleted?.length || 0}</div>
          </div>
          <div class="card p-3 text-center" style="background: var(--bg-hover);">
            <div class="text-muted" style="font-size: 0.8rem; text-transform: uppercase;">Total XP</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-purple);">${progress.xp || 0} XP</div>
          </div>
        </div>

        <!-- Tabs inside Modal for Test History and Activity Logs -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <!-- Test Scores History -->
          <div>
            <h3 style="margin-bottom: 0.75rem;">📝 Test Scores History (${testResults.length})</h3>
            <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.5rem;">
              ${testResults.length === 0 ? `
                <p class="text-muted" style="padding: 1rem; text-align: center; margin: 0;">No tests attempted yet.</p>
              ` : `
                <table class="table admin-table" style="font-size: 0.85rem;">
                  <thead>
                    <tr>
                      <th>Test Title</th>
                      <th>Score</th>
                      <th>Accuracy</th>
                      <th>Time Taken</th>
                      <th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${testResults.map(r => `
                      <tr>
                        <td><strong>${r.testTitle}</strong></td>
                        <td>${r.score}/${r.totalQuestions}</td>
                        <td>
                          <span class="badge ${r.accuracy >= 70 ? 'badge-success' : r.accuracy >= 40 ? 'badge-warning' : 'badge-danger'}">
                            ${r.accuracy}%
                          </span>
                        </td>
                        <td>${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s</td>
                        <td>${new Date(r.completedAt).toLocaleDateString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `}
            </div>
          </div>

          <!-- Activity Timeline -->
          <div>
            <h3 style="margin-bottom: 0.75rem;">⏱️ Recent Activity Timeline</h3>
            <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem;">
              ${studentLogs.length === 0 ? `
                <p class="text-muted" style="text-align: center; margin: 0;">No logged actions. Last Active: ${student.lastActive ? new Date(student.lastActive).toLocaleString() : 'Never'}</p>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 1rem; border-left: 2px solid var(--border-color); padding-left: 1rem; margin-left: 0.5rem;">
                  ${studentLogs.map(log => `
                    <div style="position: relative;">
                      <div style="position: absolute; left: -1.45rem; top: 0.25rem; width: 10px; height: 10px; border-radius: 50%; background: var(--primary);"></div>
                      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.1rem;">
                        <span>${log.action}</span>
                        <span style="font-weight: normal; color: var(--text-muted); font-size: 0.75rem;">${new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p style="margin: 0; font-size: 0.8rem; color: var(--text-color);">${log.details || ''}</p>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      `,
      actions: [
        { label: 'Close Details', class: 'btn btn-primary', onClick: () => closeModal() }
      ]
    });
  }
}
