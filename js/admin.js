import { getAllJournals, approveJournal, rejectJournal, deleteJournal, updateJournalStatus } from './services/journalService.js';
import { getAllArticles, approveArticle, rejectArticle, deleteArticle, updateArticleStatus } from './services/blogService.js';
import { getPendingJournalSubmissions, getPendingArticleSubmissions } from './services/submissionService.js';
import { getAllScopes, addScope, deleteScope } from './services/scopeService.js';
import { getAllKategori, addKategori, deleteKategori } from './services/kategoriService.js';
import { formatCurrency, formatDate, truncate } from './utils/formatter.js';
import { showSuccess, showError, showLoading, showConfirm } from './utils/notification.js';

console.log('📦 Data module loaded');

async function loadStats() {
  try {
    const [journals, articles, pendingJournals, pendingArticles] = await Promise.all([
      getAllJournals(),
      getAllArticles(),
      getPendingJournalSubmissions(),
      getPendingArticleSubmissions()
    ]);
    
    document.getElementById('statJurnal').textContent = journals.filter(j => j.status === 'active').length;
    document.getElementById('statArtikel').textContent = articles.filter(a => a.status === 'published').length;
    document.getElementById('statPendingJurnal').textContent = pendingJournals.length;
    document.getElementById('statPendingArtikel').textContent = pendingArticles.length;
    
    const recentActivity = document.getElementById('recentActivity');
    let activityHTML = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    
    if (pendingJournals.length > 0) {
      activityHTML += `<div style="padding: 8px; background: var(--bg-secondary); border-radius: 6px;">
        <strong style="color: var(--text-primary);">${pendingJournals.length}</strong> jurnal menunggu review
      </div>`;
    }
    
    if (pendingArticles.length > 0) {
      activityHTML += `<div style="padding: 8px; background: var(--bg-secondary); border-radius: 6px;">
        <strong style="color: var(--text-primary);">${pendingArticles.length}</strong> artikel menunggu review
      </div>`;
    }
    
    if (pendingJournals.length === 0 && pendingArticles.length === 0) {
      activityHTML += '<div style="padding: 16px; text-align: center; color: var(--text-tertiary);">Tidak ada aktivitas pending</div>';
    }
    
    activityHTML += '</div>';
    recentActivity.innerHTML = activityHTML;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadPendingJournals() {
  const container = document.getElementById('pendingJurnalTable');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const submissions = await getPendingJournalSubmissions();
    
    if (submissions.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada pending submission</div><p class="empty-state-text">Semua submission jurnal sudah diproses</p></div>';
      return;
    }
    
    let html = '<div class="table-container"><table class="table"><thead><tr>';
    html += '<th>Tanggal</th><th>Nama Jurnal</th><th>Instansi</th><th>Akreditasi</th><th>Harga</th><th>Pengusul</th><th style="text-align: center;">Aksi</th>';
    html += '</tr></thead><tbody>';
    
    submissions.forEach(sub => {
      html += `<tr>
        <td style="white-space: nowrap;"><small>${formatDate(sub.tanggalSubmit)}</small></td>
        <td><strong style="color: var(--text-primary);">${sub.nama}</strong></td>
        <td>${sub.instansi}</td>
        <td><span class="badge badge-primary">${sub.akreditasi}</span></td>
        <td style="white-space: nowrap;">${formatCurrency(sub.harga)}</td>
        <td><small>${sub.namaPengusul}<br><span style="color: var(--text-tertiary);">${sub.emailPengusul}</span></small></td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <button class="btn btn-sm btn-success" onclick="approveJournalSubmission('${sub.id}')">Approve</button>
            <button class="btn btn-sm btn-danger" onclick="rejectJournalSubmission('${sub.id}')">Reject</button>
          </div>
        </td>
      </tr>`;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Gagal memuat data</div></div>';
    console.error('Error:', error);
  }
}

// Continue with other functions...
// [REST OF ADMIN.JS CODE SIMILAR TO PREVIOUS VERSION]
// Export all window functions

window.loadTabData = function(tabName) {
  console.log('📊 Loading data for:', tabName);
  if (tabName === 'dashboard') loadStats();
  if (tabName === 'pendingJurnal') loadPendingJournals();
  if (tabName === 'kelolaScope') loadScopes();
  if (tabName === 'kelolaKategori') loadKategori();
};

loadStats();
console.log('✅ Data module ready');