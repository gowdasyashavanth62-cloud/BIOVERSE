import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, isSuperAdmin, isContentManager, isTeacher } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal, confirmModal } from '../../components/modal.js';

export function render(params) {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  // Local state filters
  let selectedYear = '';
  let selectedExam = '';
  let selectedChapter = '';
  let searchQuery = '';

  renderPage();

  function renderPage() {
    const allQuestions = Store.getQuestions() || [];
    const chapters = Store.getAllChapters() || [];

    // Filter to questions that are PYQs (having a non-null/non-empty year)
    const pyqs = allQuestions.filter(q => q.year !== null && q.year !== undefined && q.year !== '');

    // Extract list of unique years from data for filter dropdown dynamically
    const uniqueYears = [...new Set(pyqs.map(q => q.year.toString()))].sort((a, b) => b - a);

    // Filter list
    const filteredPyqs = pyqs.filter(q => {
      const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchYear = true;
      let matchExam = true;
      let matchChapter = true;

      if (selectedYear) {
        matchYear = q.year.toString() === selectedYear;
      }

      if (selectedExam) {
        const examVal = (q.exam || q.category || '').toLowerCase();
        matchExam = examVal === selectedExam.toLowerCase();
      }

      if (selectedChapter) {
        matchChapter = q.chapterId === selectedChapter;
      }

      return matchSearch && matchYear && matchExam && matchChapter;
    });

    const isEditor = isSuperAdmin() || isContentManager() || isTeacher();
    const canDelete = isSuperAdmin() || isContentManager();

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>🎓 Previous Year Questions (PYQs)</h1>
              <p class="text-muted">Manage previous year NEET, KCET, and PU board exam questions</p>
            </div>
            ${isEditor ? `
              <button class="btn btn-primary" id="addPyqBtn">
                <i data-lucide="plus"></i> Add PYQ
              </button>
            ` : ''}
          </div>

          <!-- Stats Grid -->
          <div class="dashboard-grid animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(59, 130, 246, 0.1);color:var(--accent-blue);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="archive"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">Total PYQs</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">${pyqs.length}</p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(239, 68, 68, 0.1);color:var(--accent-red);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="activity"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">NEET PYQs</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">
                    ${pyqs.filter(q => (q.exam || q.category) === 'neet').length}
                  </p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(16, 163, 74, 0.1);color:var(--primary);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="award"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">KCET PYQs</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">
                    ${pyqs.filter(q => (q.exam || q.category) === 'kcet').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="card animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:15px;align-items:end;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Search Question</label>
                  <input type="text" id="searchPyq" class="form-input" placeholder="Search question or explanation..." value="${searchQuery}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Exam</label>
                  <select id="filterExam" class="form-select">
                    <option value="">All Exams</option>
                    <option value="neet" ${selectedExam === 'neet' ? 'selected' : ''}>NEET</option>
                    <option value="kcet" ${selectedExam === 'kcet' ? 'selected' : ''}>KCET</option>
                    <option value="pu" ${selectedExam === 'pu' ? 'selected' : ''}>PU Board</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Year</label>
                  <select id="filterYear" class="form-select">
                    <option value="">All Years</option>
                    ${uniqueYears.map(y => `<option value="${y}" ${selectedYear === y ? 'selected' : ''}>${y}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Chapter</label>
                  <select id="filterChapter" class="form-select">
                    <option value="">All Chapters</option>
                    ${chapters.map(c => `<option value="${c.id}" ${selectedChapter === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="admin-table-container standalone animate-fade-in">
            <div class="admin-table-responsive">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Exam & Year</th>
                    <th>Chapter</th>
                    <th>Question</th>
                    <th>Correct Ans</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredPyqs.length === 0 ? `
                    <tr>
                      <td colspan="5" style="text-align:center;padding:40px;" class="text-muted">
                        No PYQs found matching current filters.
                      </td>
                    </tr>
                  ` : filteredPyqs.map(q => {
                    const ch = chapters.find(c => c.id === q.chapterId);
                    const examLabel = (q.exam || q.category || '').toUpperCase();
                    const badgeClass = examLabel === 'NEET' ? 'badge-danger' : examLabel === 'KCET' ? 'badge-primary' : 'badge-warning';
                    
                    return `
                      <tr>
                        <td>
                          <span class="badge ${badgeClass}">${examLabel}</span>
                          <span style="font-weight:600;margin-left:5px;">${q.year}</span>
                        </td>
                        <td>${ch ? ch.title : 'N/A'}</td>
                        <td style="max-width:320px;">
                          <div style="font-weight:500;margin-bottom:4px;" class="text-truncate" title="${q.question}">
                            ${q.question}
                          </div>
                          <div style="font-size:0.75em;color:var(--gray-500);" class="text-truncate">
                            A: ${q.options[0]} | B: ${q.options[1]} | C: ${q.options[2]} | D: ${q.options[3]}
                          </div>
                        </td>
                        <td>
                          <span class="badge badge-success" style="font-family:var(--font-mono);">
                            Option ${String.fromCharCode(65 + q.correctAnswer)}
                          </span>
                        </td>
                        <td>
                          <div class="admin-actions">
                            <button class="action-btn view view-pyq-btn" data-id="${q.id}" title="Preview PYQ">
                              <i data-lucide="eye"></i>
                            </button>
                            ${isEditor ? `
                              <button class="action-btn edit edit-pyq-btn" data-id="${q.id}" title="Edit PYQ">
                                <i data-lucide="edit-3"></i>
                              </button>
                            ` : ''}
                            ${canDelete ? `
                              <button class="action-btn delete delete-pyq-btn" data-id="${q.id}" title="Delete PYQ">
                                <i data-lucide="trash-2"></i>
                              </button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupFilters();
    setupActions();
  }

  function setupFilters() {
    const searchInput = document.getElementById('searchPyq');
    const examSelect = document.getElementById('filterExam');
    const yearSelect = document.getElementById('filterYear');
    const chapterSelect = document.getElementById('filterChapter');

    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      debounce(() => renderPage(), 300)();
    });

    examSelect?.addEventListener('change', (e) => {
      selectedExam = e.target.value;
      renderPage();
    });

    yearSelect?.addEventListener('change', (e) => {
      selectedYear = e.target.value;
      renderPage();
    });

    chapterSelect?.addEventListener('change', (e) => {
      selectedChapter = e.target.value;
      renderPage();
    });
  }

  function setupActions() {
    // Add PYQ Click
    document.getElementById('addPyqBtn')?.addEventListener('click', () => {
      openAddEditModal();
    });

    // View Details Click
    document.querySelectorAll('.view-pyq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openPreviewModal(btn.dataset.id);
      });
    });

    // Edit PYQ Click
    document.querySelectorAll('.edit-pyq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openAddEditModal(btn.dataset.id);
      });
    });

    // Delete PYQ Click
    document.querySelectorAll('.delete-pyq-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pyqId = btn.dataset.id;
        const confirm = await confirmModal('Delete PYQ', 'Are you sure you want to delete this previous year question?');
        if (confirm) {
          Store.deleteQuestion(pyqId);
          showToast('PYQ deleted successfully!', 'success');
          renderPage();
        }
      });
    });
  }

  function openPreviewModal(pyqId) {
    const allQuestions = Store.getQuestions();
    const q = allQuestions.find(x => x.id === pyqId);
    if (!q) return;

    const chapters = Store.getAllChapters();
    const ch = chapters.find(c => c.id === q.chapterId);
    const examName = (q.exam || q.category || '').toUpperCase();

    openModal({
      title: `${examName} ${q.year} - Question Details`,
      size: 'md',
      content: `
        <div style="font-size:0.9em;color:var(--gray-500);margin-bottom:15px;display:flex;justify-content:space-between;border-bottom:1px solid var(--gray-100);padding-bottom:10px;">
          <span>Chapter: <strong>${ch ? ch.title : 'N/A'}</strong></span>
          <span>Exam: <strong>${examName} (${q.year})</strong></span>
        </div>

        <p style="font-size:1.1em;font-weight:500;line-height:1.5;margin-bottom:20px;">${q.question}</p>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${q.options.map((opt, i) => {
            const isCorrect = i === q.correctAnswer;
            return `
              <div style="padding:10px 15px; border:1px solid ${isCorrect ? 'var(--success)' : 'var(--gray-200)'}; background:${isCorrect ? 'rgba(16, 163, 74, 0.05)' : '#fff'}; border-radius:var(--radius-sm); display:flex; align-items:center; gap:10px;">
                <span style="font-weight:bold; background:${isCorrect ? 'var(--success)' : 'var(--gray-100)'}; color:${isCorrect ? '#fff' : 'var(--gray-700)'}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85em;">
                  ${String.fromCharCode(65 + i)}
                </span>
                <span style="color:${isCorrect ? 'var(--success)' : 'var(--gray-800)'}; font-weight:${isCorrect ? '600' : 'normal'};">${opt}</span>
                ${isCorrect ? '<i data-lucide="check" style="width:16px;height:16px;margin-left:auto;color:var(--success);"></i>' : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div style="background:var(--gray-50);padding:15px;border-radius:var(--radius-md);border-left:4px solid var(--accent-blue);">
          <strong style="display:block;margin-bottom:5px;font-size:0.9em;color:var(--gray-700);">Explanation:</strong>
          <p style="margin:0;font-size:0.9em;line-height:1.5;color:var(--gray-600);">${q.explanation || 'No explanation provided.'}</p>
        </div>
      `,
      actions: [
        { label: 'Close', class: 'btn btn-secondary', onClick: () => closeModal() }
      ]
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function openAddEditModal(pyqId = null) {
    const isEdit = pyqId !== null;
    let pyqData = { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', year: new Date().getFullYear(), category: 'neet', exam: 'neet', chapterId: '', conceptId: null };

    if (isEdit) {
      const allQuestions = Store.getQuestions();
      const existing = allQuestions.find(x => x.id === pyqId);
      if (existing) {
        pyqData = { ...existing };
      }
    }

    const syllabus = Store.getSyllabus();
    const allChapters = Store.getAllChapters();

    openModal({
      title: isEdit ? 'Edit PYQ Details' : 'Add Previous Year Question',
      size: 'lg',
      content: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Exam Type *</label>
            <select id="mPyqExam" class="form-select">
              <option value="neet" ${pyqData.exam === 'neet' || pyqData.category === 'neet' ? 'selected' : ''}>NEET</option>
              <option value="kcet" ${pyqData.exam === 'kcet' || pyqData.category === 'kcet' ? 'selected' : ''}>KCET</option>
              <option value="pu" ${pyqData.exam === 'pu' || pyqData.category === 'pu' ? 'selected' : ''}>PU Board</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Year of Exam *</label>
            <input type="number" id="mPyqYear" class="form-input" value="${pyqData.year || ''}" placeholder="E.g., 2021" min="2000" max="2030">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Chapter *</label>
          <select id="mPyqChapter" class="form-select">
            <option value="">Select Chapter</option>
            ${allChapters.map(c => `<option value="${c.id}" ${pyqData.chapterId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Question Text *</label>
          <textarea id="mPyqText" class="form-textarea" rows="3" placeholder="Enter question description...">${pyqData.question}</textarea>
        </div>

        <div style="margin-bottom:15px;"><strong style="font-size:0.95em;color:var(--gray-800);">Options</strong></div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Option A *</label>
            <input type="text" id="mPyqOpt0" class="form-input" value="${pyqData.options[0] || ''}" placeholder="Option A">
          </div>
          <div class="form-group">
            <label class="form-label">Option B *</label>
            <input type="text" id="mPyqOpt1" class="form-input" value="${pyqData.options[1] || ''}" placeholder="Option B">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Option C *</label>
            <input type="text" id="mPyqOpt2" class="form-input" value="${pyqData.options[2] || ''}" placeholder="Option C">
          </div>
          <div class="form-group">
            <label class="form-label">Option D *</label>
            <input type="text" id="mPyqOpt3" class="form-input" value="${pyqData.options[3] || ''}" placeholder="Option D">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Correct Option *</label>
          <select id="mPyqCorrect" class="form-select">
            <option value="0" ${pyqData.correctAnswer === 0 ? 'selected' : ''}>Option A</option>
            <option value="1" ${pyqData.correctAnswer === 1 ? 'selected' : ''}>Option B</option>
            <option value="2" ${pyqData.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
            <option value="3" ${pyqData.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Solution Explanation</label>
          <textarea id="mPyqExplanation" class="form-textarea" rows="3" placeholder="Provide step-by-step reason...">${pyqData.explanation || ''}</textarea>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: isEdit ? 'Save Changes' : 'Create PYQ', class: 'btn btn-primary', onClick: () => handleSave(pyqId) }
      ]
    });
  }

  function handleSave(pyqId = null) {
    const exam = document.getElementById('mPyqExam')?.value;
    const yearVal = document.getElementById('mPyqYear')?.value.trim();
    const chapterId = document.getElementById('mPyqChapter')?.value;
    const questionText = document.getElementById('mPyqText')?.value.trim();
    const opt0 = document.getElementById('mPyqOpt0')?.value.trim();
    const opt1 = document.getElementById('mPyqOpt1')?.value.trim();
    const opt2 = document.getElementById('mPyqOpt2')?.value.trim();
    const opt3 = document.getElementById('mPyqOpt3')?.value.trim();
    const correctAnswer = parseInt(document.getElementById('mPyqCorrect')?.value, 10);
    const explanation = document.getElementById('mPyqExplanation')?.value.trim();

    if (!exam || !yearVal || !chapterId || !questionText || !opt0 || !opt1 || !opt2 || !opt3) {
      showToast('Please fill in all required fields (*)', 'error');
      return;
    }

    const year = parseInt(yearVal, 10);
    const options = [opt0, opt1, opt2, opt3];

    // Maintain compatibility: set both category and exam
    const payload = {
      question: questionText,
      options,
      correctAnswer,
      explanation,
      year,
      category: exam,
      exam,
      chapterId,
      conceptId: null
    };

    if (pyqId) {
      Store.updateQuestion(pyqId, payload);
      showToast('PYQ updated successfully!', 'success');
    } else {
      Store.addQuestion(payload);
      showToast('PYQ added successfully!', 'success');
    }

    closeModal();
    renderPage();
  }

  // Simple debounce helper
  let timeout;
  function debounce(func, delay) {
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
}
