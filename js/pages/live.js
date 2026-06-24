import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';

export async function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  window.navigateTo = navigateTo;

  let activeTab = 'chat'; // chat, poll, qa
  let chatMessages = [
    { name: 'Vijay Kumar', role: 'student', message: 'Hello maam, is transcription starting codon always AUG?' },
    { name: 'Dr. Shruti Patil', role: 'teacher', message: 'Yes Vijay, transcription promoter maps the start point, but translation initiator codon is AUG.' },
    { name: 'Pooja Bhat', role: 'student', message: 'Will this chapter have 5 marks question in Board exam?' },
    { name: 'Kiran Gowda', role: 'student', message: 'Is DNA replication continuous on both strands?' }
  ];
  let qaQuestions = [
    { id: 'q1', user: 'Vijay Kumar', question: 'How does RNA polymerase recognize the promoter sequence?', answered: true, answer: 'Through the sigma factor in prokaryotes, or specific transcription factors in eukaryotes.' }
  ];

  let selectedPollOption = null;
  const pollData = Store.getMockLiveClassPolls()[0];

  let chatFeedInterval = null;

  function renderLivePage() {
    const mainContent = document.getElementById('live-main-content');
    const liveClasses = Store.getMockLiveClasses();
    const activeClass = liveClasses.find(c => c.active);

    const chatHtml = chatMessages.map(msg => `
      <div style="font-size:12.5px; border-bottom:1px solid var(--gray-50); padding-bottom:6px; margin-bottom:4px;">
        <span style="font-weight:bold; color:${msg.role === 'teacher' ? 'var(--primary)' : 'var(--gray-800)'};">${msg.name}</span>
        <span style="font-size:10px; background:${msg.role === 'teacher' ? 'var(--primary-100)' : 'var(--gray-100)'}; padding:1px 4px; border-radius:4px; margin-left:4px;">${msg.role}</span>
        <p style="color:var(--gray-700); margin:2px 0 0 0; line-height:1.4;">${msg.message}</p>
      </div>
    `).join('');

    const qaHtml = qaQuestions.map(q => `
      <div style="background:var(--gray-50); padding:10px; border-radius:var(--radius-md); font-size:12px; border:1px solid var(--gray-100); margin-bottom:8px;">
        <div style="font-weight:600; color:var(--gray-800); margin-bottom:4px;">Asked by ${q.user}</div>
        <p style="color:var(--gray-700); margin:0 0 8px 0; font-style:italic;">"${q.question}"</p>
        ${q.answered 
          ? `<div style="border-top:1px dashed var(--gray-200); padding-top:6px; margin-top:6px; color:var(--primary-900);">
               <strong>Teacher Answer:</strong> ${q.answer}
             </div>`
          : `<span style="color:var(--gray-400); font-size:10px;">Pending answer...</span>`
        }
      </div>
    `).join('');

    // Poll percentages
    const totalVotes = pollData.votes.reduce((a, b) => a + b, 0);
    const pollHtml = pollData.options.map((opt, idx) => {
      const votesCount = pollData.votes[idx];
      const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
      const isSelected = selectedPollOption === idx;
      
      return `
        <button class="btn btn-outline btn-block poll-opt-btn" data-index="${idx}" ${selectedPollOption !== null ? 'disabled' : ''} style="margin-bottom:8px; text-align:left; justify-content:space-between; padding:10px; font-size:12px; background:${isSelected ? 'var(--primary-50)' : 'white'}; border-color:${isSelected ? 'var(--primary)' : 'var(--gray-200)'};">
          <span>${opt}</span>
          ${selectedPollOption !== null ? `<span style="font-weight:bold;color:var(--primary);">${pct}% (${votesCount})</span>` : ''}
        </button>
      `;
    }).join('');

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Live Classes</span>
        </div>
        <h1>📺 Live Streaming Classes & Webinars</h1>
        <p>Participate in scheduled strategy events, live PU Biology lectures, and webinars. Answer polls and chat in real-time with teachers!</p>
      </div>

      <div class="live-layout animate-fade-in" style="margin-bottom:32px;">
        <!-- Video Stream Player -->
        <div>
          <div class="live-video-panel">
            <!-- Simulated streaming video background with loader/text -->
            <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)); text-align:center; padding:20px; color:white;">
              <!-- Pulse Red dot -->
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; background:rgba(0,0,0,0.6); padding:4px 12px; border-radius:16px; border:1px solid rgba(255,255,255,0.2);">
                <span style="width:10px; height:10px; background:var(--accent-red); border-radius:50%; display:inline-block; animation:pulse 1.5s infinite;"></span>
                <span style="font-weight:bold; font-size:11px; text-transform:uppercase; letter-spacing:1px;">LIVE STREAM ACTIVE</span>
              </div>
              <h2 style="font-family:var(--font-display); font-size:20px; font-weight:700; margin:0 0 6px 0;">${activeClass ? activeClass.title : 'Live Session'}</h2>
              <p style="opacity:0.8; font-size:12px; margin:0;">Teacher: ${activeClass ? activeClass.teacher : 'Staff'}</p>
              
              <!-- Dummy Player Controls (visually appealing) -->
              <div style="position:absolute; bottom:16px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:center; font-size:12px; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:var(--radius-md);">
                <div style="display:flex; gap:16px; align-items:center;">
                  <i data-lucide="play" style="width:16px;height:16px;cursor:pointer;"></i>
                  <i data-lucide="volume-2" style="width:16px;height:16px;cursor:pointer;"></i>
                  <span>02:40 / 60:00</span>
                </div>
                <div>
                  <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="users" style="width:14px;height:14px;"></i> 142 watching</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Strategy Events / Upcoming Classes -->
          <div style="margin-top:24px;">
            <h3 style="font-family:var(--font-display); color:var(--gray-900); font-size:16px; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
              <i data-lucide="calendar" style="color:var(--primary);width:18px;height:18px;"></i> Upcoming Webinars & Strategies
            </h3>
            <div style="display:grid; grid-template-columns:1fr; gap:12px;">
              ${liveClasses.filter(c => !c.active).map(c => `
                <div class="card hover-lift" style="display:flex; justify-content:space-between; align-items:center; padding:16px; border:1px solid var(--gray-200); flex-wrap:wrap; gap:12px;">
                  <div>
                    <h4 style="font-family:var(--font-display); margin:0; font-size:14px; color:var(--gray-800);">${c.title}</h4>
                    <p style="font-size:11px; color:var(--gray-500); margin-top:4px;">Host: ${c.teacher} · Starts: ${new Date(c.start).toLocaleDateString()} at 4:00 PM</p>
                  </div>
                  <button class="btn btn-primary btn-sm register-btn" style="padding:6px 12px; font-size:11px;">Register Event</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Interactive Right Sidebar -->
        <div class="live-chat-panel">
          <!-- Sidebar Tabs -->
          <div style="display:flex; border-bottom:1px solid var(--gray-200);">
            <button class="tab-item-chat flex-grow ${activeTab === 'chat' ? 'active' : ''}" data-tab="chat" style="flex:1; border:none; background:${activeTab === 'chat' ? 'white' : 'var(--gray-50)'}; border-bottom:${activeTab === 'chat' ? '2px solid var(--primary)' : 'none'}; padding:12px; font-weight:bold; font-size:12px; cursor:pointer;">Chat</button>
            <button class="tab-item-chat flex-grow ${activeTab === 'poll' ? 'active' : ''}" data-tab="poll" style="flex:1; border:none; background:${activeTab === 'poll' ? 'white' : 'var(--gray-50)'}; border-bottom:${activeTab === 'poll' ? '2px solid var(--primary)' : 'none'}; padding:12px; font-weight:bold; font-size:12px; cursor:pointer;">Polls</button>
            <button class="tab-item-chat flex-grow ${activeTab === 'qa' ? 'active' : ''}" data-tab="qa" style="flex:1; border:none; background:${activeTab === 'qa' ? 'white' : 'var(--gray-50)'}; border-bottom:${activeTab === 'qa' ? '2px solid var(--primary)' : 'none'}; padding:12px; font-weight:bold; font-size:12px; cursor:pointer;">Q&A</button>
          </div>

          <!-- Chat tab content -->
          <div class="live-chat-messages" style="display:${activeTab === 'chat' ? 'flex' : 'none'};" id="chat-scroller">
            ${chatHtml}
          </div>

          <!-- Chat Form -->
          <form id="live-chat-form" style="display:${activeTab === 'chat' ? 'flex' : 'none'}; padding:10px; border-top:1px solid var(--gray-200); gap:8px;">
            <input type="text" placeholder="Send a message..." class="form-input" id="live-chat-input" style="flex-grow:1; height:36px; padding:0 12px; font-size:12px;" required>
            <button type="submit" class="btn btn-primary" style="padding:0 12px; height:36px; font-size:12px;"><i data-lucide="send"></i></button>
          </form>

          <!-- Polls tab content -->
          <div style="display:${activeTab === 'poll' ? 'block' : 'none'}; padding:16px;">
            <h4 style="font-family:var(--font-display); font-size:13px; color:var(--gray-800); margin-bottom:12px;">${pollData.question}</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${pollHtml}
            </div>
          </div>

          <!-- Q&A tab content -->
          <div style="display:${activeTab === 'qa' ? 'flex' : 'none'}; flex-direction:column; height:100%; justify-content:space-between; padding:16px;">
            <div style="overflow-y:auto; flex-grow:1; max-height:360px;">
              ${qaHtml}
            </div>
            
            <form id="live-qa-form" style="border-top:1px solid var(--gray-200); padding-top:10px; display:flex; flex-direction:column; gap:8px;">
              <textarea placeholder="Ask the teacher a question..." class="form-input" id="live-qa-input" style="min-height:50px; font-size:12px; padding:8px;" required></textarea>
              <button type="submit" class="btn btn-primary btn-block" style="padding:8px; font-size:12px;">Submit Question</button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Scroll chat to bottom
    const scroller = document.getElementById('chat-scroller');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;

    // Bind sidebar tabs
    document.querySelectorAll('.tab-item-chat').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        renderLivePage();
      });
    });

    // Chat submit
    const chatForm = document.getElementById('live-chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('live-chat-input');
        chatMessages.push({
          name: user.name,
          role: 'student',
          message: input.value
        });
        input.value = '';
        renderLivePage();
      });
    }

    // QA submit
    const qaForm = document.getElementById('live-qa-form');
    if (qaForm) {
      qaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('live-qa-input');
        qaQuestions.push({
          id: 'q_' + Date.now(),
          user: user.name,
          question: input.value,
          answered: false
        });
        input.value = '';
        showToast('Question submitted to teacher!', 'success');
        renderLivePage();
      });
    }

    // Poll vote
    document.querySelectorAll('.poll-opt-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        selectedPollOption = parseInt(btn.dataset.index);
        pollData.votes[selectedPollOption]++;
        showToast('Vote counted! +10 XP', 'success');
        await Store.addXP(10);
        renderLivePage();
      });
    });

    // Register button
    document.querySelectorAll('.register-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.textContent = 'Registered ✓';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        btn.setAttribute('disabled', 'true');
        showToast('Successfully registered! You will be notified when this strategizing session goes live.', 'success');
      });
    });
  }

  // Set up rolling chat feed simulator
  function startChatFeed() {
    const randomMessages = [
      { name: 'Kiran Gowda', role: 'student', message: 'Ah got it, thanks!' },
      { name: 'Ravi Teja', role: 'student', message: 'Is this important for KCET exam?' },
      { name: 'Dr. Shruti Patil', role: 'teacher', message: 'Yes Ravi, transcription enzymes are asked every year.' },
      { name: 'Anjali Sharma', role: 'student', message: 'Please repeat the function of promoter.' },
      { name: 'Vijay Kumar', role: 'student', message: 'Okazaki fragments are on lagging strand right?' }
    ];

    chatFeedInterval = setInterval(() => {
      if (chatMessages.length < 15) {
        const nextMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        chatMessages.push(nextMsg);
        const scroller = document.getElementById('chat-scroller');
        if (scroller && activeTab === 'chat') {
          renderLivePage();
        }
      }
    }, 4000);
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="live-main-content">
        <!-- Renders dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  renderLivePage();
  startChatFeed();

  return () => {
    clearInterval(chatFeedInterval);
  };
}
