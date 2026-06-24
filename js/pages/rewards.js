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

  async function renderStore() {
    const mainContent = document.getElementById('rewards-main-content');
    const xp = progress.xp || 0;
    const items = Store.getRedeemableItems();

    const itemsHtml = items.map(item => {
      const canAfford = xp >= item.costXp;
      return `
        <div class="card hover-lift" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; border:1px solid var(--gray-200); position:relative;">
          <!-- XP Cost Badge -->
          <div style="position:absolute; top:12px; right:12px; background:var(--primary-100); color:var(--primary); padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px;">
            💎 ${item.costXp} XP
          </div>
          <div>
            <h3 style="font-family:var(--font-display); color:var(--gray-900); font-size:15px; margin-bottom:6px; margin-top:8px;">${item.title}</h3>
            <p style="font-size:12px; color:var(--gray-600); line-height:1.4; margin-bottom:16px;">${item.desc}</p>
          </div>
          <button class="btn ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-block redeem-btn" data-id="${item.id}" ${canAfford ? '' : 'disabled'} style="font-size:12px; padding:8px 12px; border-radius:var(--radius-md);">
            ${canAfford ? 'Redeem Item' : '🔒 Insufficient XP'}
          </button>
        </div>
      `;
    }).join('');

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Rewards Store</span>
        </div>
        <h1>🎁 BioVerse XP Rewards Store</h1>
        <p>Redeem your hard-earned XP for premium account extensions, exclusive NEET/KCET study booklets, and profiles customisations.</p>
      </div>

      <!-- Current Balance Widget -->
      <div class="card premium-gradient" style="padding:24px; color:white; border-radius:var(--radius-lg); margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
        <div>
          <h2 style="font-family:var(--font-display); margin:0; font-size:20px;">Your Reward Balance</h2>
          <p style="opacity:0.85; font-size:12px; margin-top:4px;">Gain XP by watching syllabus videos, reading notes, and completing quizzes.</p>
        </div>
        <div style="background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); padding:10px 20px; border-radius:var(--radius-md); text-align:center; min-width:140px; border:1px solid rgba(255,255,255,0.2);">
          <span style="font-size:10px; text-transform:uppercase; font-weight:600; display:block; opacity:0.8;">Available XP</span>
          <strong style="font-size:24px; font-family:var(--font-display); font-weight:bold;">💎 ${xp} XP</strong>
        </div>
      </div>

      <!-- Grid of Items -->
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:20px; margin-bottom:24px;">
        ${itemsHtml}
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind event listener
    document.querySelectorAll('.redeem-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const res = await Store.redeemItem(id);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast(`Success! Redeemed: ${res.item.title}`, 'success');
          // Reload page
          render();
        }
      });
    });
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="rewards-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  await renderStore();
}
