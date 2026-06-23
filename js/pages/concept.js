import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const app = document.getElementById('app');
  const concept = Store.getConcept(params.conceptId);
  if (!concept) { navigateTo('/dashboard'); return; }

  const videos = Store.getVideos(params.conceptId);
  const questions = Store.getQuestions({ conceptId: params.conceptId }).slice(0, 5);
  const progress = Store.getProgress();

  window.navigateTo = navigateTo;

  const classId = concept.classId;
  const classLabel = classId === 'pu1' ? '1st PU' : '2nd PU';

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="chapter-header animate-fade-in">
          <div class="breadcrumb">
            <a href="#/dashboard">Dashboard</a>
            <i data-lucide="chevron-right"></i>
            <a href="#/syllabus/${classId}">${classLabel}</a>
            <i data-lucide="chevron-right"></i>
            <a href="#/chapter/${concept.chapterId}">${concept.chapterTitle}</a>
            <i data-lucide="chevron-right"></i>
            <span>${concept.title}</span>
          </div>
          <h1>${concept.title}</h1>
          <p class="text-muted">${concept.description || ''}</p>
        </div>

        <!-- Video Section -->
        <section class="section animate-fade-in">
          <h2><i data-lucide="play-circle"></i> Video Lectures</h2>
          ${videos.length === 0 ? `
            <div class="empty-state card"><p>No videos available for this concept yet.</p></div>
          ` : `
            <div class="concept-video-main">
              <div class="video-player">
                <iframe id="mainVideo" src="https://www.youtube.com/embed/${videos[0].youtubeId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
              </div>
              <h3 id="currentVideoTitle">${videos[0].title}</h3>
            </div>
            ${videos.length > 1 ? `
              <div class="video-list-small">
                ${videos.map((v, i) => `
                  <div class="video-list-item ${i === 0 ? 'active' : ''}" data-video-yt="${v.youtubeId}" data-video-title="${v.title}" data-video-id="${v.id}">
                    <img src="https://img.youtube.com/vi/${v.youtubeId}/default.jpg" alt="">
                    <div>
                      <strong>${v.title}</strong>
                      <span class="text-muted">${v.duration || ''}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          `}
        </section>

        <!-- Quick Quiz -->
        ${questions.length > 0 ? `
        <section class="section animate-fade-in">
          <h2><i data-lucide="zap"></i> Quick Quiz</h2>
          <div class="quick-quiz" id="quickQuiz">
            ${questions.map((q, i) => `
              <div class="quiz-question card" data-qid="${q.id}" data-correct="${q.correctAnswer}">
                <p><strong>Q${i + 1}.</strong> ${q.question}</p>
                <div class="quiz-options">
                  ${q.options.map((opt, oi) => `
                    <button class="quiz-option" data-option="${oi}">
                      <span class="option-letter">${String.fromCharCode(65 + oi)}</span> ${opt}
                    </button>
                  `).join('')}
                </div>
                <div class="quiz-feedback" style="display:none">
                  <p class="explanation">${q.explanation || ''}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Back to Chapter -->
        <div class="section" style="text-align:center;">
          <button class="btn btn-outline" onclick="navigateTo('/chapter/${concept.chapterId}')">
            <i data-lucide="arrow-left"></i> Back to ${concept.chapterTitle}
          </button>
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Video switching
  document.querySelectorAll('.video-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const iframe = document.getElementById('mainVideo');
      const titleEl = document.getElementById('currentVideoTitle');
      iframe.src = `https://www.youtube.com/embed/${item.dataset.videoYt}`;
      titleEl.textContent = item.dataset.videoTitle;
      document.querySelectorAll('.video-list-item').forEach(v => v.classList.remove('active'));
      item.classList.add('active');
      Store.markVideoWatched(item.dataset.videoId);
    });
  });

  // Quiz interactions
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const questionEl = btn.closest('.quiz-question');
      if (questionEl.classList.contains('answered')) return;
      questionEl.classList.add('answered');
      const correct = parseInt(questionEl.dataset.correct);
      const selected = parseInt(btn.dataset.option);
      questionEl.querySelectorAll('.quiz-option').forEach((o, i) => {
        if (i === correct) o.classList.add('correct');
        if (i === selected && i !== correct) o.classList.add('wrong');
        o.disabled = true;
      });
      questionEl.querySelector('.quiz-feedback').style.display = 'block';
    });
  });

  // Mark first video as watched
  if (videos.length > 0) Store.markVideoWatched(videos[0].id);
}
