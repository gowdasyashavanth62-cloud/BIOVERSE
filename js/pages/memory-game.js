import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  window.navigateTo = navigateTo;

  let activeGame = 'match'; // match, label, speed
  
  // MATCHING GAME STATE
  let matchPairs = [
    { term: 'Mitochondria', desc: 'ATP synthesis' },
    { term: 'Chloroplast', desc: 'Photosynthesis' },
    { term: 'Ribosome', desc: 'Protein factory' },
    { term: 'Lysosome', desc: 'Suicidal bag' },
    { term: 'Helicase', desc: 'Unwinds DNA double helix' }
  ];
  let selectedTerm = null;
  let selectedDesc = null;
  let matchesCount = 0;

  // SPEED MCQ STATE
  let speedQuestions = [
    { q: 'Who proposed the semiconservative model of DNA replication?', a: ['Watson and Crick', 'Meselson and Stahl', 'Hershey and Chase', 'Griffith'], c: 0 },
    { q: 'Which stage of prophase I does crossing over occur?', a: ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'], c: 2 },
    { q: 'What is the phenotypic ratio of a Mendelian dihybrid cross?', a: ['3:1', '1:2:1', '9:3:3:1', '1:1:1:1'], c: 2 },
    { q: 'Which pigment acts as the primary reaction center in photosynthesis?', a: ['Chlorophyll a', 'Chlorophyll b', 'Carotenoids', 'Xanthophylls'], c: 0 }
  ];
  let currentSpeedIdx = 0;
  let speedScore = 0;
  let speedTimer = null;
  let speedTimeLeft = 30; // 30s initial timer

  function renderGame() {
    const mainContent = document.getElementById('game-main-content');

    const gameTabsHtml = [
      { id: 'match', label: 'Match Terms', icon: 'layers' },
      { id: 'label', label: 'Diagram Label', icon: 'image' },
      { id: 'speed', label: 'Speed MCQ Round', icon: 'zap' }
    ].map(game => `
      <button class="tab-btn ${activeGame === game.id ? 'tab-btn-active' : ''}" data-game="${game.id}" style="padding:8px 16px;font-size:13px;border-radius:12px;border:none;background:${activeGame === game.id ? 'var(--primary)' : 'var(--gray-100)'};color:${activeGame === game.id ? 'white' : 'var(--gray-600)'};cursor:pointer;font-family:var(--font-display);font-weight:600;display:flex;align-items:center;gap:6px;transition:all 0.2s;">
        <i data-lucide="${game.icon}" style="width:14px;height:14px;"></i> ${game.label}
      </button>
    `).join('');

    let gamePanelHtml = '';

    if (activeGame === 'match') {
      // Shuffle lists independently for matching
      const terms = [...matchPairs].sort(() => 0.5 - Math.random());
      const descs = [...matchPairs].sort(() => 0.5 - Math.random());

      const termsHtml = terms.map(t => `
        <div class="match-card term-card" data-term="${t.term}">${t.term}</div>
      `).join('');
      const descsHtml = descs.map(d => `
        <div class="match-card desc-card" data-desc="${d.desc}">${d.desc}</div>
      `).join('');

      gamePanelHtml = `
        <div style="text-align:center; margin-bottom:20px;">
          <h3 style="font-family:var(--font-display); color:var(--primary-900); font-size:16px;">Cell Organelles and Functions Matcher</h3>
          <p class="text-muted text-sm">Select a term on the left, then select its matching function on the right!</p>
        </div>
        <div class="matching-game-grid animate-fade-in">
          <div style="display:flex; flex-direction:column; gap:10px;">
            <h4 style="font-size:13px; text-transform:uppercase; color:var(--gray-500); font-weight:bold; text-align:center;">Organelle</h4>
            ${termsHtml}
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <h4 style="font-size:13px; text-transform:uppercase; color:var(--gray-500); font-weight:bold; text-align:center;">Function</h4>
            ${descsHtml}
          </div>
        </div>
      `;
    } else if (activeGame === 'label') {
      gamePanelHtml = `
        <div style="text-align:center; margin-bottom:20px;">
          <h3 style="font-family:var(--font-display); color:var(--primary-900); font-size:16px;">Plant Cell Labeling Challenge</h3>
          <p class="text-muted text-sm">Review chloroplast structure and click correct blanks!</p>
        </div>
        <div style="max-width:500px; margin:0 auto; text-align:center;" class="animate-fade-in">
          <!-- Chloroplast SVG Outline -->
          <svg viewBox="0 0 200 120" style="width:100%; max-height:250px; background:#f4fbf7; border:2px solid var(--primary-100); border-radius:var(--radius-lg);">
            <ellipse cx="100" cy="60" rx="80" ry="45" fill="none" stroke="var(--primary)" stroke-width="3"/>
            <!-- Stroma -->
            <text x="100" y="30" fill="var(--primary-800)" font-size="10" font-weight="bold">Stroma</text>
            <!-- Thylakoids -->
            <rect x="50" y="55" width="20" height="8" rx="2" fill="var(--primary-400)" />
            <rect x="50" y="65" width="20" height="8" rx="2" fill="var(--primary-400)" />
            <rect x="130" y="55" width="20" height="8" rx="2" fill="var(--primary-400)" />
            
            <!-- Hotspots -->
            <circle cx="60" cy="50" r="8" fill="#e5e7eb" stroke="var(--gray-400)" stroke-width="1.5" style="cursor:pointer;" class="label-hotspot" data-label="Thylakoid"/>
            <text x="60" y="53" fill="var(--gray-700)" font-size="8" text-anchor="middle" font-weight="bold" pointer-events="none">1</text>

            <circle cx="100" cy="40" r="8" fill="#e5e7eb" stroke="var(--gray-400)" stroke-width="1.5" style="cursor:pointer;" class="label-hotspot" data-label="Stroma"/>
            <text x="100" y="43" fill="var(--gray-700)" font-size="8" text-anchor="middle" font-weight="bold" pointer-events="none">2</text>
          </svg>
          
          <div style="display:flex; justify-content:center; gap:12px; margin-top:20px;" id="labels-drawer">
            <button class="btn btn-outline select-label-btn" data-label="Thylakoid" style="padding:6px 12px; font-size:12px;">Thylakoid</button>
            <button class="btn btn-outline select-label-btn" data-label="Stroma" style="padding:6px 12px; font-size:12px;">Stroma</button>
          </div>
        </div>
      `;
    } else if (activeGame === 'speed') {
      const qObj = speedQuestions[currentSpeedIdx];
      const answersHtml = qObj.a.map((ans, idx) => `
        <button class="btn btn-outline speed-choice-btn" data-index="${idx}" style="padding:10px; font-size:12.5px;">${ans}</button>
      `).join('');

      gamePanelHtml = `
        <div style="max-width:500px; margin:0 auto; text-align:center;" class="animate-fade-in">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; font-weight:bold; font-size:14px; font-family:var(--font-display);">
            <span style="color:var(--primary);">Score: ${speedScore}</span>
            <span style="color:var(--accent-red);">⏱️ Time: ${speedTimeLeft}s</span>
          </div>

          <div class="card" style="padding:20px; border:2px solid var(--primary-100);">
            <p style="font-weight:700; font-size:15px; margin:0 0 16px 0;">${qObj.q}</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${answersHtml}
            </div>
          </div>
        </div>
      `;
    }

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Biology Games Center</span>
        </div>
        <h1>🧩 Biology Gamified Revision Hub</h1>
        <p>Interactive games designed to make revision addictive. Test your anatomy maps, term matches, or fight the clock in speed MCQ rounds!</p>
      </div>

      <!-- Game Selection Tabs -->
      <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
        ${gameTabsHtml}
      </div>

      <!-- Active Game Viewport -->
      <div class="card" style="padding:32px; border:1px solid var(--gray-200); box-shadow:var(--shadow-sm); min-height:300px; display:flex; flex-direction:column; justify-content:center;">
        ${gamePanelHtml}
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind event handlers
    // Game selection
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(speedTimer);
        activeGame = btn.dataset.game;
        
        // Reset states
        selectedTerm = null;
        selectedDesc = null;
        matchesCount = 0;
        
        currentSpeedIdx = 0;
        speedScore = 0;
        speedTimeLeft = 30;
        
        if (activeGame === 'speed') {
          startSpeedGame();
        }
        
        renderGame();
      });
    });

    // MATCHING GAME HANDLERS
    if (activeGame === 'match') {
      document.querySelectorAll('.term-card').forEach(card => {
        card.addEventListener('click', async () => {
          document.querySelectorAll('.term-card').forEach(c => c.classList.remove('selected'));
          selectedTerm = card.dataset.term;
          card.classList.add('selected');
          await checkMatches();
        });
      });

      document.querySelectorAll('.desc-card').forEach(card => {
        card.addEventListener('click', async () => {
          document.querySelectorAll('.desc-card').forEach(c => c.classList.remove('selected'));
          selectedDesc = card.dataset.desc;
          card.classList.add('selected');
          await checkMatches();
        });
      });
    }

    // DIAGRAM LABELING HANDLERS
    if (activeGame === 'label') {
      let activeHotspot = null;

      document.querySelectorAll('.label-hotspot').forEach(spot => {
        spot.addEventListener('click', () => {
          document.querySelectorAll('.label-hotspot').forEach(s => s.setAttribute('stroke', 'var(--gray-400)'));
          spot.setAttribute('stroke', 'var(--primary)');
          activeHotspot = spot;
          showToast('Select matching label from below');
        });
      });

      document.querySelectorAll('.select-label-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!activeHotspot) {
            showToast('Select a numbered spot on the diagram first!', 'warning');
            return;
          }
          const spotLabel = activeHotspot.dataset.label;
          const selectedLabel = btn.dataset.label;

          if (spotLabel === selectedLabel) {
            activeHotspot.setAttribute('fill', 'var(--primary-200)');
            activeHotspot.setAttribute('stroke', 'var(--success)');
            btn.style.background = 'var(--primary-100)';
            btn.style.color = 'var(--primary)';
            btn.setAttribute('disabled', 'true');
            showToast('Correct! +15 XP', 'success');
            await Store.addXP(15);
            activeHotspot = null;
          } else {
            showToast('Incorrect label, try again!', 'error');
          }
        });
      });
    }

    // SPEED MCQ HANDLERS
    if (activeGame === 'speed') {
      document.querySelectorAll('.speed-choice-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const selected = parseInt(btn.dataset.index);
          const correct = speedQuestions[currentSpeedIdx].c;

          if (selected === correct) {
            speedScore++;
            speedTimeLeft += 5; // Reward time
            showToast('Correct! +5s +10 XP', 'success');
            await Store.addXP(10);
            
            // Go next
            if (currentSpeedIdx < speedQuestions.length - 1) {
              currentSpeedIdx++;
            } else {
              // End game successfully
              clearInterval(speedTimer);
              showToast(`Fantastic! Finished with score: ${speedScore}`, 'success');
              await Store.addXP(100);
              activeGame = 'match';
            }
            renderGame();
          } else {
            showToast('Incorrect! Try another question.', 'error');
            // Go next anyway but no time reward
            if (currentSpeedIdx < speedQuestions.length - 1) {
              currentSpeedIdx++;
              renderGame();
            } else {
              clearInterval(speedTimer);
              activeGame = 'match';
              renderGame();
            }
          }
        });
      });
    }
  }

  async function checkMatches() {
    if (selectedTerm && selectedDesc) {
      // Find pair
      const pair = matchPairs.find(p => p.term === selectedTerm && p.desc === selectedDesc);
      if (pair) {
        // Success
        document.querySelector(`.term-card[data-term="${selectedTerm}"]`).classList.add('matched');
        document.querySelector(`.desc-card[data-desc="${selectedDesc}"]`).classList.add('matched');
        showToast('Matched! +10 XP', 'success');
        await Store.addXP(10);
        matchesCount++;
        
        if (matchesCount === matchPairs.length) {
          setTimeout(async () => {
            showToast('Superb! You matched all pairs! Bonus +50 XP', 'success');
            await Store.addXP(50);
            // Reset
            selectedTerm = null;
            selectedDesc = null;
            matchesCount = 0;
            renderGame();
          }, 1000);
        }
      } else {
        // Mismatch
        showToast('Mismatch! Try again.', 'error');
        document.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
      }
      selectedTerm = null;
      selectedDesc = null;
    }
  }

  function startSpeedGame() {
    speedTimer = setInterval(() => {
      speedTimeLeft--;
      const label = document.getElementById('revision-timer'); // reused timer or speed label
      
      // Update timer in UI if rendered
      const timeSpan = document.querySelector('[style*="color:var(--accent-red)"]');
      if (timeSpan) {
        timeSpan.textContent = `⏱️ Time: ${speedTimeLeft}s`;
      }

      if (speedTimeLeft <= 0) {
        clearInterval(speedTimer);
        showToast(`Time is up! Final score: ${speedScore}`, 'warning');
        activeGame = 'match';
        renderGame();
      }
    }, 1000);
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="game-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  renderGame();

  return () => {
    clearInterval(speedTimer);
  };
}
