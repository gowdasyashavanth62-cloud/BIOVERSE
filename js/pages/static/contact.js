import { navigateTo } from '../../router.js';
import { Store } from '../../store.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Footer } from '../../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .contact-hero {
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
        text-align: center;
        padding: 80px 24px 60px;
      }
      .contact-hero h1 {
        font-size: 2.6rem;
        font-weight: 800;
        margin-bottom: 12px;
      }
      .contact-hero p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 500px;
        margin: 0 auto;
      }
      .contact-content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 60px 24px 80px;
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 40px;
        align-items: start;
      }
      .contact-form-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 36px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.04);
      }
      .contact-form-card h2 {
        font-size: 1.4rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 6px;
      }
      .contact-form-card .subtitle {
        color: #6b7280;
        font-size: 0.92rem;
        margin-bottom: 28px;
      }
      .contact-form .form-group {
        margin-bottom: 20px;
      }
      .contact-form .form-label {
        display: block;
        font-size: 0.88rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
      }
      .contact-form .form-input,
      .contact-form .form-textarea {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid #d1d5db;
        border-radius: 10px;
        font-size: 0.95rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        box-sizing: border-box;
        font-family: inherit;
      }
      .contact-form .form-input:focus,
      .contact-form .form-textarea:focus {
        border-color: #16A34A;
        box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
      }
      .contact-form .form-textarea {
        resize: vertical;
        min-height: 120px;
      }
      .contact-submit {
        width: 100%;
        padding: 13px;
        background: linear-gradient(135deg, #0A6847, #16A34A);
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .contact-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10,104,71,0.3);
      }
      .contact-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      .contact-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #15803d;
        padding: 20px;
        border-radius: 14px;
        text-align: center;
        display: none;
      }
      .contact-success.show { display: block; }
      .contact-success i {
        display: block;
        margin: 0 auto 10px;
      }
      .contact-success strong {
        display: block;
        margin-bottom: 4px;
        font-size: 1.05rem;
      }

      .contact-sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .sidebar-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.03);
      }
      .sidebar-card h3 {
        font-size: 1rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sidebar-card h3 i {
        color: #16A34A;
      }
      .sidebar-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .sidebar-item:last-child { border-bottom: none; }
      .sidebar-item-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0A6847;
        flex-shrink: 0;
      }
      .sidebar-item-label {
        font-size: 0.82rem;
        color: #9ca3af;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .sidebar-item-value {
        font-size: 0.9rem;
        color: #374151;
        line-height: 1.5;
      }
      .sidebar-hours {
        font-size: 0.88rem;
        color: #6b7280;
        line-height: 1.6;
      }
      .sidebar-hours strong {
        color: #374151;
      }

      @media (max-width: 768px) {
        .contact-hero h1 { font-size: 2rem; }
        .contact-content {
          grid-template-columns: 1fr;
          padding: 40px 20px 60px;
        }
      }
    </style>

    ${Navbar()}

    <main>
      <section class="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.</p>
      </section>

      <div class="contact-content">
        <div class="contact-form-card">
          <h2>Send us a message</h2>
          <p class="subtitle">Fill out the form below and we'll get back to you shortly.</p>

          <div class="contact-success" id="contactSuccess">
            <i data-lucide="check-circle-2" style="width:40px;height:40px;color:#16A34A"></i>
            <strong>Message sent successfully!</strong>
            <p style="margin:0;font-size:0.9rem">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          </div>

          <form class="contact-form" id="contactForm">
            <div class="form-group">
              <label class="form-label" for="contactName">Full Name</label>
              <input class="form-input" type="text" id="contactName" placeholder="Your full name" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactEmail">Email Address</label>
              <input class="form-input" type="email" id="contactEmail" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactSubject">Subject</label>
              <input class="form-input" type="text" id="contactSubject" placeholder="How can we help?" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactMessage">Message</label>
              <textarea class="form-textarea" id="contactMessage" placeholder="Tell us more about your query..." required></textarea>
            </div>
            <button type="submit" class="contact-submit" id="contactBtn">
              <i data-lucide="send" style="width:18px;height:18px"></i> Send Message
            </button>
          </form>
        </div>

        <div class="contact-sidebar">
          <div class="sidebar-card">
            <h3><i data-lucide="info" style="width:18px;height:18px"></i> Contact Information</h3>
            <div class="sidebar-item">
              <div class="sidebar-item-icon"><i data-lucide="mail" style="width:18px;height:18px"></i></div>
              <div>
                <div class="sidebar-item-label">Email</div>
                <div class="sidebar-item-value">hello@bioverse.in</div>
              </div>
            </div>
            <div class="sidebar-item">
              <div class="sidebar-item-icon"><i data-lucide="phone" style="width:18px;height:18px"></i></div>
              <div>
                <div class="sidebar-item-label">Phone</div>
                <div class="sidebar-item-value">+91 80 1234 5678</div>
              </div>
            </div>
            <div class="sidebar-item">
              <div class="sidebar-item-icon"><i data-lucide="map-pin" style="width:18px;height:18px"></i></div>
              <div>
                <div class="sidebar-item-label">Address</div>
                <div class="sidebar-item-value">123, 4th Cross, Indiranagar<br>Bangalore, KA 560038</div>
              </div>
            </div>
          </div>

          <div class="sidebar-card">
            <h3><i data-lucide="clock" style="width:18px;height:18px"></i> Support Hours</h3>
            <div class="sidebar-hours">
              <strong>Monday – Friday</strong><br>9:00 AM – 6:00 PM IST<br><br>
              <strong>Saturday</strong><br>10:00 AM – 2:00 PM IST<br><br>
              <strong>Sunday</strong><br>Closed
            </div>
          </div>

          <div class="sidebar-card" style="background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-color:#bbf7d0">
            <h3><i data-lucide="message-circle" style="width:18px;height:18px"></i> Quick Support</h3>
            <p style="font-size:0.88rem;color:#4b5563;line-height:1.6;margin:0">For urgent academic queries, email us at <strong>support@bioverse.in</strong> with your registered email for faster response.</p>
          </div>
        </div>
      </div>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('contactSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) return;

      const btn = document.getElementById('contactBtn');
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" style="width:18px;height:18px;animation:spin 1s linear infinite"></i> Sending...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        form.style.display = 'none';
        successBox.classList.add('show');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 800);
    });
  }
}
