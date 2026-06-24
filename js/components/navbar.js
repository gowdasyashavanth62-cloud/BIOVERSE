/**
 * navbar.js – Top Navigation Bar Component
 *
 * Public view:  Logo ▸ nav links (Home, Pricing) ▸ Login / Sign Up buttons
 * Auth view:    Logo ▸ spacer ▸ search icon ▸ bell icon ▸ avatar dropdown
 *
 * Usage:
 *   import { Navbar, initNavbar } from '../components/navbar.js';
 *   document.getElementById('app').innerHTML = Navbar() + pageContent;
 *   initNavbar();
 */

import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { isAuthenticated, isAdmin, getUserInitials, getAvatarColor } from '../auth.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Escape HTML entities to prevent XSS */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Render the navbar HTML.
 * Automatically picks public vs authenticated layout based on auth state.
 * @returns {Promise<string>} HTML string
 */
export async function Navbar() {
  const user = Store.getCurrentUser();

  if (user) {
    return await _authenticatedNavbar(user);
  }
  return _publicNavbar();
}

// ── Private renderers ──────────────────────────────────────────────────────

function _publicNavbar() {
  return `
  <nav class="navbar navbar-public" role="navigation" aria-label="Main navigation">
    <div class="navbar-inner">
      <!-- Logo -->
      <a class="navbar-logo" href="#/" data-action="nav" data-nav="/" aria-label="BioVerse Home">
        <span class="navbar-logo-icon">🧬</span>
        <span class="navbar-logo-text">BioVerse</span>
      </a>

      <!-- Hamburger (mobile) -->
      <button class="navbar-hamburger" data-action="toggle-mobile-menu" aria-label="Toggle menu" aria-expanded="false">
        <i data-lucide="menu"></i>
      </button>

      <!-- Nav Links -->
      <div class="navbar-menu" id="publicMenu">
        <div class="navbar-start">
          <a class="navbar-item" href="#/" data-action="nav" data-nav="/">Home</a>
          <a class="navbar-item" href="#/pricing" data-action="nav" data-nav="/pricing">Pricing &amp; Plans</a>
        </div>
        <div class="navbar-end">
          <button class="btn btn-ghost" data-action="nav" data-nav="/login">Log In</button>
          <button class="btn btn-primary" data-action="nav" data-nav="/signup">Sign Up</button>
        </div>
      </div>
    </div>
  </nav>`;
}

