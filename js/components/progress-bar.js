/**
 * progress-bar.js – Progress Bar Variants
 *
 * Exports:
 *   ProgressBar(percentage, options)  – horizontal bar with animated fill
 *   CircularProgress(percentage, size) – SVG circular progress ring
 *
 * Usage:
 *   import { ProgressBar, CircularProgress } from '../components/progress-bar.js';
 *   const html = ProgressBar(75, { showLabel: true, animate: true });
 *   const ring = CircularProgress(60, 100);
 */

// ── ProgressBar ────────────────────────────────────────────────────────────

/**
 * Horizontal progress bar with animated fill.
 *
 * @param {number} percentage – 0 to 100
 * @param {Object} [options]
 * @param {string} [options.height='8px']   – bar height
 * @param {string} [options.color]          – fill color (defaults to primary gradient)
 * @param {boolean} [options.showLabel=true] – show percentage text
 * @param {boolean} [options.animate=true]  – animate the fill on mount
 * @param {string}  [options.className]     – extra CSS class
 * @returns {string} HTML string
 */
export function ProgressBar(percentage, options = {}) {
  const {
    height = '8px',
    color = '',
    showLabel = true,
    animate = true,
    className = '',
  } = options;

  const pct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const rounded = Math.round(pct);

  const colorStyle = color ? `background:${color};` : '';
  const animateClass = animate ? ' progress-bar-animate' : '';
  const extraClass = className ? ` ${className}` : '';

  // The fill width is set via CSS custom property so the animation can read it
  const label = showLabel
    ? `<span class="progress-bar-label">${rounded}%</span>`
    : '';

  return `
  <div class="progress-bar${extraClass}"
       role="progressbar"
       aria-valuenow="${rounded}"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="${rounded}% complete"
       style="height:${height}">
    <div class="progress-bar-fill${animateClass}"
         style="width:${rounded}%;${colorStyle}height:100%"
         data-progress="${rounded}">
    </div>
    ${label}
  </div>`;
}

// ── CircularProgress ───────────────────────────────────────────────────────

/**
 * SVG-based circular progress ring.
 *
 * @param {number} percentage – 0 to 100
 * @param {number} [size=120] – diameter in px
 * @param {Object} [options]
 * @param {string} [options.trackColor='var(--gray-200)']
 * @param {string} [options.fillColor='var(--primary)']
 * @param {number} [options.strokeWidth=8]
 * @param {boolean} [options.showLabel=true]
 * @returns {string} HTML string
 */
export function CircularProgress(percentage, size = 120, options = {}) {
  const {
    trackColor = 'var(--gray-200, #e5e7eb)',
    fillColor = 'var(--primary, #0A6847)',
    strokeWidth = 8,
    showLabel = true,
  } = options;

  const pct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const rounded = Math.round(pct);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const center = size / 2;
  const fontSize = Math.round(size * 0.22);

  const labelHtml = showLabel
    ? `<text x="${center}" y="${center}"
            text-anchor="middle"
            dominant-baseline="central"
            class="circular-progress-label"
            style="font-size:${fontSize}px;font-weight:700;fill:var(--gray-800,#1f2937);font-family:var(--font-heading,'Outfit',sans-serif)">
         ${rounded}%
       </text>`
    : '';

  return `
  <div class="circular-progress"
       role="progressbar"
       aria-valuenow="${rounded}"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="${rounded}% complete"
       style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Track -->
      <circle cx="${center}" cy="${center}" r="${radius}"
              fill="none"
              stroke="${trackColor}"
              stroke-width="${strokeWidth}"
              class="circular-progress-track" />
      <!-- Fill -->
      <circle cx="${center}" cy="${center}" r="${radius}"
              fill="none"
              stroke="${fillColor}"
              stroke-width="${strokeWidth}"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${dashOffset}"
              class="circular-progress-fill"
              transform="rotate(-90 ${center} ${center})"
              style="transition:stroke-dashoffset 1s ease-out;" />
      ${labelHtml}
    </svg>
  </div>`;
}
