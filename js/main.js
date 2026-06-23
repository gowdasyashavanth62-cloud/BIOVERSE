import { Store } from './store.js';
import { initRouter } from './router.js';
import { seedData } from './data/seed.js';

// ── Seed initial data if first launch ──
if (!Store.isSeeded()) {
  seedData();
  Store.markSeeded();
}

// ── Route Definitions ──
// Each route lazily imports its page module for code-splitting
const routes = {
  '/':                  async (p) => (await import('./pages/home.js')).render(p),
  '/login':             async (p) => (await import('./pages/login.js')).render(p),
  '/signup':            async (p) => (await import('./pages/signup.js')).render(p),
  '/forgot-password':   async (p) => (await import('./pages/forgot-password.js')).render(p),
  '/dashboard':         async (p) => (await import('./pages/dashboard.js')).render(p),
  '/syllabus/:classId': async (p) => (await import('./pages/syllabus.js')).render(p),
  '/chapter/:chapterId':async (p) => (await import('./pages/chapter.js')).render(p),
  '/concept/:conceptId':async (p) => (await import('./pages/concept.js')).render(p),
  '/notes/:chapterId':  async (p) => (await import('./pages/notes.js')).render(p),
  '/questions':         async (p) => (await import('./pages/question-bank.js')).render(p),
  '/questions/:chapterId': async (p) => (await import('./pages/question-bank.js')).render(p),
  '/test/:testId':      async (p) => (await import('./pages/test.js')).render(p),
  '/test-result/:resultId': async (p) => (await import('./pages/test-result.js')).render(p),
  '/tests':             async (p) => (await import('./pages/tests-list.js')).render(p),
  '/progress':          async (p) => (await import('./pages/progress.js')).render(p),
  '/study-planner':     async (p) => (await import('./pages/study-planner.js')).render(p),
  '/diagrams':          async (p) => (await import('./pages/diagrams.js')).render(p),
  '/diagram-quiz/:id':  async (p) => (await import('./pages/diagram-quiz.js')).render(p),
  '/pyq':               async (p) => (await import('./pages/pyq-center.js')).render(p),
  '/analytics/kcet':    async (p) => (await import('./pages/analytics-kcet.js')).render(p),
  '/analytics/neet':    async (p) => (await import('./pages/analytics-neet.js')).render(p),
  '/profile':           async (p) => (await import('./pages/profile.js')).render(p),
  '/pricing':           async (p) => (await import('./pages/pricing.js')).render(p),
  '/about':             async (p) => (await import('./pages/static/about.js')).render(p),
  '/contact':           async (p) => (await import('./pages/static/contact.js')).render(p),
  '/privacy':           async (p) => (await import('./pages/static/privacy.js')).render(p),
  '/terms':             async (p) => (await import('./pages/static/terms.js')).render(p),
  '/checkout/:planId':  async (p) => (await import('./pages/checkout.js')).render(p),
  '/payment-success':   async (p) => (await import('./pages/payment-success.js')).render(p),
  '/payment-failure':   async (p) => (await import('./pages/payment-failure.js')).render(p),
  '/subscription':      async (p) => (await import('./pages/subscription.js')).render(p),
  '/certificates':      async (p) => (await import('./pages/certificates.js')).render(p),
  '/certificate/:certId': async (p) => (await import('./pages/certificate-view.js')).render(p),
  '/launch':            async (p) => (await import('./pages/launch.js')).render(p),
  '/settings':          async (p) => (await import('./pages/settings.js')).render(p),
  '/ai-tutor':          async (p) => (await import('./pages/ai-tutor.js')).render(p),
  '/admin':             async (p) => (await import('./pages/admin/admin-dashboard.js')).render(p),
  '/admin/content':     async (p) => (await import('./pages/admin/manage-content.js')).render(p),
  '/admin/videos':      async (p) => (await import('./pages/admin/manage-videos.js')).render(p),
  '/admin/notes':       async (p) => (await import('./pages/admin/manage-notes.js')).render(p),
  '/admin/questions':   async (p) => (await import('./pages/admin/manage-questions.js')).render(p),
  '/admin/pyqs':        async (p) => (await import('./pages/admin/manage-pyqs.js')).render(p),
  '/admin/tests':       async (p) => (await import('./pages/admin/manage-tests.js')).render(p),
  '/admin/students':    async (p) => (await import('./pages/admin/manage-students.js')).render(p),
  '/admin/subscriptions':async (p) => (await import('./pages/admin/manage-subscriptions.js')).render(p),
  '/admin/analytics':   async (p) => (await import('./pages/admin/analytics.js')).render(p),
  '/admin/settings':    async (p) => (await import('./pages/admin/settings.js')).render(p),
};

// ── Initialize ──
initRouter(routes);
