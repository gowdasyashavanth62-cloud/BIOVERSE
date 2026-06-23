/**
 * stats.js – Stats & Counter Widgets
 *
 * Exports:
 *   AnimatedCounter(value, label, icon) – counter with count-up animation support
 *   StreakBadge(days)                   – fire emoji streak pill
 *   initCounters()                      – animate all [data-counter] elements
 *
 * Usage:
 *   import { AnimatedCounter, StreakBadge, initCounters } from '../components/stats.js';
 *   const html = AnimatedCounter(256, 'Questions Solved', 'help-circle');
 *   // After inserting into DOM:
 *   initCounters();
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

// ── AnimatedCounter ────────────────────────────────────────────────────────

/**
 * Renders a stat display that can be animated via initCounters().
 *
 * The `data-counter` attribute stores the target value.
 * The element text starts at "0" and counts up when initCounters() runs.
 *
 * @param {number|string} value – target number
 * @param {string}        label – descriptive label
 * @param {string}        [icon='activity'] – Lucide icon name
 * @returns {string} HTML string
 */
export function AnimatedCounter(value, label, icon = 'activity') {
  const numValue = Number(value) || 0;

  return `
  <div class="animated-counter" aria-label="${esc(label)}: ${numValue}">
    <div class="animated-counter-icon">
      <i data-lucide="${esc(icon)}"></i>
    </div>
    <span class="animated-counter-value" data-counter data-target="${numValue}">0</span>
    <span class="animated-counter-label">${esc(label)}</span>
  </div>`;
}

// ── StreakBadge ─────────────────────────────────────────────────────────────

/**
 * Fire emoji streak display with warm gradient pill styling.
 *
 * @param {number} days – streak day count
 * @returns {string} HTML string
 */
export function StreakBadge(days) {
  const d = Math.max(0, Number(days) || 0);

  if (d === 0) {
    return `
    <div class="streak-badge streak-badge-inactive" aria-label="No active streak">
      <span class="streak-emoji">🔥</span>
      <span class="streak-text">Start your streak!</span>
    </div>`;
  }

  // Multi-fire emojis for long streaks
  let fireEmoji = '🔥';
  if (d >= 30) fireEmoji = '🔥🔥🔥';
  else if (d >= 7) fireEmoji = '🔥🔥';

  return `
  <div class="streak-badge streak-badge-active" aria-label="${d} day streak">
    <span class="streak-emoji">${fireEmoji}</span>
    <span class="streak-days" data-counter data-target="${d}">0</span>
    <span class="streak-text">day streak</span>
  </div>`;
}

// ── initCounters ───────────────────────────────────────────────────────────

/**
 * Find all elements with `[data-counter]` and animate their text from 0
 * to the value in `data-target`. Uses requestAnimationFrame for smoothness.
 *
 * Call after the DOM has been updated with counter elements.
 *
 * @param {number} [duration=1200] – animation duration in ms
 */
export function initCounters(duration = 1200) {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  counters.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target) || target === 0) {
      el.textContent = '0';
      return;
    }

    // Skip if already animated
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    _animateCounter(el, target, duration);
  });
}

// ── Private ────────────────────────────────────────────────────────────────

/**
 * Animate a single counter element from 0 to target.
 * Uses an ease-out curve for a natural feel.
 *
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} duration
 */
function _animateCounter(el, target, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic: 1 - (1 - t)^3
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  // Use IntersectionObserver if available so counting only starts when visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(el);
            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
  } else {
    // Fallback: animate immediately
    requestAnimationFrame(update);
  }
}
