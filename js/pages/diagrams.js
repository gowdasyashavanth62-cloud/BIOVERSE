import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { navigateTo } from '../router.js';
import { diagramsData } from '../data/diagrams.js';

export function render() {
  const app = document.getElementById('app');
  
  window.navigateTo = navigateTo;

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <section class="section animate-fade-in">
          <div class="section-header">
            <h2>Interactive Diagrams</h2>
            <p class="text-muted">Master biological structures through interactive labeling exercises.</p>
          </div>
          
          <div class="diagram-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px;">
            ${diagramsData.map(diagram => `
              <div class="card hover-lift" style="overflow: hidden; cursor: pointer;" onclick="navigateTo('/diagrams/${diagram.id}')">
                <div style="height: 160px; overflow: hidden; background: #eee;">
                  <img src="${diagram.imageUrl}" alt="${diagram.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="card-body">
                  <h3 style="margin: 0 0 10px 0;">${diagram.title}</h3>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge" style="background: var(--bg-hover); color: var(--text-color); padding: 4px 8px; border-radius: 4px; font-size: 0.8em; text-transform: capitalize;">${diagram.category}</span>
                    <span style="font-size: 0.85em; color: var(--text-muted);"><i data-lucide="crosshair" style="width: 14px; height: 14px; vertical-align: middle;"></i> ${diagram.hotspots.length} labels</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
