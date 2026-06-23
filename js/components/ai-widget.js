import { Store } from '../store.js';
import { showToast } from './toast.js';

export const AIWidget = {
  inject() {
    // Check if already injected
    if (document.getElementById('ai-floating-assistant')) return;

    // Inject self-contained styles
    const style = document.createElement('style');
    style.id = 'ai-widget-styles';
    style.textContent = `
      .ai-floating-btn {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary) 0%, #10b981 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .ai-floating-btn:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 15px 30px rgba(16, 185, 129, 0.6);
      }
      .ai-drawer {
        position: fixed;
        bottom: 100px;
        right: 25px;
        width: 380px;
        height: 520px;
        border-radius: 1.25rem;
        background: rgba(30, 41, 59, 0.85);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: aiSlideUp 0.3s ease-out;
      }
      @keyframes aiSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ai-drawer-header {
        padding: 1.25rem;
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ai-drawer-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ai-drawer-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s;
      }
      .ai-drawer-close:hover {
        color: white;
      }
      .ai-drawer-body {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .ai-context-indicator {
        padding: 6px 10px;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 8px;
        font-size: 0.75rem;
        color: #34d399;
        margin-bottom: 0.5rem;
      }
      .ai-chat-messages {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        padding-right: 4px;
      }
      .ai-msg {
        max-width: 85%;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        line-height: 1.4;
      }
      .ai-msg.tutor {
        background: rgba(255, 255, 255, 0.05);
        color: #f3f4f6;
        align-self: flex-start;
        border-bottom-left-radius: 2px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .ai-msg.student {
        background: var(--primary);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
      }
      .ai-quick-chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: auto;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      .ai-chip {
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.2s;
      }
      .ai-chip:hover {
        background: rgba(16, 185, 129, 0.1);
        border-color: var(--primary);
        color: #34d399;
      }
      .ai-drawer-footer {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .ai-typing-indicator {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
        padding-left: 5px;
      }
    `;
    document.head.appendChild(style);

    // Create Widget Button
    const btn = document.createElement('div');
    btn.id = 'ai-floating-assistant';
    btn.className = 'ai-floating-btn';
    btn.innerHTML = `<i data-lucide="bot" style="width:28px; height:28px;"></i>`;
    document.body.appendChild(btn);

    // Create Drawer Layout
    const drawer = document.createElement('div');
    drawer.id = 'ai-assistant-drawer';
    drawer.className = 'ai-drawer';
    drawer.style.display = 'none';
    drawer.innerHTML = `
      <div class="ai-drawer-header">
        <h3>🤖 AI Biology Assistant</h3>
        <button class="ai-drawer-close" id="aiDrawerCloseBtn">&times;</button>
      </div>
      <div class="ai-drawer-body">
        <div class="ai-context-indicator" id="aiContextIndicator">
          <i data-lucide="book-open" style="width:12px; height:12px; vertical-align:middle; display:inline-block; margin-right:4px;"></i>
          Context: General Biology
        </div>
        <div class="ai-chat-messages" id="aiWidgetMessages">
          <div class="ai-msg tutor">Hello! I am your AI Biology Assistant. How can I help you today?</div>
        </div>
        <div class="ai-quick-chips" id="aiQuickChips">
          <div class="ai-chip" data-q="Explain Photosynthesis">Explain Photosynthesis</div>
          <div class="ai-chip" data-q="Explain DNA Replication">Explain DNA Replication</div>
          <div class="ai-chip" data-q="Memory trick for Mitosis">Memory trick for Mitosis</div>
        </div>
      </div>
      <div class="ai-drawer-footer">
        <div class="flex-row gap-xs mb-xs" style="justify-content: space-between; align-items:center; margin-bottom: 8px;">
          <select id="aiWidgetLanguage" class="form-control" style="width:auto; padding:0.2rem 0.5rem; font-size:0.75rem; background: rgba(30, 41, 59, 0.85); color:white; border: 1px solid rgba(255,255,255,0.1);">
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
          <div class="flex-row gap-xs">
            <button id="aiWidgetMic" class="btn btn-sm btn-ghost" style="padding: 4px 8px; color:rgba(255, 255, 255, 0.7);" title="Voice Input"><i data-lucide="mic" style="width:14px; height:14px;"></i></button>
            <button id="aiWidgetTTS" class="btn btn-sm btn-ghost" style="padding: 4px 8px; color:rgba(255, 255, 255, 0.7);" title="Toggle Speak Responses"><i data-lucide="volume-2" style="width:14px; height:14px;"></i></button>
          </div>
        </div>
        <div class="flex-row gap-xs" style="display:flex; gap:8px;">
          <input type="text" id="aiWidgetInput" class="form-control" placeholder="Ask a biology doubt..." style="flex:1; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); color:white; font-size:0.85rem; padding: 6px 12px; border-radius: 8px;">
          <button id="aiWidgetSend" class="btn btn-primary" style="padding: 6px 12px; border-radius:8px;"><i data-lucide="send" style="width:14px; height:14px;"></i></button>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Bind Event Listeners
    btn.addEventListener('click', () => {
      if (drawer.style.display === 'none') {
        this.open();
      } else {
        this.close();
      }
    });

    const closeBtn = document.getElementById('aiDrawerCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Send Button
    const sendBtn = document.getElementById('aiWidgetSend');
    const inputField = document.getElementById('aiWidgetInput');
    if (sendBtn && inputField) {
      sendBtn.addEventListener('click', () => this.handleSubmit());
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSubmit();
      });
    }

    // Quick Chips click
    this.bindChipClicks();

    // TTS Button Toggle
    let isTtsActive = false;
    const ttsBtn = document.getElementById('aiWidgetTTS');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        isTtsActive = !isTtsActive;
        ttsBtn.style.color = isTtsActive ? '#10b981' : 'rgba(255, 255, 255, 0.7)';
        showToast(isTtsActive ? 'Speech output enabled' : 'Speech output disabled', 'info');
      });
    }

    // Speech Recognition
    const micBtn = document.getElementById('aiWidgetMic');
    if (micBtn) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          micBtn.style.color = '#dc2626'; // red
          inputField.placeholder = "Listening...";
        };

        rec.onend = () => {
          micBtn.style.color = 'rgba(255, 255, 255, 0.7)';
          inputField.placeholder = "Ask a biology doubt...";
        };

        rec.onresult = (event) => {
          const text = event.results[0][0].transcript;
          inputField.value = text;
          this.handleSubmit();
        };

        micBtn.addEventListener('click', () => {
          try {
            rec.start();
          } catch {
            rec.stop();
          }
        });
      } else {
        micBtn.style.display = 'none';
      }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  bindChipClicks() {
    document.querySelectorAll('#aiQuickChips .ai-chip').forEach(chip => {
      chip.replaceWith(chip.cloneNode(true)); // remove old listeners
    });
    document.querySelectorAll('#aiQuickChips .ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.textContent.trim();
        this.askTutor(question);
      });
    });
  },

  open() {
    const drawer = document.getElementById('ai-assistant-drawer');
    if (drawer) {
      drawer.style.display = 'flex';
      this.detectContext();
    }
  },

  close() {
    const drawer = document.getElementById('ai-assistant-drawer');
    if (drawer) drawer.style.display = 'none';
  },

  setChips(chipQuestions) {
    const container = document.getElementById('aiQuickChips');
    if (!container) return;
    container.innerHTML = chipQuestions.map(q => `<div class="ai-chip">${q}</div>`).join('');
    this.bindChipClicks();
  },

  detectContext() {
    const hash = window.location.hash || '';
    const indicator = document.getElementById('aiContextIndicator');
    if (!indicator) return;

    let context = { chapterTitle: 'General Biology', classLabel: '' };
    let chips = ['Explain Photosynthesis', 'Explain DNA Replication', 'Memory trick for Mitosis'];
    
    if (hash.includes('/chapter/')) {
      const parts = hash.split('/');
      const chapterId = parts[parts.length - 1];
      const chapter = Store.getChapter(chapterId);
      if (chapter) {
        context.chapterTitle = chapter.title;
        context.classLabel = chapter.classId === 'pu1' ? '1st PU' : '2nd PU';
        indicator.innerHTML = `<i data-lucide="book-open" style="width:12px; height:12px; vertical-align:middle; display:inline-block; margin-right:4px;"></i> Chapter: ${chapter.title} (${context.classLabel})`;
        chips = ['Explain this chapter', 'NCERT points for this chapter', 'Common Board Questions'];
      }
    } else if (hash.includes('/concept/')) {
      const parts = hash.split('/');
      const conceptId = parts[parts.length - 1];
      const concept = Store.getConcept(conceptId);
      if (concept) {
        context.chapterTitle = concept.chapterTitle || 'Syllabus';
        indicator.innerHTML = `<i data-lucide="layers" style="width:12px; height:12px; vertical-align:middle; display:inline-block; margin-right:4px;"></i> Concept: ${concept.title}`;
        chips = [`Explain ${concept.title}`, `Memory trick for ${concept.title}`, `NEET MCQ on ${concept.title}`];
      }
    } else if (hash.includes('/notes/')) {
      const parts = hash.split('/');
      const chapterId = parts[parts.length - 1];
      const chapter = Store.getChapter(chapterId);
      if (chapter) {
        context.chapterTitle = chapter.title;
        indicator.innerHTML = `<i data-lucide="file-text" style="width:12px; height:12px; vertical-align:middle; display:inline-block; margin-right:4px;"></i> Notes: ${chapter.title}`;
        chips = ['Summarize this note', 'Important highlights', 'Last minute sheet'];
      }
    } else {
      indicator.innerHTML = `<i data-lucide="globe" style="width:12px; height:12px; vertical-align:middle; display:inline-block; margin-right:4px;"></i> Context: General Syllabus`;
    }
    
    this.currentContext = context;
    this.setChips(chips);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  handleSubmit() {
    const inputField = document.getElementById('aiWidgetInput');
    const text = inputField.value.trim();
    if (!text) return;
    inputField.value = '';
    this.askTutor(text);
  },

  askTutor(text) {
    const messages = document.getElementById('aiWidgetMessages');
    if (!messages) return;

    // Append Student Message
    const sMsg = document.createElement('div');
    sMsg.className = 'ai-msg student animate-fade-in';
    sMsg.textContent = text;
    messages.appendChild(sMsg);
    messages.scrollTop = messages.scrollHeight;

    // Show Typing Indicator
    const typing = document.createElement('div');
    typing.className = 'ai-typing-indicator animate-fade-in';
    typing.id = 'aiWidgetTyping';
    typing.textContent = 'Tutor is thinking...';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    const language = document.getElementById('aiWidgetLanguage').value || 'en';

    setTimeout(() => {
      // Remove typing
      const tEl = document.getElementById('aiWidgetTyping');
      if (tEl) tEl.remove();

      // Get Answer
      const response = Store.askBiologyTutor(text, this.currentContext || {}, language);
      
      // Save to chat history
      Store.saveAiChat(text, response);

      // Append Tutor Message
      const tMsg = document.createElement('div');
      tMsg.className = 'ai-msg tutor animate-fade-in';
      
      // Convert markdown-like headers and lists to basic HTML
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*?)$/gm, '• $1')
        .replace(/\n/g, '<br>');

      tMsg.innerHTML = formattedResponse;
      messages.appendChild(tMsg);
      messages.scrollTop = messages.scrollHeight;

      // Speak if enabled
      const ttsBtn = document.getElementById('aiWidgetTTS');
      const isSpeakActive = ttsBtn && ttsBtn.style.color === 'rgb(16, 185, 129)'; // Active green
      if (isSpeakActive && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(response.replace(/[\*#_]/g, ''));
        utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }, 600);
  }
};
