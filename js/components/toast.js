/**
 * toast.js – Toast Notification System
 *
 * Renders into `#toast-container` (expected in index.html).
 * Toasts auto-dismiss after 3500ms, support stacking, slide-in animation.
 *
 * Usage:
 *   import { showToast } from '../components/toast.js';
 *   showToast('Profile updated!', 'success');
 *   showToast('Something went wrong.', 'error');
 */

// ── Config ─────────────────────────────────────────────────────────────────

const TOAST_DURATION = 3500; // ms before auto-dismiss
const TOAST_ANIMATION_OUT = 300; // ms for exit animation

const TOAST_CONFIG = {
  success: { icon: 'check-circle', className: 'toast-success' },
  error:   { icon: 'x-circle',     className: 'toast-error' },
  info:    { icon: 'info',         className: 'toast-info' },
  warning: { icon: 'alert-triangle', className: 'toast-warning' },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Ensure #toast-container exists in the DOM.
 * @returns {HTMLElement}
 */
function _getContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }
  return container;
}

// ── showToast ──────────────────────────────────────────────────────────────

/**
 * Show a toast notification.
 *
 * @param {string} message – text to display (will be HTML-escaped)
 * @param {'success'|'error'|'info'|'warning'} [type='info'] – toast variant
 */
export function showToast(message, type = 'info') {
  const container = _getContainer();
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${config.className}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${config.icon}"></i>
    </div>
    <span class="toast-message">${esc(message)}</span>
    <button class="toast-close" aria-label="Dismiss notification">
      <i data-lucide="x"></i>
    </button>
  `;

  // Append to container
  container.appendChild(toast);

  // Trigger Lucide icon rendering
  if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 10);
  }

  // Animate in (next frame so CSS transition fires)
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => _dismissToast(toast));
  }

  // Auto-dismiss
  const timer = setTimeout(() => _dismissToast(toast), TOAST_DURATION);

  // Pause auto-dismiss on hover
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', () => {
    setTimeout(() => _dismissToast(toast), TOAST_DURATION);
  });
}

// ── Private helpers ────────────────────────────────────────────────────────

/**
 * Animate out and remove a toast element.
 * @param {HTMLElement} toast
 */
function _dismissToast(toast) {
  if (!toast || toast.dataset.dismissing) return;
  toast.dataset.dismissing = 'true';

  toast.classList.remove('toast-visible');
  toast.classList.add('toast-exit');

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, TOAST_ANIMATION_OUT);
}
