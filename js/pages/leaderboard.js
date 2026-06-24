import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';

export function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  const progress = Store.getProgress();
  window.navigateTo = navigateTo;

  let activePeriod = 'weekly';
  let activeFilter = 'All';

  function renderLeaderboard() {
    const mainContent = document.getElementById('leaderboard-main-content');
    
    // Seed some mock leaderboard students
    const mockStudents = [
      { id: 'm1', name: 'Rahul Gowda', class: '2nd PU', target: 'KCET', xp: 5800, testsCount: 18 },
      { id: 'm2', name: 'Priya Sharma', class: '1st PU', target: 'NEET', xp: 4200, testsCount: 14 },
      { id: 'm3', name: 'Rohan Deshmukh', class: '2nd PU', target: 'NEET', xp: 6250, testsCount: 22 },
      { id: 'm4', name: 'Preeti Hegde', class: '2nd PU', target: 'KCET', xp: 3900, testsCount: 12 },
      { id: 'm5', name: 'Kiran K.', class: '1st PU', target: 'KCET', xp: 2100, testsCount: 7 },
      { id: 'm6', name: 'Ananya Rao', class: '2nd PU', target: 'NEET', xp: 7500, testsCount: 28 },
      { id: 'm7', name: 'Siddharth M.', class: '2nd PU', target: 'KCET', xp: 1450, testsCount: 5 }
    ];

    // Add active user to the list
    mockStudents.push({
      id: user.id,
      name: user.name + ' (You)',
      class: user.class || '2nd PU',
      target: user.class === '1st PU' ? 'PU' : 'NEET', // Default mapping
      xp: progress.xp || 0,
      testsCount: Store.getTestResults().length
    });

    // Apply period scaling to make weekly/monthly stats different
    let scaledStudents = mockStudents.map(student => {
      let factor = 1;
      if (activePeriod === 'weekly') factor = 0.15;
      else if (activePeriod === 'monthly') factor = 0.6;
      
      return {
        ...student,
        xp: Math.round(student.xp * factor)
      };
    });

    // Filter by class or target
    if (activeFilter !== 'All') {
      if (activeFilter === '1st PU' || activeFilter === '2nd PU') {
        scaledStudents = scaledStudents.filter(s => s.class === activeFilter);
      } else {
        // KCET or NEET
        scaledStudents = scaledStudents.filter(s => s.target === activeFilter || s.id === user.id);
      }
    }

    // Sort by XP descending
    scaledStudents.sort((a, b) => b.xp - a.xp);

    const periodTabsHtml = ['weekly', 'monthly', 'all-time'].map(p => `
      <button class="tab-item ${activePeriod === p ? 'active' : ''}" data-period="${p}" style="text-transform:capitalize; padding:8px 16px; font-weight:600;">
        ${p.replace('-', ' ')}
      </button>
    `).join('');

    const filterOptions = ['All', '1st PU', '2nd PU', 'KCET', 'NEET'];
    const filterHtml = filterOptions.map(f => `
      <option value="${f}" ${activeFilter === f ? 'selected' : ''}>${f}</option>
    `).join('');

    const rowsHtml = scaledStudents.map((s, index) => {
      const isUser = s.id === user.id;
      const rank = index + 1;
      let rankEmoji = '';
      if (rank === 1) rankEmoji = '🥇';
      else if (rank === 2) rankEmoji = '🥈';
      else if (rank === 3) rankEmoji = '🥉';
      
      return `
        <div class="leaderboard-row ${isUser ? 'user-row' : ''}" style="border-bottom: 1px solid var(--gray-100);">
          <div class="leaderboard-rank ${rank <= 3 ? `leaderboard-rank-${rank}` : ''}" style="font-weight:bold; font-size:14px; text-align:center;">
            ${rankEmoji || rank}
          </div>
          <div style="font-weight:${isUser ? 'bold' : 'normal'}; display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:${isUser ? 'var(--primary)' : 'var(--gray-300)'}; color:white; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold;">
              ${s.name.charAt(0)}
            </div>
            <div>
              <span style="font-size:13px; color:var(--gray-800);">${s.name}</span>
              <span style="font-size:10px; color:var(--gray-400); display:block;">${s.class} · ${s.target} Target</span>
            </div>
          </div>
          <div style="font-size:13px; color:var(--primary); font-weight:bold; text-align:center;">
            ${s.xp} XP
          </div>
          <div style="font-size:12px; color:var(--gray-600); text-align:center;">
            ${s.testsCount} tests
          </div>
        </div>
      `;
    }).join('');

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Leaderboard Rankings</span>
        </div>
        <h1>🥇 Weekly & Monthly Leaderboard</h1>
        <p>Compete with other PU Biology students in Karnataka. Gain XP by studying and score higher in tests to climb the ranks!</p>
      </div>

      <!-- Filters & Tabs Grid -->
      <div class="card" style="padding:16px; margin-bottom:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <!-- Period Tabs -->
          <div class="chapter-tabs" id="periodTabs" style="margin:0; border:none; padding:0;">
            ${periodTabsHtml}
          </div>
          
          <!-- Filters Dropdown -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:13px; color:var(--gray-600); font-weight:600;">Filter by:</span>
            <select id="leaderboardFilter" class="form-input" style="width:140px; height:36px; padding:0 8px; font-size:12px;">
              ${filterHtml}
            </select>
          </div>
        </div>

        <!-- Leaderboard Table Container -->
        <div class="leaderboard-list">
          <div class="leaderboard-row header" style="font-weight:bold; font-size:12px; color:var(--gray-500); background:var(--gray-50);">
            <div style="text-align:center;">Rank</div>
            <div>Student Name</div>
            <div style="text-align:center;">Score (XP)</div>
            <div style="text-align:center;">Activity</div>
          </div>
          <div id="leaderboard-rows-container">
            ${rowsHtml}
          </div>
        </div>
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind event listeners
    // Period switching
    document.querySelectorAll('#periodTabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        activePeriod = tab.dataset.period;
        renderLeaderboard();
      });
    });

    // Filter dropdown change
    document.getElementById('leaderboardFilter').addEventListener('change', (e) => {
      activeFilter = e.target.value;
      renderLeaderboard();
    });
  }

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="leaderboard-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  renderLeaderboard();
}
