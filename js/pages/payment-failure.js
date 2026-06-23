import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" style="display:flex; align-items:center; justify-content:center; min-height:70vh;">
        <div class="card p-xl text-center animate-fade-in" style="max-width:480px; border-top: 5px solid var(--accent-red);">
          <div style="font-size:4rem; color:var(--accent-red); margin-bottom:1rem;">❌</div>
          <h2 style="color:var(--accent-red); font-family:var(--font-display); margin-bottom:10px;">Payment Failed</h2>
          <p class="text-muted" style="margin-bottom:1.5rem; line-height:1.65;">
            Unfortunately, your transaction could not be processed. This could be due to incorrect details, insufficient funds, or a gateway timeout.
          </p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary" onclick="navigateTo('/pricing')">Try Again (Select Plan)</button>
            <button class="btn btn-outline" onclick="navigateTo('/dashboard')">Back to Dashboard</button>
          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
