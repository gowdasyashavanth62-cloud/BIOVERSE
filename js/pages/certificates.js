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

  renderPage();

  function renderPage() {
    const unlockedCerts = Store.getCertificatesForUser(user.id) || [];
    
    // Evaluate progress thresholds for certificates
    const pu1Prog = Store.getOverallProgress('pu1');
    const pu2Prog = Store.getOverallProgress('pu2');
    
    // Let's get Unit 1 Progress (Diversity in the Living World)
    const unit1Id = 'unit_1'; // Diversity in the Living World
    const u1Chapters = Store.getAllChapters('pu1');
    let u1TotalPercentage = 0;
    if (u1Chapters.length > 0) {
      u1Chapters.forEach(c => u1TotalPercentage += Store.getChapterProgress(c.id).percentage);
      u1TotalPercentage = Math.round(u1TotalPercentage / u1Chapters.length);
    }
    
    // Let's get Chapter 1 Progress (The Living World)
    const ch1Prog = Store.getChapterProgress('ch_living_world').percentage;

    const certCatalog = [
      {
        id: 'course_pu1',
        title: '1st PU Biology Course Completion',
        desc: 'Unlock by completing 100% of 1st PU Biology curriculum.',
        target: '1st PU Biology',
        type: 'completion',
        currentProgress: pu1Prog,
        unlocked: pu1Prog === 100
      },
      {
        id: 'course_pu2',
        title: '2nd PU Biology Course Completion',
        desc: 'Unlock by completing 100% of 2nd PU Biology curriculum.',
        target: '2nd PU Biology',
        type: 'completion',
        currentProgress: pu2Prog,
        unlocked: pu2Prog === 100
      },
      {
        id: 'unit_diversity',
        title: 'Unit I: Diversity in the Living World',
        desc: 'Unlock by completing 100% of Unit I chapters.',
        target: 'Unit I Biology',
        type: 'unit',
        currentProgress: u1TotalPercentage,
        unlocked: u1TotalPercentage === 100
      },
      {
        id: 'ch_living',
        title: 'Chapter: The Living World Completion',
        desc: 'Unlock by completing 100% of Chapter 1 videos and notes.',
        target: 'The Living World',
        type: 'chapter',
        currentProgress: ch1Prog,
        unlocked: ch1Prog === 100
      }
    ];

    app.innerHTML = `
      ${Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="chapter-header animate-fade-in premium-gradient" style="padding:2rem; border-radius:1rem; color:white; margin-bottom:2rem;">
            <h1>🏅 My Certificates & Credentials</h1>
            <p>Earn official certificates of completion by studying chapters and finishing courses.</p>
          </div>

          <!-- Unlocked Certificates Grid -->
          <div style="margin-bottom:15px;"><h2 style="font-family:var(--font-display);">📜 Earned Certificates</h2></div>
          <div class="dashboard-grid animate-fade-in" style="margin-bottom:2.5rem;">
            ${unlockedCerts.length === 0 ? `
              <div class="card p-xl text-center" style="grid-column: 1 / -1; background:var(--surface-color);">
                <i data-lucide="award" style="width:48px; height:48px; color:var(--gray-400); margin-bottom:10px; display:inline-block;"></i>
                <h3 style="color:var(--gray-800);">No Certificates Earned Yet</h3>
                <p class="text-muted" style="max-width:400px; margin:5px auto 0;">Complete 100% of any chapter, unit, or full course to generate your print-ready certificate.</p>
              </div>
            ` : unlockedCerts.map(cert => `
              <div class="card p-lg hover-lift" style="border-top: 4px solid var(--accent-amber); display:flex; flex-direction:column; justify-content:between;">
                <div>
                  <div style="display:flex; justify-content:between; align-items:start; margin-bottom:10px;">
                    <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--accent-amber);">Verified Credential</span>
                    <i data-lucide="shield-check" class="text-success" style="width:20px; height:20px;"></i>
                  </div>
                  <h4 style="margin:0 0 5px 0;">${cert.courseName}</h4>
                  <p class="text-muted" style="font-size:0.8rem; margin:0 0 15px 0;">ID: ${cert.certificateId} | Earned: ${new Date(cert.timestamp).toLocaleDateString('en-IN')}</p>
                </div>
                <button class="btn btn-primary btn-block" onclick="navigateTo('/certificate/${cert.id}')">
                  <i data-lucide="external-link" style="width:16px; height:16px;"></i> View & Print Certificate
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Available / Locked Certificates Checklist -->
          <div style="margin-bottom:15px;"><h2 style="font-family:var(--font-display);">🔒 Certificate Requirements</h2></div>
          <div style="display:flex; flex-direction:column; gap:1.2rem; margin-bottom:3rem;" class="animate-fade-in">
            
            ${certCatalog.map(item => {
              const matchesUnlocked = unlockedCerts.find(c => c.courseName === item.title);
              return `
                <div class="card p-md flex-row justify-between align-center" style="background:${matchesUnlocked ? '#f0fdf4' : 'white'}; border: 1px solid ${matchesUnlocked ? '#bbf7d0' : 'var(--gray-200)'}; flex-wrap:wrap; gap:15px;">
                  <div style="display:flex; align-items:center; gap:15px; flex:1; min-width:250px;">
                    <div style="background:${item.unlocked ? 'var(--primary-50)' : 'var(--gray-50)'}; color:${item.unlocked ? 'var(--primary)' : 'var(--gray-400)'}; padding:15px; border-radius:12px;">
                      <i data-lucide="${item.unlocked ? 'award' : 'lock'}" style="width:24px; height:24px;"></i>
                    </div>
                    <div style="flex:1;">
                      <h4 style="margin:0 0 4px 0; color:${matchesUnlocked ? '#166534' : 'var(--gray-900)'};">${item.title}</h4>
                      <p class="text-muted" style="font-size:0.82rem; margin:0 0 8px 0;">${item.desc}</p>
                      
                      <!-- Progress Bar -->
                      <div style="display:flex; align-items:center; gap:10px;">
                        <div style="height:6px; background:var(--gray-100); border-radius:3px; flex:1; overflow:hidden;">
                          <div style="height:100%; background:${item.unlocked ? 'var(--primary)' : 'var(--accent-amber)'}; width:${item.currentProgress}%;"></div>
                        </div>
                        <span style="font-size:0.8rem; font-weight:700; color:var(--gray-700); min-width:35px;">${item.currentProgress}%</span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div style="display:flex; gap:10px; align-items:center; flex-shrink:0;">
                    ${matchesUnlocked ? `
                      <span style="color:var(--success); font-weight:600; font-size:0.9rem; display:flex; align-items:center; gap:4px;">
                        <i data-lucide="check" style="width:18px; height:18px;"></i> Generated
                      </span>
                    ` : (item.unlocked ? `
                      <button class="btn btn-primary generate-cert-btn" data-target="${item.title}" data-type="${item.type}">
                        Claim Certificate
                      </button>
                    ` : `
                      <!-- Simulate Completion Debug Button -->
                      <button class="btn btn-sm btn-outline debug-complete-btn" data-target-id="${item.id}" style="font-size:0.75rem; border-color:var(--accent-amber); color:var(--accent-amber);">
                        Simulate 100%
                      </button>
                      <button class="btn btn-outline" disabled style="opacity:0.6; cursor:not-allowed;">Locked</button>
                    `)}
                  </div>
                </div>
              `;
            }).join('')}

          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupCertificateActions();
  }

  function setupCertificateActions() {
    // Claim Certificate Button Click
    document.querySelectorAll('.generate-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const course = btn.dataset.target;
        const type = btn.dataset.type;
        
        const cert = Store.generateCertificate(user.id, course, type);
        if (cert) {
          showToast('Certificate generated successfully! 🎉', 'success');
          renderPage();
        } else {
          showToast('Failed to claim certificate. Please try again.', 'error');
        }
      });
    });

    // Simulate 100% Completion Debug Button Click
    document.querySelectorAll('.debug-complete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.targetId;
        
        if (targetId === 'course_pu1') {
          // Mock watch/read items for pu1
          const videos = Store.getVideos();
          const notes = Store.getNotes();
          videos.forEach(v => {
            const ch = Store.getChapter(v.chapterId);
            if (ch && ch.classId === 'pu1') Store.markVideoWatched(v.id);
          });
          notes.forEach(n => {
            const ch = Store.getChapter(n.chapterId);
            if (ch && ch.classId === 'pu1') Store.markNoteRead(n.id);
          });
          showToast('Simulated 1st PU Course Complete!', 'success');
        } else if (targetId === 'course_pu2') {
          // Mock watch/read items for pu2
          const videos = Store.getVideos();
          const notes = Store.getNotes();
          videos.forEach(v => {
            const ch = Store.getChapter(v.chapterId);
            if (ch && ch.classId === 'pu2') Store.markVideoWatched(v.id);
          });
          notes.forEach(n => {
            const ch = Store.getChapter(n.chapterId);
            if (ch && ch.classId === 'pu2') Store.markNoteRead(n.id);
          });
          showToast('Simulated 2nd PU Course Complete!', 'success');
        } else if (targetId === 'unit_diversity') {
          // Mock Unit 1 (The Living World, Biological Classification, Plant, Animal)
          const chs = ['ch_living_world', 'ch_bio_classification', 'ch_plant_kingdom', 'ch_animal_kingdom'];
          const videos = Store.getVideos();
          const notes = Store.getNotes();
          videos.forEach(v => {
            if (chs.includes(v.chapterId)) Store.markVideoWatched(v.id);
          });
          notes.forEach(n => {
            if (chs.includes(n.chapterId)) Store.markNoteRead(n.id);
          });
          showToast('Simulated Unit I Course Complete!', 'success');
        } else if (targetId === 'ch_living') {
          // Mock Chapter 1 items
          const videos = Store.getVideosByChapter('ch_living_world');
          const notes = Store.getNotes('ch_living_world');
          videos.forEach(v => Store.markVideoWatched(v.id));
          notes.forEach(n => Store.markNoteRead(n.id));
          showToast('Simulated Chapter 1 Complete!', 'success');
        }

        renderPage();
      });
    });
  }
}
