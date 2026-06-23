/**
 * footer.js – Site Footer Component
 *
 * 4-column responsive footer:
 *   1. BioVerse branding + tagline
 *   2. Quick Links
 *   3. Resources
 *   4. Contact info
 * Bottom bar with copyright.
 *
 * Usage:
 *   import { Footer } from '../components/footer.js';
 *   app.innerHTML = pageContent + Footer();
 */

import { navigateTo } from '../router.js';

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Render the footer HTML.
 * @returns {string} HTML string
 */
export function Footer() {
  const year = new Date().getFullYear();

  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <!-- Column 1: Brand -->
      <div class="footer-col footer-brand-col">
        <a class="footer-logo" href="#/" data-action="nav" data-nav="/" aria-label="BioVerse Home">
          <span class="footer-logo-icon">🧬</span>
          <span class="footer-logo-text">BioVerse</span>
        </a>
        <p class="footer-tagline">
          Complete Karnataka PU Biology Learning Platform. Master your Board exams, KCET &amp; NEET with structured video lessons, notes, and practice tests.
        </p>
        <div class="footer-social" aria-label="Social links">
          <a href="#" class="footer-social-link" aria-label="Twitter"><i data-lucide="twitter"></i></a>
          <a href="#" class="footer-social-link" aria-label="Instagram"><i data-lucide="instagram"></i></a>
          <a href="#" class="footer-social-link" aria-label="YouTube"><i data-lucide="youtube"></i></a>
          <a href="#" class="footer-social-link" aria-label="LinkedIn"><i data-lucide="linkedin"></i></a>
        </div>
      </div>

      <!-- Column 2: Quick Links -->
      <div class="footer-col">
        <h4 class="footer-heading">Quick Links</h4>
        <ul class="footer-links" role="list">
          <li><a href="#/" onclick="navigateTo('/');return false;">Home</a></li>
          <li><a href="#/dashboard" onclick="navigateTo('/dashboard');return false;">Dashboard</a></li>
          <li><a href="#/pricing" onclick="navigateTo('/pricing');return false;">Pricing</a></li>
          <li><a href="#/about" onclick="navigateTo('/about');return false;">About</a></li>
        </ul>
      </div>

      <!-- Column 3: Resources -->
      <div class="footer-col">
        <h4 class="footer-heading">Resources</h4>
        <ul class="footer-links" role="list">
          <li><a href="#/syllabus/1pu" onclick="navigateTo('/syllabus/1pu');return false;">1st PU Biology</a></li>
          <li><a href="#/syllabus/2pu" onclick="navigateTo('/syllabus/2pu');return false;">2nd PU Biology</a></li>
          <li><a href="#/questions" onclick="navigateTo('/questions');return false;">Question Bank</a></li>
          <li><a href="#/tests" onclick="navigateTo('/tests');return false;">Mock Tests</a></li>
        </ul>
      </div>

      <!-- Column 4: Contact -->
      <div class="footer-col">
        <h4 class="footer-heading">Contact</h4>
        <ul class="footer-links footer-contact-links" role="list">
          <li>
            <i data-lucide="mail"></i>
            <a href="mailto:hello@bioverse.com">hello@bioverse.com</a>
          </li>
          <li>
            <i data-lucide="phone"></i>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </li>
          <li>
            <i data-lucide="map-pin"></i>
            <span>Karnataka, India</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="footer-copyright">&copy; ${year} BioVerse. All rights reserved.</p>
        <p class="footer-built">Built with ❤️ for Karnataka PU Students</p>
        <div class="footer-legal">
          <a href="#/privacy" onclick="navigateTo('/privacy');return false;">Privacy</a>
          <a href="#/terms" onclick="navigateTo('/terms');return false;">Terms</a>
        </div>
      </div>
    </div>
  </footer>`;
}
