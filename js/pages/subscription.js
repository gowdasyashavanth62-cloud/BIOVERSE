import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  const app = document.getElementById('app');
  let selectedInvoice = null;

  renderPage();

  function renderPage() {
    const freshUser = Store.getAllUsers().find(u => u.id === user.id);
    const subPlan = freshUser.subscriptionPlan || 'free';
    const hasPremium = freshUser.subscription === 'premium';
    const isYearly = subPlan === 'yearly';
    
    // Dates
    const startStr = freshUser.subscriptionStart ? new Date(freshUser.subscriptionStart).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
    const endStr = freshUser.subscriptionEnd ? new Date(freshUser.subscriptionEnd).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
    
    let daysLeft = 0;
    if (freshUser.subscriptionEnd) {
      const diff = new Date(freshUser.subscriptionEnd) - new Date();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const referralCode = freshUser.referralCode || 'BIO-REF-' + freshUser.id.substr(-6).toUpperCase();
    const referralsCount = freshUser.referralsCount || 0;
    const credits = referralsCount * 5; // 5 days of premium per referral
    const history = freshUser.paymentHistory || [];

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
            <h1>💎 Subscription Dashboard</h1>
            <p>Manage your premium access, view billing history, and invite friends to earn rewards.</p>
          </div>

          <div class="admin-grid animate-fade-in" style="margin-bottom:2rem; align-items:start;">
            
            <!-- Subscription Plan Status -->
            <div class="card p-lg">
              <h3 style="margin-bottom:1rem;"><i data-lucide="shield" class="text-primary"></i> Membership Status</h3>
              
              <div style="background:var(--surface-color); padding:20px; border-radius:12px; border:1px solid var(--gray-200); margin-bottom:1.5rem;">
                <div style="display:flex; justify-content:between; align-items:center; margin-bottom:10px;">
                  <span style="font-size:1.1rem; font-weight:700; color:var(--gray-800);">
                    ${hasPremium ? (isYearly ? 'Premium Yearly Tier' : 'Premium Monthly Tier') : 'Free Learner Tier'}
                  </span>
                  <span class="badge ${hasPremium ? 'badge-success' : 'badge-ghost'}" style="padding:4px 10px; font-size:0.8rem;">
                    ${hasPremium ? 'Active' : 'Basic Access'}
                  </span>
                </div>
                
                ${hasPremium ? `
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; font-size:0.9rem; margin-top:15px; border-top:1px solid var(--gray-100); padding-top:15px;">
                    <div>
                      <span class="text-muted" style="font-size:0.8rem;">START DATE</span>
                      <p style="margin:4px 0 0 0; font-weight:600;">${startStr}</p>
                    </div>
                    <div>
                      <span class="text-muted" style="font-size:0.8rem;">RENEWAL / EXPIRY DATE</span>
                      <p style="margin:4px 0 0 0; font-weight:600;">${endStr} (${daysLeft} days left)</p>
                    </div>
                  </div>
                ` : `
                  <p class="text-muted" style="font-size:0.9rem; margin-top:10px; line-height:1.5;">
                    Upgrade to a premium subscription to unlock HD video lectures, 10+ years of solved PYQs, mock tests, and full KCET/NEET analytical summaries.
                  </p>
                  <button class="btn btn-primary" onclick="navigateTo('/pricing')" style="margin-top:10px;">Upgrade to Premium</button>
                `}
              </div>

              ${hasPremium ? `
                <!-- Auto Renewal Switch -->
                <div style="display:flex; justify-content:between; align-items:center; border-top:1px solid var(--gray-100); padding-top:1.2rem; margin-bottom:1.5rem;">
                  <div>
                    <strong>Auto-Renewal Status</strong>
                    <p class="text-muted" style="font-size:0.8rem; margin:2px 0 0 0;">Automatically bill and extend membership</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="renewalToggle" ${freshUser.autoRenew ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>

                <!-- Simulate Expiry Reminders -->
                <div style="background:#fef3c7; border:1px solid #fde68a; padding:15px; border-radius:10px; color:#92400e; font-size:0.85rem;">
                  <strong style="display:block; margin-bottom:5px;">🕒 Test Email Expiry Reminders</strong>
                  <p style="margin:0 0 10px 0; font-size:0.8rem; line-height:1.4;">Click to simulate receiving automated renewal reminder emails in your inbox.</p>
                  <div style="display:flex; gap:8px;">
                    <button class="btn btn-sm btn-outline test-rem-btn" data-days="7" style="border-color:#d97706; color:#d97706;">7 Days Expiry</button>
                    <button class="btn btn-sm btn-outline test-rem-btn" data-days="3" style="border-color:#d97706; color:#d97706;">3 Days Expiry</button>
                    <button class="btn btn-sm btn-outline test-rem-btn" data-days="1" style="border-color:#d97706; color:#d97706;">1 Day Expiry</button>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Referral System Card -->
            <div class="card p-lg">
              <h3 style="margin-bottom:1rem;"><i data-lucide="gift" class="text-primary"></i> Invite & Earn</h3>
              <p class="text-muted" style="font-size:0.9rem; line-height:1.5; margin-bottom:1.5rem;">
                Invite your classmates to BioVerse! When a friend joins waitlist or premium using your link, you get **5 free days** of Premium credits.
              </p>
              
              <div style="background:var(--surface-color); padding:15px; border-radius:10px; border:1px solid var(--gray-200); margin-bottom:1.5rem;">
                <label class="form-label" style="font-size:0.8rem; text-transform:uppercase;">Your Referral Link</label>
                <div style="display:flex; gap:8px; margin-top:5px;">
                  <input type="text" class="form-input" id="refLinkVal" style="font-size:0.85rem; padding:8px;" readonly value="${window.location.origin}/#/launch?ref=${referralCode}">
                  <button class="btn btn-outline" id="copyRefBtn" style="padding:8px 12px;"><i data-lucide="copy" style="width:16px; height:16px;"></i></button>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; text-align:center;">
                <div style="border:1px solid var(--gray-100); padding:12px; border-radius:10px;">
                  <span style="font-size:1.8rem; font-weight:800; color:var(--primary);">${referralsCount}</span>
                  <span class="text-muted" style="display:block; font-size:0.78rem; font-weight:600; text-transform:uppercase; margin-top:4px;">Friends Joined</span>
                </div>
                <div style="border:1px solid var(--gray-100); padding:12px; border-radius:10px;">
                  <span style="font-size:1.8rem; font-weight:800; color:var(--accent-amber);">+${credits}</span>
                  <span class="text-muted" style="display:block; font-size:0.78rem; font-weight:600; text-transform:uppercase; margin-top:4px;">Credits Earned (Days)</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Billing & Payment History -->
          <div style="margin-bottom:10px;"><h2 style="font-family:var(--font-display);">🧾 Billing & Payment History</h2></div>
          <div class="admin-table-container standalone animate-fade-in" style="margin-bottom:3rem;">
            <div class="admin-table-responsive">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Invoice ID</th>
                    <th>Subscribed Plan</th>
                    <th>Amount Paid</th>
                    <th>Coupon Applied</th>
                    <th>Status</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.length === 0 ? `
                    <tr>
                      <td colspan="7" style="text-align:center; padding:40px;" class="text-muted">
                        No transactions found. Upgrade your plan to start studying premium.
                      </td>
                    </tr>
                  ` : history.slice().sort((a,b) => new Date(b.date) - new Date(a.date)).map(inv => `
                    <tr>
                      <td style="font-size:0.9rem;">${new Date(inv.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                      <td class="cell-mono" style="font-size:0.85rem;">${inv.invoiceId || 'INV-0000'}</td>
                      <td class="cell-bold" style="font-size:0.9rem;">${inv.planName}</td>
                      <td style="font-weight:600; color:var(--primary);">₹${inv.amount.toLocaleString('en-IN')}</td>
                      <td>${inv.coupon ? `<span class="badge badge-warning" style="font-size:0.75rem;">${inv.coupon}</span>` : '—'}</td>
                      <td><span class="badge badge-success">Success</span></td>
                      <td>
                        <button class="btn btn-sm btn-outline download-inv-btn" data-payment-id="${inv.paymentId}" style="display:flex; align-items:center; gap:4px; font-size:0.8rem; padding:4px 10px;">
                          <i data-lucide="file-text" style="width:14px; height:14px;"></i> View Invoice
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <!-- Invoice Modal overlay -->
      <div id="invModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99999; align-items:center; justify-content:center;">
        <div class="card" style="width:700px; max-height:85vh; overflow-y:auto; padding:24px; position:relative;">
          <button id="closeInvBtn" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.8rem; cursor:pointer; color:var(--gray-400);">&times;</button>
          
          <div id="invModalContent"></div>
          
          <div style="display:flex; justify-content:end; gap:10px; margin-top:1.5rem; border-top:1px solid var(--gray-200); padding-top:1.5rem;" class="no-print">
            <button class="btn btn-primary" id="printInvBtn"><i data-lucide="printer" style="width:16px; height:16px;"></i> Print / Save PDF</button>
            <button class="btn btn-outline" id="closeInvBtn2">Close</button>
          </div>
        </div>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupAutoRenewal();
    setupReminderSimulators();
    setupReferralsCopy();
    setupInvoicesViewer();
  }

  function setupAutoRenewal() {
    const toggle = document.getElementById('renewalToggle');
    if (toggle) {
      toggle.addEventListener('change', () => {
        Store.toggleAutoRenewal(user.id);
        const active = toggle.checked;
        showToast(`Auto-renewal ${active ? 'Enabled' : 'Disabled'} successfully`, 'success');
      });
    }
  }

  function setupReminderSimulators() {
    document.querySelectorAll('.test-rem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = btn.dataset.days;
        let msg = '';
        if (days === '7') {
          msg = `👋 Expiry Reminder (7 Days left): Your Premium Monthly plan will expire soon on ${endStr || 'date'}. We have enabled auto-renewal for seamless learning.`;
        } else if (days === '3') {
          msg = `🚨 Expiry Alert (3 Days left): Complete your biology syllabus without pauses. Your subscription will end on ${endStr || 'date'}.`;
        } else {
          msg = `⚠️ Urgent: Subscription Expiring Tomorrow! Your premium access will be suspended in 24 hours. Click to renew.`;
        }

        // Mock mail notification
        alert(`📩 Automated Simulated Email sent to ${user.email}:\n\nSubject: BioVerse Subscription Renewal Notification\n\n${msg}`);
        showToast('Simulated notification triggered!', 'success');
      });
    });
  }

  function setupReferralsCopy() {
    const copyBtn = document.getElementById('copyRefBtn');
    const input = document.getElementById('refLinkVal');
    
    copyBtn?.addEventListener('click', () => {
      input.select();
      document.execCommand('copy');
      showToast('Referral link copied to clipboard!', 'success');
    });
  }

  function setupInvoicesViewer() {
    const modal = document.getElementById('invModal');
    const content = document.getElementById('invModalContent');
    const closeBtn = document.getElementById('closeInvBtn');
    const closeBtn2 = document.getElementById('closeInvBtn2');
    const printBtn = document.getElementById('printInvBtn');

    document.querySelectorAll('.download-inv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const payId = btn.dataset.paymentId;
        const freshUser = Store.getAllUsers().find(u => u.id === user.id);
        const record = freshUser.paymentHistory.find(r => r.paymentId === payId);
        
        if (record) {
          selectedInvoice = record;
          
          content.innerHTML = `
            <div style="font-family:var(--font-body); color:#333;">
              <!-- Invoice Header -->
              <div style="display:flex; justify-content:between; align-items:start; border-bottom:2px solid var(--gray-100); padding-bottom:1.5rem; margin-bottom:1.5rem;">
                <div>
                  <h2 style="color:var(--primary); font-weight:800; margin:0; display:flex; align-items:center; gap:8px;">
                    🍃 BioVerse Learning
                  </h2>
                  <p class="text-muted" style="font-size:0.8rem; margin:4px 0 0 0;">Karnataka PU Biology Learning Portal</p>
                </div>
                <div style="text-align:right;">
                  <h3 style="margin:0; font-family:var(--font-display); color:var(--gray-800);">INVOICE</h3>
                  <p style="font-size:0.85rem; color:var(--gray-500); margin:4px 0 0 0;">${record.invoiceId || 'INV-0000'}</p>
                </div>
              </div>

              <!-- Invoice Metadata -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:2rem; font-size:0.9rem;">
                <div>
                  <p style="margin:0 0 4px 0; color:var(--gray-400); text-transform:uppercase; font-size:0.75rem; font-weight:700;">Billed To</p>
                  <strong>${user.name}</strong>
                  <p style="margin:4px 0 0 0; color:var(--gray-600);">${user.email}</p>
                  ${user.phone ? `<p style="margin:2px 0 0 0; color:var(--gray-600);">${user.phone}</p>` : ''}
                </div>
                <div style="text-align:right;">
                  <p style="margin:0 0 4px 0; color:var(--gray-400); text-transform:uppercase; font-size:0.75rem; font-weight:700;">Payment Details</p>
                  <p style="margin:0; color:var(--gray-600);">Date: <strong>${new Date(record.date).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</strong></p>
                  <p style="margin:4px 0 0 0; color:var(--gray-600);">Transaction ID: <strong style="font-family:monospace;">${record.paymentId}</strong></p>
                  <p style="margin:4px 0 0 0; color:var(--gray-600);">Gateway: <strong>Razorpay Secure</strong></p>
                </div>
              </div>

              <!-- Invoice Details Table -->
              <table style="width:100%; border-collapse:collapse; margin-bottom:2rem; font-size:0.9rem;">
                <thead>
                  <tr style="border-bottom:2px solid var(--gray-200); text-align:left;">
                    <th style="padding:10px 0; color:var(--gray-500); font-weight:600;">Description</th>
                    <th style="padding:10px 0; text-align:right; color:var(--gray-500); font-weight:600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--gray-100);">
                    <td style="padding:15px 0;">
                      <strong>BioVerse Premium Package – ${record.planName}</strong>
                      <p class="text-muted" style="font-size:0.8rem; margin:4px 0 0 0;">Unlimited access to videos, summary revision notes, mock tests, and readiness reports.</p>
                    </td>
                    <td style="padding:15px 0; text-align:right; font-weight:600; color:var(--primary);">₹${record.amount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Totals -->
              <div style="display:flex; justify-content:end; margin-bottom:2rem;">
                <div style="width:250px; font-size:0.9rem; display:flex; flex-direction:column; gap:8px;">
                  <div style="display:flex; justify-content:between;">
                    <span class="text-muted">Subtotal</span>
                    <span>₹${record.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div style="display:flex; justify-content:between;">
                    <span class="text-muted">GST (18% inclusive)</span>
                    <span>₹${Math.round(record.amount * 0.18)}</span>
                  </div>
                  <hr style="margin:5px 0; border:0; border-top:1px solid var(--gray-200);">
                  <div style="display:flex; justify-content:between; font-size:1.15rem; font-weight:700;">
                    <span>Total Paid</span>
                    <span style="color:var(--primary);">₹${record.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <!-- Invoice Footer -->
              <div style="border-top:1px solid var(--gray-100); padding-top:1.5rem; text-align:center; font-size:0.8rem; color:var(--gray-400);">
                <p style="margin:0 0 5px 0;">Thank you for studying with BioVerse!</p>
                <p style="margin:0;">This is an electronically generated receipt. No signature is required.</p>
              </div>
            </div>
          `;
          
          modal.style.display = 'flex';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });
    });

    const closeModal = () => { modal.style.display = 'none'; selectedInvoice = null; };
    closeBtn?.addEventListener('click', closeModal);
    closeBtn2?.addEventListener('click', closeModal);
    
    printBtn?.addEventListener('click', () => {
      // Trigger browser printing for only the invoice container
      window.print();
    });
  }
}
