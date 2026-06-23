import { navigateTo } from '../router.js';
import { Store } from '../store.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .auth-container {
        display: flex;
        min-height: 100vh;
      }
      .auth-left {
        flex: 1;
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 50%, #065f46 100%);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 60px 48px;
        position: relative;
        overflow: hidden;
      }
      .auth-left::before {
        content: '';
        position: absolute;
        top: -30%;
        right: -30%;
        width: 80%;
        height: 80%;
        background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%);
        pointer-events: none;
      }
      .auth-brand {
        font-size: 1.8rem;
        font-weight: 800;
        margin-bottom: 8px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      .auth-brand-sub {
        font-size: 1rem;
        opacity: 0.85;
        margin-bottom: 40px;
        position: relative;
      }
      .auth-features {
        list-style: none;
        padding: 0;
        margin: 0;
        position: relative;
      }
      .auth-features li {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 0;
        font-size: 1rem;
        opacity: 0.92;
      }
      .auth-features li i {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        opacity: 0.85;
      }
      .auth-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 24px;
        background: #fff;
        overflow-y: auto;
      }
      .auth-form-wrapper {
        width: 100%;
        max-width: 440px;
        padding: 20px 0;
      }
      .auth-form-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 6px;
      }
      .auth-form-subtitle {
        color: #6b7280;
        font-size: 0.95rem;
        margin-bottom: 28px;
      }
      .auth-form .form-group {
        margin-bottom: 18px;
      }
      .auth-form .form-label {
        display: block;
        font-size: 0.88rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
      }
      .auth-form .form-input,
      .auth-form .form-select {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid #d1d5db;
        border-radius: 10px;
        font-size: 0.95rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        box-sizing: border-box;
        background: #fff;
      }
      .auth-form .form-input:focus,
      .auth-form .form-select:focus {
        border-color: #16A34A;
        box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
      }
      .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .password-wrapper {
        position: relative;
      }
      .password-wrapper .form-input {
        padding-right: 44px;
      }
      .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        padding: 4px;
        display: flex;
        align-items: center;
      }
      .password-toggle:hover { color: #6b7280; }
      .auth-submit {
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
        margin-top: 8px;
      }
      .auth-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10,104,71,0.3);
      }
      .auth-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .auth-footer-text {
        text-align: center;
        margin-top: 22px;
        font-size: 0.9rem;
        color: #6b7280;
      }
      .auth-footer-text a {
        color: #16A34A;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
      }
      .auth-footer-text a:hover { text-decoration: underline; }
      .auth-error {
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
      .auth-error.show { display: flex; }
      .password-strength {
        height: 4px;
        background: #e5e7eb;
        border-radius: 4px;
        margin-top: 8px;
        overflow: hidden;
      }
      .password-strength-bar {
        height: 100%;
        width: 0%;
        border-radius: 4px;
        transition: all 0.3s;
      }
      .terms-text {
        font-size: 0.82rem;
        color: #9ca3af;
        margin-top: 14px;
        text-align: center;
        line-height: 1.5;
      }
      .terms-text a {
        color: #16A34A;
        text-decoration: none;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .auth-left { display: none; }
        .auth-right { padding: 32px 20px; }
        .form-row-2 { grid-template-columns: 1fr; }
      }
    </style>

    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand" onclick="navigateTo('/')">
          <i data-lucide="leaf" style="width:28px;height:28px"></i>
          BioVerse
        </div>
        <p class="auth-brand-sub">Your journey to mastering Biology starts here</p>
        <ul class="auth-features">
          <li><i data-lucide="zap"></i> Get started in under a minute</li>
          <li><i data-lucide="book-open"></i> Access free chapters immediately</li>
          <li><i data-lucide="target"></i> Prepare for PU Boards, KCET & NEET</li>
          <li><i data-lucide="trending-up"></i> Track your progress & improve</li>
          <li><i data-lucide="users"></i> Join 5,000+ Karnataka students</li>
          <li><i data-lucide="gift"></i> Free plan available — no credit card needed</li>
        </ul>
      </div>

      <div class="auth-right">
        <div class="auth-form-wrapper">
          <h1 class="auth-form-title">Create your account</h1>
          <p class="auth-form-subtitle">Start learning Biology the smart way</p>

          <div class="auth-error" id="signupError">
            <i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0"></i>
            <span id="signupErrorText"></span>
          </div>

          <form class="auth-form" id="signupForm" autocomplete="on">
            <div class="form-group">
              <label class="form-label" for="signupName">Full Name</label>
              <input class="form-input" type="text" id="signupName" placeholder="Enter your full name" autocomplete="name" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="signupEmail">Email or Username</label>
              <input class="form-input" type="text" id="signupEmail" placeholder="Enter an email or username" autocomplete="username" required>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="signupPhone">Phone Number</label>
                <input class="form-input" type="tel" id="signupPhone" placeholder="10-digit number" autocomplete="tel" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="signupClass">Class</label>
                <select class="form-input form-select" id="signupClass" required>
                  <option value="" disabled selected>Select class</option>
                  <option value="1st PU">1st PU</option>
                  <option value="2nd PU">2nd PU</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signupPassword">Password</label>
              <div class="password-wrapper">
                <input class="form-input" type="password" id="signupPassword" placeholder="Min 6 characters" autocomplete="new-password" required>
                <button type="button" class="password-toggle" id="togglePassword1">
                  <i data-lucide="eye" style="width:18px;height:18px"></i>
                </button>
              </div>
              <div class="password-strength">
                <div class="password-strength-bar" id="pwdStrengthBar"></div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signupConfirm">Confirm Password</label>
              <div class="password-wrapper">
                <input class="form-input" type="password" id="signupConfirm" placeholder="Re-enter password" autocomplete="new-password" required>
                <button type="button" class="password-toggle" id="togglePassword2">
                  <i data-lucide="eye" style="width:18px;height:18px"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="auth-submit" id="signupBtn">
              <i data-lucide="user-plus" style="width:18px;height:18px"></i> Create Account
            </button>
          </form>

          <p class="terms-text">
            By signing up, you agree to our <a onclick="navigateTo('/terms')">Terms of Service</a> and <a onclick="navigateTo('/privacy')">Privacy Policy</a>.
          </p>

          <p class="auth-footer-text">
            Already have an account? <a onclick="navigateTo('/login')">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Password visibility toggles
  function setupToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (btn && input) {
      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });
    }
  }
  setupToggle('togglePassword1', 'signupPassword');
  setupToggle('togglePassword2', 'signupConfirm');

  // Password strength meter
  const pwdInput = document.getElementById('signupPassword');
  const strengthBar = document.getElementById('pwdStrengthBar');
  if (pwdInput && strengthBar) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      let strength = 0;
      if (val.length >= 6) strength++;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const pct = Math.min((strength / 5) * 100, 100);
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16A34A'];
      strengthBar.style.width = pct + '%';
      strengthBar.style.background = colors[Math.min(strength - 1, 4)] || '#e5e7eb';
    });
  }

  // Form submission
  const form = document.getElementById('signupForm');
  const errorBox = document.getElementById('signupError');
  const errorText = document.getElementById('signupErrorText');

  function showError(msg) {
    errorText.textContent = msg;
    errorBox.classList.add('show');
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.classList.remove('show');

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;
      const cls = document.getElementById('signupClass').value;

      // Validation
      if (!name || !email || !phone || !password || !confirm || !cls) {
        showError('Please fill in all fields.');
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        showError('Please enter a valid 10-digit phone number.');
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirm) {
        showError('Passwords do not match.');
        return;
      }

      // Submit
      const submitBtn = document.getElementById('signupBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" style="width:18px;height:18px;animation:spin 1s linear infinite"></i> Creating account...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        const result = Store.signup({ name, email, phone, password, class: cls });
        if (result && result.error) {
          showError(result.error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i data-lucide="user-plus" style="width:18px;height:18px"></i> Create Account';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        } else if (result && result.isPending) {
          // Show success message and redirect to login
          errorBox.classList.remove('auth-error');
          errorBox.style.background = '#dcfce7';
          errorBox.style.color = '#166534';
          errorBox.style.borderColor = '#bbf7d0';
          errorText.textContent = 'Account created successfully! It is pending admin approval.';
          errorBox.classList.add('show');
          submitBtn.innerHTML = '<i data-lucide="check" style="width:18px;height:18px"></i> Success';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(() => navigateTo('/login'), 3000);
        } else {
          navigateTo('/dashboard');
        }
      }, 600);
    });
  }
}
