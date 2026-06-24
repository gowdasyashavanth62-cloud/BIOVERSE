import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { isPremium } from '../auth.js';

export async function render(params) {
  const app = document.getElementById('app');
  window.navigateTo = navigateTo;
  const allChapters = await Store.getAllChapters();
  const selectedChapter = params.chapterId || '';
  const premium = isPremium();
  let questions = await Store.getQuestions(selectedChapter ? { chapterId: selectedChapter } : {});

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in">
          <h1>❓ Question Bank</h1>
          <p class="text-muted">Practice questions from PU Board, KCET & NEET</p>
        </div>

        <div class="filters-bar card animate-fade-in" style="${!premium ? 'opacity:0.6; pointer-events:none;' : ''}">
          <div class="filters-row">
            <select id="filterChapter" class="form-select" ${!premium ? 'disabled' : ''}>
              <option value="">All Chapters</option>
              ${allChapters.map(ch => `<option value="${ch.id}" ${ch.id === selectedChapter ? 'selected' : ''}>${ch.title}</option>`).join('')}
            </select>
            <select id="filterCategory" class="form-select" ${!premium ? 'disabled' : ''}>
              <option value="">All Categories</option>
              <option value="pu">PU Board</option>
              <option value="kcet">KCET</option>
              <option value="neet">NEET</option>
            </select>
            <select id="filterDifficulty" class="form-select" ${!premium ? 'disabled' : ''}>
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div class="filter-summary" id="filterSummary">${premium ? questions.length : Math.min(questions.length, 3)} questions found ${!premium ? '(Preview Mode)' : ''}</div>
        </div>

        <div class="question-list animate-fade-in" id="questionList" style="position:relative;">
          ${renderQuestions(premium ? questions : questions.slice(0, 3))}
          ${!premium ? `
            <div class="paywall-overlay-card card" style="background:rgba(15, 23, 42, 0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 2rem; text-align:center; backdrop-filter: blur(8px); border-radius:1rem; border: 1px solid rgba(255, 255, 255, 0.1); margin-top:2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <div class="lock-icon-container" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:50%; width:60px; height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:1.25rem;">
                <i data-lucide="lock" style="width:28px; height:28px; color:#fbbf24;"></i>
              </div>
              <h3 style="color:white; font-size:1.5rem; margin-bottom:0.5rem; font-weight:600;">🔒 Premium Question Bank</h3>
              <p style="color:rgba(255,255,255,0.8); font-size:0.95rem; margin-bottom:1.5rem; max-width:450px;">
                You are currently viewing a limited preview. Unlock 1,000+ chapter-wise Board, KCET, and NEET questions with detailed video solutions and explanations.
              </p>
              <button class="btn btn-primary" onclick="navigateTo('/pricing')" style="box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">Upgrade to Premium</button>
            </div>
          ` : ''}
        </div>
      </main>
    </div>
  `;

  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const filterChapter = document.getElementById('filterChapter');
  const filterCategory = document.getElementById('filterCategory');
  const filterDifficulty = document.getElementById('filterDifficulty');

  async function applyFilters() {
    if (!premium) return;
    const filters = {};
    if (filterChapter.value) filters.chapterId = filterChapter.value;
    if (filterCategory.value) filters.category = filterCategory.value;
    if (filterDifficulty.value) filters.difficulty = filterDifficulty.value;
    const filtered = await Store.getQuestions(filters);
    document.getElementById('questionList').innerHTML = renderQuestions(filtered);
    document.getElementById('filterSummary').textContent = `${filtered.length} questions found`;
    bindAnswerToggles();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  if (filterChapter) filterChapter.addEventListener('change', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterDifficulty) filterDifficulty.addEventListener('change', applyFilters);
  bindAnswerToggles();
}

function renderQuestions(questions) {
  if (questions.length === 0) {
    return `<div class="empty-state card"><i data-lucide="help-circle"></i><h3>No Questions Found</h3><p>Try adjusting your filters.</p></div>`;
  }
  return questions.map((q, i) => `
    <div class="question-item card animate-fade-in">
      <div class="question-header">
        <span class="question-number">Q${i + 1}</span>
        <div class="question-tags">
          <span class="badge badge-${q.category === 'neet' ? 'danger' : q.category === 'kcet' ? 'primary' : 'warning'}">${(q.category || '').toUpperCase()}</span>
          <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}">${q.difficulty || ''}</span>
          ${q.year ? `<span class="badge">PYQ ${q.year}</span>` : ''}
        </div>
      </div>
      <p class="question-text">${q.question}</p>
      <div class="question-options">
        ${(q.options || []).map((opt, oi) => `
          <div class="question-option"><span class="option-letter">${String.fromCharCode(65 + oi)}</span><span>${opt}</span></div>
        `).join('')}
      </div>
      <button class="btn btn-sm btn-ghost toggle-answer">Show Answer</button>
      <div class="question-answer">
        <div class="correct-answer"><strong>Answer:</strong> ${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}</div>
        ${q.explanation ? `<div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function bindAnswerToggles() {
  document.querySelectorAll('.toggle-answer').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      if (answer) {
        answer.classList.toggle('show');
        btn.textContent = answer.classList.contains('show') ? 'Hide Answer' : 'Show Answer';
      }
    });
  });
}
