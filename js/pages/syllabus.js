import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { ProgressBar } from '../components/progress-bar.js';

export function render(params) {
  const app = document.getElementById('app');
  const classId = params.classId;
  const className = classId === 'pu1' ? '1st PU Biology' : '2nd PU Biology';
  const classEmoji = classId === 'pu1' ? '🌱' : '🧬';
  const units = Store.getUnits(classId);
  window.navigateTo = navigateTo;

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <!-- Header -->
        <div class="chapter-header syllabus-header">
          <div class="breadcrumb">
            <a href="#/dashboard">Dashboard</a>
            <i data-lucide="chevron-right"></i>
            <span>${className}</span>
          </div>
          <h1>${classEmoji} ${className}</h1>
          <p>${units.length} Units · ${units.reduce((s, u) => s + u.chapters.length, 0)} Chapters</p>
        </div>

        <!-- Search -->
        <div class="search-filter-bar animate-fade-in">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="chapterSearch" placeholder="Search chapters..." class="form-input">
          </div>
        </div>

        <!-- Units Accordion -->
        <div class="units-list animate-fade-in" id="unitsList">
          ${units.map((unit, ui) => `
            <div class="unit-accordion" data-unit-index="${ui}">
              <button class="accordion-header unit-header" data-toggle="unit-${ui}">
                <div class="unit-header-left">
                  <span class="unit-icon">${unit.icon || '📘'}</span>
                  <div>
                    <h3>Unit ${unit.number}: ${unit.title}</h3>
                    <p class="text-muted">${unit.chapters.length} Chapters · ${unit.description || ''}</p>
                  </div>
                </div>
                <i data-lucide="chevron-down" class="accordion-arrow"></i>
              </button>
              <div class="accordion-content" id="unit-${ui}">
                <div class="chapters-grid">
                  ${unit.chapters.map((ch, ci) => {
                    const cp = Store.getChapterProgress(ch.id);
                    return `
                      <div class="chapter-card-item card hover-lift" onclick="navigateTo('/chapter/${ch.id}')" data-chapter-name="${(ch.title || '').toLowerCase()}">
                        <div class="chapter-card-top">
                          <span class="chapter-icon">${ch.icon || '📖'}</span>
                          <span class="chapter-number">Ch ${ch.order || ci + 1}</span>
                        </div>
                        <h4>${ch.title}</h4>
                        <p class="text-muted chapter-desc">${ch.description || ''}</p>
                        <div class="chapter-card-footer">
                          ${ProgressBar(cp.percentage, { height: '4px', showLabel: false })}
                          <div class="chapter-meta">
                            <span><i data-lucide="play-circle"></i> ${cp.videos.total}</span>
                            <span><i data-lucide="file-text"></i> ${cp.notes.total}</span>
                            <span><i data-lucide="help-circle"></i> ${cp.questions.total}</span>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Accordion toggle
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.toggle;
      const content = document.getElementById(targetId);
      const arrow = btn.querySelector('.accordion-arrow');
      const isOpen = content.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
      document.querySelectorAll('.accordion-arrow').forEach(a => a.style.transform = '');
      if (!isOpen) {
        content.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Open first unit by default
  const firstContent = document.getElementById('unit-0');
  if (firstContent) {
    firstContent.classList.add('open');
    const firstArrow = document.querySelector('[data-toggle="unit-0"] .accordion-arrow');
    if (firstArrow) firstArrow.style.transform = 'rotate(180deg)';
  }

  // Search
  const searchInput = document.getElementById('chapterSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('[data-chapter-name]').forEach(card => {
        card.style.display = card.dataset.chapterName.includes(q) ? '' : 'none';
      });
      // Show all accordions when searching
      if (q) {
        document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('open'));
      }
    });
  }
}
