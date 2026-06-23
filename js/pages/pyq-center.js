import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { pyqData } from '../data/pyqs.js';

export function render() {
  const app = document.getElementById('app');
  
  // Extract unique years, exams
  const years = [...new Set(pyqData.map(q => q.year))].sort((a,b) => b-a);
  const exams = [...new Set(pyqData.map(q => q.exam))].sort();
  const allChapters = Store.getAllChapters() || [];

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <section class="section animate-fade-in">
          <div class="section-header">
            <h2>PYQ Center</h2>
            <p class="text-muted">Practice Previous Year Questions to perfect your exam strategy.</p>
          </div>
          
          <!-- Filters -->
          <div class="card mb-4">
            <div class="card-body">
              <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
                <div class="form-group" style="flex: 1; min-width: 150px; margin-bottom: 0;">
                  <label>Exam Type</label>
                  <select id="filter-exam" class="form-control">
                    <option value="">All Exams</option>
                    ${exams.map(e => `<option value="${e}">${e.toUpperCase()}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="flex: 1; min-width: 150px; margin-bottom: 0;">
                  <label>Year</label>
                  <select id="filter-year" class="form-control">
                    <option value="">All Years</option>
                    ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="flex: 2; min-width: 200px; margin-bottom: 0;">
                  <label>Chapter</label>
                  <select id="filter-chapter" class="form-control">
                    <option value="">All Chapters</option>
                    ${allChapters.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Results -->
          <div id="pyq-results">
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              Loading questions...
            </div>
          </div>
        </section>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  window.navigateTo = navigateTo;

  const filterExam = document.getElementById('filter-exam');
  const filterYear = document.getElementById('filter-year');
  const filterChapter = document.getElementById('filter-chapter');

  function renderQuestions() {
    const examVal = filterExam.value;
    const yearVal = filterYear.value;
    const chapterVal = filterChapter.value;

    let filtered = pyqData.filter(q => {
      if (examVal && q.exam !== examVal) return false;
      if (yearVal && q.year.toString() !== yearVal) return false;
      if (chapterVal && q.chapterId !== chapterVal) return false;
      return true;
    });

    const resultsContainer = document.getElementById('pyq-results');
    
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card p-4 text-center">
          <p class="text-muted">No questions found matching your filters.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map((q, i) => {
      const chap = allChapters.find(c => c.id === q.chapterId);
      const chapterTitle = chap ? chap.title : 'Unknown Chapter';
      
      return `
        <div class="card mb-3 pyq-card">
          <div class="card-header" style="display: flex; justify-content: space-between; font-size: 0.85em; color: var(--text-muted); background: var(--bg-hover);">
            <span>${chapterTitle}</span>
            <span style="font-weight: bold; color: var(--primary); text-transform: uppercase;">${q.exam} ${q.year}</span>
          </div>
          <div class="card-body">
            <p style="font-size: 1.1em; margin-bottom: 15px;">${i + 1}. ${q.question}</p>
            <div class="options-grid" style="display: flex; flex-direction: column; gap: 10px;">
              ${q.options.map((opt, optIdx) => `
                <button class="btn btn-outline pyq-option" style="text-align: left; justify-content: flex-start; padding: 10px 15px; height: auto; white-space: normal;" data-correct="${optIdx === q.correctAnswer}">
                  ${String.fromCharCode(65 + optIdx)}. ${opt}
                </button>
              `).join('')}
            </div>
            <div class="pyq-explanation mt-3 p-3" style="display: none; background: rgba(var(--accent-green-rgb), 0.1); border-left: 4px solid var(--accent-green); border-radius: var(--radius-sm);">
              <strong>Explanation:</strong> <br> ${q.explanation}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners for options
    const optionBtns = resultsContainer.querySelectorAll('.pyq-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const parent = this.closest('.pyq-card');
        const options = parent.querySelectorAll('.pyq-option');
        
        // Disable all options in this question
        options.forEach(o => {
          o.disabled = true;
          o.style.cursor = 'default';
          if (o.dataset.correct === 'true') {
            o.style.background = 'var(--accent-green)';
            o.style.color = 'white';
            o.style.borderColor = 'var(--accent-green)';
          }
        });

        // If wrong, highlight red
        if (this.dataset.correct !== 'true') {
          this.style.background = 'var(--accent-red)';
          this.style.color = 'white';
          this.style.borderColor = 'var(--accent-red)';
        }
        
        // Show explanation
        const expl = parent.querySelector('.pyq-explanation');
        if (expl) expl.style.display = 'block';
      });
    });
  }

  filterExam.addEventListener('change', renderQuestions);
  filterYear.addEventListener('change', renderQuestions);
  filterChapter.addEventListener('change', renderQuestions);

  // Initial render
  renderQuestions();
}
