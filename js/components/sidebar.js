/**
 * sidebar.js – Collapsible Sidebar Navigation Component
 *
 * Dark-themed left sidebar for authenticated pages.
 * Detects active link from window.location.hash.
 * Admin section shown only for admin users.
 *
 * Usage:
 *   import { Sidebar, initSidebar } from '../components/sidebar.js';
 *   app.innerHTML = Sidebar() + `<main class="main-content">…</main>`;
 *   initSidebar();
 */

import { Store } from '../store.js';
import { navigateTo, getHash } from '../router.js';
import { isAdmin } from '../auth.js';

// ── Route config ───────────────────────────────────────────────────────────

const MAIN_LINKS = [
  { path: '/dashboard',       icon: 'layout-dashboard', label: 'Dashboard' },
  { path: '/ai-tutor',        icon: 'bot',              label: 'AI Biology Tutor' },
  { path: '/study-planner',   icon: 'calendar',         label: 'Study Planner' },
  { path: '/community',       icon: 'users',            label: 'Student Community' },
  { path: '/live',            icon: 'tv',               label: 'Live Classes' },
  { path: '/syllabus/pu1',    icon: 'book-open',        label: '1st PU Biology' },
  { path: '/syllabus/pu2',    icon: 'book-open',        label: '2nd PU Biology' },
  { path: '/notes',           icon: 'file-text',        label: 'Notes' },
  { path: '/diagrams',        icon: 'image',            label: 'Diagram Center' },
  { path: '/questions',       icon: 'help-circle',      label: 'Question Bank' },
  { path: '/pyq',             icon: 'archive',          label: 'PYQ Center' },
  { path: '/tests',           icon: 'clipboard-list',   label: 'Mock Tests' },
  { path: '/flashcards',      icon: 'layers',           label: 'Flashcard Center' },
  { path: '/revision',        icon: 'zap',              label: 'Quick Revision' },
  { path: '/memory-game',     icon: 'gamepad-2',        label: 'Biology Games' },
  { path: '/rewards',         icon: 'gift',             label: 'Rewards Store' },
  { path: '/analytics/kcet',  icon: 'pie-chart',        label: 'KCET Analytics' },
  { path: '/analytics/neet',  icon: 'activity',         label: 'NEET Analytics' },
  { path: '/progress',        icon: 'bar-chart-3',      label: 'Overall Progress' },
  { path: '/subscription',    icon: 'credit-card',      label: 'Subscription' },
  { path: '/certificates',    icon: 'award',            label: 'Certificates' },
  { path: '/profile',         icon: 'user',             label: 'Profile' },
  { path: '/settings',        icon: 'settings',         label: 'Settings' },
];

const ADMIN_LINKS = [
  { path: '/admin',               icon: 'shield',           label: 'Dashboard' },
  { path: '/admin/content',       icon: 'folders',          label: 'Content' },
  { path: '/admin/videos',        icon: 'video',            label: 'Videos' },
  { path: '/admin/notes',         icon: 'file-text',        label: 'Notes' },
  { path: '/admin/questions',     icon: 'database',         label: 'Questions' },
  { path: '/admin/pyqs',          icon: 'archive',          label: 'PYQs' },
  { path: '/admin/tests',         icon: 'file-check',       label: 'Tests' },
  { path: '/admin/students',      icon: 'users',            label: 'Students' },
  { path: '/admin/subscriptions', icon: 'credit-card',      label: 'Subscriptions' },
  { path: '/admin/analytics',     icon: 'bar-chart-3',      label: 'Analytics' },
  { path: '/admin/settings',      icon: 'settings',         label: 'Settings' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function _isActive(path) {
  const hash = getHash();
  // Exact match or starts-with for nested routes
  return hash === path || hash.startsWith(path + '/');
}

function _renderLink({ path, icon, label }) {
  const active = _isActive(path) ? ' sidebar-link-active' : '';
  return `
    <a class="sidebar-link${active}"
       href="#${path}"
       data-action="sidebar-nav"
       data-nav="${path}"
       role="menuitem"
       aria-current="${_isActive(path) ? 'page' : 'false'}">
      <i data-lucide="${icon}"></i>
      <span class="sidebar-label">${label}</span>
    </a>`;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Render the sidebar HTML.
 * @returns {string} HTML string
 */
export function Sidebar() {
  const showAdmin = isAdmin();
  const user = Store.getCurrentUser();
  const userName = user ? user.name : '';

  const mainLinks = MAIN_LINKS.map(_renderLink).join('');

  const adminSection = showAdmin
    ? `
      <div class="sidebar-separator">
        <span class="sidebar-separator-text">Admin</span>
      </div>
      <div class="sidebar-section sidebar-admin-section">
        ${ADMIN_LINKS.map(_renderLink).join('')}
      </div>`
    : '';

  return `
  <aside class="sidebar" id="sidebar" role="navigation" aria-label="Sidebar navigation">
    <!-- Collapse toggle -->
    <div class="sidebar-header">
      <button class="sidebar-toggle" data-action="toggle-sidebar" aria-label="Toggle sidebar">
        <i data-lucide="panel-left-close"></i>
      </button>
    </div>

    <!-- Main nav links -->
    <div class="sidebar-section sidebar-main-section">
      ${mainLinks}
    </div>

    ${adminSection}

    <!-- Bottom spacer -->
    <div class="sidebar-footer"></div>
  </aside>

  <!-- Mobile overlay backdrop -->
  <div class="sidebar-overlay" id="sidebar-overlay" data-action="close-sidebar"></div>`;
}

// ── Init ────────────────────────────────────────────────────────────────────

/**
 * Attach event listeners for the sidebar.
 * Call once after inserting Sidebar() HTML into the DOM.
 */
export function initSidebar() {
  window.navigateTo = navigateTo;

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  // ── Event delegation ─────────────────────────────────────────────────
  sidebar.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'sidebar-nav') {
      e.preventDefault();
      const path = target.dataset.nav;
      if (path) {
        // On mobile, close sidebar after navigation
        _closeSidebar();
        navigateTo(path);
      }
      return;
    }

    if (action === 'toggle-sidebar') {
      e.preventDefault();
      _toggleSidebar();
      return;
    }
  });

  // Overlay click closes sidebar (mobile)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      _closeSidebar();
    });
  }

  // Escape key closes mobile sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') _closeSidebar();
  });
}

// ── Private DOM helpers ────────────────────────────────────────────────────

function _toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');

  // On mobile the class 'open' controls visibility
  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  }

  // Persist collapsed state
  try {
    localStorage.setItem('bv_sidebar_collapsed', isCollapsed ? '1' : '0');
  } catch { /* silent */ }
}

function _closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

/**
 * Restore sidebar collapsed state from localStorage.
 * Call in page init if desired.
 */
export function restoreSidebarState() {
  try {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const collapsed = localStorage.getItem('bv_sidebar_collapsed');
    if (collapsed === '1') sidebar.classList.add('sidebar-collapsed');
  } catch { /* silent */ }
}
