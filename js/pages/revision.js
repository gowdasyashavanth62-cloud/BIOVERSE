import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  window.navigateTo = navigateTo;

  let activeDuration = 15; // 15, 30, 60
  let selectedChapterId = 'ch_molecular'; // default

  async function renderRevision() {
    const mainContent = document.getElementById('revision-main-content');
    const chapters = await Store.getAllChapters() || [];

    const durationTabsHtml = [15, 30, 60].map(dur => `
      <button class="tab-btn ${activeDuration === dur ? 'tab-btn-active' : ''}" data-dur="${dur}" style="padding:8px 16px;font-size:13px;border-radius:12px;border:none;background:${activeDuration === dur ? 'var(--primary)' : 'var(--gray-100)'};color:${activeDuration === dur ? 'white' : 'var(--gray-600)'};cursor:pointer;font-family:var(--font-display);font-weight:600;transition:all 0.2s;">
        ⏱️ ${dur} Min Revision
      </button>
    `).join('');

    const selectOptionsHtml = chapters.map(ch => `
      <option value="${ch.id}" ${selectedChapterId === ch.id ? 'selected' : ''}>${ch.title}</option>
    `).join('');

    // Generate revision materials dynamically depending on duration & chapter
    const revisionContent = await _getRevisionMaterials(selectedChapterId, activeDuration);

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Quick Exam-Day Revision</span>
        </div>
        <h1>⚡ Exam-Day Quick Revision Center</h1>
        <p>Short on time? Select your target duration and chapter to load a speed-optimized checklist of definitions, memory tricks, and high-weightage diagrams.</p>
      </div>

      <!-- Select Chapter & Duration Bar -->
      <div class="card" style="padding:20px; margin-bottom:24px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <!-- Duration Tabs -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${durationTabsHtml}
          </div>
          
          <!-- Select Chapter -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:13px; color:var(--gray-600); font-weight:600;">Chapter:</span>
            <select id="chapterSelect" class="form-input" style="width:220px; height:36px; padding:0 8px; font-size:12px;">
              ${selectOptionsHtml}
            </select>
          </div>
        </div>
      </div>

      <!-- Revision Display Area -->
      <div class="card" style="padding:24px; border:1px solid var(--gray-200); box-shadow:var(--shadow-sm);">
        ${revisionContent}
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind event listeners
    // Duration tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        activeDuration = parseInt(btn.dataset.dur);
        await renderRevision();
      });
    });

    // Chapter select
    document.getElementById('chapterSelect').addEventListener('change', async (e) => {
      selectedChapterId = e.target.value;
      await renderRevision();
    });
  }

  async function _getRevisionMaterials(chapterId, duration) {
    const ch = await Store.getChapter(chapterId);
    if (!ch) return `<p>Select a chapter to begin.</p>`;

    // Define content mapping based on chapter
    let chapterData = {
      title: ch.title,
      tricks: '💡 *Textbook Tip:* Review matching tables inside NCERT diagrams.',
      highlights: '• Focus on definitions and pathway components.',
      formulas: '• No equations in this chapter, focus on pathways.'
    };

    if (chapterId === 'ch_molecular' || chapterId.includes('inheritance')) {
      chapterData = {
        title: 'Molecular Basis of Inheritance',
        tricks: `💡 *Memory Trick:* **H**elicase **H**alves the helix (unwinding); **P**olymerase **P**olishes new strands (replication); **L**igase **L**inks Okazaki fragments together.`,
        highlights: `
          • **DNA Structure:** Right-handed double helix, 0.34 nm between base pairs, 3.4 nm per pitch, anti-parallel strands.
          • **Transcription Unit:** Promoter, Structural gene, Terminator. RNA polymerase binds to promoter.
          • **Genetic Code:** Triplet, degenerate, non-overlapping, universal. AUG codes for Methionine and acts as initiator codon.
        `,
        formulas: `
          • **Chargaff's Rule:** In double-stranded DNA, \([A] + [G] = [T] + [C]\), or \(A/T = G/C = 1\).
          • **Replication Direction:** Always synthesized in 5' to 3' direction.
        `
      };
    } else if (chapterId === 'ch_photosynthesis' || chapterId.includes('photo')) {
      chapterData = {
        title: 'Photosynthesis in Higher Plants',
        tricks: `💡 *Memory Trick:* **C**owboys **R**ide **R**apidly — **C**arboxylation, **R**eduction, **R**egeneration (Stages of Calvin Cycle).`,
        highlights: `
          • **Light reaction (Granum):** Absorption of light, splitting of water (Photolysis), release of oxygen, formation of ATP and NADPH.
          • **Dark reaction (Stroma):** Carbon fixation cycle converting CO2 to sugars, utilizing ATP and NADPH.
        `,
        formulas: `
          • **Calvin Cycle (C3):** Requires 3 ATP and 2 NADPH for every CO2 fixed. For one molecule of Glucose (6 carbons), 18 ATP and 12 NADPH are used.
          • **Hatch-Slack Pathway (C4):** Requires 30 ATP and 12 NADPH to produce one Glucose.
        `
      };
    }

    // Compose markup according to selected duration
    let bodyHtml = `
      <div style="border-bottom:2px solid var(--primary-100); padding-bottom:12px; margin-bottom:16px;">
        <h2 style="font-family:var(--font-display); color:var(--primary); font-size:18px;">${chapterData.title}</h2>
        <span style="font-size:11px; background:var(--primary-50); color:var(--primary); padding:2px 8px; border-radius:12px; font-weight:bold;">⏱️ ${duration} min checklist active</span>
      </div>
    `;

    // 15 Min: Key Concepts, Memory Tricks
    bodyHtml += `
      <div style="margin-bottom:16px;">
        <h3 style="font-size:14px; font-family:var(--font-display); color:var(--gray-800); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i data-lucide="book-open" style="color:var(--primary);width:16px;height:16px;"></i> High-Yield Concept Highlights</h3>
        <div style="font-size:13px; color:var(--gray-700); line-height:1.5; padding-left:8px;">
          ${chapterData.highlights}
        </div>
      </div>

      <div style="margin-bottom:16px; background:var(--primary-50); padding:12px; border-radius:var(--radius-md); border:1px solid var(--primary-100);">
        <h3 style="font-size:13px; font-family:var(--font-display); color:var(--primary-900); margin-bottom:4px; display:flex; align-items:center; gap:6px;"><i data-lucide="sparkles" style="color:var(--primary);width:14px;height:14px;"></i> AI Memory Tricks & Mnemonics</h3>
        <p style="font-size:12.5px; color:var(--primary-800); line-height:1.4; margin:0;">${chapterData.tricks}</p>
      </div>
    `;

    // 30 Min: Adds Key Formulas/Cycles and Weightage
    if (duration >= 30) {
      bodyHtml += `
        <div style="margin-bottom:16px; border-top:1px dashed var(--gray-200); padding-top:16px;">
          <h3 style="font-size:14px; font-family:var(--font-display); color:var(--gray-800); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i data-lucide="activity" style="color:var(--accent-purple);width:16px;height:16px;"></i> Key Pathways & Mathematical Rules</h3>
          <div style="font-size:13px; color:var(--gray-700); line-height:1.5; padding-left:8px;">
            ${chapterData.formulas}
          </div>
        </div>

        <div style="margin-bottom:16px; background:var(--gray-50); padding:12px; border-radius:var(--radius-md); border:1px solid var(--gray-200);">
          <h4 style="font-size:12px; color:var(--gray-700); font-weight:bold; margin-bottom:4px;">🔥 Board & Entrance Exam Weightage</h4>
          <p style="font-size:12px; color:var(--gray-500); margin:0;">This chapter has high weightage, typically representing <strong>3-4 questions</strong> in NEET and <strong>5 marks</strong> in KCET.</p>
        </div>
      `;
    }

    // 60 Min: Rapid review speed MCQs
    if (duration === 60) {
      bodyHtml += `
        <div style="border-top:1px dashed var(--gray-200); padding-top:16px; margin-top:16px;">
          <h3 style="font-size:14px; font-family:var(--font-display); color:var(--gray-800); margin-bottom:12px; display:flex; align-items:center; gap:6px;"><i data-lucide="help-circle" style="color:var(--accent-amber);width:16px;height:16px;"></i> Rapid speed MCQs for testing</h3>
          <div style="background:var(--surface-color); padding:14px; border-radius:var(--radius-md); border:1.5px solid var(--primary-100);">
            <p style="margin:0 0 8px 0; font-weight:600; font-size:13px;">Q: If a DNA strand has 30% Adenine, what is the percentage of Cytosine?</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="btn btn-outline btn-sm speed-ans-btn" data-correct="true" style="padding:6px; font-size:11px;">A) 20%</button>
              <button class="btn btn-outline btn-sm speed-ans-btn" style="padding:6px; font-size:11px;">B) 30%</button>
              <button class="btn btn-outline btn-sm speed-ans-btn" style="padding:6px; font-size:11px;">C) 40%</button>
              <button class="btn btn-outline btn-sm speed-ans-btn" style="padding:6px; font-size:11px;">D) 50%</button>
            </div>
          </div>
        </div>
      `;
      
      // Bind speed MCQs click events after rendering
      setTimeout(() => {
        document.querySelectorAll('.speed-ans-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const isCorrect = btn.dataset.correct === 'true';
            if (isCorrect) {
              btn.style.background = 'var(--primary-100)';
              btn.style.borderColor = 'var(--primary)';
              showToast('Correct! +10 XP', 'success');
              await Store.addXP(10);
            } else {
              btn.style.background = 'rgba(239, 68, 68, 0.1)';
              btn.style.borderColor = 'var(--accent-red)';
              showToast('Try again!', 'error');
            }
          });
        });
      }, 100);
    }

    return bodyHtml;
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="revision-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  await renderRevision();
}
