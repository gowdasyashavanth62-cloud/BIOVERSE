import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  const progress = await Store.getProgress();
  window.navigateTo = navigateTo;

  let activeMode = 'learn'; // learn, practice, revision
  let currentCardIndex = 0;
  let isFlipped = false;
  let customCards = Store.getCustomFlashcards();

  const defaultCards = [
    { id: 'dfc1', front: 'Mitochondria', back: 'Double-membrane organelle responsible for ATP synthesis (cellular respiration). Also called the powerhouse of the cell.' },
    { id: 'dfc2', front: 'Ribosome', back: 'Non-membrane bound organelles responsible for protein synthesis. Found in both eukaryotic and prokaryotic cells.' },
    { id: 'dfc3', front: 'Semiconservative replication', back: 'DNA replication model proved by Meselson and Stahl, where each new DNA double helix contains one original strand and one new strand.' },
    { id: 'dfc4', front: 'Codon', back: 'A sequence of three nucleotides on mRNA that corresponds with a specific amino acid or stop signal during protein synthesis.' },
    { id: 'dfc5', front: 'Synaptonemal Complex', back: 'A protein structure formed between homologous chromosomes during zygotene stage of meiosis prophase I, facilitating crossing over.' }
  ];

  // Combine default and custom cards
  let activeCards = [...defaultCards, ...customCards];

  // Practice scoring tracking
  let knownIds = [];
  let studyAgainIds = [];

  // Timed Revision setup
  let timerInterval = null;
  let timeRemaining = 10; // 10 seconds per card

  function renderFlashcards() {
    const mainContent = document.getElementById('flashcards-main-content');
    
    const modeTabs = ['learn', 'practice', 'revision'].map(mode => `
      <button class="tab-btn ${activeMode === mode ? 'tab-btn-active' : ''}" data-mode="${mode}" style="padding:8px 16px;font-size:13px;border-radius:12px;border:none;background:${activeMode === mode ? 'var(--primary)' : 'var(--gray-100)'};color:${activeMode === mode ? 'white' : 'var(--gray-600)'};cursor:pointer;font-family:var(--font-display);font-weight:600;text-transform:capitalize;transition:all 0.2s;">
        ${mode} Mode
      </button>
    `).join('');

    const card = activeCards[currentCardIndex];
    let cardContentHtml = '';

    if (activeCards.length === 0) {
      cardContentHtml = `
        <div class="card" style="text-align:center;padding:48px;color:var(--gray-400);">
          <i data-lucide="layers" style="width:48px;height:48px;margin:0 auto 16px auto;opacity:0.5;"></i>
          <p style="font-weight:600;font-size:16px;">No flashcards available</p>
          <p style="font-size:13px;margin-bottom:12px;">Create your own custom cards below to get started!</p>
        </div>
      `;
    } else {
      cardContentHtml = `
        <!-- Flashcard Viewport -->
        <div class="flashcard-wrapper">
          <div class="flashcard ${isFlipped ? 'flipped' : ''}" id="main-flashcard">
            <!-- Front -->
            <div class="flashcard-front">
              <span style="font-size:11px;color:var(--gray-400);text-transform:uppercase;font-weight:bold;margin-bottom:20px;letter-spacing:1px;">Question / Term</span>
              <h2 style="font-family:var(--font-display);color:var(--gray-800);font-size:24px;margin:0;">${card.front}</h2>
              <span style="font-size:11px;color:var(--primary);margin-top:40px;font-weight:600;">👉 Click to Flip Card</span>
            </div>
            <!-- Back -->
            <div class="flashcard-back">
              <span style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;font-weight:bold;margin-bottom:20px;letter-spacing:1px;">Explanation / Answer</span>
              <p style="font-size:15px;line-height:1.6;margin:0;">${card.back}</p>
              <span style="font-size:11px;color:var(--primary-300);margin-top:40px;font-weight:600;">👉 Click to Flip Back</span>
            </div>
          </div>
        </div>

        <!-- Controls Footer -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;max-width:480px;margin:0 auto;">
          <div style="display:flex;align-items:center;justify-content:space-between;width:100%;font-size:13px;color:var(--gray-500);font-weight:600;">
            <button class="btn btn-ghost" id="prev-card" style="padding:6px 12px;gap:6px;" ${currentCardIndex === 0 ? 'disabled' : ''}>
              <i data-lucide="chevron-left"></i> Previous
            </button>
            <span>Card ${currentCardIndex + 1} of ${activeCards.length}</span>
            <button class="btn btn-ghost" id="next-card" style="padding:6px 12px;gap:6px;" ${currentCardIndex === activeCards.length - 1 ? 'disabled' : ''}>
              Next <i data-lucide="chevron-right"></i>
            </button>
          </div>

          <!-- Mode specific actions -->
          ${_renderModeControls(card.id)}
        </div>
      `;
    }

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Flashcard Center</span>
        </div>
        <h1>🎴 Dynamic Flashcard Revision</h1>
        <p>Revision for high-yield PU Board definitions and NEET concepts using flashcards. Learn terms, practice matching, or take timed revision runs.</p>
      </div>

      <!-- Mode Selector -->
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        ${modeTabs}
      </div>

      <!-- Main Card Container -->
      <div style="margin-bottom:48px;">
        ${cardContentHtml}
      </div>

      <!-- Custom Card Creator -->
      <div class="card" style="max-width:600px;margin:0 auto;padding:24px;border:1.5px solid var(--primary-100);box-shadow:var(--shadow-md);">
        <h3 style="font-family:var(--font-display);color:var(--primary-900);margin-bottom:12px;font-size:16px;display:flex;align-items:center;gap:6px;">
          <i data-lucide="plus-circle" style="color:var(--primary);"></i> Create Custom Flashcard
        </h3>
        <form id="custom-card-form">
          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label" style="font-size:12px;font-weight:600;">Front (Term / Question)</label>
            <input type="text" id="cfc-front" placeholder="e.g. Splicing" class="form-input" required>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label" style="font-size:12px;font-weight:600;">Back (Definition / Answer)</label>
            <textarea id="cfc-back" placeholder="e.g. Process in eukaryotic cells where introns are removed and exons are joined together." class="form-input" style="min-height:70px;padding:8px 12px;font-size:13px;" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Add Card (+5 XP)</button>
        </form>
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind events
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(timerInterval);
        activeMode = btn.dataset.mode;
        currentCardIndex = 0;
        isFlipped = false;
        knownIds = [];
        studyAgainIds = [];
        if (activeMode === 'revision') {
          startRevisionTimer();
        }
        renderFlashcards();
      });
    });

    // Flip card
    const flashcardEl = document.getElementById('main-flashcard');
    if (flashcardEl) {
      flashcardEl.addEventListener('click', () => {
        isFlipped = !isFlipped;
        flashcardEl.classList.toggle('flipped', isFlipped);
      });
    }

    // Prev / Next controls
    const prevBtn = document.getElementById('prev-card');
    const nextBtn = document.getElementById('next-card');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
          currentCardIndex--;
          isFlipped = false;
          resetRevisionTimer();
          renderFlashcards();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentCardIndex < activeCards.length - 1) {
          currentCardIndex++;
          isFlipped = false;
          resetRevisionTimer();
          renderFlashcards();
        }
      });
    }

    // Mode actions: Known / Study Again
    const knownBtn = document.getElementById('known-btn');
    const studyAgainBtn = document.getElementById('study-again-btn');

    if (knownBtn) {
      knownBtn.addEventListener('click', async (e) => {
        const id = knownBtn.dataset.id;
        if (!knownIds.includes(id)) knownIds.push(id);
        studyAgainIds = studyAgainIds.filter(x => x !== id);
        
        // Go to next card
        if (currentCardIndex < activeCards.length - 1) {
          currentCardIndex++;
          isFlipped = false;
          renderFlashcards();
        } else {
          await showPracticeSummary();
        }
      });
    }

    if (studyAgainBtn) {
      studyAgainBtn.addEventListener('click', async (e) => {
        const id = studyAgainBtn.dataset.id;
        if (!studyAgainIds.includes(id)) studyAgainIds.push(id);
        knownIds = knownIds.filter(x => x !== id);
        
        if (currentCardIndex < activeCards.length - 1) {
          currentCardIndex++;
          isFlipped = false;
          renderFlashcards();
        } else {
          await showPracticeSummary();
        }
      });
    }

    // Custom Card submission
    const cardForm = document.getElementById('custom-card-form');
    cardForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const front = document.getElementById('cfc-front').value;
      const back = document.getElementById('cfc-back').value;
      
      await Store.saveCustomFlashcard(front, back);
      showToast('Custom card saved! +5 XP', 'success');
      customCards = Store.getCustomFlashcards();
      activeCards = [...defaultCards, ...customCards];
      
      cardForm.reset();
      renderFlashcards();
    });
  }

  function _renderModeControls(cardId) {
    if (activeMode === 'practice') {
      const knownCount = knownIds.length;
      return `
        <div style="display:flex;gap:12px;width:100%;margin-top:10px;">
          <button class="btn btn-outline btn-block" id="study-again-btn" data-id="${cardId}" style="border-color:var(--accent-red);color:var(--accent-red);padding:10px;font-size:12px;">
            ⚠️ Study Again
          </button>
          <button class="btn btn-primary btn-block" id="known-btn" data-id="${cardId}" style="padding:10px;font-size:12px;">
            ✅ I Know This (+5 XP)
          </button>
        </div>
        <div style="font-size:11px;color:var(--gray-500);text-align:center;width:100%;margin-top:8px;">
          Score: ${knownCount}/${activeCards.length} Mastered
        </div>
      `;
    }

    if (activeMode === 'revision') {
      return `
        <div style="background:var(--gray-100);width:100%;padding:10px 16px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:13px;color:var(--gray-700);">
          <i data-lucide="timer" style="width:16px;height:16px;color:var(--accent-red);"></i> 
          <span>Time remaining: <strong style="color:var(--accent-red);" id="revision-timer">${timeRemaining}s</strong></span>
        </div>
      `;
    }

    return '';
  }

  async function showPracticeSummary() {
    showToast(`Practice session finished! You mastered ${knownIds.length}/${activeCards.length} cards.`, 'success');
    const xpReward = knownIds.length * 5;
    if (xpReward > 0) {
      await Store.addXP(xpReward);
    }
    // Return to learn mode
    activeMode = 'learn';
    currentCardIndex = 0;
    renderFlashcards();
  }

  function startRevisionTimer() {
    timeRemaining = 10;
    timerInterval = setInterval(() => {
      timeRemaining--;
      const label = document.getElementById('revision-timer');
      if (label) label.textContent = `${timeRemaining}s`;
      
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        // Automatically flip card
        isFlipped = true;
        const mainCard = document.getElementById('main-flashcard');
        if (mainCard) mainCard.classList.add('flipped');
        
        // Wait 3 seconds, then go to next card
        setTimeout(() => {
          if (currentCardIndex < activeCards.length - 1) {
            currentCardIndex++;
            isFlipped = false;
            startRevisionTimer();
            renderFlashcards();
          } else {
            showToast('Timed Revision complete! Good job keeping up the speed.', 'success');
            activeMode = 'learn';
            currentCardIndex = 0;
            renderFlashcards();
          }
        }, 3000);
      }
    }, 1000);
  }

  function resetRevisionTimer() {
    if (activeMode === 'revision') {
      clearInterval(timerInterval);
      startRevisionTimer();
    }
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="flashcards-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  renderFlashcards();

  return () => {
    // Cleanup timer on leave
    clearInterval(timerInterval);
  };
}
