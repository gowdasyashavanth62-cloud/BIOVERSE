import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { ProgressBar, CircularProgress } from '../components/progress-bar.js';
import { StreakBadge } from '../components/stats.js';

export function render() {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  const progress = Store.getProgress();
  const pu1Progress = Store.getOverallProgress('pu1');
  const pu2Progress = Store.getOverallProgress('pu2');
  const results = Store.getTestResults();
  const pu1Chapters = Store.getAllChapters('pu1');
  const pu2Chapters = Store.getAllChapters('pu2');
  window.navigateTo = navigateTo;

  const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length) : 0;

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in">
          <h1>📈 My Progress</h1>
          <p class="text-muted">Track your learning journey</p>
        </div>

        <!-- Overview -->
        <div class="progress-overview animate-fade-in">
          <div class="progress-circle-card card">
            <h3>Overall Progress</h3>
            ${CircularProgress(Math.round((pu1Progress + pu2Progress) / 2), 140)}
          </div>
          <div class="progress-stats-col">
            <div class="card progress-stat-item">
              <i data-lucide="play-circle"></i>
              <div><strong>${progress.videosWatched?.length || 0}</strong><span>Videos Watched</span></div>
            </div>
            <div class="card progress-stat-item">
              <i data-lucide="file-text"></i>
              <div><strong>${progress.notesRead?.length || 0}</strong><span>Notes Read</span></div>
            </div>
            <div class="card progress-stat-item">
              <i data-lucide="clipboard-check"></i>
              <div><strong>${results.length}</strong><span>Tests Taken</span></div>
            </div>
            <div class="card progress-stat-item">
              <i data-lucide="target"></i>
              <div><strong>${avgScore}%</strong><span>Avg. Score</span></div>
            </div>
          </div>
          <div class="card progress-streak-card">
            ${StreakBadge(user?.streak || progress.streak || 0)}
            <p class="text-muted" style="margin-top:0.5rem;">Keep going!</p>
          </div>
        </div>

        <!-- Class-wise Progress -->
        <div class="progress-classes animate-fade-in">
          <div class="card">
            <h3>🌱 1st PU Biology</h3>
            ${ProgressBar(pu1Progress, { height: '10px' })}
            <div class="chapter-progress-list">
              ${pu1Chapters.map(ch => {
                const cp = Store.getChapterProgress(ch.id);
                return `
                  <div class="ch-progress-row" onclick="navigateTo('/chapter/${ch.id}')">
                    <span>${ch.icon || '📖'} ${ch.title}</span>
                    <div class="ch-progress-bar">${ProgressBar(cp.percentage, { height: '6px', showLabel: true })}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <div class="card">
            <h3>🧬 2nd PU Biology</h3>
            ${ProgressBar(pu2Progress, { height: '10px' })}
            <div class="chapter-progress-list">
              ${pu2Chapters.map(ch => {
                const cp = Store.getChapterProgress(ch.id);
                return `
                  <div class="ch-progress-row" onclick="navigateTo('/chapter/${ch.id}')">
                    <span>${ch.icon || '📖'} ${ch.title}</span>
                    <div class="ch-progress-bar">${ProgressBar(cp.percentage, { height: '6px', showLabel: true })}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Test History -->
        ${results.length > 0 ? `
        <section class="section animate-fade-in">
          <h2>📊 Test History</h2>
          <div class="table-responsive"><table class="table">
            <thead><tr><th>Test</th><th>Score</th><th>Accuracy</th><th>Time</th><th>Action</th></tr></thead>
            <tbody>
              ${results.slice().reverse().slice(0, 10).map(r => `
                <tr>
                  <td>${r.testTitle || 'Test'}</td>
                  <td>${r.correct}/${r.totalQuestions}</td>
                  <td><span class="badge badge-${r.accuracy >= 80 ? 'success' : r.accuracy >= 50 ? 'warning' : 'danger'}">${r.accuracy}%</span></td>
                  <td>${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s</td>
                  <td><button class="btn btn-sm btn-ghost" onclick="navigateTo('/test-result/${r.id}')">View</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table></div>
        </section>
        ` : ''}
      </main>
    </div>
  `;
  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
