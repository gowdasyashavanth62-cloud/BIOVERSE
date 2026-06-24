import { Store } from '../store.js';
import { navigateTo } from '../router.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Sidebar, initSidebar } from '../components/sidebar.js';

export async function render(params) {
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();
  window.navigateTo = navigateTo;

  let activeCategory = 'All';
  let searchQuery = '';

  async function renderForum() {
    const posts = await Store.getCommunityPosts();
    
    // Filter posts
    let filteredPosts = posts;
    if (activeCategory !== 'All') {
      filteredPosts = filteredPosts.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q)
      );
    }

    const categories = ['All', '1st PU Biology', '2nd PU Biology', 'KCET Biology', 'NEET Biology'];
    const catHtml = categories.map(cat => `
      <button class="tab-btn ${activeCategory === cat ? 'tab-btn-active' : ''}" data-cat="${cat}" style="padding:8px 16px;font-size:13px;border-radius:12px;border:none;background:${activeCategory === cat ? 'var(--primary)' : 'var(--gray-100)'};color:${activeCategory === cat ? 'white' : 'var(--gray-600)'};cursor:pointer;font-family:var(--font-display);font-weight:600;transition:all 0.2s;">
        ${cat}
      </button>
    `).join('');

    const postsHtml = filteredPosts.length === 0
      ? `<div class="card" style="text-align:center;padding:48px;color:var(--gray-400);">
           <i data-lucide="message-square" style="width:48px;height:48px;margin:0 auto 16px auto;opacity:0.5;"></i>
           <p style="font-weight:600;font-size:16px;margin-bottom:8px;">No discussions found</p>
           <p style="font-size:13px;">Be the first to start a conversation in this category!</p>
         </div>`
      : filteredPosts.map(post => {
          const isUpvoted = post.upvotedBy && post.upvotedBy.includes(user.id);
          
          // AI suggestions logic based on keywords
          let aiRecs = [];
          const text = (post.title + ' ' + post.content).toLowerCase();
          if (text.includes('meiosis') || text.includes('cell division') || text.includes('prophase')) {
            aiRecs = [
              { title: 'Concept: Meiosis I (Prophase stages)', path: '#/concept/c_meiosis' },
              { title: 'Chapter Notes: Cell Cycle & Division', path: '#/notes/ch_cell_division' },
              { title: 'Speed MCQ Round: Cell Cycle', path: '#/memory-game' }
            ];
          } else if (text.includes('genetics') || text.includes('inheritance') || text.includes('mendel')) {
            aiRecs = [
              { title: 'Chapter Notes: Principles of Inheritance', path: '#/notes/ch_inheritance' },
              { title: 'NEET Practice Questions: Genetics', path: '#/questions/ch_inheritance' }
            ];
          } else if (text.includes('weightage') || text.includes('kcet') || text.includes('neet')) {
            aiRecs = [
              { title: 'NEET Performance Intelligence', path: '#/analytics/neet' },
              { title: 'KCET Accuracy Analysis', path: '#/analytics/kcet' }
            ];
          } else {
            aiRecs = [
              { title: 'AI Assistant Tutor', path: '#/ai-tutor' },
              { title: 'General Question Bank', path: '#/questions' }
            ];
          }

          const recsHtml = aiRecs.map(rec => `
            <a href="${rec.path}" style="display:inline-flex;align-items:center;gap:6px;background:white;border:1px dashed var(--primary-300);color:var(--primary);padding:6px 12px;border-radius:12px;font-size:11px;font-weight:600;text-decoration:none;margin-right:8px;margin-bottom:6px;transition:all 0.2s;">
              <i data-lucide="link" style="width:10px;height:10px;"></i> ${rec.title}
            </a>
          `).join('');

          return `
            <div class="post-card animate-fade-in" id="post-${post.id}">
              <div class="post-meta">
                <span class="post-category-tag">${post.category}</span>
                <span>·</span>
                <span style="font-weight:600;color:var(--gray-800);">${post.authorName} (${post.authorRole === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'})</span>
                ${post.authorBadge ? `<span style="background:var(--accent-amber);color:white;font-size:9px;padding:2px 6px;border-radius:10px;font-weight:bold;">${post.authorBadge}</span>` : ''}
                <span>·</span>
                <span>${new Date(post.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})}</span>
              </div>
              <h3 style="margin-bottom:8px;font-family:var(--font-display);font-size:16px;color:var(--gray-900);">${post.title}</h3>
              <p style="color:var(--gray-600);font-size:13px;line-height:1.6;margin-bottom:16px;white-space:pre-line;">${post.content}</p>
              
              <!-- AI Recommendations Drawer -->
              <div class="ai-suggestions-box" style="background:var(--primary-50);padding:12px;border-radius:var(--radius-md);margin-bottom:16px;display:none;" id="ai-rec-${post.id}">
                <div style="display:flex;align-items:center;gap:6px;font-weight:bold;font-size:12px;color:var(--primary-900);margin-bottom:8px;font-family:var(--font-display);">
                  <i data-lucide="bot" style="width:14px;height:14px;color:var(--primary);"></i> AI Recommended Resources:
                </div>
                <div style="display:flex;flex-wrap:wrap;">
                  ${recsHtml}
                </div>
              </div>

              <!-- Post Actions -->
              <div style="display:flex;align-items:center;gap:24px;border-top:1px solid var(--gray-100);padding-top:12px;">
                <button class="btn btn-ghost btn-sm upvote-btn" data-id="${post.id}" style="padding:6px 12px;font-size:12px;color:${isUpvoted ? 'var(--primary)' : 'var(--gray-500)'};gap:6px;">
                  <i data-lucide="thumbs-up" style="fill:${isUpvoted ? 'var(--primary)' : 'transparent'};width:14px;height:14px;"></i>
                  <span>${post.upvotes}</span>
                </button>
                <button class="btn btn-ghost btn-sm toggle-comments-btn" data-id="${post.id}" style="padding:6px 12px;font-size:12px;color:var(--gray-500);gap:6px;">
                  <i data-lucide="message-square" style="width:14px;height:14px;"></i>
                  <span>${post.comments ? post.comments.length : 0} Replies</span>
                </button>
                <button class="btn btn-ghost btn-sm ai-suggest-toggle" data-id="${post.id}" style="padding:6px 12px;font-size:12px;color:var(--primary);gap:6px;margin-left:auto;">
                  <i data-lucide="sparkles" style="width:14px;height:14px;"></i>
                  <span>AI Suggest</span>
                </button>
              </div>

              <!-- Comments Section (collapsible) -->
              <div class="comments-section" id="comments-${post.id}" style="display:none;margin-top:16px;border-top:1px dashed var(--gray-200);padding-top:16px;">
                <div class="comments-list" style="display:flex;flex-direction:column;gap:12px;margin-bottom:12px;">
                  ${post.comments.length === 0 
                    ? `<div style="text-align:center;color:var(--gray-400);font-size:12px;padding:12px;">No replies yet. Start the discussion!</div>`
                    : post.comments.map(c => `
                        <div style="background:var(--gray-50);padding:10px 14px;border-radius:var(--radius-md);font-size:12px;border:1px solid var(--gray-100);">
                          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-weight:600;color:var(--gray-800);">${c.authorName} (${c.authorRole === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'})</span>
                            <span style="font-size:9px;color:var(--gray-400);">${new Date(c.date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}</span>
                          </div>
                          <p style="color:var(--gray-700);line-height:1.5;white-space:pre-line;">${c.content}</p>
                        </div>
                      `).join('')
                  }
                </div>
                
                <!-- Add Comment Form -->
                <form class="comment-form" data-id="${post.id}" style="display:flex;gap:8px;">
                  <textarea placeholder="Write a reply..." class="form-input" style="flex-grow:1;min-height:36px;height:36px;padding:8px 12px;font-size:12px;resize:none;border-radius:var(--radius-md);" required></textarea>
                  <button type="submit" class="btn btn-primary btn-sm" style="padding:0 14px;border-radius:var(--radius-md);height:36px;font-size:12px;">Reply</button>
                </form>
              </div>
            </div>
          `;
        }).join('');

    mainContent.innerHTML = `
      <!-- Header -->
      <div class="chapter-header" style="margin-bottom:24px;">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a>
          <i data-lucide="chevron-right"></i>
          <span>Student Community</span>
        </div>
        <h1>👥 Student Discussion Community</h1>
        <p>Ask doubts, discuss concepts, share revision materials, and prepare for KCET/NEET with other students and teachers.</p>
      </div>

      <!-- Categories & Add Post Bar -->
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${catHtml}
        </div>
        <button class="btn btn-primary" id="open-new-post-btn" style="gap:8px;">
          <i data-lucide="plus"></i> New Post
        </button>
      </div>

      <!-- New Post Form Modal (collapsible) -->
      <div id="new-post-box" style="display:none;background:white;border:1.5px solid var(--primary-100);box-shadow:var(--shadow-md);border-radius:var(--radius-lg);padding:20px;margin-bottom:24px;" class="animate-fade-in">
        <h3 style="margin-bottom:12px;font-family:var(--font-display);color:var(--primary-900);">Create a New Discussion Post</h3>
        <form id="new-post-form">
          <div style="display:grid;grid-template-columns:1fr 200px;gap:12px;margin-bottom:12px;">
            <input type="text" id="post-title" placeholder="What is your question or topic?" class="form-input" style="height:40px;" required>
            <select id="post-category" class="form-input" style="height:40px;padding:0 8px;" required>
              <option value="1st PU Biology">1st PU Biology</option>
              <option value="2nd PU Biology">2nd PU Biology</option>
              <option value="KCET Biology" selected>KCET Biology</option>
              <option value="NEET Biology">NEET Biology</option>
            </select>
          </div>
          <textarea id="post-content" placeholder="Provide background context, write your doubt, or describe the concept you want to discuss..." class="form-input" style="min-height:100px;margin-bottom:16px;padding:12px;font-size:13px;" required></textarea>
          <div style="display:flex;justify-content:flex-end;gap:12px;">
            <button type="button" class="btn btn-secondary" id="cancel-post-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Post</button>
          </div>
        </form>
      </div>

      <!-- Feed Grid -->
      <div style="display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:start;">
        <!-- Left Feed -->
        <div class="posts-feed">
          ${postsHtml}
        </div>

        <!-- Right Community Widgets -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- Community Stats -->
          <div class="card" style="padding:16px;">
            <h4 style="font-family:var(--font-display);color:var(--gray-800);margin-bottom:12px;font-size:14px;">Community Stats</h4>
            <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;">
                <span class="text-muted">Total Posts</span>
                <span style="font-weight:600;">${posts.length}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span class="text-muted">Active Users</span>
                <span style="font-weight:600;">48+ online</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span class="text-muted">Teachers Online</span>
                <span style="color:var(--primary);font-weight:600;">3 Online</span>
              </div>
            </div>
          </div>

          <!-- Rules -->
          <div class="card" style="padding:16px;background:var(--primary-50);border-color:var(--primary-100);">
            <h4 style="font-family:var(--font-display);color:var(--primary-900);margin-bottom:8px;font-size:14px;">📋 Guidelines</h4>
            <ul style="padding-left:16px;font-size:11px;color:var(--primary-800);line-height:1.6;display:flex;flex-direction:column;gap:6px;">
              <li>Be polite and support other biology students.</li>
              <li>Search before posting to see if your doubt was already solved.</li>
              <li>Earn +20 XP for every question you post, and +10 XP for helping others.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Re-bind Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind sub-listeners
    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        activeCategory = btn.dataset.cat;
        await renderForum();
      });
    });

    // Toggle comments
    document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const box = document.getElementById(`comments-${id}`);
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      });
    });

    // AI Suggestions Toggle
    document.querySelectorAll('.ai-suggest-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const box = document.getElementById(`ai-rec-${id}`);
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      });
    });

    // Upvotes
    document.querySelectorAll('.upvote-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const isUp = await Store.upvotePost(id);
        await renderForum();
      });
    });

    // Comment submission
    document.querySelectorAll('.comment-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = form.dataset.id;
        const input = form.querySelector('textarea');
        await Store.addCommentToPost(id, input.value);
        await renderForum();
      });
    });

    // New post controls
    const newPostBtn = document.getElementById('open-new-post-btn');
    const cancelPostBtn = document.getElementById('cancel-post-btn');
    const newPostBox = document.getElementById('new-post-box');

    newPostBtn.addEventListener('click', () => {
      newPostBox.style.display = 'block';
      window.scrollTo({ top: newPostBox.offsetTop - 80, behavior: 'smooth' });
    });

    cancelPostBtn.addEventListener('click', () => {
      newPostBox.style.display = 'none';
    });

    const newPostForm = document.getElementById('new-post-form');
    newPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('post-title').value;
      const cat = document.getElementById('post-category').value;
      const content = document.getElementById('post-content').value;
      
      await Store.addCommunityPost(cat, title, content);
      newPostBox.style.display = 'none';
      await renderForum();
    });
  }

  app.innerHTML = `
    ${await Navbar()}
    <div class="app-layout">
      ${Sidebar()}
      <main class="main-content" id="forum-main-content">
        <!-- Forum Content will be rendered dynamically -->
      </main>
    </div>
  `;

  initNavbar();
  initSidebar();
  const mainContent = document.getElementById('forum-main-content');
  await renderForum();
}
