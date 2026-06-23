import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { isAuthenticated, getGreeting, getUserInitials, getAvatarColor, formatDate, timeAgo } from '../auth.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { CourseCard, StatCard } from '../components/card.js';
import { ProgressBar, CircularProgress } from '../components/progress-bar.js';
import { StreakBadge, initCounters } from '../components/stats.js';

export function render() {
  if (!isAuthenticated()) { navigateTo('/login'); return; }
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  const progress = Store.getProgress();
  const stats = Store.getStats();
  const pu1Progress = Store.getOverallProgress('pu1');
  const pu2Progress = Store.getOverallProgress('pu2');
  const testResults = Store.getTestResults();
  const recentChapters = Store.getAllChapters().slice(0, 4);

  // Concept Mastery calculations
  const allChaptersList = Store.getAllChapters() || [];
  let masteredCount = 0;
  allChaptersList.forEach(ch => {
    const concepts = Store.getConcepts(ch.id);
    concepts.forEach(con => {
      const mastery = Store.getConceptMastery(con.id);
      if (mastery.level === 'Mastered') masteredCount++;
    });
  });

  // AI Coach Motivation Target
  const activePlan = Store.getStudyPlan();
  let coachGoal = "Welcome to BioVerse! Set up a custom Study Planner target to receive automated study schedules and coaching.";
  if (activePlan) {
    const nextTarget = activePlan.schedule.find(t => !t.completed);
    if (nextTarget) {
      const ch = Store.getChapter(nextTarget.chapterId);
      coachGoal = `Your AI Coach recommends targeting **${ch ? ch.title : 'General Biology'}** today. Finish reading its notes and watch video lessons to lock in +25 Concept Mastery points!`;
    } else {
      coachGoal = "Sensational effort! You have completed all scheduled days in your study plan. Go to the Study Planner to reset or create a new outline.";
    }
  }

  // Fallback / defaults for premium stats
  const streak = user.streak || progress.streak || 0;
  const xp = user.xp || progress.xp || 0;
  const studyHours = user.studyHours || Math.round((progress.videosWatched?.length || 0) * 0.5) || 0;

  window.navigateTo = navigateTo;

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <!-- Smart Welcome Banner -->
        <section class="welcome-card premium-gradient animate-fade-in">
          <div class="welcome-content">
            <div class="welcome-text">
              <h1>${getGreeting()}, ${user.name.split(' ')[0]}! 👋</h1>
              <p>Welcome to your Smart Dashboard. Here's your daily snapshot.</p>
            </div>
            <div class="welcome-stats flex-row gap-md">
              <div class="glass-badge">
                <i data-lucide="zap" class="text-amber"></i>
                <span><strong>${xp}</strong> XP</span>
              </div>
              <div class="glass-badge">
                <i data-lucide="flame" class="text-orange"></i>
                <span><strong>${streak}</strong> Day Streak</span>
              </div>
              <div class="glass-badge">
                <i data-lucide="award" style="color:#34d399;"></i>
                <span><strong>${masteredCount}</strong> Mastered Concepts</span>
              </div>
            </div>
          </div>
        </section>

        <!-- AI Coach Motivation Panel -->
        <section class="card p-4 animate-fade-in" style="border-left: 4px solid var(--primary); margin-top: 2rem; background: rgba(30, 41, 59, 0.45); display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap;">
          <div style="flex:1; min-width:280px;">
            <h3 style="margin:0; font-size:1.15rem; display:flex; align-items:center; gap:6px; color:white;"><i data-lucide="bot" style="color:var(--primary); width:20px; height:20px;"></i> AI Coach Daily Goal</h3>
            <p style="margin:6px 0 0 0; font-size:0.9rem; color:rgba(255,255,255,0.85); line-height:1.5;">${coachGoal}</p>
          </div>
          <button class="btn btn-primary" onclick="navigateTo('/ai-tutor')" style="flex-shrink:0;">
            <i data-lucide="message-square" style="width:14px; height:14px; margin-right:6px; display:inline-block; vertical-align:middle;"></i> Ask AI Tutor
          </button>
        </section>

        <!-- Stats Grid -->
        <section class="dashboard-grid stagger-1 animate-fade-in" style="margin-top: 2rem;">
          ${StatCard({ icon: 'play-circle', value: progress.videosWatched?.length || 0, label: 'Videos Watched', color: 'var(--accent-blue)' })}
          ${StatCard({ icon: 'file-text', value: progress.notesRead?.length || 0, label: 'Notes Read', color: 'var(--primary)' })}
          ${StatCard({ icon: 'clipboard-check', value: testResults.length, label: 'Tests Taken', color: 'var(--accent-purple)' })}
          ${StatCard({ icon: 'trending-up', value: Math.round((pu1Progress + pu2Progress) / 2) + '%', label: 'Overall Progress', color: 'var(--accent-amber)' })}
        </section>

        <div class="dashboard-two-col animate-fade-in stagger-2" style="margin-top: 2rem;">
          <!-- Progress Charts Section -->
          <div class="card chart-card">
            <div class="card-header flex-row justify-between align-center">
              <h3><i data-lucide="bar-chart-2"></i> Learning Activity</h3>
              <select id="chartPeriod" class="form-control" style="width:auto; padding:0.25rem;">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div class="card-body">
              <canvas id="progressChart" height="200"></canvas>
            </div>
          </div>

          <!-- Daily Challenges Section -->
          <div class="card challenges-card">
            <div class="card-header">
              <h3><i data-lucide="target"></i> Daily Challenges</h3>
            </div>
            <div class="card-body">
              <ul class="challenge-list" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:1rem;">
                <li class="challenge-item p-sm rounded border flex-row align-center justify-between" style="background:var(--surface-color);">
                  <div class="flex-row align-center gap-sm">
                    <i data-lucide="play" class="text-primary"></i>
                    <div>
                      <p style="margin:0; font-weight:600;">Watch 2 Videos</p>
                      <small class="text-muted">Earn +50 XP</small>
                    </div>
                  </div>
                  <button class="btn btn-sm btn-outline">Go</button>
                </li>
                <li class="challenge-item p-sm rounded border flex-row align-center justify-between" style="background:var(--surface-color);">
                  <div class="flex-row align-center gap-sm">
                    <i data-lucide="check-circle" class="text-success"></i>
                    <div>
                      <p style="margin:0; font-weight:600; text-decoration:line-through;">Take a Quiz</p>
                      <small class="text-muted">Earn +100 XP</small>
                    </div>
                  </div>
                  <span class="badge badge-success">Completed</span>
                </li>
                <li class="challenge-item p-sm rounded border flex-row align-center justify-between" style="background:var(--surface-color);">
                  <div class="flex-row align-center gap-sm">
                    <i data-lucide="book-open" class="text-purple"></i>
                    <div>
                      <p style="margin:0; font-weight:600;">Read 1 Notes chapter</p>
                      <small class="text-muted">Earn +40 XP</small>
                    </div>
                  </div>
                  <button class="btn btn-sm btn-outline">Go</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Course Cards -->
        <section class="section animate-fade-in stagger-3">
          <div class="section-header">
            <h2>Your Courses</h2>
          </div>
          <div class="course-grid">
            ${CourseCard({ icon: '🌱', title: '1st PU Biology', subtitle: 'Units I - V', chaptersCount: 16, progress: pu1Progress, link: '/syllabus/pu1' })}
            ${CourseCard({ icon: '🧬', title: '2nd PU Biology', subtitle: 'Units VI - X', chaptersCount: 13, progress: pu2Progress, link: '/syllabus/pu2' })}
            ${CourseCard({ icon: '🎯', title: 'KCET Biology', subtitle: 'Competitive Prep', chaptersCount: stats.kcetQuestions, progress: 0, link: '/questions' })}
            ${CourseCard({ icon: '🔥', title: 'NEET Biology', subtitle: 'National Exam Prep', chaptersCount: stats.neetQuestions, progress: 0, link: '/questions' })}
          </div>
        </section>

      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initCounters();

  // Initialize Chart.js
  setTimeout(() => {
    const ctx = document.getElementById('progressChart');
    if (ctx && window.Chart) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Study Hours',
            data: [1, 2, 0.5, 3, 1.5, 4, 2],
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } else if (ctx && !window.Chart) {
      // Lazy load chart.js if not present
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Study Hours',
              data: [1, 2, 0.5, 3, 1.5, 4, 2],
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      };
      document.head.appendChild(script);
    }
  }, 100);
}
