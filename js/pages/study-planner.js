import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';

export function render() {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  if (!user) { navigateTo('/login'); return; }

  window.navigateTo = navigateTo;
  let activeTab = 'daily'; // daily, weekly, monthly

  function renderPlanContent(plan) {
    if (!plan) {
      return `
        <div class="card mb-4 animate-fade-in">
          <div class="card-header">
            <h3>📅 Create your Study Planner</h3>
          </div>
          <div class="card-body">
            <form id="planner-form" style="display: flex; flex-direction:column; gap: 1.25rem;">
              <div style="display:flex; gap:15px; flex-wrap:wrap;">
                <div class="form-group" style="flex: 1; min-width: 200px;">
                  <label for="exam-type" style="font-weight:600;">Target Exam</label>
                  <select id="exam-type" class="form-control">
                    <option value="pu1">1st PU Board Exam</option>
                    <option value="pu2">2nd PU Board Exam</option>
                    <option value="kcet">KCET (Karnataka CET)</option>
                    <option value="neet">NEET Biology</option>
                  </select>
                </div>
                <div class="form-group" style="flex: 1; min-width: 200px;">
                  <label for="daily-hours" style="font-weight:600;">Study Hours Per Day</label>
                  <input type="number" id="daily-hours" class="form-control" min="1" max="16" value="4">
                </div>
                <div class="form-group" style="flex: 1; min-width: 200px;">
                  <label for="target-date" style="font-weight:600;">Exam Target Date</label>
                  <input type="date" id="target-date" class="form-control">
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="align-self: flex-start; padding: 10px 24px;">🚀 Generate Adaptive Planner</button>
            </form>
          </div>
        </div>
      `;
    }

    const totalTasks = plan.schedule.length;
    const completedTasks = plan.schedule.filter(t => t.completed).length;
    const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter uncompleted tasks before today to check if missed
    const missedSessions = plan.schedule.filter(t => !t.completed && t.date < todayStr && !t.isRevisionSession);

    return `
      <div class="animate-fade-in">
        <!-- Planner Stats / Header -->
        <div class="dashboard-grid mb-4" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
          <div class="card p-3 flex-row justify-between align-center" style="border-left: 4px solid var(--primary);">
            <div>
              <small class="text-muted">Target Exam</small>
              <h4 style="margin: 4px 0 0 0;">${plan.chapters.length > 16 ? 'KCET / NEET Biology' : 'PU Board Biology'}</h4>
            </div>
            <i data-lucide="award" style="color:var(--primary); width:28px; height:28px;"></i>
          </div>
          <div class="card p-3 flex-row justify-between align-center" style="border-left: 4px solid var(--accent-blue);">
            <div>
              <small class="text-muted">Hours Committed</small>
              <h4 style="margin: 4px 0 0 0;">${plan.hoursPerDay} hrs / day</h4>
            </div>
            <i data-lucide="clock" style="color:var(--accent-blue); width:28px; height:28px;"></i>
          </div>
          <div class="card p-3 flex-row justify-between align-center" style="border-left: 4px solid var(--accent-amber);">
            <div>
              <small class="text-muted">Plan Progress</small>
              <h4 style="margin: 4px 0 0 0;">${progressPct}% Complete</h4>
            </div>
            <i data-lucide="trending-up" style="color:var(--accent-amber); width:28px; height:28px;"></i>
          </div>
        </div>

        ${missedSessions.length > 0 ? `
          <div class="card mb-4 p-3 flex-row justify-between align-center animate-pulse" style="background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 10px;">
            <div class="flex-row gap-sm align-center">
              <i data-lucide="alert-triangle" style="color:#ef4444;"></i>
              <div>
                <strong style="color:white; font-size:0.95rem;">Missed Study Sessions Detected</strong>
                <p class="text-muted" style="margin:2px 0 0 0; font-size:0.85rem;">You missed ${missedSessions.length} sessions. Recalculate your targets to stay on track.</p>
              </div>
            </div>
            <button class="btn btn-sm btn-danger" id="recalculateBtn" style="background:#ef4444; border-color:#ef4444; color:white;">⚡ Reschedule Adaptive Plan</button>
          </div>
        ` : ''}

        ${plan.isAdaptive ? `
          <div class="card mb-4 p-3 flex-row gap-sm align-center" style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius:10px;">
            <i data-lucide="check-circle" style="color:#10b981;"></i>
            <div>
              <strong style="color:white; font-size:0.95rem;">Plan Rescheduled Successfully</strong>
              <p class="text-muted" style="margin:2px 0 0 0; font-size:0.85rem;">Remaining workload has been redistributed. Added dedicated catch-up and revision blocks.</p>
            </div>
          </div>
        ` : ''}

        <!-- Tabs Navigation -->
        <div class="flex-row gap-sm align-center justify-between mb-4">
          <div class="flex-row gap-xs" style="display:flex; gap:8px;">
            <button class="chip ${activeTab === 'daily' ? 'chip-active' : ''}" data-tab="daily">Daily Targets</button>
            <button class="chip ${activeTab === 'weekly' ? 'chip-active' : ''}" data-tab="weekly">Weekly Plan</button>
            <button class="chip ${activeTab === 'monthly' ? 'chip-active' : ''}" data-tab="monthly">Monthly Overview</button>
          </div>
          <button class="btn btn-outline btn-sm" id="resetPlanBtn"><i data-lucide="refresh-cw" style="width:12px; height:12px; margin-right:4px;"></i> Reset Planner</button>
        </div>

        <!-- Tab content renders below -->
        <div class="planner-calendar-section">
          ${renderTabContent(plan)}
        </div>

      </div>
    `;
  }

  function renderTabContent(plan) {
    if (activeTab === 'daily') {
      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
          ${plan.schedule.map((item, idx) => {
            const ch = Store.getChapter(item.chapterId);
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            
            return `
              <div class="card p-3 hover-lift ${item.completed ? 'completed-card' : ''}" style="border-left: 4px solid ${item.isCatchUp ? '#ef4444' : item.isRevisionSession ? '#d97706' : 'var(--primary)'}; opacity: ${item.completed ? 0.6 : 1}; position:relative;">
                <div class="flex-row justify-between align-center mb-sm" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span style="font-weight:bold; font-size:0.9rem;">${item.isRevisionSession ? '🔄 Revision' : `Day ${idx + 1}`}</span>
                  <span style="font-size:0.8rem; color:var(--text-muted);">${dateStr}</span>
                </div>
                <div style="font-size: 0.95rem; font-weight:600; margin-bottom:12px; color:white;">
                  ${item.isRevisionSession ? 'Revision Session' : (ch ? ch.title : 'Study Biology Topic')}
                </div>
                <div class="flex-row justify-between align-center" style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                  <span style="font-size:0.75rem; color:${item.isCatchUp ? '#f87171' : 'var(--text-muted)'}; font-weight:600;">
                    ${item.notes || `<i data-lucide="clock" style="width:12px; height:12px; vertical-align:middle; display:inline-block;"></i> ${plan.hoursPerDay} hrs`}
                  </span>
                  <label class="checkbox-container" style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:white; cursor:pointer;">
                    <input type="checkbox" class="planner-checkbox" data-ch-id="${item.chapterId}" data-date="${item.date}" ${item.completed ? 'checked' : ''} style="cursor:pointer;">
                    Done
                  </label>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (activeTab === 'weekly') {
      // Chunk schedule into weeks of 7 items
      const weeks = [];
      for (let i = 0; i < plan.schedule.length; i += 7) {
        weeks.push(plan.schedule.slice(i, i + 7));
      }

      return `
        <div class="flex-column gap-md" style="display:flex; flex-direction:column; gap:20px;">
          ${weeks.map((week, wIdx) => {
            const completedCount = week.filter(t => t.completed).length;
            return `
              <div class="card p-4">
                <div class="flex-row justify-between align-center mb-md" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                  <h4 style="margin:0; color:white;">📅 Week ${wIdx + 1}</h4>
                  <span class="badge badge-primary">${completedCount} / ${week.length} completed</span>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:10px;">
                  ${week.map(day => {
                    const ch = Store.getChapter(day.chapterId);
                    return `
                      <div style="background: rgba(255,255,255,0.02); border: 1px solid ${day.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}; padding:10px; border-radius:8px; font-size:0.8rem;">
                        <div style="font-weight:600; color:${day.completed ? '#10b981' : 'white'};">${ch ? ch.title.split(' ')[0] : 'Chapter'}</div>
                        <small class="text-muted">${new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (activeTab === 'monthly') {
      return `
        <div class="card p-4">
          <h4 style="margin-bottom:15px; color:white;">Monthly Target Calendar</h4>
          <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:10px; text-align:center;">
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Mon</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Tue</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Wed</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Thu</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Fri</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Sat</div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--primary);">Sun</div>
            
            ${plan.schedule.map((day, idx) => {
              const completed = day.completed;
              return `
                <div style="background: ${completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${completed ? '#10b981' : 'rgba(255,255,255,0.08)'}; border-radius:6px; padding:15px 5px; height: 60px; display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.75rem; font-weight:bold; color:${completed ? '#10b981' : 'white'};">${idx + 1}</span>
                  <small style="font-size:0.6rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap;">
                    ${day.isRevisionSession ? 'Revision' : (Store.getChapter(day.chapterId)?.title || 'Chapter')}
                  </small>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  function reRender() {
    const activePlan = Store.getStudyPlan();
    document.getElementById('studyPlannerContainer').innerHTML = renderPlanContent(activePlan);
    
    // Rebind listeners
    bindPlannerEvents(activePlan);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function bindPlannerEvents(plan) {
    if (!plan) {
      // Bind generator form
      const form = document.getElementById('planner-form');
      
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 2); // default 2 months target
      document.getElementById('target-date').valueAsDate = defaultDate;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const examType = document.getElementById('exam-type').value;
        const dailyHours = parseInt(document.getElementById('daily-hours').value, 10);
        const targetDateStr = document.getElementById('target-date').value;
        
        if (!targetDateStr) {
          showToast('Please select a target date', 'warning');
          return;
        }

        // Fetch chapters matching selected exam
        let chapters = [];
        if (examType === 'pu1') {
          chapters = Store.getAllChapters('pu1');
        } else if (examType === 'pu2') {
          chapters = Store.getAllChapters('pu2');
        } else {
          chapters = Store.getAllChapters(); // all for KCET/NEET
        }

        const generated = Store.createStudyPlan(chapters.map(c => c.id), targetDateStr, dailyHours);
        if (generated) {
          showToast('Adaptive Study Plan Generated!', 'success');
          reRender();
        }
      });
      return;
    }

    // Recalculate button
    const recalculateBtn = document.getElementById('recalculateBtn');
    if (recalculateBtn) {
      recalculateBtn.addEventListener('click', () => {
        Store.reschedulePlannerPlan();
        showToast('Study Plan Rescheduled & Catch-up classes injected', 'success');
        reRender();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('resetPlanBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const userId = Store.getCurrentUser()?.id;
        if (userId) {
          localStorage.removeItem('bv_study_plan_' + userId);
          showToast('Study planner reset', 'info');
          reRender();
        }
      });
    }

    // Checkboxes
    document.querySelectorAll('.planner-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const chId = box.dataset.chId;
        const date = box.dataset.date;
        const completed = e.target.checked;
        Store.updateStudyPlanTask(chId, date, completed);
        showToast(completed ? 'Target marked as completed! +20 XP' : 'Target unmarked', 'success');
        if (completed) Store.addXP(20);
        reRender();
      });
    });

    // Tab Chips
    document.querySelectorAll('[data-tab]').forEach(chip => {
      chip.addEventListener('click', () => {
        activeTab = chip.dataset.tab;
        reRender();
      });
    });
  }

  // Initial render scaffolding
  const activePlan = Store.getStudyPlan();
  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content">
        <section class="section animate-fade-in">
          <div class="section-header">
            <h2>Study Planner</h2>
            <p class="text-muted">High-fidelity adaptive syllabus tracking calendar. Missed sessions are rescheduled automatically.</p>
          </div>
          
          <div id="studyPlannerContainer">
            ${renderPlanContent(activePlan)}
          </div>
        </section>
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  bindPlannerEvents(activePlan);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

