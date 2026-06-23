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
  
  let chatHistory = Store.getAiChats();
  let currentLanguage = 'en';
  let isTTSActive = false;

  // Predefined biology concepts to choose from for quick actions
  const allChapters = Store.getAllChapters() || [];

  app.innerHTML = `
    ${Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content flex-column" style="height: calc(100vh - 70px); overflow:hidden; padding: 1.5rem;">
        
        <div class="chapter-header animate-fade-in flex-row justify-between align-center" style="margin-bottom:1.5rem; flex-shrink: 0;">
          <div>
            <h1 style="margin:0; font-size:1.8rem; display:flex; align-items:center; gap:8px;">🤖 AI Biology Tutor</h1>
            <p class="text-muted" style="margin:5px 0 0 0; font-size:0.9rem;">Your personal syllabus-focused assistant for Karnataka PU, KCET & NEET Biology.</p>
          </div>
          <div class="flex-row gap-sm align-center">
            <select id="tutorLanguage" class="form-select" style="width:auto; padding:0.4rem 1.5rem 0.4rem 0.75rem; background:rgba(30, 41, 59, 0.85); color:white; border: 1px solid rgba(255,255,255,0.15);">
              <option value="en">English (Syllabus Mode)</option>
              <option value="kn">ಕನ್ನಡ (Kannada Medium)</option>
            </select>
            <button id="tutorTTSBtn" class="btn btn-outline" style="padding:0.4rem 0.8rem; display:flex; align-items:center; gap:6px;">
              <i data-lucide="volume-2" id="ttsIcon"></i> Speak Responses
            </button>
          </div>
        </div>

        <div class="dashboard-two-col flex-row" style="flex: 1; min-height: 0; gap: 1.5rem; margin-top:0;">
          
          <!-- LEFT SIDEBAR: CHAT LOGS & SUGGESTIONS -->
          <div class="personal-notes-panel flex-column animate-fade-in" style="flex: 1; max-width: 320px; background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius:1rem; padding:1.25rem; overflow-y:auto; display:flex; min-height:0;">
            <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:6px;"><i data-lucide="history"></i> Chat History</h3>
            <div class="chat-history-list" id="tutorHistoryList" style="display:flex; flex-direction:column; gap:0.5rem; flex:1; overflow-y:auto; min-height: 0;">
              ${chatHistory.length === 0 ? `
                <p class="text-muted text-sm text-center" style="margin-top:2rem;">No chats yet. Ask a question to begin!</p>
              ` : chatHistory.map((c, i) => `
                <div class="history-item card p-sm cursor-pointer" data-chat-id="${c.id}" style="padding: 10px; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  <strong>Q:</strong> ${c.question}
                </div>
              `).join('')}
            </div>

            <hr style="margin:1rem 0; border:none; border-top:1px solid rgba(255,255,255,0.1);">
            
            <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:6px;"><i data-lucide="compass"></i> Quick Actions</h3>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              <button class="btn btn-outline btn-block text-left quick-action-btn" data-action="explain" style="justify-content:flex-start; text-align:left; font-size:0.85rem; padding: 10px;">
                <i data-lucide="book-open" style="width:14px; height:14px; margin-right:8px;"></i> Explain a Concept
              </button>
              <button class="btn btn-outline btn-block text-left quick-action-btn" data-action="questions" style="justify-content:flex-start; text-align:left; font-size:0.85rem; padding: 10px;">
                <i data-lucide="help-circle" style="width:14px; height:14px; margin-right:8px;"></i> Generate NEET MCQs
              </button>
              <button class="btn btn-outline btn-block text-left quick-action-btn" data-action="plan" style="justify-content:flex-start; text-align:left; font-size:0.85rem; padding: 10px;">
                <i data-lucide="calendar" style="width:14px; height:14px; margin-right:8px;"></i> Smart Planner
              </button>
              <button class="btn btn-outline btn-block text-left quick-action-btn" data-action="summarize" style="justify-content:flex-start; text-align:left; font-size:0.85rem; padding: 10px;">
                <i data-lucide="file-text" style="width:14px; height:14px; margin-right:8px;"></i> Summarize Chapter
              </button>
            </div>
          </div>

          <!-- CENTRAL MAIN CHAT WORKSPACE -->
          <div class="card flex-column" style="flex: 2.5; display:flex; flex-direction:column; min-height:0; padding:0; border-radius:1rem; overflow:hidden; background:rgba(30, 41, 59, 0.4); border:1px solid rgba(255,255,255,0.08);">
            
            <!-- Chat output -->
            <div class="chat-messages-container" id="tutorMessages" style="flex: 1; padding: 1.5rem; overflow-y:auto; display:flex; flex-direction:column; gap:1.25rem; min-height:0;">
              <div class="tutor-chat-bubble flex-row gap-sm animate-fade-in" style="display:flex; align-items:flex-start;">
                <div style="background:var(--primary); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
                  <i data-lucide="bot" style="color:white; width:18px; height:18px;"></i>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:12px; border-top-left-radius:0; border: 1px solid rgba(255,255,255,0.05); color:#f3f4f6; max-width:80%; font-size:0.95rem; line-height:1.5;">
                  Hello ${user.name}! I am your **BioVerse Biology Coach**. I specialize in Karnataka PU Board, KCET, and NEET topics. 
                  <br><br>
                  Ask me questions like:
                  <ul>
                    <li>"Explain Photosynthesis"</li>
                    <li>"Difference between mitosis and meiosis"</li>
                    <li>"Memory trick for DNA replication"</li>
                  </ul>
                  You can also click the quick action buttons on the left or type your custom biology doubt.
                </div>
              </div>
            </div>

            <!-- Suggested questions slider -->
            <div class="suggested-prompts-bar flex-row gap-xs" style="display:flex; gap:8px; padding:0.5rem 1rem; background:rgba(255,255,255,0.02); border-top:1px solid rgba(255,255,255,0.05); overflow-x:auto; flex-shrink:0;">
              <button class="badge badge-primary cursor-pointer prompt-badge" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 12px; color:rgba(255,255,255,0.85); font-size:0.8rem; white-space:nowrap; border-radius:100px;">Explain Human Heart</button>
              <button class="badge badge-primary cursor-pointer prompt-badge" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 12px; color:rgba(255,255,255,0.85); font-size:0.8rem; white-space:nowrap; border-radius:100px;">Summarize Cell Division</button>
              <button class="badge badge-primary cursor-pointer prompt-badge" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 12px; color:rgba(255,255,255,0.85); font-size:0.8rem; white-space:nowrap; border-radius:100px;">Give me NEET Questions from Genetics</button>
            </div>

            <!-- Chat input bar -->
            <div class="chat-input-container" style="padding:1.25rem; background:rgba(255,255,255,0.03); border-top:1px solid rgba(255,255,255,0.08); flex-shrink: 0;">
              <div class="flex-row gap-sm" style="display:flex; gap:10px;">
                <button id="tutorMicBtn" class="btn btn-outline" style="padding: 10px; display:flex; align-items:center; justify-content:center; flex-shrink: 0;" title="Voice Assistant">
                  <i data-lucide="mic" id="micIcon" style="width:18px; height:18px;"></i>
                </button>
                <input type="text" id="tutorInputText" class="form-control" placeholder="Ask your Biology tutor a question..." style="flex:1; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:8px; padding: 10px 15px;">
                <button id="tutorSendBtn" class="btn btn-primary" style="display:flex; align-items:center; justify-content:center; padding:10px 20px; gap:6px; border-radius:8px;">
                  Send <i data-lucide="send" style="width:14px; height:14px;"></i>
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  `;

  initNavbar(); initSidebar();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const messagesDiv = document.getElementById('tutorMessages');
  const inputText = document.getElementById('tutorInputText');
  const sendBtn = document.getElementById('tutorSendBtn');
  const micBtn = document.getElementById('tutorMicBtn');
  const ttsBtn = document.getElementById('tutorTTSBtn');
  const languageSelect = document.getElementById('tutorLanguage');
  const historyListDiv = document.getElementById('tutorHistoryList');

  // Load chat on clicking history item
  function bindHistoryClick() {
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.chatId;
        const chat = chatHistory.find(c => c.id === id);
        if (chat) {
          appendMessage('student', chat.question);
          appendMessage('tutor', chat.answer);
        }
      });
    });
  }
  bindHistoryClick();

  // Prompt badges click
  document.querySelectorAll('.prompt-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const q = badge.textContent.trim();
      inputText.value = q;
      handleSubmit();
    });
  });

  // Quick Action Buttons
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'explain') {
        const ch = allChapters[Math.floor(Math.random() * allChapters.length)];
        inputText.value = `Explain Photosynthesis and light reaction`;
        showToast('Suggested photo-synthetic prompt loaded', 'info');
      } else if (action === 'questions') {
        inputText.value = `Give me NEET Questions from Genetics`;
        showToast('NEET genetics questions loaded', 'info');
      } else if (action === 'plan') {
        navigateTo('/study-planner');
        showToast('Navigating to Study Planner', 'success');
      } else if (action === 'summarize') {
        inputText.value = `Summarize DNA Replication semiconservative model`;
        showToast('Chapter summary prompt loaded', 'info');
      }
    });
  });

  // Language Change
  languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    showToast(`Language set to ${currentLanguage === 'kn' ? 'Kannada' : 'English'}`, 'success');
  });

  // TTS Toggle
  ttsBtn.addEventListener('click', () => {
    isTTSActive = !isTTSActive;
    ttsBtn.classList.toggle('btn-primary', isTTSActive);
    ttsBtn.classList.toggle('btn-outline', !isTTSActive);
    document.getElementById('ttsIcon').style.color = isTTSActive ? '#ffffff' : '';
    showToast(isTTSActive ? 'Tutor will read out responses' : 'Text-to-speech output disabled', 'info');
  });

  // Voice Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      document.getElementById('micIcon').style.color = '#dc2626'; // red
      inputText.placeholder = 'Listening...';
    };

    recognition.onend = () => {
      document.getElementById('micIcon').style.color = '';
      inputText.placeholder = 'Ask your Biology tutor a question...';
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      inputText.value = speechToText;
      handleSubmit();
    };

    micBtn.addEventListener('click', () => {
      try {
        recognition.start();
      } catch {
        recognition.stop();
      }
    });
  } else {
    micBtn.style.display = 'none';
  }

  // Handle Send click
  sendBtn.addEventListener('click', handleSubmit);
  inputText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  function handleSubmit() {
    const q = inputText.value.trim();
    if (!q) return;
    inputText.value = '';
    
    appendMessage('student', q);

    // Show Typing Indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'tutor-chat-bubble flex-row gap-sm animate-fade-in';
    typingIndicator.id = 'aiTyping';
    typingIndicator.innerHTML = `
      <div style="background:rgba(255,255,255,0.05); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
        <i data-lucide="bot" style="color:rgba(255,255,255,0.5); width:18px; height:18px;"></i>
      </div>
      <div style="background:rgba(255,255,255,0.03); padding:0.75rem 1rem; border-radius:12px; border-top-left-radius:0; color:rgba(255,255,255,0.5); font-size:0.85rem; font-style:italic;">
        Thinking...
      </div>
    `;
    messagesDiv.appendChild(typingIndicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
      const typ = document.getElementById('aiTyping');
      if (typ) typ.remove();

      // Resolve question
      const answer = Store.askBiologyTutor(q, {}, currentLanguage);
      
      // Save
      Store.saveAiChat(q, answer);
      
      appendMessage('tutor', answer);

      // Speak if enabled
      if (isTTSActive && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(answer.replace(/[\*#_]/g, ''));
        utterance.lang = currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }

      // Update history list
      chatHistory = Store.getAiChats();
      renderHistoryList();
    }, 600);
  }

  function appendMessage(role, text) {
    const isStudent = role === 'student';
    const bubble = document.createElement('div');
    bubble.className = `tutor-chat-bubble flex-row gap-sm animate-fade-in`;
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'flex-start';
    bubble.style.justifyContent = isStudent ? 'flex-end' : 'flex-start';

    // Format markdown-like tags to standard HTML
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '• $1')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = isStudent ? `
      <div style="background:var(--primary); padding:1rem; border-radius:12px; border-top-right-radius:0; color:white; max-width:80%; font-size:0.95rem; line-height:1.5;">
        ${formatted}
      </div>
      <div style="background:rgba(255,255,255,0.05); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
        <i data-lucide="user" style="color:white; width:18px; height:18px;"></i>
      </div>
    ` : `
      <div style="background:var(--primary); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
        <i data-lucide="bot" style="color:white; width:18px; height:18px;"></i>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:12px; border-top-left-radius:0; border: 1px solid rgba(255,255,255,0.05); color:#f3f4f6; max-width:80%; font-size:0.95rem; line-height:1.5;">
        ${formatted}
      </div>
    `;

    messagesDiv.appendChild(bubble);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderHistoryList() {
    historyListDiv.innerHTML = chatHistory.length === 0 ? `
      <p class="text-muted text-sm text-center" style="margin-top:2rem;">No chats yet. Ask a question to begin!</p>
    ` : chatHistory.map((c) => `
      <div class="history-item card p-sm cursor-pointer" data-chat-id="${c.id}" style="padding: 10px; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
        <strong>Q:</strong> ${c.question}
      </div>
    `).join('');
    bindHistoryClick();
  }
}
