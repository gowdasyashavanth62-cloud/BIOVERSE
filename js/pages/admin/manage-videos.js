import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, isSuperAdmin, isContentManager, isTeacher, hasPermission } from '../../auth.js';
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

  // Let's store current filters in local state
  let searchQuery = '';
  let selectedUnit = '';
  let selectedChapter = '';

  renderPage();

  function renderPage() {
    const videos = Store.getVideos() || [];
    const syllabus = Store.getSyllabus() || [];
    const chapters = Store.getAllChapters() || [];

    // Ensure all videos have a mock views count for display
    videos.forEach(v => {
      if (v.views === undefined) {
        v.views = Math.floor(Math.random() * 850) + 150;
      }
    });

    // Filtering logic
    const filteredVideos = videos.filter(v => {
      const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchUnit = true;
      let matchChapter = true;

      if (selectedChapter) {
        matchChapter = v.chapterId === selectedChapter;
      }

      if (selectedUnit) {
        const ch = chapters.find(c => c.id === v.chapterId);
        matchUnit = ch && ch.unitId === selectedUnit;
      }

      return matchSearch && matchUnit && matchChapter;
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
              <h1>🎥 Video Library</h1>
              <p class="text-muted">Manage YouTube videos, chapters, and concepts</p>
            </div>
            ${isEditor ? `
              <button class="btn btn-primary" id="addVideoBtn">
                <i data-lucide="plus"></i> Add Video
              </button>
            ` : ''}
          </div>

          <!-- Stats Grid -->
          <div class="dashboard-grid animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(10, 104, 71, 0.1);color:var(--primary);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="video"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">Total Videos</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">${videos.length}</p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:rgba(59, 130, 246, 0.1);color:var(--accent-blue);padding:8px;border-radius:var(--radius-md);">
                  <i data-lucide="eye"></i>
                </div>
                <div>
                  <h4 style="margin:0;font-size:var(--text-sm);color:var(--gray-500);">Total Views</h4>
                  <p style="margin:5px 0 0 0;font-size:var(--text-2xl);font-weight:var(--font-bold);">
                    ${videos.reduce((sum, v) => sum + (v.views || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="card animate-fade-in" style="margin-bottom:var(--space-6);">
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:15px;align-items:end;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Search</label>
                  <input type="text" id="searchVideo" class="form-input" placeholder="Search by title or desc..." value="${searchQuery}">
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
              </div>
            </div>
          </div>

          <!-- Table Container -->
          <div class="admin-table-container standalone animate-fade-in">
            <div class="admin-table-responsive">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Chapter & Concept</th>
                    <th>YouTube ID</th>
                    <th>Duration</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredVideos.length === 0 ? `
                    <tr>
                      <td colspan="6" style="text-align:center;padding:40px;" class="text-muted">
                        No videos found matching the criteria.
                      </td>
                    </tr>
                  ` : filteredVideos.map(v => {
                    const ch = chapters.find(c => c.id === v.chapterId);
                    const con = ch && ch.concepts ? ch.concepts.find(co => co.id === v.conceptId) : null;
                    return `
                      <tr>
                        <td class="cell-bold">${v.title}</td>
                        <td>
                          <div style="font-size:0.85em;color:var(--gray-600);">${ch ? ch.title : 'N/A'}</div>
                          <div style="font-size:0.75em;color:var(--primary); font-weight:500;">${con ? con.title : 'General'}</div>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-outline preview-btn" data-ytid="${v.youtubeId}" data-title="${v.title}" style="display:flex;align-items:center;gap:6px;">
                            <i data-lucide="play-circle" style="width:14px;height:14px;"></i>
                            <span>${v.youtubeId}</span>
                          </button>
                        </td>
                        <td><span class="cell-mono">${v.duration || 'N/A'}</span></td>
                        <td>${v.views}</td>
                        <td>
                          <div class="admin-actions">
                            ${isEditor ? `
                              <button class="action-btn edit edit-video-btn" data-id="${v.id}" title="Edit Video">
                                <i data-lucide="edit-3"></i>
                              </button>
                            ` : ''}
                            ${canDelete ? `
                              <button class="action-btn delete delete-video-btn" data-id="${v.id}" title="Delete Video">
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

    // Bind event listeners
    setupFilters();
    setupActions();
  }

  function setupFilters() {
    const searchInput = document.getElementById('searchVideo');
    const unitSelect = document.getElementById('filterUnit');
    const chapterSelect = document.getElementById('filterChapter');

    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      debounce(() => renderPage(), 300)();
    });

    unitSelect?.addEventListener('change', (e) => {
      selectedUnit = e.target.value;
      selectedChapter = ''; // Reset chapter when unit changes
      renderPage();
    });

    chapterSelect?.addEventListener('change', (e) => {
      selectedChapter = e.target.value;
      renderPage();
    });
  }

  function setupActions() {
    // Preview Click
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ytid = btn.dataset.ytid;
        const title = btn.dataset.title;
        openVideoPreview(ytid, title);
      });
    });

    // Add Video Click
    document.getElementById('addVideoBtn')?.addEventListener('click', () => {
      openAddEditModal();
    });

    // Edit Video Click
    document.querySelectorAll('.edit-video-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vidId = btn.dataset.id;
        openAddEditModal(vidId);
      });
    });

    // Delete Video Click
    document.querySelectorAll('.delete-video-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const vidId = btn.dataset.id;
        const videos = Store.getVideos();
        const v = videos.find(x => x.id === vidId);
        if (!v) return;

        const confirm = await confirmModal('Delete Video', `Are you sure you want to delete "${v.title}"?`);
        if (confirm) {
          Store.deleteVideo(vidId);
          showToast('Video deleted successfully!', 'success');
          renderPage();
        }
      });
    });
  }

  function openVideoPreview(youtubeId, title) {
    openModal({
      title: title,
      size: 'lg',
      content: `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius-md);background:#000;">
          <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
          </iframe>
        </div>
        <div style="margin-top:15px; font-size:0.9em;" class="text-muted">
          Playing from YouTube (ID: <strong>${youtubeId}</strong>)
        </div>
      `,
      actions: [
        { label: 'Close', class: 'btn btn-secondary', onClick: () => closeModal() }
      ]
    });
  }

  function openAddEditModal(videoId = null) {
    const isEdit = videoId !== null;
    let videoData = { title: '', description: '', youtubeUrl: '', duration: '', chapterId: '', conceptId: '' };

    if (isEdit) {
      const videos = Store.getVideos();
      const existing = videos.find(v => v.id === videoId);
      if (existing) videoData = { ...existing };
    }

    const syllabus = Store.getSyllabus();
    const allChapters = Store.getAllChapters();

    // Figure out initial Unit ID if editing
    let initialUnitId = '';
    if (videoData.chapterId) {
      const chObj = allChapters.find(c => c.id === videoData.chapterId);
      if (chObj) initialUnitId = chObj.unitId;
    }

    openModal({
      title: isEdit ? 'Edit Video Details' : 'Add New Video',
      size: 'lg',
      content: `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" id="mVideoTitle" class="form-input" value="${videoData.title}" placeholder="Enter video title">
          </div>
          <div class="form-group">
            <label class="form-label">Duration (e.g. 15:45)</label>
            <input type="text" id="mVideoDuration" class="form-input" value="${videoData.duration}" placeholder="MM:SS">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="mVideoDesc" class="form-textarea" rows="3" placeholder="Enter short description...">${videoData.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">YouTube Link / URL *</label>
          <input type="text" id="mVideoUrl" class="form-input" value="${videoData.youtubeUrl || (videoData.youtubeId ? 'https://youtube.com/watch?v=' + videoData.youtubeId : '')}" placeholder="https://www.youtube.com/watch?v=...">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unit *</label>
            <select id="mVideoUnit" class="form-select">
              <option value="">Select Unit</option>
              ${syllabus.map(u => `<option value="${u.id}" ${initialUnitId === u.id ? 'selected' : ''}>Unit ${u.number}: ${u.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Chapter *</label>
            <select id="mVideoChapter" class="form-select" ${!initialUnitId ? 'disabled' : ''}>
              <option value="">Select Chapter</option>
              ${allChapters
                .filter(c => c.unitId === initialUnitId)
                .map(c => `<option value="${c.id}" ${videoData.chapterId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Concept</label>
          <select id="mVideoConcept" class="form-select" ${!videoData.chapterId ? 'disabled' : ''}>
            <option value="">Select Concept (Optional)</option>
            ${(videoData.chapterId ? Store.getConcepts(videoData.chapterId) : [])
              .map(co => `<option value="${co.id}" ${videoData.conceptId === co.id ? 'selected' : ''}>${co.title}</option>`).join('')}
          </select>
        </div>
      `,
      actions: [
        { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
        { label: isEdit ? 'Save Changes' : 'Add Video', class: 'btn btn-primary', onClick: () => handleSave(videoId) }
      ]
    });

    // Dynamic Cascading Listeners in the modal
    const mUnit = document.getElementById('mVideoUnit');
    const mChapter = document.getElementById('mVideoChapter');
    const mConcept = document.getElementById('mVideoConcept');

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

  function handleSave(videoId = null) {
    const title = document.getElementById('mVideoTitle')?.value.trim();
    const duration = document.getElementById('mVideoDuration')?.value.trim();
    const description = document.getElementById('mVideoDesc')?.value.trim();
    const youtubeUrl = document.getElementById('mVideoUrl')?.value.trim();
    const chapterId = document.getElementById('mVideoChapter')?.value;
    const conceptId = document.getElementById('mVideoConcept')?.value || null;

    if (!title || !youtubeUrl || !chapterId) {
      showToast('Please fill in all required fields (*)', 'error');
      return;
    }

    const payload = {
      title,
      duration,
      description,
      youtubeUrl,
      chapterId,
      conceptId
    };

    if (videoId) {
      Store.updateVideo(videoId, payload);
      showToast('Video updated successfully!', 'success');
    } else {
      Store.addVideo(payload);
      showToast('Video added to library!', 'success');
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