async function _authenticatedNavbar(user) {
  const initials = esc(getUserInitials(user.name));
  const avatarColor = getAvatarColor(user.name);
  const adminLink = isAdmin()
    ? `<a class="dropdown-item" href="#/admin" data-action="nav" data-nav="/admin">
         <i data-lucide="shield"></i> Admin
       </a>`
    : '';

  const progress = await Store.getProgress(user.id);
  const lvlInfo = Store.getLevelInfo(progress.xp);
  const notifs = await Store.getNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;

  const notifItems = notifs.length === 0
    ? `<div style="text-align:center;padding:12px;color:var(--gray-400);font-size:12px;">No notifications yet.</div>`
    : notifs.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}" style="padding:8px;border-radius:var(--radius-sm);background:${n.read ? 'transparent' : 'var(--primary-50)'};border-bottom:1px solid var(--gray-100);margin-bottom:4px;">
          <div style="font-weight:600;font-size:11px;color:var(--gray-800);">${esc(n.title)}</div>
          <div style="font-size:10px;color:var(--gray-500);margin:2px 0;">${esc(n.message)}</div>
          <div style="font-size:8px;color:var(--gray-400);text-align:right;">${new Date(n.time || n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      `).join('');

  return `
  <nav class="navbar navbar-auth" role="navigation" aria-label="Main navigation">
    <div class="navbar-inner">
      <!-- Logo -->
      <a class="navbar-logo" href="#/dashboard" data-action="nav" data-nav="/dashboard" aria-label="BioVerse Dashboard">
        <span class="navbar-logo-icon">🧬</span>
        <span class="navbar-logo-text">BioVerse</span>
      </a>

      <!-- Spacer -->
      <div class="navbar-spacer"></div>

      <!-- Right actions -->
      <div class="navbar-actions">
        <!-- Level Badge -->
        <span class="nav-level-badge" style="background:var(--primary);color:white;padding:4px 10px;border-radius:16px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;font-family:var(--font-display);">
          <i data-lucide="award" style="width:12px;height:12px;"></i> Lvl ${lvlInfo.level}
        </span>

        <!-- Search (visual only) -->
        <button class="navbar-icon-btn" aria-label="Search" data-action="search">
          <i data-lucide="search"></i>
        </button>

        <!-- Notifications -->
        <div class="navbar-notifications-wrapper" style="position:relative;">
          <button class="navbar-icon-btn" aria-label="Notifications" data-action="toggle-notif" style="position:relative;">
            <i data-lucide="bell"></i>
            ${unreadCount > 0 ? `<span class="notif-badge-dot" style="position:absolute;top:4px;right:4px;width:8px;height:8px;background:var(--accent-red);border-radius:50%;"></span>` : ''}
          </button>
          
          <div class="navbar-dropdown notif-dropdown" id="navbar-notif-dropdown" style="display:none;position:absolute;top:100%;right:0;width:320px;background:white;box-shadow:var(--shadow-lg);border-radius:var(--radius-md);border:1px solid var(--gray-200);z-index:1000;padding:12px;margin-top:8px;">
            <div style="padding:0 0 8px 0;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:bold;font-family:var(--font-display);font-size:13px;">Notifications</span>
              <button class="btn btn-ghost btn-sm" data-action="mark-read-all" style="padding:2px 6px;font-size:10px;height:auto;">Mark read</button>
            </div>
            <div class="dropdown-divider" style="margin:4px 0 8px 0;"></div>
            <div class="notif-list" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
              ${notifItems}
            </div>
          </div>
        </div>

        <!-- Avatar + dropdown -->
        <div class="navbar-avatar-wrapper" data-action="toggle-avatar-dropdown">
          <button class="navbar-avatar" style="background:${avatarColor}" aria-label="User menu" aria-haspopup="true" aria-expanded="false">
            ${initials}
          </button>

          <div class="navbar-dropdown" id="navbar-dropdown" role="menu" aria-label="User menu">
            <div class="dropdown-header">
              <div class="dropdown-avatar" style="background:${avatarColor}">${initials}</div>
              <div class="dropdown-user-info">
                <span class="dropdown-user-name">${esc(user.name)}</span>
                <span class="dropdown-user-email">${esc(user.email)}</span>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#/profile" data-action="nav" data-nav="/profile" role="menuitem">
              <i data-lucide="user"></i> Profile
            </a>
            <a class="dropdown-item" href="#/dashboard" data-action="nav" data-nav="/dashboard" role="menuitem">
              <i data-lucide="layout-dashboard"></i> Dashboard
            </a>
            ${adminLink}
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item-danger" data-action="logout" role="menuitem">
              <i data-lucide="log-out"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Hamburger (mobile) -->
      <button class="navbar-hamburger navbar-hamburger-auth" data-action="toggle-mobile-menu" aria-label="Toggle menu" aria-expanded="false">
        <i data-lucide="menu"></i>
      </button>
    </div>
  </nav>`;
}

// ── Init ────────────────────────────────────────────────────────────────────

/**
 * Attach event listeners for the navbar.
 * Call once after inserting Navbar() HTML into the DOM.
 */
export function initNavbar() {
  // Make navigateTo available for inline handlers if needed
  window.navigateTo = navigateTo;

  const nav = document.querySelector('.navbar');
  if (!nav) return;

  // ── Event delegation ─────────────────────────────────────────────────
  nav.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    // Navigation
    if (action === 'nav') {
      e.preventDefault();
      const path = target.dataset.nav;
      if (path) {
        _closeMobileMenu();
        _closeDropdown();
        navigateTo(path);
      }
      return;
    }

    // Mobile menu toggle
    if (action === 'toggle-mobile-menu') {
      e.preventDefault();
      _toggleMobileMenu();
      return;
    }

    // Avatar dropdown toggle
    if (action === 'toggle-avatar-dropdown') {
      e.preventDefault();
      e.stopPropagation();
      _toggleDropdown();
      return;
    }

    // Notification dropdown toggle
    if (action === 'toggle-notif') {
      e.preventDefault();
      e.stopPropagation();
      _toggleNotifDropdown();
      return;
    }

    // Mark all notifications read
    if (action === 'mark-read-all') {
      e.preventDefault();
      Store.markNotificationsRead();
      const dot = document.querySelector('.notif-badge-dot');
      if (dot) dot.remove();
      const items = document.querySelectorAll('.notif-item');
      items.forEach(item => {
        item.style.background = 'transparent';
        item.classList.remove('unread');
        item.classList.add('read');
      });
      return;
    }

    // Logout
    if (action === 'logout') {
      e.preventDefault();
      Store.logout();
      _closeDropdown();
      navigateTo('/');
      return;
    }
  });

  // ── Close dropdown on outside click ──────────────────────────────────
  document.addEventListener('click', _handleOutsideClick);

  // ── Close dropdown on Escape key ─────────────────────────────────────
  document.addEventListener('keydown', _handleEscapeKey);
}

// ── Private DOM helpers ────────────────────────────────────────────────────

function _toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar && window.innerWidth <= 1024) {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    return;
  }

  const menu = document.getElementById('publicMenu') || document.getElementById('navbar-menu');
  const btn = document.querySelector('.navbar-hamburger');
  if (!menu) return;
  const isOpen = menu.classList.toggle('navbar-menu-open');
  if (btn) btn.setAttribute('aria-expanded', String(isOpen));
}

function _closeMobileMenu() {
  const menu = document.getElementById('publicMenu') || document.getElementById('navbar-menu');
  const btn = document.querySelector('.navbar-hamburger');
  if (menu) menu.classList.remove('navbar-menu-open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function _toggleDropdown() {
  const dd = document.getElementById('navbar-dropdown');
  const btn = document.querySelector('.navbar-avatar');
  if (!dd) return;
  const isOpen = dd.classList.toggle('dropdown-open');
  if (btn) btn.setAttribute('aria-expanded', String(isOpen));
  _closeNotifDropdown(); // Close notifs if avatar is opened
}

function _closeDropdown() {
  const dd = document.getElementById('navbar-dropdown');
  const btn = document.querySelector('.navbar-avatar');
  if (dd) dd.classList.remove('dropdown-open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function _toggleNotifDropdown() {
  const nd = document.getElementById('navbar-notif-dropdown');
  if (!nd) return;
  const isHidden = nd.style.display === 'none';
  nd.style.display = isHidden ? 'block' : 'none';
  _closeDropdown(); // Close avatar menu if notifs are opened
}

function _closeNotifDropdown() {
  const nd = document.getElementById('navbar-notif-dropdown');
  if (nd) nd.style.display = 'none';
}

function _handleOutsideClick(e) {
  const wrapper = document.querySelector('.navbar-avatar-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    _closeDropdown();
  }
  const notifWrapper = document.querySelector('.navbar-notifications-wrapper');
  if (notifWrapper && !notifWrapper.contains(e.target)) {
    _closeNotifDropdown();
  }
}

function _handleEscapeKey(e) {
  if (e.key === 'Escape') {
    _closeDropdown();
    _closeNotifDropdown();
    _closeMobileMenu();
  }
}
