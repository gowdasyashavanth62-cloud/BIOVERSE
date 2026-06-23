import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, isSuperAdmin, isContentManager, isTeacher, formatDate } from '../../auth.js';
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
  let searchQuery = '';
  let selectedUnit = '';
  let selectedChapter = '';
  let selectedType = '';

  renderPage();

  function renderPage() {
    const notes = Store.getNotes() || [];
    const syllabus = Store.getSyllabus() || [];
    const chapters = Store.getAllChapters() || [];

    // Filter notes
    const filteredNotes = notes.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchUnit = true;
      let matchChapter = true;
      let matchType = true;

      if (selectedType) {
        matchType = n.type === selectedType;
      }

      if (selectedChapter) {
        matchChapter = n.chapterId === selectedChapter;
      }

      if (selectedUnit) {
        const ch = chapters.find(c => c.id === n.chapterId);
        matchUnit = ch && ch.unitId === selectedUnit;
      }

      return matchSearch && matchUnit && matchChapter && matchType;
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
              <h1>📝 Notes Library</h1>
              <p class="text-muted">Manage smart notes, revision sheets, and PDFs</p>
            </div>
            ${isEditor ? `
              <button class="btn btn-primary" id="addNoteBtn">
                <i data-lucide="plus"></i> Add Note
              </button>
            ` : ''}
          </div>

          <!-- Stats Summary -->
          <div class="dashboard-grid animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(16, 163, 74, 0.1);color:var(--primary);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="file-text"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">Total Notes</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">${notes.length}</p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(245, 158, 11, 0.1);color:var(--accent-amber);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="book-open"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">Revision Sheets</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">
                    ${notes.filter(n => n.type === 'revision').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Card -->
          <div class="card animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:15px;align-items:end;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Search</label>
                  <input type="text" id="searchNotes" class="form-input" placeholder="Search title or content..." value="${searchQuery}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Filter Unit</label>
                  <select id="filterUnit" class="form-select">
                    <option value="">All Units</option>
                    ${syllabus.map(u => `<option value="${u.id}" ${selectedUnit === u.id ? 'selected' : ''}>Unit ${u.number}: ${u.title}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Filter Chapter</label>
                  <select id="filterChapter" class="form-select">
                    <option value="">All Chapters</option>
                    ${chapters
                      .filter(c => !selectedUnit || c.unitId === selectedUnit)
                      .map(c => `<option value="${c.id}" ${selectedChapter === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Type</label>
                  <select id="filterType" class="form-select">
                    <option value="">All Types</option>
                    <option value="detailed" ${selectedType === 'detailed' ? 'selected' : ''}>Detailed</option>
                    <option value="revision" ${selectedType === 'revision' ? 'selected' : ''}>Revision</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Table list -->
          <div class="admin-table-container standalone animate-fade-in">
            <div class="admin-table-responsive">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Chapter</th>
                    <th>Type</th>
                    <th>PDF Attachment</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredNotes.length === 0 ? `
                    <tr>
                      <td colspan="6" style="text-align:center;padding:40px;" class="text-muted">
                        No notes found matching current filters.
                      </td>
                    </tr>
                  ` : filteredNotes.map(n => {
                    const ch = chapters.find(c => c.id === n.chapterId);
                    return `
                      <tr>
                        <td class="cell-bold">${n.title}</td>
                        <td>${ch ? ch.title : 'N/A'}</td>
                        <td>
                          <span class="badge ${n.type === 'revision' ? 'badge-warning' : 'badge-primary'}">
                            ${n.type === 'revision' ? 'Revision' : 'Detailed'}
                          </span>
                        </td>
                        <td>
                          ${n.pdfUrl ? `
                            <a href="${n.pdfUrl}" target="_blank" class="btn btn-sm btn-outline" style="display:inline-flex;align-items:center;gap:6px;">
                              <i data-lucide="file-text" style="width:14px;height:14px;"></i>
                              <span>View PDF</span>
                            </a>
                          ` : '<span class="text-muted" style="font-size:0.85em;">No attachment</span>'}
                        </td>
                        <td><span style="font-size:0.85em;">${n.createdAt ? formatDate(n.createdAt) : 'N/A'}</span></td>
                        <td>
                          <div class="admin-actions">
                            ${isEditor ? `
                              <button class="action-btn edit edit-note-btn" data-id="${n.id}" title="Edit Note">
                                <i data-lucide="edit-3"></i>
                              </button>
                            ` : ''}
                            ${canDelete ? `
                              <button class="action-btn delete delete-note-btn" data-id="${n.id}" title="Delete Note">
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
    const searchInput = document.getElementById('searchNotes');
    const unitSelect = document.getElementById('filterUnit');
    const chapterSelect = document.getElementById('filterChapter');
    const typeSelect = document.getElementById('filterType');

    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      debounce(() => renderPage(), 300)();
    });

    unitSelect?.addEventListener('change', (e) => {
      selectedUnit = e.target.value;
      selectedChapter = '';
      renderPage();
    });

    chapterSelect?.addEventListener('change', (e) => {
      selectedChapter = e.target.value;
      renderPage();
    });

    typeSelect?.addEventListener('change', (e) => {
      selectedType = e.target.value;
      renderPage();
    });
  }

  function setupActions() {
    // Add Note Click
    document.getElementById('addNoteBtn')?.addEventListener('click', () => {
      openAddEditModal();
    });

    // Edit Note Click
    document.querySelectorAll('.edit-note-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openAddEditModal(btn.dataset.id);
      });
    });

    // Delete Note Click
    document.querySelectorAll('.delete-note-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const noteId = btn.dataset.id;
        const notes = Store.getNotes();
        const n = notes.find(x => x.id === noteId);
        if (!n) return;

        const confirm = await confirmModal('Delete Note', `Are you sure you want to delete "${n.title}"?`);
        if (confirm) {
          Store.deleteNote(noteId);
          showToast('Note deleted successfully!', 'success');
          renderPage();
        }
      });
    });
  }

  function openAddEditModal(noteId = null) {
    const isEdit = noteId !== null;
    let noteData = { title: '', description: '', chapterId: '', conceptId: '', type: 'detailed', content: '', pdfUrl: '' };

    if (isEdit) {
      const existing = Store.getNote(noteId);
      if (existing) noteData = { ...existing };
    }

    const syllabus = Store.getSyllabus();
    const allChapters = Store.getAllChapters();

    let initialUnitId = '';
    if (noteData.chapterId) {
      const chObj = allChapters.find(c => c.id === noteData.chapterId);
      if (chObj) initialUnitId = chObj.unitId;
    }

    openModal({
      title: isEdit ? 'Edit Note Details' : 'Add Smart Note',
      size: 'lg',
      content: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" id="mNoteTitle" class="form-input" value="${noteData.title}" placeholder="Enter note title">
          </div>
          <div class="form-group">
            <label class="form-label">Note Type</label>
            <select id="mNoteType" class="form-select">
              <option value="detailed" ${noteData.type === 'detailed' ? 'selected' : ''}>Detailed Study Notes</option>
              <option value="revision" ${noteData.type === 'revision' ? 'selected' : ''}>Quick Revision Sheets</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Short Description</label>
          <input type="text" id="mNoteDesc" class="form-input" value="${noteData.description || ''}" placeholder="E.g., High-yield review of concepts">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unit *</label>
            <select id="mNoteUnit" class="form-select">
              <option value="">Select Unit</option>
              ${syllabus.map(u => `<option value="${u.id}" ${initialUnitId === u.id ? 'selected' : ''}>Unit ${u.number}: ${u.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Chapter *</label>
            <select id="mNoteChapter" class="form-select" ${!initialUnitId ? 'disabled' : ''}>
              <option value="">Select Chapter</option>
              ${allChapters
                .filter(c => c.unitId === initialUnitId)
                .map(c => `<option value="${c.id}" ${noteData.chapterId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Concept</label>
            <select id="mNoteConcept" class="form-select" ${!noteData.chapterId ? 'disabled' : ''}>
              <option value="">Select Concept (Optional)</option>
              ${(noteData.chapterId ? Store.getConcepts(noteData.chapterId) : [])
                .map(co => `<option value="${co.id}" ${noteData.conceptId === co.id ? 'selected' : ''}>${co.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">PDF File Attachment</label>
            <div style="display:flex;gap:10px;">
              <input type="text" id="mNotePdfUrl" class="form-input" value="${noteData.pdfUrl || ''}" placeholder="https://..." style="flex:1;">
              <input type="file" id="mNotePdfFile" style="display:none;" accept="application/pdf">
              <button type="button" class="btn btn-outline" id="mNoteMockUploadBtn" style="white-space:nowrap;padding:0 12px;height:38px;">
                <i data-lucide="upload" style="width:14px;height:14px;margin-right:5px;"></i> Upload Mock PDF
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">HTML Content (Rich text simulator) *</label>
          <textarea id="mNoteContent" class="form-textarea" rows="10" placeholder="<h3>1. Topic Title</h3><p>Use standard HTML here...</p>" style="font-family:var(--font-mono);font-size:var(--text-xs);">${noteData.content || ''}</textarea>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: isEdit ? 'Save Changes' : 'Create Note', class: 'btn btn-primary', onClick: () => handleSave(noteId) }
      ]
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Cascading options
    const mUnit = document.getElementById('mNoteUnit');
    const mChapter = document.getElementById('mNoteChapter');
    const mConcept = document.getElementById('mNoteConcept');
    const mPdfUrl = document.getElementById('mNotePdfUrl');
    const mMockBtn = document.getElementById('mNoteMockUploadBtn');

    mMockBtn?.addEventListener('click', () => {
      // Simulate file upload and return a mock URL
      const titleVal = document.getElementById('mNoteTitle')?.value.trim() || 'note';
      const cleanTitle = titleVal.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const randomId = Math.floor(Math.random() * 900) + 100;
      mPdfUrl.value = `/pdfs/${cleanTitle}-${randomId}.pdf`;
      showToast('Mock PDF uploaded successfully!', 'success');
    });

    mUnit?.addEventListener('change', (e) => {
      const uId = e.target.value;
      if (!uId) {
        mChapter.innerHTML = '<option value="">Select Chapter</option>';
        mChapter.disabled = true;
        mConcept.innerHTML = '<option value="">Select Concept (Optional)</option>';
        mConcept.disabled = true;
        return;
      }

      const filteredChaps = allChapters.filter(c => c.unitId === uId);
      mChapter.innerHTML = '<option value="">Select Chapter</option>' + 
        filteredChaps.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
      mChapter.disabled = false;

      mConcept.innerHTML = '<option value="">Select Concept (Optional)</option>';
      mConcept.disabled = true;
    });

    mChapter?.addEventListener('change', (e) => {
      const chId = e.target.value;
      if (!chId) {
        mConcept.innerHTML = '<option value="">Select Concept (Optional)</option>';
        mConcept.disabled = true;
        return;
      }

      const concepts = Store.getConcepts(chId);
      mConcept.innerHTML = '<option value="">Select Concept (Optional)</option>' + 
        concepts.map(co => `<option value="${co.id}">${co.title}</option>`).join('');
      mConcept.disabled = false;
    });
  }

  function handleSave(noteId = null) {
    const title = document.getElementById('mNoteTitle')?.value.trim();
    const type = document.getElementById('mNoteType')?.value;
    const description = document.getElementById('mNoteDesc')?.value.trim();
    const chapterId = document.getElementById('mNoteChapter')?.value;
    const conceptId = document.getElementById('mNoteConcept')?.value || null;
    const pdfUrl = document.getElementById('mNotePdfUrl')?.value.trim();
    const content = document.getElementById('mNoteContent')?.value.trim();

    if (!title || !chapterId || !content) {
      showToast('Please fill in all required fields (*)', 'error');
      return;
    }

    const payload = {
      title,
      type,
      description,
      chapterId,
      conceptId,
      pdfUrl,
      content
    };

    if (noteId) {
      Store.updateNote(noteId, payload);
      showToast('Notes updated successfully!', 'success');
    } else {
      Store.addNote(payload);
      showToast('Smart Notes created successfully!', 'success');
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
