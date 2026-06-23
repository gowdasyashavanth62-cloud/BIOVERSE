import { navigateTo } from '../router.js';
import { Store } from '../store.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Footer } from '../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .forgot-page {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 24px;
        background: #f8faf9;
      }
      .forgot-card {
        background: #fff;
        border-radius: 20px;
        padding: 44px 40px;
        max-width: 440px;
        width: 100%;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        border: 1px solid #e5e7eb;
      }
      .forgot-icon-wrap {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        color: #0A6847;
      }
      .forgot-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #111;
        text-align: center;
        margin-bottom: 8px;
      }
      .forgot-subtitle {
        text-align: center;
        color: #6b7280;
        font-size: 0.92rem;
        margin-bottom: 28px;
        line-height: 1.5;
      }
      .forgot-card .form-group {
        margin-bottom: 20px;
      }
      .forgot-card .form-label {
        display: block;
        font-size: 0.88rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
      }
      .forgot-card .form-input {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid #d1d5db;
        border-radius: 10px;
        font-size: 0.95rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        box-sizing: border-box;
      }
      .forgot-card .form-input:focus {
        border-color: #16A34A;
        box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
      }
      .forgot-submit {
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
      .forgot-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10,104,71,0.3);
      }
      .forgot-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      .forgot-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 0.88rem;
        margin-bottom: 18px;
        display: none;
        align-items: center;
        gap: 8px;
      }
      .forgot-error.show { display: flex; }
      .forgot-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #15803d;
        padding: 16px;
        border-radius: 12px;
        font-size: 0.92rem;
        text-align: center;
        line-height: 1.5;
        display: none;
      }
      .forgot-success.show { display: block; }
      .forgot-success i {
        display: block;
        margin: 0 auto 8px;
      }
      .forgot-back {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 22px;
        font-size: 0.9rem;
        color: #6b7280;
      }
      .forgot-back a {
        color: #16A34A;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
      }
      .forgot-back a:hover { text-decoration: underline; }

      @media (max-width: 480px) {
        .forgot-card { padding: 32px 24px; }
      }
    </style>

    ${Navbar()}

    <main>
      <div class="forgot-page">
        <div class="forgot-card">
          <div class="forgot-icon-wrap">
            <i data-lucide="key-round" style="width:30px;height:30px"></i>
          </div>
          <h1 class="forgot-title">Forgot your password?</h1>
          <p class="forgot-subtitle">No worries! Enter the email address linked to your account and we'll send you a reset link.</p>

          <div class="forgot-error" id="forgotError">
            <i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0"></i>
            <span id="forgotErrorText"></span>
          </div>

          <div class="forgot-success" id="forgotSuccess">
            <i data-lucide="mail-check" style="width:32px;height:32px;color:#16A34A"></i>
            <strong>Password reset link sent!</strong><br>
            We've sent a password reset link to your email address. Please check your inbox and spam folder.
          </div>

          <form id="forgotForm">
            <div class="form-group">
              <label class="form-label" for="forgotEmail">Email Address</label>
              <input class="form-input" type="email" id="forgotEmail" placeholder="you@example.com" required>
            </div>
            <button type="submit" class="forgot-submit" id="forgotBtn">
              <i data-lucide="send" style="width:18px;height:18px"></i> Send Reset Link
            </button>
          </form>

          <div class="forgot-back">
            <i data-lucide="arrow-left" style="width:16px;height:16px"></i>
            <span>Back to <a onclick="navigateTo('/login')">Sign In</a></span>
          </div>
        </div>
      </div>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const form = document.getElementById('forgotForm');
  const errorBox = document.getElementById('forgotError');
  const errorText = document.getElementById('forgotErrorText');
  const successBox = document.getElementById('forgotSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.classList.remove('show');

      const email = document.getElementById('forgotEmail').value.trim();

      if (!email) {
        errorText.textContent = 'Please enter your email address.';
        errorBox.classList.add('show');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorText.textContent = 'Please enter a valid email address.';
        errorBox.classList.add('show');
        return;
      }

      const btn = document.getElementById('forgotBtn');
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
