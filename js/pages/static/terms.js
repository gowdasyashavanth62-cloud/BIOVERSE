import { navigateTo } from '../../router.js';
import { Store } from '../../store.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Footer } from '../../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .legal-hero {
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
        text-align: center;
        padding: 70px 24px 50px;
      }
      .legal-hero h1 {
        font-size: 2.4rem;
        font-weight: 800;
        margin-bottom: 8px;
      }
      .legal-hero p {
        font-size: 0.95rem;
        opacity: 0.85;
      }
      .legal-content {
        max-width: 780px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }
      .legal-updated {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f0fdf4;
        color: #15803d;
        font-size: 0.82rem;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 20px;
        margin-bottom: 32px;
      }
      .legal-section {
        margin-bottom: 36px;
      }
      .legal-section h2 {
        font-size: 1.3rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 14px;
        padding-bottom: 10px;
        border-bottom: 2px solid #ecfdf5;
      }
      .legal-section p {
        color: #4b5563;
        font-size: 0.95rem;
        line-height: 1.75;
        margin-bottom: 12px;
      }
      .legal-section ul, .legal-section ol {
        padding-left: 24px;
        margin: 12px 0;
      }
      .legal-section ul li, .legal-section ol li {
        color: #4b5563;
        font-size: 0.95rem;
        line-height: 1.75;
        margin-bottom: 6px;
      }
      .legal-section a {
        color: #16A34A;
        text-decoration: none;
        font-weight: 600;
      }
      .legal-section a:hover {
        text-decoration: underline;
      }
      .legal-highlight {
        background: #f8faf9;
        border-left: 4px solid #16A34A;
        padding: 16px 20px;
        border-radius: 0 10px 10px 0;
        margin: 16px 0;
      }
      .legal-highlight p {
        margin: 0;
        color: #374151;
      }
      .legal-warning {
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
        padding: 16px 20px;
        border-radius: 0 10px 10px 0;
        margin: 16px 0;
      }
      .legal-warning p {
        margin: 0;
        color: #92400e;
      }
    </style>

    ${Navbar()}

    <main>
      <section class="legal-hero">
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using BioVerse</p>
      </section>

      <div class="legal-content">
        <div class="legal-updated">
          <i data-lucide="calendar" style="width:14px;height:14px"></i>
          Last updated: June 1, 2026
        </div>

        <section class="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the BioVerse website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.</p>
          <p>These Terms apply to all visitors, users, students, and others who access or use the Services. By creating an account, you represent that you are at least 15 years old, or are using the platform under the supervision of a parent or guardian.</p>
        </section>

        <section class="legal-section">
          <h2>2. Description of Service</h2>
          <p>BioVerse is an online educational platform that provides Biology learning resources for Karnataka Pre-University (PU) Board students. Our Services include:</p>
          <ul>
            <li>Video lectures covering 1st and 2nd PU Biology syllabi</li>
            <li>Study notes and reference materials</li>
            <li>Practice questions and question banks</li>
            <li>Mock tests and assessments</li>
            <li>Previous year question papers (PYQs)</li>
            <li>Progress tracking and performance analytics</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any part of the Services at any time, with or without notice.</p>
        </section>

        <section class="legal-section">
          <h2>3. User Accounts</h2>
          <p>To access certain features, you must create an account. When creating an account, you agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Immediately notify us of any unauthorized use of your account</li>
          </ul>
          <p>You may not share your account credentials with others or allow others to access your account. Each account is for a single individual user only.</p>
        </section>

        <section class="legal-section">
          <h2>4. Content & Intellectual Property</h2>
          <p>All content on BioVerse — including videos, notes, questions, graphics, logos, and software — is the property of BioVerse or its content creators and is protected by copyright and intellectual property laws.</p>
          <div class="legal-highlight">
            <p><strong>You may:</strong> Access and use the content for personal, non-commercial educational purposes as part of your subscription.</p>
          </div>
          <div class="legal-warning">
            <p><strong>You may NOT:</strong> Copy, reproduce, distribute, publish, download, display, post, transmit, or modify any content without prior written permission from BioVerse.</p>
          </div>
          <p>Specifically, the following are prohibited:</p>
          <ul>
            <li>Screen recording, downloading, or copying video lectures</li>
            <li>Redistributing study notes or question papers</li>
            <li>Sharing your account or subscription with others</li>
            <li>Using any content for commercial purposes</li>
            <li>Scraping or automated collection of any content</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>5. Subscriptions & Payments</h2>
          <p>BioVerse offers both Free and Premium subscription plans:</p>
          <ul>
            <li><strong>Free Plan:</strong> Limited access to basic features at no cost</li>
            <li><strong>Premium Plan:</strong> Full access to all features for ₹299/month or ₹2,499/year</li>
          </ul>
          <p><strong>Payment Terms:</strong></p>
          <ul>
            <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
            <li>Payments are processed securely through Razorpay</li>
            <li>Monthly subscriptions renew automatically unless cancelled</li>
            <li>Annual subscriptions renew at the end of the 12-month period</li>
          </ul>
          <p><strong>Refund Policy:</strong> We offer a 7-day money-back guarantee. If you're unsatisfied within the first 7 days of a new subscription, contact us for a full refund. Refunds are not available after 7 days or for renewal charges.</p>
        </section>

        <section class="legal-section">
          <h2>6. Acceptable Use</h2>
          <p>You agree not to use BioVerse for any unlawful or prohibited purpose. You shall not:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Services or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Use bots, scripts, or automated tools to access the Services</li>
            <li>Post or transmit harmful, threatening, or offensive material</li>
            <li>Engage in any activity that could damage or overload our infrastructure</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>7. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice, for any reason, including:</p>
          <ul>
            <li>Violation of these Terms of Service</li>
            <li>Sharing or redistributing copyrighted content</li>
            <li>Sharing account credentials with others</li>
            <li>Engaging in fraudulent or harmful activities</li>
            <li>Non-payment for Premium subscriptions</li>
          </ul>
          <p>Upon termination, your right to use the Services will immediately cease. We are not liable for any loss of data or access resulting from termination.</p>
        </section>

        <section class="legal-section">
          <h2>8. Disclaimer of Warranties</h2>
          <p>The Services are provided "as is" and "as available" without warranties of any kind, either express or implied. BioVerse does not warrant that:</p>
          <ul>
            <li>The Services will be uninterrupted, timely, secure, or error-free</li>
            <li>The results obtained from the Services will be accurate or reliable</li>
            <li>Any errors in the Services will be corrected</li>
          </ul>
          <p>BioVerse is an educational supplement and does not guarantee specific academic outcomes, exam results, or scores.</p>
        </section>

        <section class="legal-section">
          <h2>9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, BioVerse and its directors, employees, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses resulting from:</p>
          <ul>
            <li>Your access to or use of (or inability to access or use) the Services</li>
            <li>Any conduct or content of any third party on the Services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          <p>In no event shall our total liability exceed the amount you paid us in the past twelve (12) months.</p>
        </section>

        <section class="legal-section">
          <h2>10. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.</p>
        </section>

        <section class="legal-section">
          <h2>11. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p>Your continued use of the Services after changes are posted constitutes acceptance of the revised Terms.</p>
        </section>

        <section class="legal-section">
          <h2>12. Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:legal@bioverse.in">legal@bioverse.in</a></li>
            <li>Phone: +91 80 1234 5678</li>
            <li>Address: 123, 4th Cross, Indiranagar, Bangalore, Karnataka 560038</li>
          </ul>
        </section>
      </div>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
