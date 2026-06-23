/**
 * BioVerse Badges Component
 * Generates HTML for achievement and premium badges.
 */

export function renderAchievementBadge(id, title, iconSvg, dateEarned) {
  const dateStr = dateEarned ? new Date(dateEarned).toLocaleDateString() : 'In Progress';
  const isLocked = !dateEarned;
  
  return `
    <div class="card glass-panel badge-card ${isLocked ? 'locked opacity-60' : 'animate-pop-in'}" data-badge-id="${id}">
      <div class="card-body flex flex-col items-center text-center gap-3">
        <div class="badge-icon-wrapper ${isLocked ? 'grayscale' : 'premium-gradient'} w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border-2 ${isLocked ? 'border-gray-200' : 'premium-border'} shadow-md">
          ${iconSvg || '<i data-lucide="award"></i>'}
        </div>
        <div class="badge-info">
          <h4 class="font-semibold text-gray-800 text-sm mb-1">${title}</h4>
          <span class="text-xs text-gray-500">${dateStr}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderPremiumTierBadge(tierName) {
  const isPremium = tierName.toLowerCase() === 'premium' || tierName.toLowerCase() === 'pro';
  
  if (!isPremium) {
    return `
      <div class="badge badge-primary">
        <i data-lucide="user"></i> Basic
      </div>
    `;
  }
  
  return `
    <div class="badge premium-gradient text-white animate-premium-glow shadow-sm flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style="background: linear-gradient(135deg, #FFD700 0%, #8A2BE2 100%);">
      <i data-lucide="zap" class="w-3 h-3"></i> ${tierName}
    </div>
  `;
}
