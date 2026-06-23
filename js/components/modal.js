/**
 * modal.js – Modal Dialog System
 *
 * Renders modals into `#modal-container` (expected in index.html).
 *
 * Exports:
 *   openModal({ title, content, actions, size })
 *   closeModal()
 *   confirmModal(title, message) → Promise<boolean>
 *   initModal()
 *
 * Usage:
 *   import { openModal, closeModal, confirmModal } from '../components/modal.js';
 *
 *   openModal({
 *     title: 'Delete Item',
 *     content: '<p>Are you sure?</p>',
 *     size: 'sm',
 *     actions: [
 *       { label: 'Cancel', class: 'btn-ghost', onClick: 'closeModal' },
 *       { label: 'Delete', class: 'btn-danger', onClick: 'handleDelete' },
 *     ]
 *   });
 *
 *   const ok = await confirmModal('Confirm', 'Proceed with this action?');
 */

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

let _escapeListener = null;
let _modalActionCallback = null;

// ── openModal ──────────────────────────────────────────────────────────────

/**
 * Open a modal dialog.
 *
 * @param {Object}   options
 * @param {string}   options.title     – modal title (plain text)
 * @param {string}   options.content   – modal body (raw HTML – caller is responsible for escaping)
 * @param {Array}    [options.actions] – [{label, class, onClick}] onClick is a function or 'closeModal'
 * @param {string}   [options.size]    – 'sm' | 'md' | 'lg'   (default 'md')
 */
export function openModal({ title = '', content = '', actions = [], size = 'md' } = {}) {
  const container = document.getElementById('modal-container');
  if (!container) {
    console.warn('modal.js: #modal-container not found in DOM');
    return;
  }

  const sizeClass = `modal-${size}`;

  // Build action buttons
  const actionsHtml = actions.length
    ? `<div class="modal-actions">
         ${actions.map((a, i) => `
           <button class="btn ${a.class || 'btn-ghost'}" data-modal-action="${i}">
             ${esc(a.label)}
           </button>
         `).join('')}
       </div>`
    : '';

  container.innerHTML = `
  <div class="modal-overlay" data-modal-close aria-hidden="true"></div>
  <div class="modal ${sizeClass}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title">${esc(title)}</h3>
      <button class="modal-close-btn" data-modal-close aria-label="Close modal">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="modal-body">
      ${content}
    </div>
    ${actionsHtml}
  </div>`;

  // Show with animation
  requestAnimationFrame(() => {
    container.classList.add('modal-container-visible');
  });

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Store action callbacks
  _modalActionCallback = actions;

  // ── Event listeners ────────────────────────────────────────────────
  // Backdrop & close button clicks
  container.addEventListener('click', _handleModalClick);

  // Escape key
  _escapeListener = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', _escapeListener);

  // Re-init Lucide for close icon
  if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 20);
  }
}

// ── closeModal ─────────────────────────────────────────────────────────────

/**
 * Close the currently open modal, if any.
 */
export function closeModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.classList.remove('modal-container-visible');

  // Allow CSS transition to finish before clearing
  setTimeout(() => {
    container.innerHTML = '';
  }, 200);

  // Restore body scroll
  document.body.style.overflow = '';

  // Cleanup listeners
  container.removeEventListener('click', _handleModalClick);
  if (_escapeListener) {
    document.removeEventListener('keydown', _escapeListener);
    _escapeListener = null;
  }

  _modalActionCallback = null;
}

// Make closeModal globally available for inline handlers
window.closeModal = closeModal;

// ── confirmModal ───────────────────────────────────────────────────────────

/**
 * Show a confirm dialog.
 *
 * @param {string} title   – dialog title
 * @param {string} message – body message (plain text)
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled
 */
export function confirmModal(title, message) {
  return new Promise((resolve) => {
    openModal({
      title: title || 'Confirm',
      content: `<p class="modal-confirm-message">${esc(message)}</p>`,
      size: 'sm',
      actions: [
        {
          label: 'Cancel',
          class: 'btn-ghost',
          onClick: () => {
            closeModal();
            resolve(false);
          },
        },
        {
          label: 'Confirm',
          class: 'btn-primary',
          onClick: () => {
            closeModal();
            resolve(true);
          },
        },
      ],
    });
  });
}

// ── initModal ──────────────────────────────────────────────────────────────

/**
 * Initialize modal system. Currently a no-op placeholder.
 * Call at app boot if you want to ensure #modal-container exists.
 */
export function initModal() {
  const container = document.getElementById('modal-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'modal-container';
    document.body.appendChild(div);
  }
}

// ── Private helpers ────────────────────────────────────────────────────────

function _handleModalClick(e) {
  // Close button or overlay click
  if (e.target.closest('[data-modal-close]')) {
    closeModal();
    return;
  }

  // Action button click
  const actionBtn = e.target.closest('[data-modal-action]');
  if (actionBtn && _modalActionCallback) {
    const idx = parseInt(actionBtn.dataset.modalAction, 10);
    const action = _modalActionCallback[idx];
    if (action) {
      if (typeof action.onClick === 'function') {
        action.onClick();
      } else if (action.onClick === 'closeModal') {
        closeModal();
      }
    }
  }
}
