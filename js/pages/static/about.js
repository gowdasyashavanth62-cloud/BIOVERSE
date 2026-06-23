import { navigateTo } from '../../router.js';
import { Store } from '../../store.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Footer } from '../../components/footer.js';

export function render(params) {
  window.navigateTo = navigateTo;
  const app = document.getElementById('app');
  app.innerHTML = `
    <style>
      .about-hero {
        background: linear-gradient(135deg, #0A6847 0%, #16A34A 100%);
        color: #fff;
        text-align: center;
        padding: 80px 24px 60px;
      }
      .about-hero h1 {
        font-size: 2.6rem;
        font-weight: 800;
        margin-bottom: 12px;
      }
      .about-hero p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 560px;
        margin: 0 auto;
        line-height: 1.6;
      }
      .about-content {
        max-width: 900px;
        margin: 0 auto;
        padding: 60px 24px 80px;
      }
      .about-section {
        margin-bottom: 56px;
      }
      .about-section h2 {
        font-size: 1.6rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .about-section h2 i {
        color: #16A34A;
      }
      .about-section p {
        color: #4b5563;
        font-size: 1rem;
        line-height: 1.75;
        margin-bottom: 12px;
      }
      .mission-card {
        background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
        border: 1px solid #bbf7d0;
        border-radius: 16px;
        padding: 32px;
        margin-bottom: 20px;
      }
      .mission-card p {
        color: #15803d;
        font-size: 1.1rem;
        font-weight: 500;
        font-style: italic;
        line-height: 1.7;
        margin: 0;
      }
      .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .value-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 24px;
        transition: all 0.25s;
      }
      .value-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(10,104,71,0.08);
        border-color: #16A34A;
      }
      .value-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0A6847;
        margin-bottom: 14px;
      }
      .value-card h3 {
        font-size: 1.05rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 6px;
      }
      .value-card p {
        font-size: 0.88rem;
        color: #6b7280;
        line-height: 1.55;
        margin: 0;
      }
      .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 24px;
        margin-top: 20px;
      }
      .team-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 28px;
        text-align: center;
        transition: all 0.25s;
      }
      .team-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      }
      .team-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.3rem;
        color: #fff;
        margin: 0 auto 14px;
      }
      .team-name {
        font-weight: 700;
        color: #111;
        font-size: 1.05rem;
        margin-bottom: 4px;
      }
      .team-role {
        color: #16A34A;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .team-bio {
        color: #6b7280;
        font-size: 0.85rem;
        line-height: 1.5;
      }
      .contact-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .contact-info-card {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 20px;
      }
      .contact-info-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0A6847;
        flex-shrink: 0;
      }
      .contact-info-card h4 {
        font-size: 0.88rem;
        font-weight: 700;
        color: #111;
        margin-bottom: 4px;
      }
      .contact-info-card p {
        font-size: 0.85rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .about-hero h1 { font-size: 2rem; }
        .about-hero { padding: 60px 20px 48px; }
      }
    </style>

    ${Navbar()}

    <main>
      <section class="about-hero">
        <h1>About BioVerse</h1>
        <p>We're on a mission to make Biology learning accessible, engaging, and effective for every Karnataka PU student.</p>
      </section>

      <div class="about-content">
        <!-- Mission -->
        <section class="about-section">
          <h2><i data-lucide="heart" style="width:24px;height:24px"></i> Our Mission</h2>
          <div class="mission-card">
            <p>"To empower every Karnataka Pre-University Biology student with world-class learning resources, enabling them to excel in board exams, crack KCET & NEET, and develop a genuine love for the life sciences."</p>
          </div>
          <p>We believe that quality education should not be limited by geography or financial constraints. BioVerse was born from the idea that every student in Karnataka — whether in Bangalore or a small town — deserves access to the same quality of Biology education.</p>
        </section>

        <!-- What We Offer -->
        <section class="about-section">
          <h2><i data-lucide="layers" style="width:24px;height:24px"></i> What We Offer</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon"><i data-lucide="play-circle" style="width:22px;height:22px"></i></div>
              <h3>Video Lectures</h3>
              <p>Engaging HD video lessons for every chapter with clear explanations and visual aids.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i data-lucide="book-open" style="width:22px;height:22px"></i></div>
              <h3>Study Notes</h3>
              <p>Comprehensive, exam-focused notes with diagrams, tables, and key highlights.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i data-lucide="help-circle" style="width:22px;height:22px"></i></div>
              <h3>Question Banks</h3>
              <p>1000+ practice questions with detailed solutions covering all difficulty levels.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i data-lucide="clipboard-check" style="width:22px;height:22px"></i></div>
              <h3>Mock Tests</h3>
              <p>Simulated exam environments with instant results and performance analytics.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i data-lucide="history" style="width:22px;height:22px"></i></div>
              <h3>Previous Year Papers</h3>
              <p>10+ years of PU Board, KCET, and NEET previous year questions with solutions.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i data-lucide="bar-chart-2" style="width:22px;height:22px"></i></div>
              <h3>Progress Tracking</h3>
              <p>Visual dashboards showing your learning progress, strengths, and areas to improve.</p>
            </div>
          </div>
        </section>

        <!-- Our Team -->
        <section class="about-section">
          <h2><i data-lucide="users" style="width:24px;height:24px"></i> Our Team</h2>
          <p>BioVerse is built by a passionate team of educators, technologists, and Biology enthusiasts who believe in the power of quality education.</p>
          <div class="team-grid">
            <div class="team-card">
              <div class="team-avatar" style="background:linear-gradient(135deg,#0A6847,#16A34A)">DR</div>
              <div class="team-name">Dr. Ramesh Hegde</div>
              <div class="team-role">Chief Academic Officer</div>
              <div class="team-bio">20+ years of teaching PU Biology. Former HOD at a leading Bangalore college.</div>
            </div>
            <div class="team-card">
              <div class="team-avatar" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">PK</div>
              <div class="team-name">Priya Krishnamurthy</div>
              <div class="team-role">Content Lead</div>
              <div class="team-bio">M.Sc. Biotechnology. Creates engaging study material for competitive exams.</div>
            </div>
            <div class="team-card">
              <div class="team-avatar" style="background:linear-gradient(135deg,#0e7490,#06b6d4)">AJ</div>
              <div class="team-name">Arun Joshi</div>
              <div class="team-role">Technology Lead</div>
              <div class="team-bio">Full-stack developer passionate about EdTech and building learner-first platforms.</div>
            </div>
            <div class="team-card">
              <div class="team-avatar" style="background:linear-gradient(135deg,#dc2626,#f97316)">SK</div>
              <div class="team-name">Dr. Sunitha K.</div>
              <div class="team-role">NEET Specialist</div>
              <div class="team-bio">10+ years coaching NEET aspirants. Expert in Genetics and Ecology.</div>
            </div>
          </div>
        </section>

        <!-- Contact Info -->
        <section class="about-section">
          <h2><i data-lucide="mail" style="width:24px;height:24px"></i> Get in Touch</h2>
          <p>We'd love to hear from you! Whether you have questions, feedback, or partnership ideas — reach out anytime.</p>
          <div class="contact-info-grid">
            <div class="contact-info-card">
              <div class="contact-info-icon"><i data-lucide="mail" style="width:20px;height:20px"></i></div>
              <div>
                <h4>Email</h4>
                <p>hello@bioverse.in</p>
              </div>
            </div>
            <div class="contact-info-card">
              <div class="contact-info-icon"><i data-lucide="phone" style="width:20px;height:20px"></i></div>
              <div>
                <h4>Phone</h4>
                <p>+91 80 1234 5678</p>
              </div>
            </div>
            <div class="contact-info-card">
              <div class="contact-info-icon"><i data-lucide="map-pin" style="width:20px;height:20px"></i></div>
              <div>
                <h4>Address</h4>
                <p>123, 4th Cross, Indiranagar<br>Bangalore, Karnataka 560038</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    ${Footer()}
  `;

  initNavbar();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
