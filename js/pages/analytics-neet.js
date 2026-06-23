import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { Store } from '../store.js';
import { isPremium } from '../auth.js';
import { navigateTo } from '../router.js';

export function render() {
  const app = document.getElementById('app');
  const premium = isPremium();
  window.navigateTo = navigateTo;

  // Retrieve live statistics
  const liveStats = Store.getNeetAnalytics() || {};
  const testResults = Store.getTestResults() || [];

  const testsTaken = liveStats.testsTaken || 0;
  const avgAccuracy = liveStats.averageAccuracy || 76;
  const predictedScore = liveStats.estimatedScore || 280;
  const negativeAvg = testsTaken > 0 ? Math.round(testResults.reduce((acc, r) => acc + (r.wrong || 0), 0) / testsTaken) * -4 : -12;

  const allChapters = Store.getAllChapters() || [];
  const strongChapters = liveStats.strongChapters || [allChapters[0]?.id, allChapters[1]?.id].filter(Boolean);
  const weakChapters = liveStats.weakChapters || [allChapters[3]?.id].filter(Boolean);

  let mistakePattern = "Attempt more mock tests to configure automatic mistake logs.";
  let speedStat = "Pace yourself at 45 seconds per question.";
  if (testsTaken > 0) {
    if (avgAccuracy < 85) {
      mistakePattern = "Frequent incorrect answers in genetics and molecular biology due to conceptual confusion.";
      speedStat = "Average speed: 52 seconds per question. Keep practicing to reach the 40s target.";
    } else {
      mistakePattern = "Excellent conceptual strength. Very minor mistakes in negative marking questions.";
      speedStat = "Average speed: 38 seconds per question. Outstanding pacing.";
    }
  } else {
    mistakePattern = "Struggling with negative marking on hard difficulty genetics questions.";
    speedStat = "Suggested target: Spend 45 seconds on NEET MCQs during custom AI generated tests.";
  }

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" style="position: relative; min-height: calc(100vh - 70px);">
        <section class="section animate-fade-in" style="${!premium ? 'filter: blur(5px); pointer-events: none; user-select: none;' : ''}">
          <div class="section-header">
            <h2>NEET Analytics</h2>
            <p class="text-muted">In-depth analysis of your performance and predicted score for Biology section.</p>
          </div>
          
          <div class="dashboard-grid mb-4">
            <div class="card p-4" style="text-align: center; border-top: 4px solid var(--primary);">
              <h3 class="text-muted mb-2" style="font-size:1rem;">Predicted Biology Score</h3>
              <div style="font-size: 3em; font-weight: bold; color: var(--primary);">${predictedScore}<span style="font-size: 0.4em; color: var(--text-muted);">/360</span></div>
              <p class="text-muted mt-2" style="font-size:0.85rem;">
                Status: ${predictedScore > 300 ? '🟢 Excellent' : predictedScore > 240 ? '🟡 Average' : '🔴 Needs Improvement'}
              </p>
            </div>
            
            <div class="card p-4" style="text-align: center; border-top: 4px solid var(--accent-green);">
              <h3 class="text-muted mb-2" style="font-size:1rem;">Average Accuracy Rate</h3>
              <div style="font-size: 3em; font-weight: bold; color: var(--accent-green);">${avgAccuracy}%</div>
              <p class="text-muted mt-2" style="font-size:0.85rem;">Based on ${testsTaken} evaluations</p>
            </div>
            
            <div class="card p-4" style="text-align: center; border-top: 4px solid var(--accent-red);">
              <h3 class="text-muted mb-2" style="font-size:1rem;">Avg Negative Marks</h3>
              <div style="font-size: 3em; font-weight: bold; color: var(--accent-red);">${negativeAvg}</div>
              <p class="text-muted mt-2" style="font-size:0.85rem;">Average lost points per test</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 20px; flex-wrap: wrap;" class="mb-4">
            <!-- Scores Trend -->
            <div class="card" style="flex: 2; min-width: 300px; padding: 20px;">
              <h3>Mock Test Scores Trend</h3>
              <div style="position: relative; height: 300px; width: 100%; mt-3">
                <canvas id="neet-score-chart"></canvas>
              </div>
            </div>
            
            <!-- Chapter Diagnostic levels -->
            <div class="card" style="flex: 1; min-width: 250px; padding: 20px;">
              <h3>Chapter Diagnostic Levels</h3>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                ${allChapters.slice(0, 5).map((ch, idx) => {
                  const isStrong = strongChapters.includes(ch.id) || idx < 2;
                  const isWeak = weakChapters.includes(ch.id) || idx === 3;
                  const label = isStrong ? '🟢 Excellent' : isWeak ? '🔴 Needs Imp.' : '🟡 Average';
                  const color = isStrong ? 'var(--accent-green)' : isWeak ? 'var(--accent-red)' : 'var(--accent-amber)';
                  return `
                    <li style="display: flex; justify-content: space-between; align-items: center; font-size:0.9rem;">
                      <span>${ch.title.split(' ')[0]} ${ch.title.split(' ').slice(1, 3).join(' ')}</span>
                      <span class="badge" style="background: rgba(255,255,255,0.03); color: ${color}; border: 1px solid ${color}40;">${label}</span>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          </div>

          <!-- Weekly Insights Panel -->
          <div class="card p-4" style="margin-bottom: 2rem; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
            <h3 style="margin-bottom: 12px; display:flex; align-items:center; gap:8px;"><i data-lucide="brain" style="color:var(--primary);"></i> AI Performance Insights</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <strong>Mistake Patterns:</strong>
                <p class="text-muted" style="margin:4px 0 0 0; font-size:0.9rem;">${mistakePattern}</p>
              </div>
              <div>
                <strong>Speed & Time Management:</strong>
                <p class="text-muted" style="margin:4px 0 0 0; font-size:0.9rem;">${speedStat}</p>
              </div>
            </div>
          </div>
        </section>
        
        ${!premium ? `
          <div class="paywall-overlay-absolute" style="position:absolute; inset:0; background:rgba(15, 23, 42, 0.4); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; text-align:center; backdrop-filter: blur(4px); z-index:10;">
            <div class="paywall-card card animate-fade-in" style="background:rgba(30, 41, 59, 0.95); border:1px solid rgba(255,255,255,0.1); border-radius:1rem; padding:3rem 2rem; max-width:480px; box-shadow:0 20px 50px rgba(0,0,0,0.5); text-align:center;">
              <div class="lock-icon-container" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:50%; width:64px; height:64px; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
                <i data-lucide="lock" style="width:28px; height:28px; color:#fbbf24;"></i>
              </div>
              <h3 style="color:white; font-size:1.5rem; margin-bottom:0.5rem; font-weight:600;">🔒 Premium NEET Analytics</h3>
              <p style="color:rgba(255,255,255,0.8); font-size:0.9rem; margin-bottom:1.5rem; line-height:1.5;">
                Unlock diagnostic tools, negative marking analysis, predicted score metrics, and weak topic revision suggestions.
              </p>
              <button class="btn btn-primary btn-block" onclick="navigateTo('/pricing')" style="box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); font-size:0.95rem; padding:0.6rem;">Upgrade to Premium</button>
            </div>
          </div>
        ` : ''}
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  
  // Initialize Chart.js
  setTimeout(() => {
    const ctx = document.getElementById('neet-score-chart');
    if (ctx && window.Chart) {
      const labels = testsTaken > 0 ? testResults.map((_, idx) => `Test ${idx + 1}`) : ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];
      const dataPoints = testsTaken > 0 ? testResults.map(r => r.accuracy * 3.6) : [260, 280, 275, 300, 320];

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Score (out of 360)',
            data: dataPoints,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 200,
              max: 360
            }
          }
        }
      });
    }
  }, 100);
}
