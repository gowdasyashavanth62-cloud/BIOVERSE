import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { navigateTo } from '../router.js';
import { diagramsData } from '../data/diagrams.js';

export function render(params) {
  const app = document.getElementById('app');
  const diagramId = params && params.id ? params.id : null;
  const diagram = diagramsData.find(d => d.id === diagramId);

  if (!diagram) {
    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="card p-4 text-center">
            <h2>Diagram Not Found</h2>
            <button class="btn btn-primary mt-3" onclick="navigateTo('/diagrams')">Back to Diagrams</button>
          </div>
        </main>
      </div>
    `;
    initNavbar();
    initSidebar();
    window.navigateTo = navigateTo;
    return;
  }

  // Shuffle labels for the word bank
  const shuffledLabels = [...diagram.hotspots].sort(() => Math.random() - 0.5);

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="mb-3">
          <button class="btn btn-ghost" onclick="navigateTo('/diagrams')">
            <i data-lucide="arrow-left"></i> Back to Diagrams
          </button>
        </div>
        
        <section class="section animate-fade-in">
          <div class="section-header">
            <h2>${diagram.title}</h2>
            <p class="text-muted">Drag labels to their correct positions or click a hotspot to select a label.</p>
          </div>
          
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <!-- Diagram Area -->
            <div style="flex: 2; min-width: 300px; position: relative;">
              <div class="card" style="padding: 10px; display: inline-block; position: relative;">
                <img src="${diagram.imageUrl}" alt="${diagram.title}" style="max-width: 100%; border-radius: var(--radius-md); display: block;" id="diagram-img">
                
                ${diagram.hotspots.map((hs, index) => `
                  <div class="hotspot" data-id="${hs.id}" style="
                    position: absolute; 
                    left: ${hs.x}%; 
                    top: ${hs.y}%; 
                    width: 24px; 
                    height: 24px; 
                    margin-left: -12px; 
                    margin-top: -12px; 
                    background: var(--accent-amber); 
                    border: 2px solid white; 
                    border-radius: 50%; 
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                  ">${index + 1}</div>
                `).join('')}
              </div>
            </div>
            
            <!-- Labels Area -->
            <div style="flex: 1; min-width: 250px;">
              <div class="card">
                <div class="card-header">
                  <h3>Labels</h3>
                </div>
                <div class="card-body">
                  <div id="word-bank" style="display: flex; flex-direction: column; gap: 10px;">
                    ${shuffledLabels.map(hs => `
                      <div class="label-item" data-label="${hs.label}" data-id="${hs.id}" style="
                        padding: 10px;
                        background: var(--bg-hover);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-sm);
                        cursor: grab;
                        user-select: none;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                        <span>${hs.label}</span>
                        <span class="status-icon"></span>
                      </div>
                    `).join('')}
                  </div>
                  
                  <div class="mt-4">
                    <button id="check-answers" class="btn btn-primary" style="width: 100%;">Check Answers</button>
                    <button id="reset-quiz" class="btn btn-ghost mt-2" style="width: 100%;">Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Selection Modal (Mobile Friendly) -->
        <div id="label-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
          <div class="card" style="width: 90%; max-width: 400px; padding: 20px;">
            <h3 id="modal-title">Select Label for Hotspot</h3>
            <div id="modal-options" style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px; max-height: 60vh; overflow-y: auto;"></div>
            <button class="btn btn-ghost mt-3" style="width: 100%;" onclick="document.getElementById('label-modal').style.display='none'">Cancel</button>
          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  window.navigateTo = navigateTo;

  // Simple logic for matching hotspots and labels via clicking
  const userAnswers = {}; // hs_id -> label string
  let currentHotspotId = null;

  const hotspots = document.querySelectorAll('.hotspot');
  const labelModal = document.getElementById('label-modal');
  const modalOptions = document.getElementById('modal-options');
  const checkBtn = document.getElementById('check-answers');
  const resetBtn = document.getElementById('reset-quiz');
  const labelItems = document.querySelectorAll('.label-item');

  hotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      currentHotspotId = hs.dataset.id;
      document.getElementById('modal-title').innerText = `Select label for Hotspot ${hs.innerText}`;
      
      modalOptions.innerHTML = shuffledLabels.map(l => {
        const isSelected = userAnswers[currentHotspotId] === l.label;
        return `<button class="btn ${isSelected ? 'btn-primary' : 'btn-outline'}" onclick="window.selectLabel('${l.label.replace(/'/g, "\\'")}')">${l.label}</button>`;
      }).join('');
      
      labelModal.style.display = 'flex';
    });
  });

  window.selectLabel = (labelStr) => {
    if (currentHotspotId) {
      userAnswers[currentHotspotId] = labelStr;
      
      // Update hotspot UI
      const hsElement = document.querySelector(`.hotspot[data-id="${currentHotspotId}"]`);
      hsElement.style.background = 'var(--primary)';
      hsElement.setAttribute('title', labelStr);
      
      // Update label item UI
      labelItems.forEach(item => {
        if (item.dataset.label === labelStr) {
          item.style.borderLeft = '4px solid var(--primary)';
        }
      });
    }
    labelModal.style.display = 'none';
  };

  checkBtn.addEventListener('click', () => {
    let correctCount = 0;
    
    diagram.hotspots.forEach(hs => {
      const isCorrect = userAnswers[hs.id] === hs.label;
      const hsElement = document.querySelector(`.hotspot[data-id="${hs.id}"]`);
      
      if (userAnswers[hs.id]) {
        if (isCorrect) {
          hsElement.style.background = 'var(--accent-green)';
          correctCount++;
        } else {
          hsElement.style.background = 'var(--accent-red)';
        }
      }
      
      // Update word bank styling
      labelItems.forEach(item => {
        if (item.dataset.id === hs.id) {
          const iconSpan = item.querySelector('.status-icon');
          if (userAnswers[hs.id] === hs.label) {
            iconSpan.innerHTML = '✅';
          } else {
             // Reset if wrong
             if (userAnswers[hs.id]) iconSpan.innerHTML = '❌';
          }
        }
      });
    });
    
    alert(`You got ${correctCount} out of ${diagram.hotspots.length} correct!`);
  });

  resetBtn.addEventListener('click', () => {
    Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
    hotspots.forEach(hs => {
      hs.style.background = 'var(--accent-amber)';
      hs.removeAttribute('title');
    });
    labelItems.forEach(item => {
      item.style.borderLeft = '1px solid var(--border-color)';
      item.querySelector('.status-icon').innerHTML = '';
    });
  });
}
