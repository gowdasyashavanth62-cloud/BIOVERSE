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
        font-family: inherit;
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
      .auth-left::after {
        content: '';
        position: absolute;
        bottom: -20%;
        left: -20%;
        width: 60%;
        height: 60%;
        background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%);
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
      }
      .auth-form-wrapper {
        width: 100%;
        max-width: 420px;
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
        margin-bottom: 32px;
      }
      .auth-form .form-group {
        margin-bottom: 20px;
      }
      .auth-form .form-label {
        display: block;
        font-size: 0.88rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
      }
      .auth-form .form-input {
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
      .auth-form .form-input:focus {
        border-color: #16A34A;
        box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
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
      .password-toggle:hover {
        color: #6b7280;
      }
      .form-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .remember-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        color: #374151;
        cursor: pointer;
      }
      .remember-label input {
        accent-color: #16A34A;
        width: 16px;
        height: 16px;
      }
      .forgot-link {
        font-size: 0.88rem;
        color: #16A34A;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }
      .forgot-link:hover {
        text-decoration: underline;
      }
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
        margin-top: 24px;
        font-size: 0.9rem;
        color: #6b7280;
      }
      .auth-footer-text a {
        color: #16A34A;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
      }
      .auth-footer-text a:hover {
        text-decoration: underline;
      }
      .auth-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 0.88rem;
        margin-bottom: 20px;
        display: none;
        align-items: center;
        gap: 8px;
      }
      .auth-error.show {
        display: flex;
      }

      @media (max-width: 768px) {
        .auth-left { display: none; }
        .auth-right { padding: 32px 20px; }
      }
    </style>

    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand" onclick="navigateTo('/')">
          <i data-lucide="leaf" style="width:28px;height:28px"></i>
          BioVerse
        </div>
        <p class="auth-brand-sub">Karnataka PU Biology Learning Platform</p>
        <ul class="auth-features">
          <li><i data-lucide="play-circle"></i> HD Video lectures for every chapter</li>
          <li><i data-lucide="book-open"></i> Detailed notes with diagrams</li>
          <li><i data-lucide="help-circle"></i> 1000+ practice questions with solutions</li>
          <li><i data-lucide="clipboard-check"></i> Mock tests for KCET & NEET prep</li>
          <li><i data-lucide="bar-chart-2"></i> Track progress & identify weak areas</li>
          <li><i data-lucide="shield-check"></i> Trusted by 5,000+ Karnataka students</li>
        </ul>
      </div>

      <div class="auth-right">
        <div class="auth-form-wrapper">
          <h1 class="auth-form-title">Welcome back</h1>
          <p class="auth-form-subtitle">Sign in to continue your learning journey</p>

          <div class="auth-error" id="loginError">
            <i data-lucide="alert-circle" style="width:18px;height:18px;flex-shrink:0"></i>
            <span id="loginErrorText">Invalid email or password</span>
          </div>

          <form class="auth-form" id="loginForm" autocomplete="on">
            <div class="form-group">
              <label class="form-label" for="loginEmail">Email or Username</label>
              <input class="form-input" type="text" id="loginEmail" placeholder="Enter your email or username" autocomplete="username" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="loginPassword">Password</label>
              <div class="password-wrapper">
                <input class="form-input" type="password" id="loginPassword" placeholder="Enter your password" autocomplete="current-password" required>
                <button type="button" class="password-toggle" id="togglePassword">
                  <i data-lucide="eye" style="width:18px;height:18px" id="eyeIcon"></i>
                </button>
              </div>
            </div>
            <div class="form-row">
              <label class="remember-label">
                <input type="checkbox" id="rememberMe"> Remember me
              </label>
              <a class="forgot-link" onclick="navigateTo('/forgot-password')">Forgot password?</a>
            </div>
            <button type="submit" class="auth-submit" id="loginBtn">
              <i data-lucide="log-in" style="width:18px;height:18px"></i> Sign In
            </button>
          </form>

          <p class="auth-footer-text">
            Don't have an account? <a onclick="navigateTo('/signup')">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Password visibility toggle
  const toggleBtn = document.getElementById('togglePassword');
  const pwdInput = document.getElementById('loginPassword');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = pwdInput.type === 'password';
      pwdInput.type = isPassword ? 'text' : 'password';
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  // Form submission
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginError');
  const errorText = document.getElementById('loginErrorText');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.classList.remove('show');

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      // Validation
      if (!email || !password) {
        errorText.textContent = 'Please fill in all fields.';
        errorBox.classList.add('show');
        return;
      }

      // Attempt login
      const loginBtn = document.getElementById('loginBtn');
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i data-lucide="loader-2" style="width:18px;height:18px;animation:spin 1s linear infinite"></i> Signing in...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      try {
        const user = await Store.login(email, password);
        if (!user || user.error) {
          errorText.textContent = user?.error || 'Invalid email or password. Please try again.';
          errorBox.classList.add('show');
          loginBtn.disabled = false;
          loginBtn.innerHTML = '<i data-lucide="log-in" style="width:18px;height:18px"></i> Sign In';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
          navigateTo('/dashboard');
        }
      } catch (err) {
        errorText.textContent = err.message || 'An error occurred during sign in.';
        errorBox.classList.add('show');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i data-lucide="log-in" style="width:18px;height:18px"></i> Sign In';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }
}
