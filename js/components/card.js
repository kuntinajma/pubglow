/**
 * Card Component
 * Blog card component
 */

import { formatDate, formatRelativeTime } from '../utils/formatter.js';

/**
 * Render blog card
 * @param {Object} article - Article data
 * @returns {string} HTML string
 */
export function renderBlogCard(article) {
  return `
    <div class="blog-card" data-id="${article.id}" data-slug="${article.slug}">
      <div class="blog-card-category">${article.kategori}</div>
      <h3 class="blog-card-title">${article.judul}</h3>
      <div class="blog-card-meta">
        <span>👤 ${article.penulis}</span>
        <span>•</span>
        <span>📅 ${formatDate(article.tanggalPublish)}</span>
        ${article.views ? `
          <span>•</span>
          <span>👁️ ${article.views}</span>
        ` : ''}
      </div>
      <p class="blog-card-excerpt">${article.ringkasan}</p>
      <a href="blog-detail.html?id=${article.id}" class="blog-card-link">
        Baca Selengkapnya →
      </a>
    </div>
  `;
}

/**
 * Render journal card (for homepage)
 * @param {Object} journal - Journal data
 * @returns {string} HTML string
 */
export function renderJournalCard(journal) {
  return `
    <div class="card">
      <div class="flex items-center justify-between mb-3">
        <span class="badge badge-primary">${journal.akreditasi}</span>
        ${journal.fastTrack?.tersedia ? `
          <span class="badge badge-success">Fast Track</span>
        ` : ''}
      </div>
      <h4 style="margin-bottom: 8px;">${journal.nama}</h4>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
        ${journal.instansi}
      </p>
      <div style="font-size: 13px; color: var(--text-tertiary);">
        <div>📚 ${journal.scope.join(', ')}</div>
        <div>💰 ${formatCurrency(journal.harga)}</div>
        <div>⏱️ ${journal.waktuReview} bulan</div>
      </div>
    </div>
  `;
}

/**
 * Render stat card (for admin dashboard)
 * @param {Object} stat - Stat data
 * @returns {string} HTML string
 */
export function renderStatCard(stat) {
  const iconClass = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    info: 'info'
  }[stat.type || 'primary'];
  
  return `
    <div class="stat-card">
      <div class="stat-icon ${iconClass}">${stat.icon}</div>
      <div class="stat-content">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    </div>
  `;
}