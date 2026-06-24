import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { isPremium } from '../auth.js';
import { showToast } from '../components/toast.js';

export async function render() {
  const app = document.getElementById('app');
  const premium = isPremium();
  const tests = await Store.getTests();
  const chapterTests = tests.filter(t => t.type === 'chapter');
  const unitTests = tests.filter(t => t.type === 'unit');
  const mockTests = tests.filter(t => t.type === 'mock');
  const results = await Store.getTestResults();
  const allChapters = await Store.getAllChapters();
  window.navigateTo = navigateTo;

  window.showPremiumToastAndRedirect = () => {
    showToast('This evaluation is a Premium feature. Please upgrade to access.', 'warning');
    navigateTo('/pricing');
  };

  function testCard(t) {
    const attempted = results.some(r => r.testId === t.id);
    const lastResult = results.filter(r => r.testId === t.id).pop();
    const isLocked = !premium;

    return `
      <div class="test-card card hover-lift" style="${isLocked ? 'position:relative;' : ''}">
        <div class="test-card-header" style="${isLocked ? 'opacity: 0.6;' : ''}">
          <h4>${t.title} ${isLocked ? '🔒' : ''}</h4>
          <span class="badge badge-${t.type === 'mock' ? 'danger' : t.type === 'unit' ? 'warning' : 'primary'}">${t.type}</span>
        </div>
        <div class="test-meta" style="${isLocked ? 'opacity: 0.6;' : ''}">
          <span><i data-lucide="help-circle"></i> ${(t.questionIds || []).length} Qs</span>
          <span><i data-lucide="clock"></i> ${t.duration || 30} min</span>
        </div>
        ${attempted && lastResult && !isLocked ? `<div class="test-last-score"><span>Last score: <strong>${lastResult.accuracy}%</strong></span></div>` : ''}
        ${isLocked ? `
          <button class="btn btn-primary btn-block" onclick="showPremiumToastAndRedirect()">
            <i data-lucide="lock" style="width:14px; height:14px; display:inline-block; margin-right:4px;"></i> Unlock Test
          </button>
        ` : `
          <button class="btn ${attempted ? 'btn-outline' : 'btn-primary'} btn-block" onclick="navigateTo('/test/${t.id}')">
            ${attempted ? 'Retake' : 'Start Test'}
          </button>
        `}
      </div>
    `;
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in">
          <h1>📋 Tests</h1>
          <p class="text-muted">Chapter tests, unit tests, and full mock tests</p>
        </div>

        <!-- AI Custom Test Builder -->
        <div class="card mb-4 animate-fade-in" style="${!premium ? 'opacity: 0.85; position:relative;' : ''}">
          <div class="card-header">
            <h3 style="margin:0; display:flex; align-items:center; gap:8px;"><i data-lucide="bot" style="color:var(--primary); width:20px; height:20px;"></i> AI Custom Test Builder</h3>
          </div>
          <div class="card-body">
            <form id="ai-test-form" style="display:flex; gap:15px; flex-wrap:wrap; align-items:flex-end;">
              <div class="form-group" style="flex:1.5; min-width:200px; margin-bottom:0;">
                <label for="ai-test-chapter" style="font-weight:600;">Select Chapter</label>
                <select id="ai-test-chapter" class="form-control" style="background:rgba(30, 41, 59, 0.85); color:white; border: 1px solid rgba(255,255,255,0.1);">
                  ${allChapters.map(ch => `<option value="${ch.id}">${ch.title}</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="flex:1; min-width:140px; margin-bottom:0;">
                <label for="ai-test-difficulty" style="font-weight:600;">Difficulty</label>
                <select id="ai-test-difficulty" class="form-control" style="background:rgba(30, 41, 59, 0.85); color:white; border: 1px solid rgba(255,255,255,0.1);">
                  <option value="easy">Easy</option>
                  <option value="medium" selected>Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div class="form-group" style="flex:1; min-width:120px; margin-bottom:0;">
                <label for="ai-test-count" style="font-weight:600;">Questions</label>
                <select id="ai-test-count" class="form-control" style="background:rgba(30, 41, 59, 0.85); color:white; border: 1px solid rgba(255,255,255,0.1);">
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                </select>
              </div>
              <div style="flex:1; min-width:180px;">
                <button type="submit" class="btn btn-primary btn-block" style="display:flex; align-items:center; justify-content:center; gap:6px; padding:10px;">
                  <i data-lucide="sparkles" style="width:14px; height:14px;"></i> Generate AI Test
                </button>
              </div>
            </form>
          </div>
        </div>

        ${mockTests.length > 0 ? `
        <section class="section animate-fade-in">
          <h2>🔥 Mock Tests</h2>
          <div class="tests-grid">${mockTests.map(testCard).join('')}</div>
        </section>` : ''}

        ${unitTests.length > 0 ? `
        <section class="section animate-fade-in">
          <h2>📦 Unit Tests</h2>
          <div class="tests-grid">${unitTests.map(testCard).join('')}</div>
        </section>` : ''}

        ${chapterTests.length > 0 ? `
        <section class="section animate-fade-in">
          <h2>📖 Chapter Tests</h2>
          <div class="tests-grid">${chapterTests.map(testCard).join('')}</div>
        </section>` : ''}

        ${tests.length === 0 ? `
        <div class="empty-state card"><i data-lucide="clipboard-list"></i><h3>No Tests Available</h3><p>Tests will be added soon by your admin.</p></div>
        ` : ''}
      </main>
    </div>
  `;
  initNavbar(); initSidebar();
  
  // Custom test builder submit
  const aiTestForm = document.getElementById('ai-test-form');
  if (aiTestForm) {
    aiTestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!premium) {
        showPremiumToastAndRedirect();
        return;
      }
      const chId = document.getElementById('ai-test-chapter').value;
      const diff = document.getElementById('ai-test-difficulty').value;
      const count = parseInt(document.getElementById('ai-test-count').value, 10);
      
      const newTest = await Store.generateCustomTest(chId, diff, count);
      if (newTest) {
        showToast('Custom AI Test generated successfully!', 'success');
        navigateTo(`/test/${newTest.id}`);
      } else {
        showToast('Not enough questions available for this combination', 'warning');
      }
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}
