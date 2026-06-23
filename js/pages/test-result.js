import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { formatTime } from '../auth.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { CircularProgress } from '../components/progress-bar.js';

export function render(params) {
  const app = document.getElementById('app');
  const result = Store.getTestResult(params.resultId);
  if (!result) { navigateTo('/tests'); return; }
  const test = Store.getTest(result.testId);
  window.navigateTo = navigateTo;

  const scoreColor = result.accuracy >= 80 ? 'var(--success)' : result.accuracy >= 50 ? 'var(--warning)' : 'var(--error)';
  const scoreEmoji = result.accuracy >= 80 ? '🎉' : result.accuracy >= 50 ? '👍' : '💪';
  const scoreMsg = result.accuracy >= 80 ? 'Excellent! Great job!' : result.accuracy >= 50 ? 'Good effort! Keep practicing.' : 'Don\'t worry, keep learning!';

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="result-hero animate-fade-in">
          <span class="result-emoji">${scoreEmoji}</span>
          <h1>Test Result</h1>
          <p class="text-muted">${result.testTitle || 'Test'}</p>
        </div>

        <div class="result-score-section animate-fade-in">
          <div class="result-circle">
            ${CircularProgress(result.accuracy, 160)}
          </div>
          <div class="result-score-info">
            <h2 style="color:${scoreColor}">${result.score}/${result.totalQuestions}</h2>
            <p>${scoreMsg}</p>
          </div>
        </div>

        <div class="result-stats-grid animate-fade-in">
          <div class="result-stat card">
            <div class="result-stat-icon" style="background:var(--primary-50);color:var(--primary)"><i data-lucide="check-circle"></i></div>
            <div class="result-stat-value">${result.correct}</div>
            <div class="result-stat-label">Correct</div>
          </div>
          <div class="result-stat card">
            <div class="result-stat-icon" style="background:#fef2f2;color:var(--error)"><i data-lucide="x-circle"></i></div>
            <div class="result-stat-value">${result.wrong}</div>
            <div class="result-stat-label">Wrong</div>
          </div>
          <div class="result-stat card">
            <div class="result-stat-icon" style="background:#fffbeb;color:var(--warning)"><i data-lucide="minus-circle"></i></div>
            <div class="result-stat-value">${result.unattempted}</div>
            <div class="result-stat-label">Unattempted</div>
          </div>
          <div class="result-stat card">
            <div class="result-stat-icon" style="background:#eff6ff;color:var(--accent-blue)"><i data-lucide="clock"></i></div>
            <div class="result-stat-value">${formatTime(result.timeTaken)}</div>
            <div class="result-stat-label">Time Taken</div>
          </div>
        </div>

        <!-- Answer Review -->
        ${test && test.questions ? `
        <section class="section animate-fade-in">
          <h2>📝 Answer Review</h2>
          <div class="answer-review-list">
            ${test.questions.map((q, i) => {
              const ans = result.answers[q.id] || {};
              const statusClass = ans.status === 'correct' ? 'review-correct' : ans.status === 'wrong' ? 'review-wrong' : 'review-unattempted';
              return `
                <div class="review-item card ${statusClass}">
                  <div class="review-header">
                    <span class="question-number">Q${i + 1}</span>
                    <span class="badge badge-${ans.status === 'correct' ? 'success' : ans.status === 'wrong' ? 'danger' : 'warning'}">
                      ${ans.status === 'correct' ? '✓ Correct' : ans.status === 'wrong' ? '✗ Wrong' : '— Skipped'}
                    </span>
                  </div>
                  <p class="question-text">${q.question}</p>
                  <div class="review-options">
                    ${q.options.map((opt, oi) => {
                      let cls = 'review-option';
                      if (oi === q.correctAnswer) cls += ' correct-option';
                      if (oi === ans.selected && oi !== q.correctAnswer) cls += ' wrong-option';
                      return `<div class="${cls}"><span class="option-letter">${String.fromCharCode(65 + oi)}</span> ${opt}</div>`;
                    }).join('')}
                  </div>
                  ${q.explanation ? `<div class="review-explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}

        <div class="result-actions animate-fade-in">
          <button class="btn btn-primary" onclick="navigateTo('/test/${result.testId}')"><i data-lucide="refresh-ccw"></i> Retake Test</button>
          <button class="btn btn-outline" onclick="navigateTo('/tests')"><i data-lucide="list"></i> All Tests</button>
          <button class="btn btn-ghost" onclick="navigateTo('/dashboard')"><i data-lucide="home"></i> Dashboard</button>
        </div>
      </main>
    </div>
  `;
  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
