import { getAllJournals, approveJournal, rejectJournal, deleteJournal, updateJournalStatus } from './services/journalService.js';
import { getAllArticles, approveArticle, rejectArticle, deleteArticle, updateArticleStatus } from './services/blogService.js';
import { getPendingJournalSubmissions, getPendingArticleSubmissions } from './services/submissionService.js';
import { getAllScopes, addScope, deleteScope } from './services/scopeService.js';
import { getAllKategori, addKategori, deleteKategori } from './services/kategoriService.js';
import { formatCurrency, formatDate, truncate } from './utils/formatter.js';
import { showSuccess, showError, showLoading, showConfirm } from './utils/notification.js';

console.log('📦 Data module loaded');

// ========== STATS & DASHBOARD ==========
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

// ========== PENDING SUBMISSIONS ==========
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

async function loadPendingArticles() {
  const container = document.getElementById('pendingArtikelTable');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const submissions = await getPendingArticleSubmissions();
    
    if (submissions.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada pending submission</div><p class="empty-state-text">Semua submission artikel sudah diproses</p></div>';
      return;
    }
    
    let html = '<div class="table-container"><table class="table"><thead><tr>';
    html += '<th>Tanggal</th><th>Judul</th><th>Kategori</th><th>Penulis</th><th style="text-align: center;">Aksi</th>';
    html += '</tr></thead><tbody>';
    
    submissions.forEach(sub => {
      html += `<tr>
        <td style="white-space: nowrap;"><small>${formatDate(sub.tanggalSubmit)}</small></td>
        <td><strong style="color: var(--text-primary);">${truncate(sub.judul, 80)}</strong></td>
        <td><span class="badge badge-secondary">${sub.kategori}</span></td>
        <td>${sub.penulis}</td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <button class="btn btn-sm btn-success" onclick="approveArticleSubmission('${sub.id}')">Approve</button>
            <button class="btn btn-sm btn-danger" onclick="rejectArticleSubmission('${sub.id}')">Reject</button>
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

// ========== KELOLA JURNAL ==========
window.loadKelolaJournals = async function() {
  const container = document.getElementById('kelolaJurnalTable');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const journals = await getAllJournals();
    const statusFilter = document.getElementById('filterJurnalStatus')?.value || 'all';
    const filteredJournals = statusFilter === 'all' ? journals : journals.filter(j => j.status === statusFilter);
    
    if (filteredJournals.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada jurnal</div><p class="empty-state-text">Belum ada jurnal yang ditambahkan</p></div>';
      return;
    }
    
    let html = '<div class="table-container"><table class="table"><thead><tr>';
    html += '<th>Nama Jurnal</th><th>Instansi</th><th>Akreditasi</th><th>Scope</th><th>Harga</th><th>Fast Track</th><th>Status</th><th style="text-align: center; min-width: 200px;">Aksi</th>';
    html += '</tr></thead><tbody>';
    
    filteredJournals.forEach(j => {
      const statusBadge = j.status === 'active' ? 
        '<span class="badge badge-success">Active</span>' : 
        '<span class="badge badge-gray">Inactive</span>';
      
      const statusAction = j.status === 'active' ?
        `<button class="btn btn-sm btn-outline" onclick="toggleJournalStatus('${j.id}', 'inactive')" title="Nonaktifkan">⏸️</button>` :
        `<button class="btn btn-sm btn-outline" onclick="toggleJournalStatus('${j.id}', 'active')" title="Aktifkan">▶️</button>`;
      
      html += `<tr>
        <td><strong style="color: var(--text-primary);">${j.nama}</strong></td>
        <td>${j.instansi}</td>
        <td><span class="badge badge-primary">${j.akreditasi}</span></td>
        <td><span class="badge badge-secondary">${j.scope || '-'}</span></td>
        <td style="white-space: nowrap;">${formatCurrency(j.harga)}</td>
        <td>${j.fastTrack ? '<span class="badge badge-success">Ya</span>' : '<span class="badge badge-gray">Tidak</span>'}</td>
        <td>${statusBadge}</td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <a href="edit-jurnal.html?id=${j.id}" class="btn btn-sm btn-primary" title="Edit">✏️ Edit</a>
            ${statusAction}
            <button class="btn btn-sm btn-danger" onclick="deleteJournalConfirm('${j.id}', '${j.nama}')" title="Hapus">🗑️</button>
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
};

// ========== KELOLA ARTIKEL ==========
window.loadKelolaArticles = async function() {
  const container = document.getElementById('kelolaArtikelTable');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const articles = await getAllArticles();
    const statusFilter = document.getElementById('filterArtikelStatus')?.value || 'all';
    const filteredArticles = statusFilter === 'all' ? articles : articles.filter(a => a.status === statusFilter);
    
    if (filteredArticles.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada artikel</div><p class="empty-state-text">Belum ada artikel yang ditambahkan</p></div>';
      return;
    }
    
    let html = '<div class="table-container"><table class="table"><thead><tr>';
    html += '<th>Judul</th><th>Kategori</th><th>Penulis</th><th>Tanggal</th><th>Views</th><th>Status</th><th style="text-align: center; min-width: 200px;">Aksi</th>';
    html += '</tr></thead><tbody>';
    
    filteredArticles.forEach(a => {
      let statusBadge = '<span class="badge badge-gray">Draft</span>';
      if (a.status === 'published') statusBadge = '<span class="badge badge-success">Published</span>';
      if (a.status === 'rejected') statusBadge = '<span class="badge badge-danger">Rejected</span>';
      
      const statusAction = a.status === 'published' ?
        `<button class="btn btn-sm btn-outline" onclick="toggleArticleStatus('${a.id}', 'draft')" title="Unpublish">📝</button>` :
        `<button class="btn btn-sm btn-outline" onclick="toggleArticleStatus('${a.id}', 'published')" title="Publish">📤</button>`;
      
      html += `<tr>
        <td><strong style="color: var(--text-primary);">${truncate(a.judul, 60)}</strong></td>
        <td><span class="badge badge-secondary">${a.kategori}</span></td>
        <td>${a.penulis}</td>
        <td style="white-space: nowrap;"><small>${formatDate(a.tanggalPublish || a.createdAt)}</small></td>
        <td>${a.views || 0}</td>
        <td>${statusBadge}</td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <a href="edit-artikel.html?id=${a.id}" class="btn btn-sm btn-primary" title="Edit">✏️ Edit</a>
            ${statusAction}
            <button class="btn btn-sm btn-danger" onclick="deleteArticleConfirm('${a.id}', '${a.judul}')" title="Hapus">🗑️</button>
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
};

// ========== KELOLA SCOPE ==========
async function loadScopes() {
  const container = document.getElementById('scopeList');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const scopes = await getAllScopes();
    
    if (scopes.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada scope</div><p class="empty-state-text">Belum ada scope yang ditambahkan</p></div>';
      return;
    }
    
    let html = '<div class="badge-list">';
    scopes.forEach(scope => {
      html += `<div class="badge badge-primary" style="padding: 8px 12px; display: flex; gap: 8px; align-items: center;">
        ${scope.nama}
        <button onclick="deleteScopeConfirm('${scope.id}', '${scope.nama}')" class="btn btn-sm" style="padding: 0; background: transparent; border: none; cursor: pointer;" title="Hapus">❌</button>
      </div>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Gagal memuat data</div></div>';
    console.error('Error:', error);
  }
}

// ========== KELOLA KATEGORI ==========
async function loadKategori() {
  const container = document.getElementById('kategoriList');
  container.innerHTML = '<div class="text-center" style="padding: 40px;"><div class="loader" style="margin: 0 auto;"></div></div>';
  
  try {
    const kategoris = await getAllKategori();
    
    if (kategoris.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Tidak ada kategori</div><p class="empty-state-text">Belum ada kategori yang ditambahkan</p></div>';
      return;
    }
    
    let html = '<div class="badge-list">';
    kategoris.forEach(kat => {
      html += `<div class="badge badge-secondary" style="padding: 8px 12px; display: flex; gap: 8px; align-items: center;">
        ${kat.nama}
        <button onclick="deleteKategoriConfirm('${kat.id}', '${kat.nama}')" class="btn btn-sm" style="padding: 0; background: transparent; border: none; cursor: pointer;" title="Hapus">❌</button>
      </div>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Gagal memuat data</div></div>';
    console.error('Error:', error);
  }
}

// ========== EVENT HANDLERS ==========

// Pending submissions
window.approveJournalSubmission = async (id) => {
  const confirmed = await showConfirm('Approve jurnal submission ini?');
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await approveJournal(id);
    hideLoading();
    showSuccess('Jurnal berhasil di-approve!');
    loadStats();
    loadPendingJournals();
  } catch (error) {
    hideLoading();
    showError('Gagal approve jurnal');
    console.error('Error:', error);
  }
};

window.rejectJournalSubmission = async (id) => {
  const confirmed = await showConfirm('Reject jurnal submission ini?');
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await rejectJournal(id);
    hideLoading();
    showSuccess('Jurnal berhasil di-reject');
    loadStats();
    loadPendingJournals();
  } catch (error) {
    hideLoading();
    showError('Gagal reject jurnal');
    console.error('Error:', error);
  }
};

window.approveArticleSubmission = async (id) => {
  const confirmed = await showConfirm('Approve artikel submission ini?');
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await approveArticle(id);
    hideLoading();
    showSuccess('Artikel berhasil di-approve!');
    loadStats();
    loadPendingArticles();
  } catch (error) {
    hideLoading();
    showError('Gagal approve artikel');
    console.error('Error:', error);
  }
};

window.rejectArticleSubmission = async (id) => {
  const confirmed = await showConfirm('Reject artikel submission ini?');
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await rejectArticle(id);
    hideLoading();
    showSuccess('Artikel berhasil di-reject');
    loadStats();
    loadPendingArticles();
  } catch (error) {
    hideLoading();
    showError('Gagal reject artikel');
    console.error('Error:', error);
  }
};

// Kelola Jurnal
window.toggleJournalStatus = async (id, newStatus) => {
  const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
  const confirmed = await showConfirm(`Yakin ${action} jurnal ini?`);
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await updateJournalStatus(id, newStatus);
    hideLoading();
    showSuccess(`Jurnal berhasil di${action}!`);
    window.loadKelolaJournals();
    loadStats();
  } catch (error) {
    hideLoading();
    showError(`Gagal ${action} jurnal`);
    console.error('Error:', error);
  }
};

window.deleteJournalConfirm = async (id, nama) => {
  const confirmed = await showConfirm(`Yakin hapus jurnal "${truncate(nama, 50)}"? Aksi ini tidak bisa dibatalkan!`);
  if (!confirmed) return;
  const hideLoading = showLoading('Menghapus...');
  try {
    await deleteJournal(id);
    hideLoading();
    showSuccess('Jurnal berhasil dihapus!');
    window.loadKelolaJournals();
    loadStats();
  } catch (error) {
    hideLoading();
    showError('Gagal menghapus jurnal');
    console.error('Error:', error);
  }
};

// Kelola Artikel
window.toggleArticleStatus = async (id, newStatus) => {
  const action = newStatus === 'published' ? 'publish' : newStatus === 'rejected' ? 'reject' : 'unpublish';
  const confirmed = await showConfirm(`Yakin ${action} artikel ini?`);
  if (!confirmed) return;
  const hideLoading = showLoading('Memproses...');
  try {
    await updateArticleStatus(id, newStatus);
    hideLoading();
    showSuccess(`Artikel berhasil di-${action}!`);
    window.loadKelolaArticles();
    loadStats();
  } catch (error) {
    hideLoading();
    showError(`Gagal ${action} artikel`);
    console.error('Error:', error);
  }
};

window.deleteArticleConfirm = async (id, judul) => {
  const confirmed = await showConfirm(`Yakin hapus artikel "${truncate(judul, 50)}"? Aksi ini tidak bisa dibatalkan!`);
  if (!confirmed) return;
  const hideLoading = showLoading('Menghapus...');
  try {
    await deleteArticle(id);
    hideLoading();
    showSuccess('Artikel berhasil dihapus!');
    window.loadKelolaArticles();
    loadStats();
  } catch (error) {
    hideLoading();
    showError('Gagal menghapus artikel');
    console.error('Error:', error);
  }
};

// Kelola Scope
window.deleteScopeConfirm = async (id, nama) => {
  const confirmed = await showConfirm(`Yakin hapus scope "${nama}"?`);
  if (!confirmed) return;
  const hideLoading = showLoading('Menghapus...');
  try {
    await deleteScope(id);
    hideLoading();
    showSuccess('Scope berhasil dihapus!');
    loadScopes();
  } catch (error) {
    hideLoading();
    showError('Gagal menghapus scope');
    console.error('Error:', error);
  }
};

// Kelola Kategori
window.deleteKategoriConfirm = async (id, nama) => {
  const confirmed = await showConfirm(`Yakin hapus kategori "${nama}"?`);
  if (!confirmed) return;
  const hideLoading = showLoading('Menghapus...');
  try {
    await deleteKategori(id);
    hideLoading();
    showSuccess('Kategori berhasil dihapus!');
    loadKategori();
  } catch (error) {
    hideLoading();
    showError('Gagal menghapus kategori');
    console.error('Error:', error);
  }
};

// ========== FORM SUBMISSIONS ==========

// Add Scope
document.getElementById('formTambahScope')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = document.getElementById('namaScope').value.trim();
  
  if (!nama) {
    showError('Nama scope tidak boleh kosong');
    return;
  }
  
  const hideLoading = showLoading('Menambahkan scope...');
  try {
    await addScope({ nama });
    hideLoading();
    showSuccess('Scope berhasil ditambahkan!');
    document.getElementById('namaScope').value = '';
    loadScopes();
  } catch (error) {
    hideLoading();
    showError('Gagal menambahkan scope');
    console.error('Error:', error);
  }
});

// Add Kategori
document.getElementById('formTambahKategori')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = document.getElementById('namaKategori').value.trim();
  
  if (!nama) {
    showError('Nama kategori tidak boleh kosong');
    return;
  }
  
  const hideLoading = showLoading('Menambahkan kategori...');
  try {
    await addKategori({ nama });
    hideLoading();
    showSuccess('Kategori berhasil ditambahkan!');
    document.getElementById('namaKategori').value = '';
    loadKategori();
  } catch (error) {
    hideLoading();
    showError('Gagal menambahkan kategori');
    console.error('Error:', error);
  }
});

// Filter listeners
document.getElementById('filterJurnalStatus')?.addEventListener('change', window.loadKelolaJournals);
document.getElementById('filterArtikelStatus')?.addEventListener('change', window.loadKelolaArticles);

// ========== TAB DATA LOADER ==========
window.loadTabData = function(tabName) {
  console.log('📊 Loading data for:', tabName);
  if (tabName === 'dashboard') loadStats();
  if (tabName === 'pendingJurnal') loadPendingJournals();
  if (tabName === 'pendingArtikel') loadPendingArticles();
  if (tabName === 'kelolaJurnal') window.loadKelolaJournals();
  if (tabName === 'kelolaArtikel') window.loadKelolaArticles();
  if (tabName === 'kelolaScope') loadScopes();
  if (tabName === 'kelolaKategori') loadKategori();
};

// Initial load
loadStats();
loadPendingJournals();

console.log('✅ Data module ready');