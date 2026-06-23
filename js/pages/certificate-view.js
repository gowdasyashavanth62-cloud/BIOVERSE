import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }
  window.navigateTo = navigateTo;

  const cert = Store.getCertificates().find(c => c.id === params.certId);
  if (!cert) {
    navigateTo('/certificates');
    return;
  }

  const dateStr = new Date(cert.timestamp).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
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
            #cert-frame, #cert-frame * {
              visibility: visible;
            }
            #cert-frame {
              position: absolute;
              left: 5%;
              top: 5%;
              width: 90%;
              transform: none !important;
              box-shadow: none !important;
              border: 15px solid #0A6847 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>

        <!-- Back Button & Actions (Non Printable) -->
        <div class="no-print flex-row justify-between align-center animate-fade-in" style="margin-bottom:2rem; gap:15px; flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="navigateTo('/certificates')">
            <i data-lucide="arrow-left"></i> Back to Certificates
          </button>
          
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="window.print()">
              <i data-lucide="printer" style="width:16px; height:16px;"></i> Print / Save PDF
            </button>
            <button class="btn btn-outline" id="shareProgressBtn" style="display:flex; align-items:center; gap:6px;">
              <i data-lucide="share-2" style="width:16px; height:16px;"></i> Share Progress
            </button>
          </div>
        </div>

        <!-- Stylized Printable Certificate Layout -->
        <div id="cert-frame" class="card animate-fade-in" style="max-width:850px; margin: 0 auto 3rem; padding: 50px 60px; background: #fffcf5; border: 20px solid #0A6847; box-shadow: 0 10px 40px rgba(0,0,0,0.15); text-align: center; color: #1f2937; position: relative; border-image: linear-gradient(135deg, #0A6847 0%, #16A34A 50%, #065f46 100%) 20;">
          
          <!-- Outer border accent -->
          <div style="position:absolute; top:8px; left:8px; right:8px; bottom:8px; border:2px solid #d97706; pointer-events:none;"></div>
          
          <!-- Corner decorations -->
          <div style="position:absolute; top:20px; left:20px; font-size:1.8rem; color:#d97706; pointer-events:none;">✦</div>
          <div style="position:absolute; top:20px; right:20px; font-size:1.8rem; color:#d97706; pointer-events:none;">✦</div>
          <div style="position:absolute; bottom:20px; left:20px; font-size:1.8rem; color:#d97706; pointer-events:none;">✦</div>
          <div style="position:absolute; bottom:20px; right:20px; font-size:1.8rem; color:#d97706; pointer-events:none;">✦</div>

          <!-- Header -->
          <div style="margin-bottom:2.5rem;">
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; color:var(--primary); font-weight:800; font-size:1.4rem; margin-bottom:10px;">
              <i data-lucide="leaf" style="width:24px; height:24px; color:#16A34A;"></i> BioVerse Learning
            </div>
            <h1 style="font-family: 'Times New Roman', Georgia, serif; font-size:2.8rem; font-weight:normal; letter-spacing:1px; color:#0A6847; margin:0;">
              CERTIFICATE OF COMPLETION
            </h1>
            <p style="text-transform:uppercase; font-size:0.75rem; font-weight:700; letter-spacing:3px; color:var(--gray-500); margin-top:5px; margin-bottom:0;">
              Verified Academic Achievement
            </p>
          </div>

          <!-- Text block -->
          <div style="margin-bottom:3rem; line-height:1.8;">
            <p style="font-style:italic; font-size:1.1rem; color:var(--gray-600); margin:0 0 10px 0;">This is to officially certify that</p>
            <h2 style="font-family: 'Times New Roman', Georgia, serif; font-size:2.4rem; font-weight:bold; text-decoration:underline; text-underline-offset:8px; color:#111827; margin:0 0 10px 0;">
              ${cert.studentName}
            </h2>
            <p style="font-size:1rem; color:var(--gray-600); margin:0 0 15px 0;">has successfully completed all curricular requirements and evaluations for</p>
            <h3 style="font-size:1.4rem; font-weight:800; color:#0A6847; background:rgba(10,104,71,0.06); display:inline-block; padding:8px 30px; border-radius:30px; margin:0;">
              ${cert.courseName}
            </h3>
            <p style="font-size:0.95rem; color:var(--gray-600); margin-top:15px; margin-bottom:0;">
              Demonstrating proficiency in Advanced Biological sciences, syllabus concepts, and mock examination challenges.
            </p>
          </div>

          <!-- Seal and Signatures row -->
          <div style="display:grid; grid-template-columns: 1fr 1.2fr 1fr; gap:20px; align-items:center; border-top:1px solid rgba(0,0,0,0.08); padding-top:2.5rem; margin-bottom:1.5rem;">
            
            <!-- Left Signature -->
            <div style="text-align:center;">
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size:1.6rem; color:#1f2937; margin-bottom:5px;">Yashavanth G.</div>
              <hr style="border:0; border-top:1.5px solid var(--gray-400); margin:0 auto; width:120px;">
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--gray-500); display:block; margin-top:5px; font-weight:600;">Academic Director</span>
            </div>

            <!-- Golden Seal -->
            <div style="display:flex; justify-content:center;">
              <div style="width:90px; height:90px; background:radial-gradient(circle, #fcd34d 0%, #d97706 100%); border-radius:50%; border:4px double #ffffff; box-shadow:0 4px 15px rgba(217,119,6,0.3); display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-weight:bold; position:relative;">
                <div style="position:absolute; width:100%; height:100%; border:2px dashed rgba(255,255,255,0.4); border-radius:50%; pointer-events:none;"></div>
                <span style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.5px;">BioVerse</span>
                <span style="font-size:0.95rem; margin:2px 0;">🌟</span>
                <span style="font-size:0.6rem; text-transform:uppercase; font-weight:normal;">OFFICIAL SEAL</span>
              </div>
            </div>

            <!-- Right Signature -->
            <div style="text-align:center;">
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size:1.6rem; color:#1f2937; margin-bottom:5px;">Dr. K. Swamy</div>
              <hr style="border:0; border-top:1.5px solid var(--gray-400); margin:0 auto; width:120px;">
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--gray-500); display:block; margin-top:5px; font-weight:600;">Chief Examiner</span>
            </div>

          </div>

          <!-- Credential Footer -->
          <div style="display:flex; justify-content:between; font-size:0.8rem; color:var(--gray-400); margin-top:2.5rem; border-top:1px solid rgba(0,0,0,0.05); padding-top:1rem;">
            <span>Certificate ID: <strong>${cert.certificateId}</strong></span>
            <span>Date: <strong>${dateStr}</strong></span>
            <span>Status: <strong class="text-success">Verified</strong></span>
          </div>

        </div>

        <!-- Social Share dialog mock overlay -->
        <div id="shareModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99999; align-items:center; justify-content:center;">
          <div class="card p-lg" style="width:400px; text-align:center;">
            <h3 style="margin-bottom:12px;"><i data-lucide="share-2" class="text-primary"></i> Share Your Success!</h3>
            <p class="text-muted" style="font-size:0.88rem; margin-bottom:1.5rem;">
              Share your achievement certificate with friends and teachers on social platforms.
            </p>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:1.5rem;">
              <a href="#" class="btn btn-outline share-plat" data-plat="WhatsApp" style="padding:15px 5px; font-size:0.8rem; display:flex; flex-direction:column; align-items:center; gap:6px;">
                <i data-lucide="phone-call" style="color:#25D366;"></i> WhatsApp
              </a>
              <a href="#" class="btn btn-outline share-plat" data-plat="LinkedIn" style="padding:15px 5px; font-size:0.8rem; display:flex; flex-direction:column; align-items:center; gap:6px;">
                <i data-lucide="linkedin" style="color:#0077b5;"></i> LinkedIn
              </a>
              <a href="#" class="btn btn-outline share-plat" data-plat="Twitter" style="padding:15px 5px; font-size:0.8rem; display:flex; flex-direction:column; align-items:center; gap:6px;">
                <i data-lucide="twitter" style="color:#1DA1F2;"></i> Twitter
              </a>
            </div>
            <button class="btn btn-primary btn-block" id="closeShareBtn">Close</button>
          </div>
        </div>

      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  setupShareDialog();

  function setupShareDialog() {
    const shareBtn = document.getElementById('shareProgressBtn');
    const modal = document.getElementById('shareModal');
    const closeBtn = document.getElementById('closeShareBtn');

    shareBtn?.addEventListener('click', () => {
      modal.style.display = 'flex';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    closeBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    document.querySelectorAll('.share-plat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const plat = btn.dataset.plat;
        showToast(`Sharing credential ${cert.certificateId} to ${plat}!`, 'success');
        modal.style.display = 'none';
      });
    });
  }
}
