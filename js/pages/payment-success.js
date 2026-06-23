import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';

export function render(params) {
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  // Read search query params manually
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const paymentId = urlParams.get('paymentId') || 'pay_' + Math.random().toString(36).substr(2, 9);
  const amount = urlParams.get('amount') || '299';
  const plan = urlParams.get('plan') || 'Premium Monthly';
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const invoiceId = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

  const app = document.getElementById('app');
  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-printable, #invoice-printable * {
              visibility: visible;
            }
            #invoice-printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>

        <div class="card p-lg text-center animate-fade-in no-print" style="max-width:600px; margin: 0 auto 2rem; border-top: 5px solid var(--success);">
          <div style="font-size:4rem; color:var(--success); margin-bottom:1rem;">🎉</div>
          <h2 style="color:var(--primary); font-family:var(--font-display); margin-bottom:10px;">Payment Successful!</h2>
          <p class="text-muted" style="margin-bottom:1.5rem;">
            Thank you, <strong>${user.name}</strong>! Your BioVerse Premium subscription is now fully active.
          </p>
          <div style="display:flex; gap:10px; justify-content:center;">
            <button class="btn btn-primary" onclick="navigateTo('/dashboard')">Go to Dashboard</button>
            <button class="btn btn-outline" onclick="window.print()">
              <i data-lucide="printer" style="width:16px; height:16px;"></i> Print Invoice
            </button>
          </div>
        </div>

        <!-- Printable Invoice Container -->
        <div id="invoice-printable" class="card p-xl animate-fade-in" style="max-width:700px; margin: 0 auto; border: 1px solid var(--gray-200); background: white; font-family:var(--font-body); color:#333;">
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
              <p style="font-size:0.85rem; color:var(--gray-500); margin:4px 0 0 0;">${invoiceId}</p>
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
              <p style="margin:0; color:var(--gray-600);">Date: <strong>${dateStr}</strong></p>
              <p style="margin:4px 0 0 0; color:var(--gray-600);">Transaction ID: <strong style="font-family:monospace;">${paymentId}</strong></p>
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
                  <strong>BioVerse Premium Package – ${plan}</strong>
                  <p class="text-muted" style="font-size:0.8rem; margin:4px 0 0 0;">Unlimited access to video lectures, smart revision notes, mock tests, and readiness analyzers.</p>
                </td>
                <td style="padding:15px 0; text-align:right; font-weight:600; color:var(--primary);">₹${amount}</td>
              </tr>
            </tbody>
          </table>

          <!-- Totals -->
          <div style="display:flex; justify-content:end; margin-bottom:2rem;">
            <div style="width:250px; font-size:0.9rem; display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:between;">
                <span class="text-muted">Subtotal</span>
                <span>₹${amount}</span>
              </div>
              <div style="display:flex; justify-content:between;">
                <span class="text-muted">GST (18% inclusive)</span>
                <span>₹${Math.round(amount * 0.18)}</span>
              </div>
              <hr style="margin:5px 0; border:0; border-top:1px solid var(--gray-200);">
              <div style="display:flex; justify-content:between; font-size:1.1rem; font-weight:700;">
                <span>Total Paid</span>
                <span style="color:var(--primary);">₹${amount}</span>
              </div>
            </div>
          </div>

          <!-- Invoice Footer -->
          <div style="border-top:1px solid var(--gray-100); padding-top:1.5rem; text-align:center; font-size:0.8rem; color:var(--gray-400);">
            <p style="margin:0 0 5px 0;">Thank you for studying with BioVerse!</p>
            <p style="margin:0;">This is an electronically generated receipt. No signature is required.</p>
          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
