import { Store } from './store.js';
import { AIWidget } from './components/ai-widget.js';

const routes = {};
let currentCleanup = null;
let isTransitioning = false;

export function navigateTo(path) {
  window.location.hash = '#' + path;
}

export function getHash() {
  return window.location.hash.slice(1) || '/';
}

export function getCurrentParams() {
  const hash = getHash();
  const match = matchRoute(hash);
  return match ? match.params : {};
}

function matchRoute(hash) {
  // Exact match
  if (routes[hash]) return { handler: routes[hash], params: {}, path: hash };

  // Parameterized match
  for (const [pattern, handler] of Object.entries(routes)) {
    if (!pattern.includes(':')) continue;
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');
    if (patternParts.length !== hashParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
      } else if (patternParts[i] !== hashParts[i]) {
        match = false;
        break;
      }
    }
    if (match) return { handler, params, path: pattern };
  }
  return null;
}

// Public routes that don't require auth
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/pricing', '/about', '/contact', '/privacy', '/terms', '/launch'];

// Admin-only routes
const ADMIN_ROUTES = ['/admin', '/admin/content', '/admin/questions', '/admin/tests', '/admin/students'];

async function handleRoute() {
  if (isTransitioning) return;
  isTransitioning = true;

  const hash = getHash();
  const match = matchRoute(hash);

  if (!match) {
    isTransitioning = false;
    navigateTo('/');
    return;
  }

  // Auth guards
  const user = Store.getCurrentUser();
  const isPublic = PUBLIC_ROUTES.includes(hash);
  const isAdminRoute = ADMIN_ROUTES.some(r => hash === r || hash.startsWith(r + '/'));

  if (!isPublic && !user) {
    isTransitioning = false;
    navigateTo('/login');
    return;
  }

  const isStaff = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager' || user.role === 'teacher');
  if (isAdminRoute && (!user || !isStaff)) {
    isTransitioning = false;
    navigateTo('/dashboard');
    return;
  }

  // Redirect logged-in users from auth pages to dashboard
  if (user && (hash === '/login' || hash === '/signup')) {
    isTransitioning = false;
    navigateTo('/dashboard');
    return;
  }

  // Cleanup previous page
  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.warn('Cleanup error:', e); }
    currentCleanup = null;
  }

  // Page transition
  const app = document.getElementById('app');
  app.style.opacity = '0';
  app.style.transform = 'translateY(8px)';

  await new Promise(r => setTimeout(r, 150));

  try {
    const cleanup = await match.handler(match.params);
    if (typeof cleanup === 'function') currentCleanup = cleanup;
  } catch (err) {
    console.error('Route handler error:', err);
    app.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:var(--font-body);">
        <div style="text-align:center;padding:2rem;">
          <h1 style="font-size:2rem;color:var(--gray-800);margin-bottom:1rem;">Something went wrong</h1>
          <p style="color:var(--gray-500);margin-bottom:1.5rem;">${err.message}</p>
          <a href="#/" style="color:var(--primary);font-weight:600;">Go Home</a>
        </div>
      </div>`;
  }

  // Animate in
  requestAnimationFrame(() => {
    app.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Initialize Lucide icons if available
  if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 50);
  }

  // Inject or clean up AI Widget
  if (user && user.role === 'student') {
    setTimeout(() => {
      try {
        AIWidget.inject();
        AIWidget.detectContext();
      } catch (e) {
        console.warn('AIWidget inject error:', e);
      }
    }, 100);
  } else {
    const widget = document.getElementById('ai-floating-assistant');
    if (widget) widget.remove();
    const drawer = document.getElementById('ai-assistant-drawer');
    if (drawer) drawer.remove();
  }

  isTransitioning = false;
}

export function initRouter(routeConfig) {
  for (const [path, handler] of Object.entries(routeConfig)) {
    routes[path] = handler;
  }
  window.addEventListener('hashchange', handleRoute);

  // Handle initial route
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  }
  handleRoute();
}
