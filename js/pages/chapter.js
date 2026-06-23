import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { ProgressBar } from '../components/progress-bar.js';
import { showToast } from '../components/toast.js';
import { isPremium } from '../auth.js';

let ytPlayer;
let currentVideoId = null;
let saveInterval = null;

export function render(params) {
  const app = document.getElementById('app');
  const chapter = Store.getChapter(params.chapterId);
  if (!chapter) { navigateTo('/dashboard'); return; }
  Store.incrementChapterView(params.chapterId);

  const concepts = Store.getConcepts(params.chapterId);
  const videos = Store.getVideosByChapter(params.chapterId);
  const notes = Store.getNotes(params.chapterId);
  const questions = Store.getQuestions({ chapterId: params.chapterId });
  const kcetQ = questions.filter(q => q.category === 'kcet');
  const neetQ = questions.filter(q => q.category === 'neet');
  const puQ = questions.filter(q => q.category === 'pu');
  const pyqs = questions.filter(q => q.year);
  const tests = Store.getTests({ chapterId: params.chapterId });
  const cp = Store.getChapterProgress(params.chapterId);
  const progress = Store.getProgress();

  window.navigateTo = navigateTo;
  window.openVideo = openVideo;
  window.openAIWidgetWithConcept = (conceptTitle) => {
    if (window.AIWidget) {
      window.AIWidget.open();
      window.AIWidget.askTutor(`Explain the concept of ${conceptTitle}`);
    }
  };

  const classLabel = chapter.classId === 'pu1' ? '1st PU' : '2nd PU';

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <!-- Breadcrumb & Header -->
        <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
          <div class="breadcrumb" style="color:rgba(255,255,255,0.8);">
            <a href="#/dashboard" style="color:white;">Dashboard</a>
            <i data-lucide="chevron-right"></i>
            <a href="#/syllabus/${chapter.classId}" style="color:white;">${classLabel}</a>
            <i data-lucide="chevron-right"></i>
            <span>Unit ${chapter.unitNumber}</span>
            <i data-lucide="chevron-right"></i>
            <span>${chapter.title}</span>
          </div>
          <div class="chapter-title-row">
            <div>
              <h1>${chapter.icon || '📖'} ${chapter.title}</h1>
              <p style="color:rgba(255,255,255,0.9);">${chapter.description || ''}</p>
            </div>
            <div class="chapter-progress-badge">
              <span class="badge" style="background:var(--accent-amber); color:#000;">${cp.percentage}% Complete</span>
            </div>
          </div>
          ${ProgressBar(cp.percentage, { height: '8px' })}
        </div>

        <!-- Tab Navigation -->
        <div class="chapter-tabs" id="chapterTabs">
          <button class="tab-item active" data-tab="videos">
            <i data-lucide="play-circle"></i> Videos <span class="tab-count">${videos.length}</span>
          </button>
          <button class="tab-item" data-tab="concepts">
            <i data-lucide="layers"></i> Concepts <span class="tab-count">${concepts.length}</span>
          </button>
          <button class="tab-item" data-tab="notes">
            <i data-lucide="file-text"></i> Notes <span class="tab-count">${notes.length}</span>
          </button>
          <button class="tab-item" data-tab="questions">
            <i data-lucide="help-circle"></i> Questions <span class="tab-count">${puQ.length}</span>
          </button>
          <button class="tab-item" data-tab="kcet">
            <i data-lucide="target"></i> KCET <span class="tab-count">${kcetQ.length}</span>
          </button>
          <button class="tab-item" data-tab="neet">
            <i data-lucide="flame"></i> NEET <span class="tab-count">${neetQ.length}</span>
          </button>
          <button class="tab-item" data-tab="tests">
            <i data-lucide="clipboard-list"></i> Tests <span class="tab-count">${tests.length}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="chapter-content">
          <!-- VIDEOS TAB -->
          <div class="tab-panel active" id="panel-videos">
            ${videos.length === 0 ? `
              <div class="empty-state">
                <i data-lucide="video-off"></i>
                <h3>No Videos Yet</h3>
                <p>Video lectures for this chapter will be added soon.</p>
              </div>
            ` : `
              <div class="video-grid">
                ${videos.map((v, idx) => {
                  const isLocked = !isPremium() && idx > 0;
                  const watched = progress.videosWatched?.includes(v.id);
                  const savedTime = localStorage.getItem('video_time_' + v.id) || 0;
                  const progressPct = savedTime > 0 ? 'width: 50%;' : 'width: 0%;'; // Simple mock
                  
                  const clickAction = isLocked 
                    ? `navigateTo('/pricing'); showToast('🔒 Premium Video: Upgrade to unlock full access', 'warning');` 
                    : `window.openVideo('${v.id}', '${v.youtubeId}')`;
                  
                  return `
                    <div class="video-card card hover-lift ${watched ? 'watched' : ''}" data-video-id="${v.id}" style="${isLocked ? 'opacity:0.85;' : ''}">
                      <div class="video-thumbnail" onclick="${clickAction}">
                        <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}" loading="lazy" style="${isLocked ? 'filter: blur(1.5px) grayscale(50%);' : ''}">
                        <div class="play-overlay"><i data-lucide="${isLocked ? 'lock' : 'play'}"></i></div>
                        ${isLocked ? '<span class="watched-badge badge-danger" style="background:#dc2626; color:white;">🔒 Premium</span>' : (watched ? '<span class="watched-badge">✓ Watched</span>' : (savedTime > 0 ? '<span class="watched-badge badge-warning" style="background:var(--accent-amber);color:#000;">Continue</span>' : ''))}
                        <div style="position:absolute; bottom:0; left:0; height:4px; background:rgba(0,0,0,0.5); width:100%;">
                           <div style="height:100%; background:var(--accent-amber); ${progressPct}"></div>
                        </div>
                      </div>
                      <div class="video-info">
                        <h4 style="display:flex; align-items:center; gap:6px;">
                          ${isLocked ? '<span style="font-size:0.9em;">🔒</span>' : ''} ${v.title}
                        </h4>
                        <span class="video-duration"><i data-lucide="clock"></i> ${v.duration || ''}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- CONCEPTS TAB -->
          <div class="tab-panel" id="panel-concepts">
            ${concepts.length === 0 ? `
              <div class="empty-state"><i data-lucide="layers"></i><h3>No Concepts Listed</h3></div>
            ` : `
              <div class="concepts-list">
                ${concepts.map((c, i) => {
                  const mastery = Store.getConceptMastery(c.id);
                  const badgeClass = mastery.score > 75 ? 'badge-success' : mastery.score > 50 ? 'badge-primary' : mastery.score > 25 ? 'badge-warning' : 'badge-info';
                  return `
                    <div class="concept-item card hover-lift flex-row justify-between align-center" onclick="navigateTo('/concept/${c.id}')" style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem;">
                      <div class="flex-row align-center gap-sm" style="display:flex; align-items:center; gap:12px;">
                        <div class="concept-number">${i + 1}</div>
                        <div class="concept-info">
                          <h4 style="margin:0; color:white; display:flex; align-items:center; gap:8px;">
                            ${c.title} 
                            <span class="badge ${badgeClass}" style="font-size:0.7rem; padding: 2px 6px;">${mastery.level} (${mastery.score}%)</span>
                          </h4>
                          <p class="text-muted" style="margin:4px 0 0 0; font-size:0.85rem;">${c.description || ''}</p>
                        </div>
                      </div>
                      <div class="flex-row gap-sm align-center" style="display:flex; align-items:center; gap:12px;">
                        <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); window.openAIWidgetWithConcept('${c.title}')" style="padding:4px 8px; font-size:0.75rem; color:var(--primary);" title="Ask AI Tutor">
                          <i data-lucide="bot" style="width:14px; height:14px; vertical-align:middle; display:inline-block; margin-right:4px;"></i> Ask AI
                        </button>
                        <i data-lucide="chevron-right"></i>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- NOTES TAB -->
          <div class="tab-panel" id="panel-notes">
            ${notes.length === 0 ? `
              <div class="empty-state"><i data-lucide="file-text"></i><h3>No Notes Available</h3><p>Notes will be uploaded soon.</p></div>
            ` : `
              <div class="notes-list">
                ${notes.map(n => {
                  const isRead = progress.notesRead?.includes(n.id);
                  return `
                    <div class="note-item card" data-note-id="${n.id}">
                      <div class="note-header">
                        <div>
                          <h4>${n.title}</h4>
                          <span class="badge ${n.type === 'revision' ? 'badge-warning' : 'badge-primary'}">${n.type === 'revision' ? 'Quick Revision' : 'Detailed'}</span>
                          ${isRead ? '<span class="badge badge-success">✓ Read</span>' : ''}
                        </div>
                        <button class="btn btn-sm btn-ghost mark-read-btn" data-note-id="${n.id}">${isRead ? 'Read' : 'Mark as Read'}</button>
                      </div>
                      <div class="note-content">${n.content || ''}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- PU QUESTIONS TAB -->
          <div class="tab-panel" id="panel-questions">
            ${renderQuestionList(puQ, 'PU Board')}
          </div>

          <!-- KCET TAB -->
          <div class="tab-panel" id="panel-kcet">
            ${renderQuestionList(kcetQ, 'KCET')}
          </div>

          <!-- NEET TAB -->
          <div class="tab-panel" id="panel-neet">
            ${renderQuestionList(neetQ, 'NEET')}
          </div>

          <!-- TESTS TAB -->
          <div class="tab-panel" id="panel-tests">
            ${tests.length === 0 ? `
              <div class="empty-state"><i data-lucide="clipboard-list"></i><h3>No Tests Available</h3></div>
            ` : `
              <div class="tests-grid">
                ${tests.map(t => {
                  const isPrem = isPremium();
                  const action = isPrem 
                    ? `navigateTo('/test/${t.id}')` 
                    : `navigateTo('/pricing'); showToast('🔒 Mock Tests are restricted to Premium members', 'warning');`;
                  return `
                    <div class="test-card card hover-lift" style="${!isPrem ? 'opacity:0.85;' : ''}">
                      <div class="test-card-header">
                        <h4 style="display:flex; align-items:center; gap:6px;">
                          ${!isPrem ? '<span>🔒</span>' : ''} ${t.title}
                        </h4>
                        <span class="badge">${t.type}</span>
                      </div>
                      <div class="test-meta">
                        <span><i data-lucide="help-circle"></i> ${(t.questionIds || []).length} Questions</span>
                        <span><i data-lucide="clock"></i> ${t.duration} min</span>
                      </div>
                      <button class="btn ${isPrem ? 'btn-primary' : 'btn-outline'} btn-block" onclick="${action}">
                        ${isPrem ? 'Start Test' : '🔒 Unlock Test'}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Smart Video Modal -->
        <div id="videoModal" class="video-modal-overlay" style="display:none; z-index:9999;" onclick="closeVideo(event)">
          <div class="video-modal" style="max-width:1000px; max-height:90vh; overflow-y:auto;">
            <button class="video-modal-close" onclick="closeVideo()">&times;</button>
            <div class="video-player-container flex-row gap-md p-md" style="flex-wrap:wrap;">
              <div style="flex:2; min-width:300px;">
                <div class="video-player" style="position:relative; padding-bottom:56.25%; height:0; background:#000;">
                  <div id="youtubePlayer" style="position:absolute; top:0; left:0; width:100%; height:100%;"></div>
                </div>
                <div class="video-controls flex-row justify-between align-center mt-sm p-sm rounded border" style="background:var(--surface-color);">
                  <div class="flex-row gap-sm align-center">
                    <i data-lucide="settings"></i> <strong>Playback Speed:</strong>
                    <select id="playbackSpeed" class="form-control" style="width:auto; padding:0.25rem;">
                      <option value="0.5">0.5x</option>
                      <option value="1" selected>1.0x (Normal)</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2.0x</option>
                    </select>
                  </div>
                  <div>
                    <button class="btn btn-sm btn-outline" id="markWatchedBtn"><i data-lucide="check"></i> Mark Watched (+50 XP)</button>
                  </div>
                </div>
              </div>
              <div style="flex:1; min-width:250px; display:flex; flex-direction:column; gap:1rem;">
                <div class="card" style="flex:1;">
                  <div class="card-header"><h4><i data-lucide="edit-3"></i> Video Notes</h4></div>
                  <div class="card-body" style="display:flex; flex-direction:column; gap:0.5rem; height:100%;">
                    <p class="text-muted text-sm">Jot down key points while watching. Notes are auto-saved.</p>
                    <textarea id="inlineVideoNotes" class="form-control" style="flex:1; resize:none;" placeholder="Type notes here..."></textarea>
                    <button class="btn btn-primary btn-block" id="saveInlineNotesBtn">Save Note at current timestamp</button>
                    <ul id="timestampNotesList" style="list-style:none; padding:0; margin:0; margin-top:1rem; font-size:0.9rem;">
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Tab switching
  document.querySelectorAll('#chapterTabs .tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#chapterTabs .tab-item').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  // Answer toggles
  document.querySelectorAll('.toggle-answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answerId = btn.dataset.answerId;
      const answerEl = document.getElementById(answerId);
      if (answerEl) {
        answerEl.classList.toggle('show');
        btn.textContent = answerEl.classList.contains('show') ? 'Hide Answer' : 'Show Answer';
      }
    });
  });

  // Load YouTube API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Speed Control
  document.getElementById('playbackSpeed').addEventListener('change', (e) => {
    if (ytPlayer && ytPlayer.setPlaybackRate) {
      ytPlayer.setPlaybackRate(parseFloat(e.target.value));
      showToast(`Speed set to ${e.target.value}x`);
    }
  });

  // Mark Watched
  document.getElementById('markWatchedBtn').addEventListener('click', () => {
    if (currentVideoId) {
      Store.markVideoWatched(currentVideoId);
      Store.addXP(50);
      showToast('Video marked as watched! +50 XP', 'success');
    }
  });

  // Notes
  const inlineNotes = document.getElementById('inlineVideoNotes');
  const saveNotesBtn = document.getElementById('saveInlineNotesBtn');
  const timestampNotesList = document.getElementById('timestampNotesList');

  saveNotesBtn.addEventListener('click', () => {
    if (!inlineNotes.value.trim()) return;
    let time = 0;
    if (ytPlayer && ytPlayer.getCurrentTime) {
      time = Math.floor(ytPlayer.getCurrentTime());
    }
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    const li = document.createElement('li');
    li.style.marginBottom = '0.5rem';
    li.style.borderBottom = '1px solid var(--border-color)';
    li.style.paddingBottom = '0.5rem';
    li.innerHTML = `<a href="#" onclick="seekTo(${time}); return false;" style="color:var(--accent-amber); font-weight:bold;">[${timeStr}]</a> ${inlineNotes.value}`;
    
    timestampNotesList.appendChild(li);
    inlineNotes.value = '';
    showToast('Note saved!', 'success');
  });

  window.seekTo = function(seconds) {
    if (ytPlayer && ytPlayer.seekTo) {
      ytPlayer.seekTo(seconds, true);
    }
  };
}

