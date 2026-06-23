/**
 * BioVerse Charts Component
 * Wrappers for Chart.js integrations with BioVerse themes.
 */

// Colors used in BioVerse theme
const COLORS = {
  primary: '#0A6847',
  primaryLight: '#4ade80',
  primaryGradientStart: '#22c55e',
  primaryGradientEnd: '#16a34a',
  gray: '#e5e7eb',
  text: '#374151',
  textMuted: '#6b7280'
};

/**
 * Renders a progress ring (doughnut chart) for a specific percentage.
 */
export function renderProgressRing(canvasId, percentage, label = 'Completed') {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [label, 'Remaining'],
      datasets: [{
        data: [percentage, Math.max(0, 100 - percentage)],
        backgroundColor: [
          COLORS.primary,
          COLORS.gray
        ],
        borderWidth: 0,
        hoverOffset: 2
      }]
    },
    options: {
      cutout: '80%',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

/**
 * Renders a bar chart for weekly activity (e.g. hours spent).
 */
export function renderWeeklyActivityChart(canvasId, dataPoints, labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return null;

  // Create gradient
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, COLORS.primaryLight);
  gradient.addColorStop(1, COLORS.primary);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hours Studied',
        data: dataPoints,
        backgroundColor: gradient,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: COLORS.text,
          bodyColor: COLORS.text,
          borderColor: COLORS.gray,
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} hrs`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: COLORS.gray,
            drawBorder: false,
            borderDash: [5, 5]
          },
          ticks: { color: COLORS.textMuted }
        },
        x: {
          grid: { display: false },
          ticks: { color: COLORS.textMuted }
        }
      }
    }
  });
}

/**
 * Renders a line chart for score trends over time.
 */
export function renderScoreTrendChart(canvasId, dataPoints, labels) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return null;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Score %',
        data: dataPoints,
        borderColor: COLORS.primary,
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: COLORS.primary,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: COLORS.text,
          bodyColor: COLORS.text,
          borderColor: COLORS.gray,
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: COLORS.gray,
            drawBorder: false
          },
          ticks: { color: COLORS.textMuted }
        },
        x: {
          grid: { display: false },
          ticks: { color: COLORS.textMuted, maxRotation: 45, minRotation: 45 }
        }
      }
    }
  });
}
