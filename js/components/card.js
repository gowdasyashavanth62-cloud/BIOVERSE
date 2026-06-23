/**
 * card.js – Multi-Variant Card Components
 *
 * Exports:
 *   CourseCard(props)   – large card for course / class selection
 *   ChapterCard(props)  – list-style chapter card with actions
 *   StatCard(props)     – compact stat display
 *   FeatureCard(props)  – centered feature showcase
 *
 * Usage:
 *   import { CourseCard, ChapterCard, StatCard, FeatureCard } from '../components/card.js';
 */

import { ProgressBar } from './progress-bar.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Escape HTML entities to prevent XSS */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── CourseCard ──────────────────────────────────────────────────────────────

/**
 * Large card for course / class selection.
 *
 * @param {Object} props
 * @param {string} props.icon        – Lucide icon name
 * @param {string} props.title       – e.g. "1st PU Biology"
 * @param {string} [props.subtitle]  – optional subtitle
 * @param {number} [props.chaptersCount] – number of chapters
 * @param {number} [props.progress]  – 0-100
 * @param {string} [props.link]      – route to navigate to
 * @returns {string} HTML
 */
export function CourseCard({ icon = 'book-open', title = '', subtitle = '', chaptersCount = 0, progress = 0, link = '#' } = {}) {
  const pct = Math.min(100, Math.max(0, Number(progress) || 0));
  const chapters = Number(chaptersCount) || 0;

  return `
  <div class="card card-course" data-action="nav" data-nav="${esc(link)}" role="link" tabindex="0" aria-label="${esc(title)}">
    <div class="card-course-icon">
      <i data-lucide="${esc(icon)}"></i>
    </div>
    <div class="card-course-body">
      <h3 class="card-course-title">${esc(title)}</h3>
      ${subtitle ? `<p class="card-course-subtitle">${esc(subtitle)}</p>` : ''}
      <p class="card-course-meta">
        <i data-lucide="layers"></i>
        <span>${chapters} Chapter${chapters !== 1 ? 's' : ''}</span>
      </p>
    </div>
    <div class="card-course-progress">
      ${ProgressBar(pct, { height: '6px', showLabel: true, animate: true })}
    </div>
  </div>`;
}

// ── ChapterCard ────────────────────────────────────────────────────────────

/**
 * List-style card for a chapter within a syllabus.
 *
 * @param {Object} props
 * @param {string} props.id          – chapter id
 * @param {string} [props.icon]      – Lucide icon name
 * @param {string} props.title       – chapter title
 * @param {string} [props.description] – short description
 * @param {number} [props.progress]  – 0-100
 * @param {string} [props.unitTitle] – parent unit title
 * @returns {string} HTML
 */
export function ChapterCard({ id = '', icon = 'book-open', title = '', description = '', progress = 0, unitTitle = '' } = {}) {
  const pct = Math.min(100, Math.max(0, Number(progress) || 0));

  return `
  <div class="card card-chapter" data-chapter-id="${esc(id)}">
    <div class="card-chapter-left">
      <div class="card-chapter-icon">
        <i data-lucide="${esc(icon)}"></i>
      </div>
      <div class="card-chapter-info">
        ${unitTitle ? `<span class="card-chapter-unit">${esc(unitTitle)}</span>` : ''}
        <h4 class="card-chapter-title">${esc(title)}</h4>
        ${description ? `<p class="card-chapter-desc">${esc(description)}</p>` : ''}
      </div>
    </div>
    <div class="card-chapter-right">
      <div class="card-chapter-progress">
        ${ProgressBar(pct, { height: '4px', showLabel: false, animate: true })}
        <span class="card-chapter-pct">${pct}%</span>
      </div>
      <div class="card-chapter-actions">
        <button class="btn btn-sm btn-outline" data-action="nav" data-nav="/chapter/${esc(id)}" aria-label="View chapter">
          <i data-lucide="play-circle"></i> Videos
        </button>
        <button class="btn btn-sm btn-outline" data-action="nav" data-nav="/notes/${esc(id)}" aria-label="Read notes">
          <i data-lucide="file-text"></i> Notes
        </button>
        <button class="btn btn-sm btn-outline" data-action="nav" data-nav="/questions/${esc(id)}" aria-label="Practice questions">
          <i data-lucide="help-circle"></i> Questions
        </button>
      </div>
    </div>
  </div>`;
}

// ── StatCard ───────────────────────────────────────────────────────────────

/**
 * Compact stat card for dashboards.
 *
 * @param {Object} props
 * @param {string} props.icon    – Lucide icon name
 * @param {string|number} props.value – e.g. "128" or 128
 * @param {string} props.label   – e.g. "Questions Solved"
 * @param {string} [props.color] – accent color (CSS value)
 * @param {string} [props.trend] – 'up' | 'down' | null
 * @param {string} [props.trendValue] – e.g. "+12%"
 * @returns {string} HTML
 */
export function StatCard({ icon = 'activity', value = 0, label = '', color = 'var(--primary)', trend = null, trendValue = '' } = {}) {
  const trendHtml = trend
    ? `<span class="stat-trend stat-trend-${esc(trend)}">
         <i data-lucide="${trend === 'up' ? 'trending-up' : 'trending-down'}"></i>
         ${esc(trendValue)}
       </span>`
    : '';

  return `
  <div class="card card-stat">
    <div class="card-stat-icon" style="background:${color}15;color:${color}">
      <i data-lucide="${esc(icon)}"></i>
    </div>
    <div class="card-stat-body">
      <span class="card-stat-value">${esc(String(value))}</span>
      <span class="card-stat-label">${esc(label)}</span>
    </div>
    ${trendHtml}
  </div>`;
}

// ── FeatureCard ────────────────────────────────────────────────────────────

/**
 * Feature showcase card for the home / landing page.
 *
 * @param {Object} props
 * @param {string} props.icon        – Lucide icon name
 * @param {string} props.title       – feature title
 * @param {string} props.description – feature description
 * @param {string} [props.color]     – accent color
 * @returns {string} HTML
 */
export function FeatureCard({ icon = 'star', title = '', description = '', color = 'var(--primary)' } = {}) {
  return `
  <div class="card card-feature">
    <div class="card-feature-icon" style="background:${color}12;color:${color}">
      <i data-lucide="${esc(icon)}"></i>
    </div>
    <h3 class="card-feature-title">${esc(title)}</h3>
    <p class="card-feature-desc">${esc(description)}</p>
  </div>`;
}
