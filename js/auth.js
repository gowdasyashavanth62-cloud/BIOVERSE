import { Store } from './store.js';
import { navigateTo } from './router.js';

export function isAuthenticated() {
  return Store.getCurrentUser() !== null;
}

export function isAdmin() {
  const user = Store.getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager' || user.role === 'teacher');
}

export function isSuperAdmin() {
  const user = Store.getCurrentUser();
  return user && (user.role === 'super_admin' || user.role === 'admin');
}

export function isContentManager() {
  const user = Store.getCurrentUser();
  return user && (user.role === 'content_manager' || user.role === 'super_admin' || user.role === 'admin');
}

export function isTeacher() {
  const user = Store.getCurrentUser();
  return user && (user.role === 'teacher' || user.role === 'super_admin' || user.role === 'admin');
}

export function hasPermission(permission) {
  const user = Store.getCurrentUser();
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'admin') return true;
  
  const permissions = {
    content_manager: ['manage_content', 'manage_questions', 'manage_notes', 'manage_videos', 'manage_pyqs'],
    teacher: ['upload_videos', 'upload_notes', 'create_tests']
  };
  
  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes(permission);
}

export function isPremium() {
  const user = Store.getCurrentUser();
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager' || user.role === 'teacher') return true;
  
  if (user.subscription === 'premium') {
    if (user.subscriptionEnd) {
      const expiry = new Date(user.subscriptionEnd);
      if (expiry < new Date()) return false;
    }
    return true;
  }
  return false;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    navigateTo('/login');
    return false;
  }
  return true;
}

export function requireAdmin() {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return false;
  }
  return true;
}

export function getUserInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getAvatarColor(name) {
  if (!name) return '#0A6847';
  const colors = ['#0A6847', '#16A34A', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
}
