import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  const planId = params.planId === 'yearly' ? 'plan_yearly' : 'plan_monthly';
  const plans = await Store.getPlans();
  const plan = plans.find(p => p.id === planId) || plans.find(p => p.id === 'plan_monthly');
  
  if (!plan) {
    navigateTo('/pricing');
    return;
  }

  let originalPrice = plan.price;
  let finalPrice = originalPrice;
  let couponCode = '';
  let discountAmount = 0;

  const app = document.getElementById('app');

  await renderPage();

  async function renderPage() {
    app.innerHTML = `
      ${await Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
            <h1>💳 Secure Checkout</h1>
            <p>Upgrade to BioVerse Premium and unlock complete biology mastery.</p>
          </div>

          <div class="checkout-grid animate-fade-in" style="display:grid; grid-template-columns: 1.5fr 1fr; gap:2rem; align-items:start;">
            <!-- Left Panel: Payment details -->
            <div class="card p-lg">
              <h3 style="margin-bottom:1.5rem;"><i data-lucide="shield-check" class="text-success"></i> Payment Information</h3>
              
              <!-- Payment Method Tabs -->
              <div class="payment-tabs" style="display:flex; border-bottom:2px solid var(--gray-100); margin-bottom:1.5rem; gap:20px;">
                <button class="pay-tab active" data-method="card" style="padding:10px 5px; background:none; border:none; border-bottom:2px solid var(--primary); font-weight:600; color:var(--primary); cursor:pointer;">
                  <i data-lucide="credit-card"></i> Card
                </button>
                <button class="pay-tab" data-method="upi" style="padding:10px 5px; background:none; border:none; border-bottom:2px solid transparent; font-weight:600; color:var(--gray-500); cursor:pointer;">
                  <i data-lucide="phone"></i> UPI (GPay/PhonePe)
                </button>
                <button class="pay-tab" data-method="net" style="padding:10px 5px; background:none; border:none; border-bottom:2px solid transparent; font-weight:600; color:var(--gray-500); cursor:pointer;">
                  <i data-lucide="landmark"></i> Net Banking
                </button>
              </div>

              <!-- Payment Forms -->
              <div id="method-card-form" class="method-form">
                <form id="cardForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Cardholder Name</label>
                    <input type="text" class="form-input" id="cardName" placeholder="Enter name on card" required value="${user.name}">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Card Number</label>
                    <div style="position:relative;">
                      <input type="text" class="form-input" id="cardNumber" placeholder="4111 2222 3333 4444" minlength="16" maxlength="19" required>
                      <i data-lucide="credit-card" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--gray-400);"></i>
                    </div>
                  </div>
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label">Expiry Date</label>
                      <input type="text" class="form-input" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label">CVV</label>
                      <input type="password" class="form-input" id="cardCvv" placeholder="123" maxlength="3" required>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px; margin-top:0.5rem;">
                    <input type="checkbox" id="saveCard" checked style="width:16px; height:16px; accent-color:var(--primary);">
                    <label for="saveCard" style="font-size:0.85rem; color:var(--gray-600); cursor:pointer;">Securely save this card for faster payments</label>
                  </div>
                </form>
              </div>

              <div id="method-upi-form" class="method-form" style="display:none;">
                <form id="upiForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">UPI ID (VPA)</label>
                    <input type="text" class="form-input" id="upiId" placeholder="name@okaxis" required>
                    <small class="text-muted" style="margin-top:4px; display:block;">Enter your GPay, PhonePe, or Paytm UPI ID</small>
                  </div>
                  <div style="margin:1rem 0; text-align:center;">
                    <p class="text-muted" style="font-size:0.85rem; margin-bottom:1rem;">Or scan the QR code to pay instantly</p>
                    <div style="display:inline-block; padding:15px; background:white; border:1px solid var(--gray-200); border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                      <i data-lucide="qr-code" style="width:120px; height:120px; color:var(--gray-800);"></i>
                    </div>
                  </div>
                </form>
              </div>

              <div id="method-net-form" class="method-form" style="display:none;">
                <label class="form-label">Select Your Bank</label>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:10px; margin-top:0.5rem; margin-bottom:1.5rem;">
                  <button class="btn btn-outline bank-select-btn" data-bank="SBI" style="font-size:0.85rem; padding:10px;">State Bank of India</button>
                  <button class="btn btn-outline bank-select-btn" data-bank="HDFC" style="font-size:0.85rem; padding:10px;">HDFC Bank</button>
                  <button class="btn btn-outline bank-select-btn" data-bank="ICICI" style="font-size:0.85rem; padding:10px;">ICICI Bank</button>
                  <button class="btn btn-outline bank-select-btn" data-bank="Axis" style="font-size:0.85rem; padding:10px;">Axis Bank</button>
                </div>
              </div>

              <button class="btn btn-primary btn-block mt-lg" id="payBtn" style="padding:15px; font-size:1.1rem; display:flex; align-items:center; justify-content:center; gap:8px;">
                <i data-lucide="lock" style="width:20px; height:20px;"></i> Pay ₹<span id="btnPayAmount">${finalPrice.toLocaleString('en-IN')}</span>
              </button>
            </div>

            <!-- Right Panel: Order Summary -->
            <div class="card p-lg" style="background:var(--surface-color);">
              <h3 style="margin-bottom:1.2rem; border-bottom:1px solid var(--gray-200); padding-bottom:0.5rem;">🎒 Order Summary</h3>
              <div style="display:flex; justify-content:between; margin-bottom:1rem;">
                <div>
                  <strong>${plan.name}</strong>
                  <div class="text-muted" style="font-size:0.85rem;">Billed ${plan.interval === 'year' ? 'yearly' : 'monthly'}</div>
                </div>
                <strong style="color:var(--primary);">₹${originalPrice.toLocaleString('en-IN')}</strong>
              </div>

              <!-- Coupon section -->
              <div style="border-top:1px dashed var(--gray-300); border-bottom:1px dashed var(--gray-300); padding:1rem 0; margin:1rem 0;">
                <label class="form-label" style="font-size:0.85rem;">Have a Promo Code / Coupon?</label>
                <div style="display:flex; gap:8px; margin-top:5px;">
                  <input type="text" class="form-input" id="couponInput" placeholder="e.g. BIO50" style="padding:8px 12px; font-size:0.9rem;" value="${couponCode}">
                  <button class="btn btn-outline" id="applyCouponBtn" style="padding:8px 15px; font-size:0.9rem;">Apply</button>
                </div>
                <div id="couponMessage" style="font-size:0.85rem; margin-top:6px; display:none;"></div>
              </div>

              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:1.5rem;">
                <div style="display:flex; justify-content:between; font-size:0.9rem;">
                  <span class="text-muted">Subtotal</span>
                  <span>₹${originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div id="summaryDiscountRow" style="display:none; justify-content:between; font-size:0.9rem; color:var(--accent-red);">
                  <span>Discount</span>
                  <span>-₹<span id="summaryDiscountVal">0</span></span>
                </div>
                <div style="display:flex; justify-content:between; font-size:0.9rem;">
                  <span class="text-muted">GST (18% inclusive)</span>
                  <span>₹${Math.round(finalPrice * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <hr style="margin:5px 0; border:0; border-top:1px solid var(--gray-200);">
                <div style="display:flex; justify-content:between; font-size:1.15rem; font-weight:700;">
                  <span>Total Amount</span>
                  <span style="color:var(--primary);">₹<span id="summaryTotalVal">${finalPrice.toLocaleString('en-IN')}</span></span>
                </div>
              </div>

              <div class="security-note p-sm rounded" style="background:#f0fdf4; border:1px solid #dcfce7; display:flex; gap:10px; align-items:start;">
                <i data-lucide="shield-check" class="text-success" style="width:20px; height:20px; flex-shrink:0;"></i>
                <p style="font-size:0.78rem; color:#166534; margin:0; line-height:1.45;">
                  Payments are secure and encrypted. Under 7-day money back guarantee policy, you can request full refunds at any time.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Razorpay Simulation Modal -->
      <div id="rzpModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
        <div class="card" style="width:400px; padding:0; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.3); border:none; font-family:var(--font-body);">
          
          <!-- RZP Header -->
          <div style="background:#172b4d; color:white; padding:20px; display:flex; justify-content:between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="background:#3b82f6; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9em; color:white;">BV</div>
              <div>
                <strong style="font-size:0.95rem;">BioVerse Learning</strong>
                <p style="font-size:0.7rem; opacity:0.8; margin:0;">Razorpay Secure Sandbox</p>
              </div>
            </div>
            <div style="text-align:right;">
              <p style="font-size:0.7rem; opacity:0.8; margin:0;">Amount</p>
              <strong style="font-size:1.1rem;" id="rzpModalAmount">₹${finalPrice}</strong>
            </div>
          </div>

          <!-- RZP Body -->
          <div id="rzpContent" style="padding:30px 24px; min-height:180px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div id="rzpLoader" style="text-align:center;">
              <i data-lucide="loader-2" class="text-blue" style="width:40px; height:40px; animation:spin 1s linear infinite; margin-bottom:15px;"></i>
              <p style="font-size:0.9rem; font-weight:600; color:var(--gray-800);">Contacting Payment Gateway...</p>
              <p class="text-muted" style="font-size:0.8rem; margin:0;">Please do not close this window</p>
            </div>
            <div id="rzpConfirm" style="display:none; text-align:center; width:100%;">
              <p style="font-size:0.95rem; font-weight:600; color:var(--gray-800); margin-bottom:15px;">Simulate Transaction Status</p>
              <div style="display:flex; gap:10px; justify-content:center;">
                <button class="btn btn-success" id="simSuccessBtn" style="padding:10px 24px;">Success</button>
                <button class="btn btn-danger" id="simFailBtn" style="padding:10px 24px;">Failure</button>
              </div>
            </div>
          </div>

          <!-- RZP Footer -->
          <div style="background:#f4f5f7; padding:15px; text-align:center; font-size:0.75rem; color:var(--gray-500); border-top:1px solid var(--gray-200);">
            🛡️ Secured by Razorpay. Sandbox Simulation Mode.
          </div>
        </div>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupPaymentTabs();
    setupCouponEngine();
    setupPaymentGatewaySimulation();
  }

  function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.pay-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.borderBottomColor = 'transparent';
          t.style.color = 'var(--gray-500)';
        });
        tab.classList.add('active');
        tab.style.borderBottomColor = 'var(--primary)';
        tab.style.color = 'var(--primary)';

        document.querySelectorAll('.method-form').forEach(f => f.style.display = 'none');
        document.getElementById(`method-${tab.dataset.method}-form`).style.display = 'block';
      });
    });
  }

  function setupCouponEngine() {
    const applyBtn = document.getElementById('applyCouponBtn');
    const input = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    
    applyBtn.addEventListener('click', async () => {
      const code = input.value.trim().toUpperCase();
      message.style.display = 'none';
      message.className = '';

      if (!code) {
        showToast('Please enter a coupon code', 'warning');
        return;
      }

      const res = await Store.validateCoupon(code);
      if (res.error) {
        message.textContent = res.error;
        message.style.color = 'var(--accent-red)';
        message.style.display = 'block';
        
        // Reset prices
        finalPrice = originalPrice;
        discountAmount = 0;
        couponCode = '';
        updatePricesUI();
        showToast(res.error, 'error');
      } else {
        const c = res.coupon;
        couponCode = c.code;
        if (c.type === 'percentage') {
          discountAmount = Math.round(originalPrice * (c.value / 100));
        } else {
          discountAmount = Math.min(originalPrice, c.value);
        }
        finalPrice = originalPrice - discountAmount;
        
        message.textContent = `Coupon applied successfully! Saved ₹${discountAmount}`;
        message.style.color = 'var(--success)';
        message.style.display = 'block';
        
        updatePricesUI();
        showToast(`Coupon ${c.code} applied!`, 'success');
      }
    });
  }

  function updatePricesUI() {
    document.getElementById('btnPayAmount').textContent = finalPrice.toLocaleString('en-IN');
    document.getElementById('rzpModalAmount').textContent = '₹' + finalPrice.toLocaleString('en-IN');
    document.getElementById('summaryTotalVal').textContent = finalPrice.toLocaleString('en-IN');
    
    const discRow = document.getElementById('summaryDiscountRow');
    if (discountAmount > 0) {
      discRow.style.display = 'flex';
      document.getElementById('summaryDiscountVal').textContent = discountAmount.toLocaleString('en-IN');
    } else {
      discRow.style.display = 'none';
    }
  }

  function setupPaymentGatewaySimulation() {
    const payBtn = document.getElementById('payBtn');
    const rzpModal = document.getElementById('rzpModal');
    const rzpLoader = document.getElementById('rzpLoader');
    const rzpConfirm = document.getElementById('rzpConfirm');
    
    payBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Perform basic card input validations if card tab active
      const activeTab = document.querySelector('.pay-tab.active').dataset.method;
      if (activeTab === 'card') {
        const cName = document.getElementById('cardName').value.trim();
        const cNum = document.getElementById('cardNumber').value.replace(/\s+/g, '');
        const cExp = document.getElementById('cardExpiry').value;
        const cCvv = document.getElementById('cardCvv').value;

        if (!cName || cNum.length < 15 || !cExp.includes('/') || cCvv.length < 3) {
          showToast('Please fill in valid Card Details', 'warning');
          return;
        }
      } else if (activeTab === 'upi') {
        const upiVal = document.getElementById('upiId').value.trim();
        if (!upiVal.includes('@')) {
          showToast('Please enter a valid UPI VPA ID (e.g. name@okaxis)', 'warning');
          return;
        }
      }

      // Open Razorpay Mock Sandbox Modal
      rzpModal.style.display = 'flex';
      rzpLoader.style.display = 'block';
      rzpConfirm.style.display = 'none';

      // Simulate contact to server
      setTimeout(() => {
        rzpLoader.style.display = 'none';
        rzpConfirm.style.display = 'block';
      }, 1500);
    });

    document.getElementById('simSuccessBtn').addEventListener('click', async () => {
      // Simulate Successful payment
      rzpConfirm.style.display = 'none';
      rzpLoader.style.display = 'block';
      rzpLoader.querySelector('p').textContent = 'Authenticating Transaction...';
      
      setTimeout(() => {
        rzpLoader.querySelector('p').textContent = 'Activating Subscription Plan...';
        
        setTimeout(async () => {
          const userObj = await Store.upgradeSubscription(user.id, plan.id === 'plan_yearly' ? 'yearly' : 'monthly', finalPrice, couponCode);
          rzpModal.style.display = 'none';
          
          if (userObj) {
            const lastPayment = userObj.paymentHistory[userObj.paymentHistory.length - 1];
            navigateTo(`/payment-success?paymentId=${lastPayment.paymentId}&amount=${finalPrice}&plan=${plan.id === 'plan_yearly' ? 'Premium Yearly' : 'Premium Monthly'}`);
          } else {
            navigateTo('/payment-failure');
          }
        }, 1200);
      }, 1000);
    });

    document.getElementById('simFailBtn').addEventListener('click', () => {
      rzpConfirm.style.display = 'none';
      rzpLoader.style.display = 'block';
      rzpLoader.querySelector('p').textContent = 'Processing refund / cancellation...';
      
      setTimeout(() => {
        rzpModal.style.display = 'none';
        navigateTo('/payment-failure');
      }, 1000);
    });
  }
}
