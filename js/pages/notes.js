import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { isPremium } from '../auth.js';

export async function render(params) {
  const app = document.getElementById('app');
  const chapter = await Store.getChapter(params.chapterId);
  if (!chapter) { navigateTo('/dashboard'); return; }
  const notes = await Store.getNotes(params.chapterId);
  const progress = await Store.getProgress();
  window.navigateTo = navigateTo;
  const classLabel = chapter.classId === 'pu1' ? '1st PU' : '2nd PU';

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
          <div class="breadcrumb" style="color:rgba(255,255,255,0.8);">
            <a href="#/dashboard" style="color:white;">Dashboard</a><i data-lucide="chevron-right"></i>
            <a href="#/chapter/${chapter.id}" style="color:white;">${chapter.title}</a><i data-lucide="chevron-right"></i>
            <span>Smart Notes</span>
          </div>
          <h1>📝 Smart Notes – ${chapter.title}</h1>
          <p>Highlight text to save important points, toggle Quick Revision mode for exams, and write personal notes.</p>
        </div>

        <div class="notes-filter-bar flex-row justify-between align-center animate-fade-in">
          <div class="flex-row gap-sm">
            <button class="chip chip-active" data-filter="all">All</button>
            <button class="chip" data-filter="detailed">Detailed</button>
            <button class="chip" data-filter="revision">Quick Revision</button>
          </div>
          <div class="flex-row gap-sm align-center">
            <span style="font-weight:600;">⚡ Quick Revision Mode</span>
            <label class="switch">
              <input type="checkbox" id="quickRevisionToggle">
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="dashboard-two-col animate-fade-in" style="margin-top: 2rem;">
          <div class="notes-list" id="notesList">
            ${notes.length === 0 ? `
              <div class="empty-state card"><i data-lucide="file-text"></i><h3>No Notes Available</h3><p>Notes for this chapter will be uploaded soon.</p></div>
            ` : notes.map((n, index) => {
              const isLocked = !isPremium() && index > 0;
              const isRead = progress.notesRead?.includes(n.concept_id);
              
              if (isLocked) {
                return `
                  <article class="note-article card note-locked" data-type="${n.type || 'detailed'}" data-note-id="${n.id}" style="position:relative; overflow:hidden; min-height: 250px;">
                    <div class="note-article-header" style="opacity: 0.4; pointer-events: none;">
                      <div>
                        <h3>${n.title}</h3>
                        <div class="note-badges">
                          <span class="badge ${n.type === 'revision' ? 'badge-warning' : 'badge-primary'}">${n.type === 'revision' ? '⚡ Quick Revision' : '📖 Detailed Notes'}</span>
                        </div>
                      </div>
                    </div>
                    <div class="note-article-content notes-content" style="filter: blur(4px); opacity: 0.2; pointer-events: none; user-select: none;">
                      <div class="detailed-content">
                        <p>This premium content is locked. Upgrade to Premium to access all notes, videos, question banks, and progress analytics.</p>
                        <p>Detailed notes explain the concepts in-depth, including key diagrams, KCET/NEET tips, and exam-oriented question lists.</p>
                      </div>
                    </div>
                    <div class="paywall-overlay-absolute" style="position:absolute; inset:0; background:rgba(15, 23, 42, 0.7); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; text-align:center; backdrop-filter: blur(6px); border-radius:1rem; border: 1px solid rgba(255, 255, 255, 0.1);">
                      <div class="lock-icon-container" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; margin-bottom:0.75rem; box-shadow:0 8px 32px rgba(0,0,0,0.3);">
                        <i data-lucide="lock" style="width:22px; height:22px; color:#fbbf24;"></i>
                      </div>
                      <h4 style="color:white; font-size:1.1rem; margin-bottom:0.25rem; font-weight: 600;">🔒 Premium Note</h4>
                      <p style="color:rgba(255,255,255,0.8); font-size:0.85rem; margin-bottom:0.75rem; max-width:280px;">Unlock all study notes, revisions, and exam tips.</p>
                      <button class="btn btn-primary btn-sm" onclick="navigateTo('/pricing')" style="box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">Upgrade to Premium</button>
                    </div>
                  </article>
                `;
              }

              return `
                <article class="note-article card" data-type="${n.type || 'detailed'}" data-note-id="${n.id}">
                  <div class="note-article-header">
                    <div>
                      <h3>${n.title}</h3>
                      <div class="note-badges">
                        <span class="badge ${n.type === 'revision' ? 'badge-warning' : 'badge-primary'}">${n.type === 'revision' ? '⚡ Quick Revision' : '📖 Detailed Notes'}</span>
                        ${isRead ? '<span class="badge badge-success">✓ Read</span>' : ''}
                      </div>
                    </div>
                    <button class="btn btn-sm ${isRead ? 'btn-ghost' : 'btn-primary'} mark-read-btn" data-note-id="${n.id}">
                      ${isRead ? 'Read ✓' : 'Mark as Read'}
                    </button>
                  </div>
                  <div class="note-article-content notes-content" id="content-${n.id}">
                    <div class="detailed-content">${n.content || '<p>Detailed content goes here...</p>'}</div>
                    <div class="revision-content" style="display:none; background:var(--surface-color); padding:1rem; border-left:4px solid var(--accent-amber);">
                      <ul style="margin:0; padding-left:1.5rem;">
                        <li><strong>Key Point 1:</strong> Summarized fact about ${n.title}</li>
                        <li><strong>Key Point 2:</strong> Important definition related to ${chapter.title}</li>
                        <li><strong>Key Point 3:</strong> Remember this for exams!</li>
                      </ul>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <div class="personal-notes-panel">
            <!-- AI Notes Tools Card -->
            <div class="card animate-fade-in" style="margin-bottom:1.5rem;">
              <div class="card-header">
                <h3>🤖 AI Notes Tools</h3>
              </div>
              <div class="card-body" style="display:flex; flex-direction:column; gap:10px;">
                <button class="btn btn-outline btn-block text-left ai-note-tool-btn" data-prompt="Generate a Quick Revision Summary for notes in this chapter">
                  <i data-lucide="sparkles" style="width:14px; height:14px; margin-right:6px; display:inline-block; vertical-align:middle;"></i> Generate Quick Summary
                </button>
                <button class="btn btn-outline btn-block text-left ai-note-tool-btn" data-prompt="Generate a One Page Last-Minute Revision Sheet for this chapter">
                  <i data-lucide="flame" style="width:14px; height:14px; margin-right:6px; display:inline-block; vertical-align:middle;"></i> Last Minute Revision Sheet
                </button>
                <button class="btn btn-outline btn-block text-left ai-note-tool-btn" data-prompt="Extract the key NCERT Textbook Highlights and definitions for this chapter">
                  <i data-lucide="book-open" style="width:14px; height:14px; margin-right:6px; display:inline-block; vertical-align:middle;"></i> Important NCERT Points
                </button>
              </div>
            </div>
            
            <div class="card" style="position:sticky; top:2rem;">
              <div class="card-header">
                <h3><i data-lucide="edit-3"></i> Personal Notes</h3>
              </div>
              <div class="card-body">
                <textarea id="personalNotesInput" class="form-control" rows="8" placeholder="Type your personal notes, summaries, or mnemonics here..."></textarea>
                <button class="btn btn-primary btn-block mt-md" id="savePersonalNotesBtn">Save Notes</button>
                <hr style="margin:1.5rem 0;">
                <h4><i data-lucide="highlighter"></i> Highlights</h4>
                <ul id="highlightsList" style="padding-left:1rem; margin-top:0.5rem; font-size:0.9rem;">
                  <li class="text-muted">Select text in the notes to highlight and save it here.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="section" style="text-align:center;margin-top:2rem;">
          <button class="btn btn-outline" onclick="navigateTo('/chapter/${chapter.id}')"><i data-lucide="arrow-left"></i> Back to Chapter</button>
        </div>
        
        <!-- Highlight Floating Toolbar -->
        <div id="highlightToolbar" style="display:none; position:absolute; background:#333; color:#fff; border-radius:4px; padding:4px 8px; z-index:1000; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
          <button id="highlightBtn" style="background:none; border:none; color:#fff; cursor:pointer; font-size:14px; display:flex; align-items:center; gap:4px;">
            <i data-lucide="highlighter" style="width:14px; height:14px;"></i> Highlight
          </button>
        </div>
      </main>
    </div>
  `;

  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Quick Revision Toggle
  const quickRevisionToggle = document.getElementById('quickRevisionToggle');
  if (quickRevisionToggle) {
    quickRevisionToggle.addEventListener('change', (e) => {
      const isQuick = e.target.checked;
      document.querySelectorAll('.detailed-content').forEach(el => el.style.display = isQuick ? 'none' : 'block');
      document.querySelectorAll('.revision-content').forEach(el => el.style.display = isQuick ? 'block' : 'none');
      if (isQuick) showToast('Quick Revision Mode Enabled', 'success');
    });
  }

  // Filter
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');
      const filter = chip.dataset.filter;
      document.querySelectorAll('.note-article').forEach(n => {
        n.style.display = (filter === 'all' || n.dataset.type === filter) ? '' : 'none';
      });
    });
  });

  // Mark read
  document.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await Store.markNoteRead(btn.dataset.noteId);
      btn.textContent = 'Read ✓';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-ghost');
      showToast('Note marked as read & +10 XP!', 'success');
      // Add XP
      await Store.addXP(10);
    });
  });

  // AI Notes Tool Buttons
  document.querySelectorAll('.ai-note-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      if (window.AIWidget) {
        window.AIWidget.open();
        window.AIWidget.askTutor(`${prompt} (Chapter: ${chapter.title})`);
      }
    });
  });

  // Personal Notes
  const personalNotesInput = document.getElementById('personalNotesInput');
  const savePersonalNotesBtn = document.getElementById('savePersonalNotesBtn');
  const savedNotesKey = 'personal_notes_' + chapter.id;
  
  if (personalNotesInput) {
    personalNotesInput.value = localStorage.getItem(savedNotesKey) || '';
  }
  if (savePersonalNotesBtn) {
    savePersonalNotesBtn.addEventListener('click', () => {
      localStorage.setItem(savedNotesKey, personalNotesInput.value);
      showToast('Personal notes saved!', 'success');
    });
  }

  // Highlighting Logic
  const toolbar = document.getElementById('highlightToolbar');
  const highlightBtn = document.getElementById('highlightBtn');
  const highlightsList = document.getElementById('highlightsList');
  let currentSelection = '';

  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection.toString().trim() && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      toolbar.style.display = 'block';
      toolbar.style.top = (rect.top + window.scrollY - 30) + 'px';
      toolbar.style.left = (rect.left + window.scrollX + (rect.width / 2) - 40) + 'px';
      currentSelection = selection.toString().trim();
    } else {
      toolbar.style.display = 'none';
    }
  });

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      if (currentSelection) {
        if (highlightsList.innerHTML.includes('Select text')) {
          highlightsList.innerHTML = '';
        }
        highlightsList.innerHTML += `<li style="margin-bottom:0.5rem;">${currentSelection}</li>`;
        showToast('Text highlighted', 'success');
        window.getSelection().removeAllRanges();
        toolbar.style.display = 'none';
      }
    });
  }
}
