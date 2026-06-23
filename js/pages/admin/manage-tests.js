import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin } from '../../auth.js';
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
    const tests = Store.getTests();

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>📋 Manage Tests</h1>
              <p class="text-muted">Create, generate, and manage exams and mock tests</p>
            </div>
            <button class="btn btn-primary" id="createTestBtn"><i data-lucide="plus"></i> Create Test Builder</button>
          </div>

          <div class="table-responsive animate-fade-in" style="margin-top: 1.5rem;">
            ${tests.length === 0 ? `
              <div class="card p-4 text-center">
                <h3>No tests generated yet</h3>
                <p class="text-muted">Click the "Create Test Builder" button to auto-generate a test from the question bank.</p>
              </div>
            ` : `
            <table class="table admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Questions Count</th>
                  <th>Passing %</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tests.map(t => {
                  const passingPct = t.passingPercentage || 40;
                  return `
                    <tr>
                      <td><strong>${t.title}</strong></td>
                      <td>
                        <span class="badge badge-${t.type === 'mock' ? 'danger' : t.type === 'unit' ? 'warning' : 'primary'}">
                          ${t.type.toUpperCase()}
                        </span>
                      </td>
                      <td>${(t.questionIds || []).length} questions</td>
                      <td>${passingPct}%</td>
                      <td>${t.duration || 30} mins</td>
                      <td>
                        <button class="btn btn-sm btn-danger delete-test" data-id="${t.id}">Delete</button>
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

    // Bind Create Test Action
    document.getElementById('createTestBtn')?.addEventListener('click', () => {
      openTestBuilderModal();
    });

    // Delete Action
    document.querySelectorAll('.delete-test').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (await confirmModal('Delete Test', 'Are you sure you want to delete this test?')) {
          Store.deleteTest(id);
          showToast('Test deleted successfully', 'success');
          renderPage();
        }
      });
    });
  }

  function openTestBuilderModal() {
    openModal({
      title: 'Automated Test Builder',
      size: 'lg',
      content: `
        <div class="form-group">
          <label class="form-label">Test Title</label>
          <input class="form-input" id="testTitle" placeholder="e.g. Chapter 3 Photosynthesis Quick Test">
        </div>
        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Test Type</label>
            <select class="form-select" id="testType">
              <option value="chapter">Chapter Test</option>
              <option value="unit">Unit Test</option>
              <option value="mock">Mock Exam</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Target Class</label>
            <select class="form-select" id="testClass">
              <option value="pu1">1st PU</option>
              <option value="pu2">2nd PU</option>
            </select>
          </div>
        </div>

        <div class="form-group" id="unitFilterGroup" style="display: block;">
          <label class="form-label">Select Target Unit</label>
          <select class="form-select" id="testUnit">
            <!-- Populated dynamically -->
          </select>
        </div>

        <div class="form-group" id="chapterFilterGroup" style="display: block;">
          <label class="form-label">Select Target Chapter</label>
          <select class="form-select" id="testChapter">
            <!-- Populated dynamically -->
          </select>
        </div>

        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Duration (Minutes)</label>
            <input type="number" class="form-input" id="testDuration" value="30" min="5">
          </div>
          <div class="form-group">
            <label class="form-label">Passing Percentage (%)</label>
            <input type="number" class="form-input" id="testPassing" value="40" min="1" max="100">
          </div>
          <div class="form-group">
            <label class="form-label">Number of Questions</label>
            <input type="number" class="form-input" id="testQCount" value="10" min="1">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Difficulty Filter</label>
          <select class="form-select" id="testDiffLimit">
            <option value="any">Any Difficulty</option>
            <option value="easy">Easy Only</option>
            <option value="medium">Medium Only</option>
            <option value="hard">Hard Only</option>
          </select>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: 'Auto-Generate Test', class: 'btn btn-primary', onClick: () => generateTestSubmit() }
      ]
    });

    // Populate dropdowns immediately after opening
    updateModalDropdowns();
  }

  // Handle dependent dropdown updates inside modal
  function updateModalDropdowns() {
    const type = document.getElementById('testType')?.value || 'chapter';
    const classId = document.getElementById('testClass')?.value || 'pu1';
    const unitGroup = document.getElementById('unitFilterGroup');
    const chapterGroup = document.getElementById('chapterFilterGroup');

    const syllabus = Store.getSyllabus();

    if (type === 'mock') {
      if (unitGroup) unitGroup.style.display = 'none';
      if (chapterGroup) chapterGroup.style.display = 'none';
    } else if (type === 'unit') {
      if (unitGroup) unitGroup.style.display = 'block';
      if (chapterGroup) chapterGroup.style.display = 'none';
      
      const unitSelect = document.getElementById('testUnit');
      if (unitSelect) {
        const classUnits = syllabus.filter(u => u.classId === classId);
        const originalVal = unitSelect.value;
        unitSelect.innerHTML = classUnits.map(u => `<option value="${u.id}">Unit ${u.number}: ${u.title}</option>`).join('');
        if (originalVal && classUnits.some(u => u.id === originalVal)) {
          unitSelect.value = originalVal;
        }
      }
    } else if (type === 'chapter') {
      if (unitGroup) unitGroup.style.display = 'block';
      if (chapterGroup) chapterGroup.style.display = 'block';
      
      const unitSelect = document.getElementById('testUnit');
      if (unitSelect) {
        const classUnits = syllabus.filter(u => u.classId === classId);
        const originalUnitVal = unitSelect.value;
        unitSelect.innerHTML = classUnits.map(u => `<option value="${u.id}">Unit ${u.number}: ${u.title}</option>`).join('');
        if (originalUnitVal && classUnits.some(u => u.id === originalUnitVal)) {
          unitSelect.value = originalUnitVal;
        }

        const selectedUnitId = unitSelect.value;
        const chapterSelect = document.getElementById('testChapter');
        if (chapterSelect) {
          const unit = classUnits.find(u => u.id === selectedUnitId);
          const chapters = unit ? unit.chapters : [];
          chapterSelect.innerHTML = chapters.map(ch => `<option value="${ch.id}">${ch.title}</option>`).join('');
        }
      }
    }
  }

  // Event Delegation for dropdown changes inside Modal
  document.addEventListener('change', (e) => {
    if (['testType', 'testClass', 'testUnit'].includes(e.target.id)) {
      updateModalDropdowns();
    }
  });

  function generateTestSubmit() {
    const title = document.getElementById('testTitle').value.trim();
    const type = document.getElementById('testType').value;
    const classId = document.getElementById('testClass').value;
    const unitId = document.getElementById('testUnit')?.value;
    const chapterId = document.getElementById('testChapter')?.value;
    const duration = parseInt(document.getElementById('testDuration').value) || 30;
    const passingPercentage = parseInt(document.getElementById('testPassing').value) || 40;
    const count = parseInt(document.getElementById('testQCount').value) || 10;
    const difficulty = document.getElementById('testDiffLimit').value;

    if (!title) {
      showToast('Please enter a test title.', 'error');
      return;
    }

    // Step 1: Fetch all questions
    let pool = Store.getQuestions();

    // Step 2: Apply Difficulty filter
    if (difficulty !== 'any') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // Step 3: Filter based on exam type hierarchy
    const syllabus = Store.getSyllabus();
    if (type === 'chapter') {
      if (!chapterId) {
        showToast('Please select a target chapter.', 'error');
        return;
      }
      pool = pool.filter(q => q.chapterId === chapterId);
    } else if (type === 'unit') {
      if (!unitId) {
        showToast('Please select a target unit.', 'error');
        return;
      }
      const unit = syllabus.find(u => u.id === unitId);
      const chapterIds = unit ? (unit.chapters || []).map(ch => ch.id) : [];
      pool = pool.filter(q => chapterIds.includes(q.chapterId));
    } else if (type === 'mock') {
      // Filter by Class of the question's chapter
      const chapterClassMap = {};
      syllabus.forEach(unit => {
        (unit.chapters || []).forEach(ch => {
          chapterClassMap[ch.id] = unit.classId;
        });
      });
      pool = pool.filter(q => chapterClassMap[q.chapterId] === classId);
    }

    // Step 4: Validate pool size
    if (pool.length === 0) {
      showToast('No questions in the question bank match these criteria. Please adjust filters.', 'error');
      return;
    }

    // Step 5: Randomly select N questions
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    if (selected.length < count) {
      showToast(`Only ${selected.length} questions matched. Generating test with those.`, 'warning');
    }

    // Step 6: Save Test object
    Store.addTest({
      title,
      type,
      classId,
      unitId: type === 'unit' ? unitId : null,
      chapterId: type === 'chapter' ? chapterId : null,
      duration,
      passingPercentage,
      questionIds: selected.map(q => q.id),
      totalMarks: selected.length
    });

    closeModal();
    showToast(`Test "${title}" generated successfully with ${selected.length} questions!`, 'success');
    renderPage();
  }
}
