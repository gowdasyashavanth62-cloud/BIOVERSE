import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');

  // Let's set countdown target: July 15, 2026
  const targetDate = new Date('2026-07-15T00:00:00+05:30').getTime();

  app.innerHTML = `
    <style>
      .launch-bg {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 20%, #0c3e2e 0%, #05261c 44%, #02140e 100%);
        color: #fff;
        font-family: var(--font-body);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        position: relative;
        overflow: hidden;
      }
      .launch-bg::before {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 60%);
        top: -10%;
        right: -10%;
        pointer-events: none;
      }
      .launch-bg::after {
        content: '';
        position: absolute;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(22,163,74,0.04) 0%, transparent 60%);
        bottom: -10%;
        left: -10%;
        pointer-events: none;
      }
      .launch-container {
        max-width: 800px;
        text-align: center;
        position: relative;
        z-index: 10;
      }
      .launch-brand {
        font-family: var(--font-display);
        font-size: 2.2rem;
        font-weight: 800;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 2rem;
        cursor: pointer;
      }
      .launch-title {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 1.2rem;
        background: linear-gradient(135deg, #fff 0%, #a7f3d0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .launch-subtitle {
        font-size: 1.15rem;
        color: #a7f3d0;
        opacity: 0.85;
        max-width: 600px;
        margin: 0 auto 3rem;
        line-height: 1.6;
      }
      
      /* Countdown clock style */
      .countdown-wrap {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 3.5rem;
      }
      .countdown-box {
        background: rgba(255,255,255,0.04);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        width: 100px;
        padding: 20px 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .countdown-num {
        font-family: var(--font-display);
        font-size: 2.5rem;
        font-weight: 800;
        color: #fff;
        line-height: 1;
        margin-bottom: 5px;
      }
      .countdown-lbl {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: #34d399;
        text-transform: uppercase;
      }

      /* Form Style */
      .waitlist-card {
        background: rgba(255,255,255,0.03);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        margin: 0 auto;
        box-shadow: 0 16px 48px rgba(0,0,0,0.3);
      }
      .waitlist-title {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .waitlist-desc {
        font-size: 0.88rem;
        color: #9ca3af;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      .waitlist-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        text-align: left;
      }
      .waitlist-input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255,255,255,0.05);
        border: 1.5px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        color: #fff;
        font-size: 0.95rem;
        outline: none;
        box-sizing: border-box;
        transition: all 0.2s;
      }
      .waitlist-input::placeholder { color: rgba(255,255,255,0.4); }
      .waitlist-input:focus {
        border-color: #34d399;
        background: rgba(255,255,255,0.08);
        box-shadow: 0 0 0 3px rgba(52,211,153,0.15);
      }
      .waitlist-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: none;
        border-radius: 10px;
        color: #fff;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 15px rgba(16,185,129,0.3);
      }
      .waitlist-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(16,185,129,0.4);
      }

      .reward-box {
        background: rgba(16,185,129,0.1);
        border: 1px dashed #10b981;
        padding: 20px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: fadeIn 0.3s ease;
      }

      @media (max-width: 768px) {
        .launch-title { font-size: 2.2rem; }
        .countdown-wrap { gap: 10px; }
        .countdown-box { width: 75px; padding: 15px 5px; }
        .countdown-num { font-size: 1.8rem; }
        .waitlist-card { padding: 30px 20px; }
      }
    </style>

    <div class="launch-bg">
      <div class="launch-container">
        <!-- Logo -->
        <div class="launch-brand" onclick="navigateTo('/')">
          <i data-lucide="leaf" style="width:36px; height:36px; color:#34d399;"></i>
          <span>BioVerse</span>
        </div>

        <!-- Headline -->
        <h1 class="launch-title">BioVerse is Launching Soon</h1>
        <p class="launch-subtitle">The ultimate Karnataka PU Biology portal. Master concepts, track streaks, and crack KCET & NEET with our premium CMS & smart planners.</p>

        <!-- Countdown Clock -->
        <div class="countdown-wrap">
          <div class="countdown-box">
            <span class="countdown-num" id="daysBox">00</span>
            <span class="countdown-lbl">Days</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="hoursBox">00</span>
            <span class="countdown-lbl">Hrs</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="minsBox">00</span>
            <span class="countdown-lbl">Mins</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="secsBox">00</span>
            <span class="countdown-lbl">Secs</span>
          </div>
        </div>

        <!-- Waitlist Form Card -->
        <div class="waitlist-card">
          <div id="waitlistContent">
            <h3 class="waitlist-title">Join the Exclusive Waitlist</h3>
            <p class="waitlist-desc">Secure early access. Join 800+ students and get a **20% off launch coupon** sent directly to your inbox!</p>
            
            <form class="waitlist-form" id="waitForm">
              <input type="text" class="waitlist-input" id="waitName" placeholder="Your Full Name" required>
              <input type="email" class="waitlist-input" id="waitEmail" placeholder="Your Email Address" required>
              <input type="tel" class="waitlist-input" id="waitPhone" placeholder="Your Phone Number (Optional)">
              <button type="submit" class="waitlist-btn">Join Waitlist</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // 1. Countdown timer ticker
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(interval);
      document.getElementById('daysBox').textContent = '00';
      document.getElementById('hoursBox').textContent = '00';
      document.getElementById('minsBox').textContent = '00';
      document.getElementById('secsBox').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dBox = document.getElementById('daysBox');
    const hBox = document.getElementById('hoursBox');
    const mBox = document.getElementById('minsBox');
    const sBox = document.getElementById('secsBox');

    if (dBox) dBox.textContent = days.toString().padStart(2, '0');
    if (hBox) hBox.textContent = hours.toString().padStart(2, '0');
    if (mBox) mBox.textContent = mins.toString().padStart(2, '0');
    if (sBox) sBox.textContent = secs.toString().padStart(2, '0');
  }, 1000);

  // 2. Waitlist registration form handler
  const form = document.getElementById('waitForm');
  const wContent = document.getElementById('waitlistContent');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('waitName').value.trim();
    const email = document.getElementById('waitEmail').value.trim();
    const phone = document.getElementById('waitPhone').value.trim();

    const res = Store.addToWaitlist({ name, email, phone });
    if (res.error) {
      showToast(res.error, 'error');
    } else {
      showToast('You have been added to the waitlist!', 'success');
      wContent.innerHTML = `
        <div class="reward-box">
          <i data-lucide="check-circle" style="width:40px; height:40px; color:#10b981; margin-bottom:10px; display:inline-block;"></i>
          <h4 style="margin:0 0 5px 0; color:#fff;">Welcome to the BioVerse Club!</h4>
          <p style="font-size:0.85rem; color:#a7f3d0; margin-bottom:15px;">You are now locked in for early launch access.</p>
          
          <div style="background:#022c22; padding:12px; border-radius:8px; display:inline-block; border:1px solid #10b981;">
            <span style="font-size:0.75rem; color:#a7f3d0; display:block; text-transform:uppercase;">Your Launch Discount Coupon</span>
            <strong style="font-size:1.4rem; color:#34d399; font-family:monospace; display:block; margin-top:4px; letter-spacing:1px;">WELCOME20</strong>
          </div>
          <p style="font-size:0.75rem; color:#9ca3af; margin-top:10px; line-height:1.4;">
            Save 20% on any premium subscription tier once we launch! Code details sent to **${email}**.
          </p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });

  // Cleanup interval upon leaving page
  return () => {
    clearInterval(interval);
  };
}
