import { navigateTo } from '../router.js';
import { Store } from '../store.js';
import { Navbar, initNavbar } from '../components/navbar.js';
import { Footer } from '../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .hero-section {
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 50%, #0A6847 100%);
        color: #fff;
        padding: 100px 24px 80px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .hero-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.06) 0%, transparent 50%),
                    radial-gradient(circle at 70% 30%, rgba(255,255,255,0.04) 0%, transparent 50%);
        pointer-events: none;
      }
      .hero-title {
        font-size: 3.2rem;
        font-weight: 800;
        margin-bottom: 16px;
        line-height: 1.15;
        position: relative;
      }
      .hero-subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto 36px;
        line-height: 1.6;
      }
      .hero-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;
      }
      .hero-buttons .btn-hero-primary {
        background: #fff;
        color: #0A6847;
        padding: 14px 36px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1.05rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .hero-buttons .btn-hero-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }
      .hero-buttons .btn-hero-secondary {
        background: rgba(255,255,255,0.15);
        color: #fff;
        padding: 14px 36px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.05rem;
        border: 2px solid rgba(255,255,255,0.3);
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(8px);
      }
      .hero-buttons .btn-hero-secondary:hover {
        background: rgba(255,255,255,0.25);
        transform: translateY(-2px);
      }

      .stats-row {
        display: flex;
        justify-content: center;
        gap: 32px;
        flex-wrap: wrap;
        padding: 48px 24px;
        background: #f8faf9;
        border-bottom: 1px solid #e5e7eb;
      }
      .stat-item {
        text-align: center;
        min-width: 140px;
      }
      .stat-number {
        font-size: 2.2rem;
        font-weight: 800;
        color: #0A6847;
        line-height: 1;
      }
      .stat-label {
        font-size: 0.9rem;
        color: #6b7280;
        margin-top: 6px;
        font-weight: 500;
      }

      .section-title {
        text-align: center;
        font-size: 2rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 8px;
      }
      .section-subtitle {
        text-align: center;
        color: #6b7280;
        font-size: 1.05rem;
        margin-bottom: 48px;
        max-width: 550px;
        margin-left: auto;
        margin-right: auto;
      }

      .features-section {
        padding: 80px 24px;
        max-width: 1100px;
        margin: 0 auto;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }
      .feature-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 32px 28px;
        transition: all 0.25s;
      }
      .feature-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(10,104,71,0.1);
        border-color: #16A34A;
      }
      .feature-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        color: #0A6847;
      }
      .feature-card h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 8px;
      }
      .feature-card p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.6;
      }
      .feature-badge {
        display: inline-block;
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: #92400e;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 20px;
        margin-left: 8px;
        vertical-align: middle;
      }

      .courses-section {
        padding: 80px 24px;
        background: #f8faf9;
      }
      .courses-container {
        max-width: 1100px;
        margin: 0 auto;
      }
      .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
      }
      .course-card-home {
        background: #fff;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        overflow: hidden;
        transition: all 0.25s;
        cursor: pointer;
      }
      .course-card-home:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(10,104,71,0.1);
      }
      .course-card-banner {
        height: 120px;
        background: linear-gradient(135deg, #0A6847, #16A34A);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .course-card-body {
        padding: 20px;
      }
      .course-card-body h3 {
        font-size: 1.1rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 6px;
      }
      .course-card-body p {
        color: #6b7280;
        font-size: 0.88rem;
        line-height: 1.5;
        margin-bottom: 14px;
      }
      .course-card-tag {
        display: inline-block;
        background: #ecfdf5;
        color: #0A6847;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
      }

      .pricing-preview {
        padding: 80px 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .pricing-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 28px;
      }
      .price-card {
        background: #fff;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        padding: 36px 32px;
        position: relative;
        transition: all 0.25s;
      }
      .price-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(10,104,71,0.1);
      }
      .price-card.featured {
        border-color: #16A34A;
        background: linear-gradient(180deg, #f0fdf4, #fff 40%);
      }
      .price-card.featured::before {
        content: 'MOST POPULAR';
        position: absolute;
        top: -14px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0A6847, #16A34A);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 5px 20px;
        border-radius: 20px;
        letter-spacing: 0.5px;
      }
      .price-card h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 4px;
      }
      .price-amount {
        font-size: 2.5rem;
        font-weight: 800;
        color: #0A6847;
        margin: 12px 0 4px;
      }
      .price-period {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 24px;
      }
      .price-features {
        list-style: none;
        padding: 0;
        margin: 0 0 28px;
      }
      .price-features li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        color: #374151;
        font-size: 0.92rem;
      }
      .price-features li i {
        color: #16A34A;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      .testimonials-section {
        padding: 80px 24px;
        background: #f8faf9;
      }
      .testimonials-container {
        max-width: 1100px;
        margin: 0 auto;
      }
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }
      .testimonial-card {
        background: #fff;
        border-radius: 16px;
        padding: 28px;
        border: 1px solid #e5e7eb;
        transition: all 0.25s;
      }
      .testimonial-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      }
      .testimonial-stars {
        color: #f59e0b;
        margin-bottom: 14px;
        display: flex;
        gap: 2px;
      }
      .testimonial-text {
        color: #374151;
        font-size: 0.95rem;
        line-height: 1.65;
        margin-bottom: 18px;
        font-style: italic;
      }
      .testimonial-author {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .testimonial-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        color: #fff;
        flex-shrink: 0;
      }
      .testimonial-name {
        font-weight: 700;
        color: #111;
        font-size: 0.92rem;
      }
      .testimonial-detail {
        color: #6b7280;
        font-size: 0.82rem;
      }

      .final-cta {
        padding: 80px 24px;
        text-align: center;
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
      }
      .final-cta h2 {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 14px;
      }
      .final-cta p {
        opacity: 0.9;
        font-size: 1.1rem;
        margin-bottom: 32px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }

      @media (max-width: 768px) {
        .hero-title { font-size: 2.2rem; }
        .hero-section { padding: 70px 20px 60px; }
        .stats-row { gap: 20px; padding: 32px 20px; }
        .stat-number { font-size: 1.7rem; }
        .section-title { font-size: 1.6rem; }
        .pricing-cards { grid-template-columns: 1fr; }
      }
    </style>

    ${Navbar()}

    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <h1 class="hero-title">Master Biology.<br>Crack KCET & NEET.</h1>
        <p class="hero-subtitle">The complete learning platform for Karnataka PU Board Biology students. Video lectures, detailed notes, question banks, and mock tests — all in one place.</p>
        <div class="hero-buttons">
          <a class="btn-hero-primary" onclick="navigateTo('/signup')">
            <i data-lucide="rocket" style="width:20px;height:20px"></i> Start Learning
          </a>
          <a class="btn-hero-secondary" onclick="navigateTo('/pricing')">
            <i data-lucide="sparkles" style="width:20px;height:20px"></i> Explore Plans
          </a>
        </div>
      </section>

      <!-- Stats Row -->
      <section class="stats-row">
        <div class="stat-item">
          <div class="stat-number">25+</div>
          <div class="stat-label">Chapters</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">250+</div>
          <div class="stat-label">Concepts</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">Practice Questions</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">50+</div>
          <div class="stat-label">Mock Tests</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">10+</div>
          <div class="stat-label">Years of PYQs</div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">Everything You Need to Excel</h2>
        <p class="section-subtitle">Built specifically for Karnataka PU Biology — covering both 1st and 2nd year syllabi with exam-focused content.</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="play-circle" style="width:26px;height:26px"></i></div>
            <h3>Video Lectures</h3>
            <p>High-quality video lessons for every chapter, explained in simple language with diagrams and animations.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="book-open" style="width:26px;height:26px"></i></div>
            <h3>Detailed Notes</h3>
            <p>Comprehensive, exam-ready study notes with key points highlighted and diagrams included.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="help-circle" style="width:26px;height:26px"></i></div>
            <h3>Question Bank</h3>
            <p>Chapter-wise question banks with detailed solutions covering all question types for boards and competitive exams.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="clipboard-check" style="width:26px;height:26px"></i></div>
            <h3>Mock Tests</h3>
            <p>Full-length and chapter-wise mock tests simulating real exam conditions with instant results and analysis.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="bar-chart-2" style="width:26px;height:26px"></i></div>
            <h3>Progress Tracking</h3>
            <p>Track your learning progress, test scores, and study streaks with detailed analytics and insights.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon"><i data-lucide="bot" style="width:26px;height:26px"></i></div>
            <h3>AI Tutor <span class="feature-badge">Coming Soon</span></h3>
            <p>Get instant doubt resolution with our AI-powered tutor trained on PU Biology syllabus content.</p>
          </div>
        </div>
      </section>

      <!-- Courses Section -->
      <section class="courses-section">
        <div class="courses-container">
          <h2 class="section-title">Our Courses</h2>
          <p class="section-subtitle">Structured courses aligned with the Karnataka PU Board syllabus and competitive exam patterns.</p>
          <div class="courses-grid">
            <div class="course-card-home" onclick="navigateTo('/syllabus/pu1')">
              <div class="course-card-banner">
                <i data-lucide="microscope" style="width:48px;height:48px;opacity:0.9"></i>
              </div>
              <div class="course-card-body">
                <h3>1st PU Biology</h3>
                <p>Complete coverage of 1st year PU Biology — Diversity, Structural Organisation, Cell Biology, Plant & Human Physiology.</p>
                <span class="course-card-tag">14 Chapters</span>
              </div>
            </div>
            <div class="course-card-home" onclick="navigateTo('/syllabus/pu2')">
              <div class="course-card-banner" style="background:linear-gradient(135deg,#065f46,#059669)">
                <i data-lucide="dna" style="width:48px;height:48px;opacity:0.9"></i>
              </div>
              <div class="course-card-body">
                <h3>2nd PU Biology</h3>
                <p>Master 2nd year PU Biology — Reproduction, Genetics, Evolution, Biology in Human Welfare, Biotechnology, Ecology.</p>
                <span class="course-card-tag">16 Chapters</span>
              </div>
            </div>
            <div class="course-card-home" onclick="navigateTo('/pricing')">
              <div class="course-card-banner" style="background:linear-gradient(135deg,#0e7490,#06b6d4)">
                <i data-lucide="trophy" style="width:48px;height:48px;opacity:0.9"></i>
              </div>
              <div class="course-card-body">
                <h3>KCET Biology</h3>
                <p>Targeted preparation for KCET Biology with previous year questions, shortcuts, and exam strategies.</p>
                <span class="course-card-tag">Premium</span>
              </div>
            </div>
            <div class="course-card-home" onclick="navigateTo('/pricing')">
              <div class="course-card-banner" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">
                <i data-lucide="target" style="width:48px;height:48px;opacity:0.9"></i>
              </div>
              <div class="course-card-body">
                <h3>NEET Biology</h3>
                <p>Comprehensive NEET Biology prep covering Botany & Zoology with NCERT-based concept deep dives.</p>
                <span class="course-card-tag">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Preview -->
      <section class="pricing-preview">
        <h2 class="section-title">Simple, Transparent Pricing</h2>
        <p class="section-subtitle">Start free, upgrade when you're ready. No hidden charges.</p>
        <div class="pricing-cards">
          <div class="price-card">
            <h3>Free</h3>
            <div class="price-amount">₹0</div>
            <div class="price-period">Forever free</div>
            <ul class="price-features">
              <li><i data-lucide="check"></i> Basic video lectures</li>
              <li><i data-lucide="check"></i> Limited study notes</li>
              <li><i data-lucide="check"></i> 5 questions per chapter</li>
              <li><i data-lucide="check"></i> 1 mock test</li>
              <li><i data-lucide="check"></i> Community support</li>
            </ul>
            <button class="btn btn-secondary" style="width:100%;padding:12px;border-radius:10px;font-weight:600" onclick="navigateTo('/signup')">Get Started Free</button>
          </div>
          <div class="price-card featured">
            <h3>Premium</h3>
            <div class="price-amount">₹299<span style="font-size:1rem;font-weight:500;color:#6b7280">/month</span></div>
            <div class="price-period">or ₹2,499/year (save 30%)</div>
            <ul class="price-features">
              <li><i data-lucide="check"></i> All video lectures</li>
              <li><i data-lucide="check"></i> Complete study notes</li>
              <li><i data-lucide="check"></i> Unlimited questions</li>
              <li><i data-lucide="check"></i> All mock tests</li>
              <li><i data-lucide="check"></i> PYQ access (10+ years)</li>
              <li><i data-lucide="check"></i> Progress tracking & analytics</li>
              <li><i data-lucide="check"></i> Priority support</li>
            </ul>
            <button class="btn btn-primary" style="width:100%;padding:12px;border-radius:10px;font-weight:600" onclick="navigateTo('/signup')">Start Premium</button>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials-section">
        <div class="testimonials-container">
          <h2 class="section-title">What Students Say</h2>
          <p class="section-subtitle">Join thousands of Karnataka PU Biology students who love BioVerse.</p>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-stars">
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
              </div>
              <p class="testimonial-text">"BioVerse made Biology so much easier for me. The video lectures are clear and the notes are perfectly structured for exam preparation. Scored 95+ in my boards!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background:linear-gradient(135deg,#0A6847,#16A34A)">SK</div>
                <div>
                  <div class="testimonial-name">Shreya Kulkarni</div>
                  <div class="testimonial-detail">2nd PU, Bangalore</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-stars">
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
              </div>
              <p class="testimonial-text">"The mock tests are incredible — they simulate the real KCET exam perfectly. The detailed analysis after each test helped me identify my weak areas and improve quickly."</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">RN</div>
                <div>
                  <div class="testimonial-name">Rahul Naik</div>
                  <div class="testimonial-detail">KCET Aspirant, Hubli</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-stars">
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
                <i data-lucide="star" style="width:16px;height:16px;fill:#f59e0b;stroke:#f59e0b"></i>
              </div>
              <p class="testimonial-text">"Best biology learning app for PU students. The chapter-wise question bank with detailed explanations is a game-changer. Highly recommend the Premium plan!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background:linear-gradient(135deg,#0e7490,#06b6d4)">AP</div>
                <div>
                  <div class="testimonial-name">Ananya Patil</div>
                  <div class="testimonial-detail">1st PU, Mysore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="final-cta">
        <h2>Start Your Learning Journey Today</h2>
        <p>Join thousands of students mastering Biology with BioVerse. Your success story starts here.</p>
        <a class="btn-hero-primary" onclick="navigateTo('/signup')" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0A6847;padding:14px 40px;border-radius:12px;font-weight:700;font-size:1.05rem;border:none;cursor:pointer;text-decoration:none;transition:all 0.2s">
          <i data-lucide="arrow-right" style="width:20px;height:20px"></i> Create Free Account
        </a>
      </section>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
