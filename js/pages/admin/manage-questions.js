import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal, confirmModal } from '../../components/modal.js';

export async function render() {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  let activeTab = 'list'; // 'list' or 'bulk'
  let parsedBulkQuestions = []; // stores parsed CSV rows
  let selectedBulkChapterId = '';

  await renderPage();

  async function renderPage() {
    const allChapters = await Store.getAllChapters();
    const questions = await Store.getQuestions();

    app.innerHTML = `
      ${await Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>❓ Manage Questions</h1>
              <p class="text-muted">Create questions or upload them in bulk to the question bank</p>
            </div>
            <div class="admin-header-actions">
              <button class="btn btn-primary" id="addQuestionBtn"><i data-lucide="plus"></i> Add Question</button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="chapter-tabs animate-fade-in" style="margin-bottom: 2rem;">
            <button class="tab-item ${activeTab === 'list' ? 'active' : ''}" id="tabList">Question Bank</button>
            <button class="tab-item ${activeTab === 'bulk' ? 'active' : ''}" id="tabBulk">Bulk Import CSV</button>
          </div>

          <!-- Tab Content: Question Bank List -->
          <div id="tabContentList" style="display: ${activeTab === 'list' ? 'block' : 'none'};" class="animate-fade-in">
            <div class="filters-bar card" style="margin-bottom: 1.5rem;">
              <div class="filters-row" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <select id="fChapter" class="form-select" style="max-width: 250px;">
                  <option value="">All Chapters</option>
                  ${allChapters.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
                </select>
                <select id="fCategory" class="form-select" style="max-width: 150px;">
                  <option value="">All Categories</option>
                  <option value="pu">PU</option>
                  <option value="kcet">KCET</option>
                  <option value="neet">NEET</option>
                </select>
                <select id="fDifficulty" class="form-select" style="max-width: 150px;">
                  <option value="">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div class="filter-summary" id="qCount" style="margin-top: 1rem; font-weight: bold;">
                ${questions.length} questions
              </div>
            </div>

            <div class="table-responsive">
              <table class="table admin-table" id="questionsTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Chapter</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="qTableBody">
                  ${renderRows(questions, allChapters)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab Content: Bulk Import CSV -->
          <div id="tabContentBulk" style="display: ${activeTab === 'bulk' ? 'block' : 'none'};" class="animate-fade-in">
            <div class="card p-4" style="margin-bottom: 2rem;">
              <h3>📤 Bulk CSV Upload</h3>
              <p class="text-muted">Import multiple questions using a CSV file. Prepare your file with the following headers:</p>
              
              <div style="background: var(--bg-hover); padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
                question, optionA, optionB, optionC, optionD, correctAnswer, explanation, category, difficulty<br>
                "Which organelle is the powerhouse?", "Lysosome", "Ribosome", "Mitochondria", "Nucleus", 2, "Mitochondria generates ATP", "pu", "easy"
              </div>

              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label">Assign Imported Questions to Chapter:</label>
                <select id="bulkChapterSelect" class="form-select" style="max-width: 300px;">
                  <option value="">-- Choose Chapter --</option>
                  ${allChapters.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
                </select>
              </div>

              <div style="border: 2px dashed var(--border-color); border-radius: 0.5rem; padding: 2rem; text-align: center; background: var(--bg-light); cursor: pointer;" id="dropZone">
                <i data-lucide="upload-cloud" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h4 style="margin: 0 0 0.5rem 0;">Drag and drop your CSV file here</h4>
                <p class="text-muted" style="margin: 0 0 1rem 0;">or click to browse from computer</p>
                <input type="file" id="csvFileInput" accept=".csv" style="display: none;">
                <button class="btn btn-outline" onclick="document.getElementById('csvFileInput').click()">Browse File</button>
              </div>
            </div>

            <!-- Preview Validation Grid -->
            <div id="bulkPreviewSection" class="card p-4" style="display: none; margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>📊 CSV Validation Preview (<span id="bulkCount">0</span> Questions)</h3>
                <button class="btn btn-success" id="btnConfirmBulk"><i data-lucide="check"></i> Confirm and Save Questions</button>
              </div>

              <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Question</th>
                      <th>Options</th>
                      <th>Correct Index</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody id="bulkPreviewBody">
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind Tabs
    document.getElementById('tabList')?.addEventListener('click', async () => {
      activeTab = 'list';
      await renderPage();
    });
    document.getElementById('tabBulk')?.addEventListener('click', async () => {
      activeTab = 'bulk';
      await renderPage();
    });

    // Filters event
    ['fChapter', 'fCategory', 'fDifficulty'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', async () => {
        applyFilters();
      });
    });

    // Bind Add Question
    document.getElementById('addQuestionBtn')?.addEventListener('click', async () => {
      openQuestionModal(null);
    });

    // CSV File Upload Events
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('csvFileInput');

    if (dropZone && fileInput) {
      dropZone.addEventListener('dragover', async (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.background = 'var(--bg-hover)';
      });

      dropZone.addEventListener('dragleave', async () => {
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--bg-light)';
      });

      dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--bg-light)';
        if (e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          handleFile(e.target.files[0]);
        }
      });
    }

    // Confirm Bulk Save
    document.getElementById('btnConfirmBulk')?.addEventListener('click', async () => {
      const chapterId = document.getElementById('bulkChapterSelect').value;
      if (!chapterId) {
        showToast('Please select a target chapter to import questions into.', 'error');
        return;
      }

      if (parsedBulkQuestions.length === 0) {
        showToast('No questions to import', 'error');
        return;
      }

      // Filter valid ones
      const validQuestions = parsedBulkQuestions.filter(q => q.isValid);
      if (validQuestions.length === 0) {
        showToast('No valid questions found to import', 'error');
        return;
      }

      validQuestions.forEach(async q => {
        await Store.addQuestion({
          chapterId: chapterId,
          type: q.type || 'mcq',
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          category: q.category || 'pu',
          difficulty: q.difficulty || 'medium',
          year: null
        });
      });

      showToast(`Successfully imported ${validQuestions.length} questions!`, 'success');
      await Store.logActivity('Bulk Question Import', `Imported ${validQuestions.length} questions into chapter: ${chapterId}`);
      
      parsedBulkQuestions = [];
      activeTab = 'list';
      await renderPage();
    });

    bindRowActions();
  }

  async function applyFilters() {
    const allChapters = await Store.getAllChapters();
    const filters = {};
    const ch = document.getElementById('fChapter')?.value;
    const cat = document.getElementById('fCategory')?.value;
    const dif = document.getElementById('fDifficulty')?.value;

    if (ch) filters.chapterId = ch;
    if (cat) filters.category = cat;
    if (dif) filters.difficulty = dif;

    const filtered = await Store.getQuestions(filters);
    const body = document.getElementById('qTableBody');
    if (body) {
      body.innerHTML = renderRows(filtered, allChapters);
    }
    const count = document.getElementById('qCount');
    if (count) {
      count.textContent = `${filtered.length} questions`;
    }
    bindRowActions();
  }

  async function bindRowActions() {
    // Delete
    document.querySelectorAll('.delete-q').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.id;
        if (await confirmModal('Delete Question', 'Are you sure you want to delete this question?')) {
          await Store.deleteQuestion(qid);
          showToast('Question deleted successfully', 'success');
          applyFilters();
        }
      });
    });

    // Edit
    document.querySelectorAll('.edit-q').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.id;
        const questions = await Store.getQuestions();
        const q = questions.find(item => item.id === qid);
        if (q) {
          openQuestionModal(q);
        }
      });
    });
  }

  // Open Add/Edit Modal
  async function openQuestionModal(questionObj = null) {
    const allChapters = await Store.getAllChapters();
    const isEdit = questionObj !== null;
    const qData = questionObj || {
      chapterId: '',
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      category: 'pu',
      difficulty: 'medium'
    };

    openModal({
      title: isEdit ? 'Edit Question' : 'Add Question',
      size: 'lg',
      content: `
        <div class="form-group">
          <label class="form-label">Chapter</label>
          <select class="form-select" id="qChapter">
            ${allChapters.map(c => `<option value="${c.id}" ${qData.chapterId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Question Type</label>
          <select class="form-select" id="qType">
            <option value="mcq" ${qData.type === 'mcq' ? 'selected' : ''}>Multiple Choice (MCQ)</option>
            <option value="ar" ${qData.type === 'ar' ? 'selected' : ''}>Assertion-Reason (A-R)</option>
            <option value="tf" ${qData.type === 'tf' ? 'selected' : ''}>True / False (T-F)</option>
            <option value="match" ${qData.type === 'match' ? 'selected' : ''}>Match The Following</option>
          </select>
        </div>

        <!-- Question Input Areas -->
        <div id="typeSpecificFields">
          <!-- Dynamically inserted by delegation -->
        </div>

        <div class="form-group">
          <label class="form-label">Correct Option / Answer Index</label>
          <select class="form-select" id="qCorrect">
            <option value="0" ${qData.correctAnswer === 0 ? 'selected' : ''}>Option A / True</option>
            <option value="1" ${qData.correctAnswer === 1 ? 'selected' : ''}>Option B / False</option>
            <option value="2" ${qData.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
            <option value="3" ${qData.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Explanation</label>
          <textarea class="form-textarea" id="qExpl" rows="2" placeholder="Explain the correct answer...">${qData.explanation || ''}</textarea>
        </div>
        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="qCat">
              <option value="pu" ${qData.category === 'pu' ? 'selected' : ''}>PU</option>
              <option value="kcet" ${qData.category === 'kcet' ? 'selected' : ''}>KCET</option>
              <option value="neet" ${qData.category === 'neet' ? 'selected' : ''}>NEET</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Difficulty</label>
            <select class="form-select" id="qDiff">
              <option value="easy" ${qData.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="medium" ${qData.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="hard" ${qData.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
            </select>
          </div>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: isEdit ? 'Save Changes' : 'Add Question', class: 'btn btn-primary', onClick: async () => {
          saveQuestion(isEdit, qData.id);
        }}
      ]
    });

    // Populate type-specific fields immediately
    updateModalFields(qData.type, qData);

    // Watch type change
    const typeSelect = document.getElementById('qType');
    typeSelect?.addEventListener('change', async () => {
      updateModalFields(typeSelect.value, null);
    });
  }

  async function updateModalFields(type, existingData = null) {
    const container = document.getElementById('typeSpecificFields');
    if (!container) return;

    if (type === 'mcq') {
      const qText = existingData ? existingData.question : '';
      const opts = existingData ? existingData.options : ['', '', '', ''];
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Question Text</label>
          <textarea class="form-textarea" id="qText" rows="3" required placeholder="Enter question text...">${qText}</textarea>
        </div>
        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group"><label class="form-label">Option A</label><input class="form-input" id="qOpt0" value="${opts[0] || ''}"></div>
          <div class="form-group"><label class="form-label">Option B</label><input class="form-input" id="qOpt1" value="${opts[1] || ''}"></div>
          <div class="form-group"><label class="form-label">Option C</label><input class="form-input" id="qOpt2" value="${opts[2] || ''}"></div>
          <div class="form-group"><label class="form-label">Option D</label><input class="form-input" id="qOpt3" value="${opts[3] || ''}"></div>
        </div>
      `;
    } else if (type === 'ar') {
      let assertion = '';
      let reason = '';
      if (existingData) {
        const parts = existingData.question.split('\nReason:');
        assertion = parts[0]?.replace('Assertion: ', '') || '';
        reason = parts[1] || '';
      }
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Assertion (Statement A)</label>
          <textarea class="form-textarea" id="qAssertion" rows="2" placeholder="e.g. Mitochondria is the powerhouse of the cell.">${assertion}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Reason (Statement R)</label>
          <textarea class="form-textarea" id="qReason" rows="2" placeholder="e.g. It generates energy in the form of ATP.">${reason}</textarea>
        </div>
        <div style="background: var(--bg-hover); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid var(--border-color);">
          <strong>Note:</strong> Options will automatically populate with standard A-R answers.
        </div>
      `;
    } else if (type === 'tf') {
      const qText = existingData ? existingData.question : '';
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">True/False Statement</label>
          <textarea class="form-textarea" id="qText" rows="3" placeholder="Enter true/false statement...">${qText}</textarea>
        </div>
      `;
    } else if (type === 'match') {
      let colA = ['', '', '', ''];
      let colB = ['', '', '', ''];
      let opts = ['', '', '', ''];

      if (existingData) {
        opts = existingData.options;
        // Parse colA/colB from question content if matches
        const lines = existingData.question.split('\n');
        // Fallback if not matching:
        colA = [lines[2] || '', lines[3] || '', lines[4] || '', lines[5] || ''];
        colB = [lines[8] || '', lines[9] || '', lines[10] || '', lines[11] || ''];
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <strong style="font-size: 0.85rem;">Column A</strong>
            <input class="form-input" style="margin-top:0.25rem" id="colA0" placeholder="A. Item 1" value="${colA[0]}">
            <input class="form-input" style="margin-top:0.25rem" id="colA1" placeholder="B. Item 2" value="${colA[1]}">
            <input class="form-input" style="margin-top:0.25rem" id="colA2" placeholder="C. Item 3" value="${colA[2]}">
            <input class="form-input" style="margin-top:0.25rem" id="colA3" placeholder="D. Item 4" value="${colA[3]}">
          </div>
          <div>
            <strong style="font-size: 0.85rem;">Column B</strong>
            <input class="form-input" style="margin-top:0.25rem" id="colB0" placeholder="I. Match 1" value="${colB[0]}">
            <input class="form-input" style="margin-top:0.25rem" id="colB1" placeholder="II. Match 2" value="${colB[1]}">
            <input class="form-input" style="margin-top:0.25rem" id="colB2" placeholder="III. Match 3" value="${colB[2]}">
            <input class="form-input" style="margin-top:0.25rem" id="colB3" placeholder="IV. Match 4" value="${colB[3]}">
          </div>
        </div>
        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group"><label class="form-label">Match Option A</label><input class="form-input" id="qOpt0" placeholder="e.g. A-I, B-II, C-III, D-IV" value="${opts[0] || ''}"></div>
          <div class="form-group"><label class="form-label">Match Option B</label><input class="form-input" id="qOpt1" placeholder="e.g. A-II, B-I, C-IV, D-III" value="${opts[1] || ''}"></div>
          <div class="form-group"><label class="form-label">Match Option C</label><input class="form-input" id="qOpt2" value="${opts[2] || ''}"></div>
          <div class="form-group"><label class="form-label">Match Option D</label><input class="form-input" id="qOpt3" value="${opts[3] || ''}"></div>
        </div>
      `;
    }
  }

  async function saveQuestion(isEdit, existingId = null) {
    const type = document.getElementById('qType').value;
    const chapterId = document.getElementById('qChapter').value;
    const correctAnswer = parseInt(document.getElementById('qCorrect').value);
    const explanation = document.getElementById('qExpl').value;
    const category = document.getElementById('qCat').value;
    const difficulty = document.getElementById('qDiff').value;

    let questionText = '';
    let options = [];

    if (type === 'mcq') {
      questionText = document.getElementById('qText').value.trim();
      options = [
        document.getElementById('qOpt0').value.trim(),
        document.getElementById('qOpt1').value.trim(),
        document.getElementById('qOpt2').value.trim(),
        document.getElementById('qOpt3').value.trim()
      ];
      if (!questionText || options.some(o => !o)) {
        showToast('Please fill in question text and all four options.', 'error');
        return;
      }
    } else if (type === 'tf') {
      questionText = document.getElementById('qText').value.trim();
      options = ['True', 'False'];
      if (!questionText) {
        showToast('Please fill in the statement.', 'error');
        return;
      }
    } else if (type === 'ar') {
      const assertion = document.getElementById('qAssertion').value.trim();
      const reason = document.getElementById('qReason').value.trim();
      if (!assertion || !reason) {
        showToast('Please fill in both Assertion and Reason.', 'error');
        return;
      }
      questionText = `Assertion: ${assertion}\nReason: ${reason}`;
      options = [
        'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
        'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
        'Assertion is true but Reason is false.',
        'Assertion is false but Reason is true.'
      ];
    } else if (type === 'match') {
      const colA = [
        document.getElementById('colA0').value.trim(),
        document.getElementById('colA1').value.trim(),
        document.getElementById('colA2').value.trim(),
        document.getElementById('colA3').value.trim()
      ];
      const colB = [
        document.getElementById('colB0').value.trim(),
        document.getElementById('colB1').value.trim(),
        document.getElementById('colB2').value.trim(),
        document.getElementById('colB3').value.trim()
      ];
      options = [
        document.getElementById('qOpt0').value.trim(),
        document.getElementById('qOpt1').value.trim(),
        document.getElementById('qOpt2').value.trim(),
        document.getElementById('qOpt3').value.trim()
      ];

      if (colA.some(x => !x) || colB.some(y => !y) || options.some(o => !o)) {
        showToast('Please fill in all match items in Column A & B, and all match option keys.', 'error');
        return;
      }

      questionText = `Match the items:\nColumn A:\n${colA.join('\n')}\nColumn B:\n${colB.join('\n')}`;
    }

    const payload = {
      chapterId,
      type,
      question: questionText,
      options,
      correctAnswer,
      explanation,
      category,
      difficulty,
      year: null
    };

    if (isEdit) {
      await Store.updateQuestion(existingId, payload);
      showToast('Question updated successfully!', 'success');
    } else {
      await Store.addQuestion(payload);
      showToast('Question created successfully!', 'success');
    }

    closeModal();
    await renderPage();
  }

  // File parsing logic
  async function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
      showToast('Please select a valid CSV file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      parseCSVData(text);
    };
    reader.readAsText(file);
  }

  async function parseCSVData(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing content', 'error');
      return;
    }

    // Get headers
    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    
    parsedBulkQuestions = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Hand-rolled CSV row parser to handle quoted strings containing commas
      const cells = [];
      let currentCell = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());

      // Map headers to cells
      const row = {};
      headers.forEach((h, idx) => {
        let val = cells[idx] || '';
        // Strip leading/trailing quotes
        val = val.replace(/^["']|["']$/g, '');
        row[h] = val;
      });

      // Map keys to match schema
      const question = row.question || '';
      const optionA = row.optiona || row.optionA || '';
      const optionB = row.optionb || row.optionB || '';
      const optionC = row.optionc || row.optionC || '';
      const optionD = row.optiond || row.optionD || '';
      const correctVal = row.correctanswer || row.correctAnswer || '0';
      const explanation = row.explanation || '';
      const category = (row.category || 'pu').toLowerCase();
      const difficulty = (row.difficulty || 'medium').toLowerCase();

      let parsedCorrect = parseInt(correctVal);
      if (isNaN(parsedCorrect)) {
        // Support A, B, C, D maps
        const letterMap = { a: 0, b: 1, c: 2, d: 3 };
        parsedCorrect = letterMap[correctVal.toLowerCase()] ?? 0;
      }

      const isValid = question.length > 0 && optionA.length > 0 && optionB.length > 0;

      parsedBulkQuestions.push({
        question,
        options: [optionA, optionB, optionC, optionD].filter(Boolean),
        correctAnswer: parsedCorrect,
        explanation,
        category,
        difficulty,
        isValid,
        type: 'mcq'
      });
    }

    renderBulkPreview();
  }

  async function renderBulkPreview() {
    const previewSection = document.getElementById('bulkPreviewSection');
    const previewBody = document.getElementById('bulkPreviewBody');
    const countSpan = document.getElementById('bulkCount');

    if (!previewSection || !previewBody || !countSpan) return;

    countSpan.textContent = parsedBulkQuestions.length;
    previewBody.innerHTML = parsedBulkQuestions.map((q, idx) => `
      <tr style="background: ${q.isValid ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'};">
        <td>
          <span class="badge ${q.isValid ? 'badge-success' : 'badge-danger'}">
            ${q.isValid ? 'Valid' : 'Invalid'}
          </span>
        </td>
        <td style="max-width: 250px;">
          <strong>${q.question || '<span class="text-danger">Missing Question Text</span>'}</strong>
        </td>
        <td>
          <div style="font-size: 0.8rem;">
            A: ${q.options[0] || '-'}<br>
            B: ${q.options[1] || '-'}<br>
            C: ${q.options[2] || '-'}<br>
            D: ${q.options[3] || '-'}
          </div>
        </td>
        <td>Option ${String.fromCharCode(65 + q.correctAnswer)}</td>
        <td>${q.category.toUpperCase()}</td>
        <td>${q.difficulty}</td>
      </tr>
    `).join('');

    previewSection.style.display = 'block';
  }
}

async function renderRows(questions, chapters) {
  if (questions.length === 0) {
    return '<tr><td colspan="7" class="text-center text-muted">No questions found in the bank.</td></tr>';
  }

  return questions.map((q, i) => {
    const ch = chapters.find(c => c.id === q.chapterId);
    const textPreview = (q.question || '').replace(/[\n\r]+/g, ' ');
    const displayType = (q.type || 'mcq').toUpperCase();

    return `
      <tr>
        <td>${i + 1}</td>
        <td style="max-width: 280px; font-weight: 500;">
          <div class="text-truncate" title="${q.question}">${textPreview}</div>
        </td>
        <td><span class="text-truncate" style="max-width: 150px; display: inline-block;">${ch ? ch.title : 'General'}</span></td>
        <td><span class="badge badge-outline">${displayType}</span></td>
        <td><span class="badge badge-${q.category === 'neet' ? 'danger' : q.category === 'kcet' ? 'primary' : 'warning'}">${(q.category || 'PU').toUpperCase()}</span></td>
        <td><span class="badge badge-${q.difficulty === 'hard' ? 'danger' : q.difficulty === 'easy' ? 'success' : 'warning'}">${q.difficulty}</span></td>
        <td>
          <div style="display: flex; gap: 0.25rem;">
            <button class="btn btn-sm btn-outline edit-q" data-id="${q.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-q" data-id="${q.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}
