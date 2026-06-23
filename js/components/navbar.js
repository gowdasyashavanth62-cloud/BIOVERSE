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
 * @returns {string} HTML string
 */
export function Navbar() {
  const user = Store.getCurrentUser();

  if (user) {
    return _authenticatedNavbar(user);
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

      <!-- Nav links + auth buttons -->
      <div class="navbar-menu" id="navbar-menu">
        <div class="navbar-links">
          <a class="navbar-link" href="#/" data-action="nav" data-nav="/">Home</a>
          <a class="navbar-link" href="#/pricing" data-action="nav" data-nav="/pricing">Pricing</a>
        </div>
        <div class="navbar-auth-buttons">
          <button class="btn btn-ghost" data-action="nav" data-nav="/login">Log In</button>
          <button class="btn btn-primary" data-action="nav" data-nav="/signup">Sign Up</button>
        </div>
      </div>
    </div>
  </nav>`;
}

function _authenticatedNavbar(user) {
  const initials = esc(getUserInitials(user.name));
  const avatarColor = getAvatarColor(user.name);
  const adminLink = isAdmin()
    ? `<a class="dropdown-item" href="#/admin" data-action="nav" data-nav="/admin">
         <i data-lucide="shield"></i> Admin
       </a>`
    : '';

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
        <!-- Search (visual only) -->
        <button class="navbar-icon-btn" aria-label="Search" data-action="search">
          <i data-lucide="search"></i>
        </button>

        <!-- Notifications -->
        <button class="navbar-icon-btn" aria-label="Notifications" data-action="notifications">
          <i data-lucide="bell"></i>
        </button>

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
  const menu = document.getElementById('navbar-menu');
  const btn = document.querySelector('.navbar-hamburger');
  if (!menu) return;
  const isOpen = menu.classList.toggle('navbar-menu-open');
  if (btn) btn.setAttribute('aria-expanded', String(isOpen));
}

function _closeMobileMenu() {
  const menu = document.getElementById('navbar-menu');
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
}

function _closeDropdown() {
  const dd = document.getElementById('navbar-dropdown');
  const btn = document.querySelector('.navbar-avatar');
  if (dd) dd.classList.remove('dropdown-open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function _handleOutsideClick(e) {
  const wrapper = document.querySelector('.navbar-avatar-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    _closeDropdown();
  }
}

function _handleEscapeKey(e) {
  if (e.key === 'Escape') {
    _closeDropdown();
    _closeMobileMenu();
  }
}
