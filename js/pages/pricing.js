import { navigateTo } from '../router.js';
import { Store } from '../store.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Footer } from '../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .pricing-hero {
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
        text-align: center;
        padding: 80px 24px 60px;
      }
      .pricing-hero h1 {
        font-size: 2.6rem;
        font-weight: 800;
        margin-bottom: 12px;
      }
      .pricing-hero p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 500px;
        margin: 0 auto;
      }
      .pricing-toggle-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-top: 28px;
      }
      .pricing-toggle-label {
        font-size: 0.95rem;
        font-weight: 600;
        opacity: 0.85;
      }
      .pricing-toggle-label.active { opacity: 1; }
      .pricing-toggle {
        width: 52px;
        height: 28px;
        background: rgba(255,255,255,0.3);
        border-radius: 14px;
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
        border: none;
      }
      .pricing-toggle::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 22px;
        height: 22px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
      }
      .pricing-toggle.yearly::after {
        transform: translateX(24px);
      }
      .save-badge {
        background: #fef3c7;
        color: #92400e;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 20px;
      }

      .pricing-cards-section {
        max-width: 900px;
        margin: -40px auto 0;
        padding: 0 24px 60px;
        position: relative;
        z-index: 2;
      }
      .pricing-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 28px;
      }
      .plan-card {
        background: #fff;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        padding: 40px 36px;
        position: relative;
        transition: all 0.25s;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      }
      .plan-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 48px rgba(10,104,71,0.12);
      }
      .plan-card.featured {
        border-color: #16A34A;
        background: linear-gradient(180deg, #f0fdf4, #fff 30%);
      }
      .plan-card.featured::before {
        content: 'RECOMMENDED';
        position: absolute;
        top: -14px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0A6847, #16A34A);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 5px 22px;
        border-radius: 20px;
        letter-spacing: 0.5px;
      }
      .plan-name {
        font-size: 1.3rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 4px;
      }
      .plan-desc {
        color: #6b7280;
        font-size: 0.88rem;
        margin-bottom: 16px;
      }
      .plan-price {
        font-size: 3rem;
        font-weight: 800;
        color: #0A6847;
        line-height: 1;
      }
      .plan-price-period {
        font-size: 0.95rem;
        font-weight: 500;
        color: #6b7280;
      }
      .plan-price-note {
        font-size: 0.82rem;
        color: #9ca3af;
        margin-top: 4px;
        margin-bottom: 24px;
      }
      .plan-features {
        list-style: none;
        padding: 0;
        margin: 0 0 28px;
      }
      .plan-features li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 9px 0;
        color: #374151;
        font-size: 0.92rem;
        line-height: 1.4;
      }
      .plan-features li i {
        flex-shrink: 0;
        margin-top: 2px;
      }
      .plan-features li .check { color: #16A34A; }
      .plan-features li .cross { color: #d1d5db; }
      .plan-btn {
        width: 100%;
        padding: 14px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .plan-btn-free {
        background: #f3f4f6;
        color: #374151;
      }
      .plan-btn-free:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }
      .plan-btn-premium {
        background: linear-gradient(135deg, #0A6847, #16A34A);
        color: #fff;
      }
      .plan-btn-premium:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10,104,71,0.3);
      }

      .comparison-section {
        max-width: 800px;
        margin: 0 auto;
        padding: 60px 24px 80px;
      }
      .comparison-title {
        text-align: center;
        font-size: 1.8rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 8px;
      }
      .comparison-subtitle {
        text-align: center;
        color: #6b7280;
        margin-bottom: 36px;
      }
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      }
      .comparison-table thead th {
        background: #f8faf9;
        padding: 16px 20px;
        text-align: left;
        font-weight: 700;
        font-size: 0.92rem;
        color: #111;
        border-bottom: 2px solid #e5e7eb;
      }
      .comparison-table thead th:not(:first-child) {
        text-align: center;
      }
      .comparison-table tbody td {
        padding: 14px 20px;
        font-size: 0.9rem;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
      }
      .comparison-table tbody td:not(:first-child) {
        text-align: center;
      }
      .comparison-table tbody tr:hover {
        background: #f8faf9;
      }

      .faq-section {
        background: #f8faf9;
        padding: 80px 24px;
      }
      .faq-container {
        max-width: 700px;
        margin: 0 auto;
      }
      .faq-title {
        text-align: center;
        font-size: 1.8rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 8px;
      }
      .faq-subtitle {
        text-align: center;
        color: #6b7280;
        margin-bottom: 36px;
      }
      .faq-item {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        margin-bottom: 12px;
        overflow: hidden;
        transition: box-shadow 0.2s;
      }
      .faq-item:hover {
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      }
      .faq-question {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.95rem;
        color: #111;
        user-select: none;
      }
      .faq-question i {
        transition: transform 0.2s;
        color: #9ca3af;
        flex-shrink: 0;
      }
      .faq-item.open .faq-question i {
        transform: rotate(180deg);
        color: #16A34A;
      }
      .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      .faq-item.open .faq-answer {
        max-height: 300px;
      }
      .faq-answer-inner {
        padding: 0 22px 18px;
        color: #6b7280;
        font-size: 0.9rem;
        line-height: 1.65;
      }

      .pricing-cta {
        padding: 80px 24px;
        text-align: center;
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
      }
      .pricing-cta h2 {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 12px;
      }
      .pricing-cta p {
        opacity: 0.9;
        font-size: 1.05rem;
        margin-bottom: 28px;
        max-width: 480px;
        margin-left: auto;
        margin-right: auto;
      }
      .pricing-cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #fff;
        color: #0A6847;
        padding: 14px 40px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1.05rem;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;
      }
      .pricing-cta-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }

      @media (max-width: 768px) {
        .pricing-hero h1 { font-size: 2rem; }
        .pricing-cards-grid { grid-template-columns: 1fr; }
        .plan-card { padding: 32px 24px; }
        .comparison-table { font-size: 0.82rem; }
      }
    </style>

    ${Navbar()}

    <main>
      <!-- Hero -->
      <section class="pricing-hero">
        <h1>Choose Your Plan</h1>
        <p>Start free and upgrade when you're ready. Simple pricing, no hidden fees.</p>
        <div class="pricing-toggle-wrap">
          <span class="pricing-toggle-label active" id="monthlyLabel">Monthly</span>
          <button class="pricing-toggle" id="billingToggle" aria-label="Toggle billing period"></button>
          <span class="pricing-toggle-label" id="yearlyLabel">Yearly</span>
          <span class="save-badge">Save 30%</span>
        </div>
      </section>

      <!-- Plan Cards -->
      <section class="pricing-cards-section">
        <div class="pricing-cards-grid">
          <div class="plan-card">
            <div class="plan-name">Free</div>
            <div class="plan-desc">Perfect to get started</div>
            <div class="plan-price">₹0</div>
            <div class="plan-price-period">forever free</div>
            <div class="plan-price-note">No credit card required</div>
            <ul class="plan-features">
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Basic video lectures</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Limited study notes</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> 5 questions per chapter</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> 1 mock test</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Community support</li>
              <li><i data-lucide="x" style="width:18px;height:18px" class="cross"></i> PYQ access</li>
              <li><i data-lucide="x" style="width:18px;height:18px" class="cross"></i> Progress analytics</li>
              <li><i data-lucide="x" style="width:18px;height:18px" class="cross"></i> Priority support</li>
            </ul>
            <button class="plan-btn plan-btn-free" onclick="navigateTo('/signup')">
              <i data-lucide="user-plus" style="width:18px;height:18px"></i> Get Started Free
            </button>
          </div>

          <div class="plan-card featured">
            <div class="plan-name">Premium</div>
            <div class="plan-desc">Everything you need to ace your exams</div>
            <div class="plan-price" id="premiumPrice">₹299</div>
            <div class="plan-price-period" id="premiumPeriod">per month</div>
            <div class="plan-price-note" id="premiumNote">Billed monthly, cancel anytime</div>
            <ul class="plan-features">
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> All video lectures (HD)</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Complete study notes & diagrams</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Unlimited practice questions</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> All mock tests with analysis</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> PYQ access (10+ years)</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Detailed progress tracking</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Performance analytics</li>
              <li><i data-lucide="check" style="width:18px;height:18px" class="check"></i> Priority support</li>
            </ul>
            <button class="plan-btn plan-btn-premium" onclick="navigateTo('/signup')">
              <i data-lucide="crown" style="width:18px;height:18px"></i> Start Premium
            </button>
          </div>
        </div>
      </section>

      <!-- Feature Comparison Table -->
      <section class="comparison-section">
        <h2 class="comparison-title">Feature Comparison</h2>
        <p class="comparison-subtitle">See exactly what you get with each plan</p>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th style="color:#0A6847">Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Video Lectures</td><td>Basic</td><td><strong>All (HD)</strong></td></tr>
            <tr><td>Study Notes</td><td>Limited</td><td><strong>Complete</strong></td></tr>
            <tr><td>Practice Questions</td><td>5 per chapter</td><td><strong>Unlimited</strong></td></tr>
            <tr><td>Mock Tests</td><td>1</td><td><strong>All</strong></td></tr>
            <tr><td>Previous Year Questions</td><td>—</td><td><strong>10+ years</strong></td></tr>
            <tr><td>Progress Tracking</td><td>—</td><td><strong>✓</strong></td></tr>
            <tr><td>Performance Analytics</td><td>—</td><td><strong>✓</strong></td></tr>
            <tr><td>KCET Prep Module</td><td>—</td><td><strong>✓</strong></td></tr>
            <tr><td>NEET Prep Module</td><td>—</td><td><strong>✓</strong></td></tr>
            <tr><td>Support</td><td>Community</td><td><strong>Priority</strong></td></tr>
          </tbody>
        </table>
      </section>

      <!-- FAQ -->
      <section class="faq-section">
        <div class="faq-container">
          <h2 class="faq-title">Frequently Asked Questions</h2>
          <p class="faq-subtitle">Got questions? We've got answers.</p>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>Can I try Premium features before subscribing?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">Yes! Start with our Free plan to explore the platform. You can access basic video lectures, limited notes, and sample questions. Upgrade to Premium anytime when you're ready for the full experience.</div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>What payment methods do you accept?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">We accept all major payment methods including UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe. Payments are securely processed through Razorpay.</div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>Can I cancel my subscription anytime?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">Absolutely. You can cancel your Premium subscription at any time from your account settings. You'll continue to have access to Premium features until the end of your billing period. No questions asked.</div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>Is the content aligned with the Karnataka PU Board syllabus?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">Yes, 100%. All our content — videos, notes, and questions — is carefully curated and aligned with the Karnataka PU Board Biology syllabus. Additionally, our KCET and NEET modules cover the specific exam patterns.</div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>Do you offer refunds?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">Yes, we offer a 7-day money-back guarantee on all Premium subscriptions. If you're not satisfied within the first 7 days, contact us and we'll process a full refund.</div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>Can I access BioVerse on my phone?</span>
              <i data-lucide="chevron-down" style="width:20px;height:20px"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">Yes! BioVerse is fully responsive and works on all devices — phones, tablets, and desktops. You can study anywhere, anytime. A dedicated mobile app is also in development.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="pricing-cta">
        <h2>Ready to ace your Biology exams?</h2>
        <p>Join thousands of Karnataka PU students who are already learning smarter with BioVerse.</p>
        <a class="pricing-cta-btn" onclick="navigateTo('/signup')">
          <i data-lucide="rocket" style="width:20px;height:20px"></i> Start Learning Today
        </a>
      </section>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Billing toggle
  const toggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel = document.getElementById('yearlyLabel');
  const premiumPrice = document.getElementById('premiumPrice');
  const premiumPeriod = document.getElementById('premiumPeriod');
  const premiumNote = document.getElementById('premiumNote');

  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('yearly');
      const isYearly = toggle.classList.contains('yearly');

      monthlyLabel.classList.toggle('active', !isYearly);
      yearlyLabel.classList.toggle('active', isYearly);

      if (isYearly) {
        premiumPrice.textContent = '₹2,499';
        premiumPeriod.textContent = 'per year';
        premiumNote.textContent = 'That\'s just ₹208/month — save 30%';
      } else {
        premiumPrice.textContent = '₹299';
        premiumPeriod.textContent = 'per month';
        premiumNote.textContent = 'Billed monthly, cancel anytime';
      }
    });
  }
}
