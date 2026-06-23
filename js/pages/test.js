import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';
import { isPremium } from '../auth.js';

export function render(params) {
  const app = document.getElementById('app');
  if (!isPremium()) {
    setTimeout(() => {
      showToast('This test is a Premium feature. Please upgrade to access.', 'warning');
    }, 100);
    navigateTo('/pricing');
    return;
  }
  
  const test = Store.getTest(params.testId);
  if (!test || !test.questions || test.questions.length === 0) {
    navigateTo('/tests');
    return;
  }

  window.navigateTo = navigateTo;
  let currentIndex = 0;
  let answers = {};
  let marked = new Set();
  let timerSeconds = (test.duration || 30) * 60;
  let timerInterval = null;

  function formatTimer(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  function renderQuestion() {
    const q = test.questions[currentIndex];
    const questionArea = document.getElementById('questionArea');
    if (!questionArea) return;
    questionArea.innerHTML = `
      <div class="test-question-card">
        <div class="test-q-header">
          <span class="question-number">Question ${currentIndex + 1} of ${test.questions.length}</span>
          <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}">${q.difficulty || 'medium'}</span>
        </div>
        <p class="test-q-text">${q.question}</p>
        <div class="test-options">
          ${q.options.map((opt, oi) => `
            <button class="test-option ${answers[q.id] === oi ? 'selected' : ''}" data-oi="${oi}">
              <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Option click
    questionArea.querySelectorAll('.test-option').forEach(btn => {
      btn.addEventListener('click', () => {
        answers[q.id] = parseInt(btn.dataset.oi);
        renderQuestion();
        updateNav();
      });
    });
  }

  function updateNav() {
    const navGrid = document.getElementById('qNavGrid');
    if (!navGrid) return;
    navGrid.innerHTML = test.questions.map((q, i) => {
      let cls = 'q-nav-btn';
      if (i === currentIndex) cls += ' current';
      if (answers[q.id] !== undefined) cls += ' answered';
      if (marked.has(i)) cls += ' marked';
      return `<button class="${cls}" data-qi="${i}">${i + 1}</button>`;
    }).join('');
    navGrid.querySelectorAll('.q-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentIndex = parseInt(btn.dataset.qi);
        renderQuestion();
        updateNav();
      });
    });
  }

  function submitTest() {
    clearInterval(timerInterval);
    const timeTaken = (test.duration || 30) * 60 - timerSeconds;
    const result = Store.submitTest(params.testId, answers, timeTaken);
    if (result) {
      showToast('Test submitted!', 'success');
      navigateTo('/test-result/' + result.id);
    }
  }

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content test-interface">
        <div class="test-top-bar">
          <h2>${test.title}</h2>
          <div class="test-timer" id="testTimer">
            <i data-lucide="clock"></i> <span id="timerDisplay">${formatTimer(timerSeconds)}</span>
          </div>
        </div>

        <div class="test-layout">
          <div class="test-main" id="questionArea"></div>
          <div class="test-sidebar-panel">
            <h4>Question Navigator</h4>
            <div class="q-nav-grid" id="qNavGrid"></div>
            <div class="q-nav-legend">
              <span><span class="legend-dot answered"></span> Answered</span>
              <span><span class="legend-dot current"></span> Current</span>
              <span><span class="legend-dot marked"></span> Marked</span>
              <span><span class="legend-dot"></span> Not Visited</span>
            </div>
          </div>
        </div>

        <div class="test-bottom-bar">
          <div class="test-nav-btns">
            <button class="btn btn-ghost" id="prevBtn"><i data-lucide="arrow-left"></i> Previous</button>
            <button class="btn btn-ghost" id="markBtn"><i data-lucide="flag"></i> Mark for Review</button>
            <button class="btn btn-secondary" id="nextBtn">Next <i data-lucide="arrow-right"></i></button>
          </div>
          <button class="btn btn-primary" id="submitBtn"><i data-lucide="check-circle"></i> Submit Test</button>
        </div>
      </main>
    </div>
  `;

  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  renderQuestion();
  updateNav();

  // Timer
  timerInterval = setInterval(() => {
    timerSeconds--;
    const display = document.getElementById('timerDisplay');
    if (display) display.textContent = formatTimer(timerSeconds);
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      showToast('Time is up!', 'warning');
      submitTest();
    }
    if (timerSeconds <= 60) {
      const timer = document.getElementById('testTimer');
      if (timer) timer.classList.add('timer-warning');
    }
  }, 1000);

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; renderQuestion(); updateNav(); }
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < test.questions.length - 1) { currentIndex++; renderQuestion(); updateNav(); }
  });
  document.getElementById('markBtn').addEventListener('click', () => {
    if (marked.has(currentIndex)) marked.delete(currentIndex); else marked.add(currentIndex);
    updateNav();
    showToast(marked.has(currentIndex) ? 'Marked for review' : 'Unmarked', 'info');
  });
  document.getElementById('submitBtn').addEventListener('click', async () => {
    const unanswered = test.questions.filter(q => answers[q.id] === undefined).length;
    const msg = unanswered > 0 ? `You have ${unanswered} unanswered question(s). Submit anyway?` : 'Are you sure you want to submit?';
    const confirmed = await confirmModal('Submit Test', msg);
    if (confirmed) submitTest();
  });

  return () => { clearInterval(timerInterval); };
}
