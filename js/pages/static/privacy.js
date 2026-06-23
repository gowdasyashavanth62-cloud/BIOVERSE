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
      .legal-section ul {
        padding-left: 24px;
        margin: 12px 0;
      }
      .legal-section ul li {
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
    </style>

    ${Navbar()}

    <main>
      <section class="legal-hero">
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your information</p>
      </section>

      <div class="legal-content">
        <div class="legal-updated">
          <i data-lucide="calendar" style="width:14px;height:14px"></i>
          Last updated: June 1, 2026
        </div>

        <section class="legal-section">
          <h2>1. Introduction</h2>
          <p>Welcome to BioVerse ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at bioverse.in.</p>
          <p>By using BioVerse, you agree to the collection and use of information in accordance with this policy.</p>
        </section>

        <section class="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We collect information that you provide directly to us and information collected automatically when you use our services.</p>
          <p><strong>Personal Information:</strong></p>
          <ul>
            <li>Full name and email address</li>
            <li>Phone number</li>
            <li>Class/year (1st PU or 2nd PU)</li>
            <li>Account password (stored securely using encryption)</li>
            <li>Payment information (processed through third-party payment providers)</li>
          </ul>
          <p><strong>Usage Information:</strong></p>
          <ul>
            <li>Chapters and topics accessed</li>
            <li>Test scores and quiz performance</li>
            <li>Learning progress and study time</li>
            <li>Device type, browser information, and IP address</li>
            <li>Pages visited and navigation patterns</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our educational services</li>
            <li>To personalize your learning experience and recommend content</li>
            <li>To track your academic progress and provide analytics</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send important updates about your account and our services</li>
            <li>To respond to your queries and provide customer support</li>
            <li>To detect and prevent fraud or abuse of our platform</li>
          </ul>
          <div class="legal-highlight">
            <p><strong>Note:</strong> We will never sell your personal information to third parties for marketing purposes.</p>
          </div>
        </section>

        <section class="legal-section">
          <h2>4. Cookies & Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to enhance your experience on BioVerse. These include:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., authentication, session management)</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform to improve our services</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences for a better experience</li>
          </ul>
          <p>You can manage cookie preferences through your browser settings. However, disabling essential cookies may affect platform functionality.</p>
        </section>

        <section class="legal-section">
          <h2>5. Third-Party Services</h2>
          <p>We may share limited information with trusted third-party service providers who assist us in operating our platform:</p>
          <ul>
            <li><strong>Payment Processing:</strong> Razorpay for secure payment handling</li>
            <li><strong>Analytics:</strong> Google Analytics for usage insights</li>
            <li><strong>Cloud Hosting:</strong> AWS/Google Cloud for data storage and delivery</li>
            <li><strong>Email Service:</strong> For transactional emails and notifications</li>
          </ul>
          <p>These providers are contractually obligated to protect your data and use it only for the services they provide to us.</p>
        </section>

        <section class="legal-section">
          <h2>6. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information:</p>
          <ul>
            <li>SSL/TLS encryption for all data in transit</li>
            <li>Encrypted storage for passwords and sensitive data</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls limiting who can view your information</li>
          </ul>
          <p>While we strive to protect your data, no method of electronic storage or transmission is 100% secure. We encourage you to use a strong, unique password for your BioVerse account.</p>
        </section>

        <section class="legal-section">
          <h2>7. Your Rights</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Export:</strong> Request a portable copy of your data</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@bioverse.in">privacy@bioverse.in</a>.</p>
        </section>

        <section class="legal-section">
          <h2>8. Children's Privacy</h2>
          <p>BioVerse is designed for students aged 15 and above. If you are under 15, please use our services under the supervision of a parent or guardian. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it promptly.</p>
        </section>

        <section class="legal-section">
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of significant changes by posting a notice on our website or sending you an email. Your continued use of BioVerse after changes are posted constitutes acceptance of the updated policy.</p>
        </section>

        <section class="legal-section">
          <h2>10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:privacy@bioverse.in">privacy@bioverse.in</a></li>
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