function openVideo(videoId, youtubeId) {
  currentVideoId = videoId;
  const modal = document.getElementById('videoModal');
  modal.style.display = 'flex';
  
  const savedTime = localStorage.getItem('video_time_' + videoId) || 0;
  if (savedTime > 0) {
    showToast('Resuming from where you left off');
  }

  if (window.YT && window.YT.Player) {
    if (!ytPlayer) {
      ytPlayer = new window.YT.Player('youtubePlayer', {
        videoId: youtubeId,
        playerVars: { 'autoplay': 1, 'start': parseInt(savedTime) },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    } else {
      ytPlayer.loadVideoById({videoId: youtubeId, startSeconds: parseInt(savedTime)});
    }
  } else {
    // Fallback if API hasn't loaded yet
    setTimeout(() => openVideo(videoId, youtubeId), 500);
    return;
  }

  // Start saving timestamp
  clearInterval(saveInterval);
  saveInterval = setInterval(() => {
    if (ytPlayer && ytPlayer.getCurrentTime) {
      const time = ytPlayer.getCurrentTime();
      if (time > 0) {
        localStorage.setItem('video_time_' + currentVideoId, Math.floor(time));
      }
    }
  }, 5000);
}

window.closeVideo = function(e) {
  if (e && e.target !== document.getElementById('videoModal') && !e.target.classList.contains('video-modal-close')) {
    return;
  }
  const modal = document.getElementById('videoModal');
  if (modal) modal.style.display = 'none';
  if (ytPlayer && ytPlayer.stopVideo) {
    ytPlayer.stopVideo();
  }
  clearInterval(saveInterval);
  currentVideoId = null;
}

function onPlayerStateChange(event) {
  // If ended
  if (event.data == window.YT.PlayerState.ENDED) {
    if (currentVideoId) {
      Store.markVideoWatched(currentVideoId);
      Store.addXP(50);
      showToast('Video completed! +50 XP', 'success');
    }
  }
}

function renderQuestionList(questions, label) {
  if (questions.length === 0) {
    return `<div class="empty-state"><i data-lucide="help-circle"></i><h3>No ${label} Questions Yet</h3></div>`;
  }
  const isPrem = isPremium();
  const visibleQuestions = isPrem ? questions : questions.slice(0, 5);
  const lockedCount = questions.length - visibleQuestions.length;

  return `
    <div class="question-list">
      ${visibleQuestions.map((q, i) => `
        <div class="question-item card">
          <div class="question-header">
            <span class="question-number">Q${i + 1}</span>
            <div class="question-tags">
              <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}">${q.difficulty}</span>
              ${q.year ? `<span class="badge">PYQ ${q.year}</span>` : ''}
            </div>
          </div>
          <p class="question-text">${q.question}</p>
          <div class="question-options">
            ${q.options.map((opt, oi) => `
              <div class="question-option ${oi === q.correctAnswer ? 'correct-option' : ''}" data-hidden="true">
                <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-sm btn-ghost toggle-answer-btn" data-answer-id="answer-${q.id}">Show Answer</button>
          <div class="question-answer" id="answer-${q.id}">
            <div class="correct-answer"><strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}</div>
            ${q.explanation ? `<div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
          </div>
        </div>
      `).join('')}
      
      ${lockedCount > 0 ? `
        <div class="card p-lg text-center" style="background:rgba(255,255,255,0.02); border: 2px dashed var(--gray-200); margin-top:20px;">
          <div style="font-size:2rem; margin-bottom:10px;">🔒</div>
          <h4 style="color:var(--gray-800);">Premium Question Bank</h4>
          <p class="text-muted" style="font-size:0.85rem; margin-bottom:15px; max-width:400px; margin-left:auto; margin-right:auto;">
            You have reached the free limit. Upgrade to unlock ${lockedCount} more ${label} practice questions.
          </p>
          <button class="btn btn-primary" onclick="navigateTo('/pricing')" style="display:inline-block; width:auto; padding:8px 20px; font-size:0.9rem;">Unlock Full Access</button>
        </div>
      ` : ''}
    </div>
  `;
}
