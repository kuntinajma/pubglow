import { protectAdminPage } from './auth.js';
import { db } from './firebase.js';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

await protectAdminPage();

function showToast(title, message, type = 'success') {
  const toast = new bootstrap.Toast(document.getElementById('toast'));
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastBody').textContent = message;
  const toastEl = document.getElementById('toast');
  toastEl.className = 'toast';
  if (type === 'success') toastEl.classList.add('bg-success', 'text-white');
  if (type === 'error') toastEl.classList.add('bg-danger', 'text-white');
  toast.show();
}

async function loadJournalSubmissions() {
  try {
    const q = query(collection(db, 'journal_submissions'), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    document.getElementById('journalCount').textContent = snapshot.size;
    if (snapshot.empty) {
      document.getElementById('journalsList').innerHTML = '<div class="alert alert-info">Semua selesai! Tidak ada submission jurnal.</div>';
      return;
    }
    let html = '';
    snapshot.forEach(d => {
      const data = d.data();
      const scopes = Array.isArray(data.scope) ? data.scope : [data.scope];
      const scopeBadges = scopes.map(s => `<span class="badge bg-secondary" style="font-size:11px">${s}</span>`).join(' ');
      const submittedDate = data.submittedAt ? new Date(data.submittedAt.toDate()).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';
      
      // Fast Track info
      let fastTrackInfo = 'Tidak Ada';
      if (data.fastTrack === 'Ada') {
        fastTrackInfo = data.fastTrackBiaya ? `Ada - Rp ${data.fastTrackBiaya.toLocaleString('id-ID')}` : 'Ada';
      }
      
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="mb-0">${data.nama}</h5>
              <span class="badge bg-warning text-dark">Pending Review</span>
            </div>
            
            <!-- CONTRIBUTOR INFO -->
            <div class="contributor-box">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div>
                  <strong>Kontributor:</strong><br>
                  ${data.contributor?.nama || 'N/A'}<br>
                  <a href="mailto:${data.contributor?.email || ''}">${data.contributor?.email || 'N/A'}</a>
                </div>
                <div style="text-align:right">
                  <strong>Tanggal & Waktu Kirim:</strong><br>
                  ${submittedDate}
                </div>
              </div>
            </div>
            
            <!-- JOURNAL DATA -->
            <div style="border-top:1px solid #dee2e6;padding-top:12px;margin-top:12px">
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Instansi:</div>
                <div>${data.instansi}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Akreditasi:</div>
                <div><span class="badge bg-success">${data.akreditasi}</span></div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Scope:</div>
                <div>${scopeBadges}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Biaya Publikasi:</div>
                <div>Rp ${data.harga?.toLocaleString('id-ID')}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Waktu Review:</div>
                <div>${data.waktuReview}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Frekuensi:</div>
                <div>${data.frekuensi}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Fast Track:</div>
                <div>${fastTrackInfo}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Website:</div>
                <div><a href="${data.tautan}" target="_blank">${data.tautan}</a></div>
              </div>
              ${data.catatan ? `
                <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                  <div style="color:#6c757d;font-weight:500">Catatan:</div>
                  <div style="color:#6c757d;font-style:italic">${data.catatan}</div>
                </div>
              ` : ''}
            </div>
            
            <div class="action-buttons" style="margin-top:16px">
              <button class="btn btn-success btn-sm approve-journal" data-id="${d.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Approve & Publish
              </button>
              <button class="btn btn-danger btn-sm reject-journal" data-id="${d.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('journalsList').innerHTML = html;
    document.querySelectorAll('.approve-journal').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Approve dan publish jurnal ini ke website?')) approveJournal(btn.dataset.id);
      });
    });
    document.querySelectorAll('.reject-journal').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Reject submission ini? Data akan dihapus permanen.')) rejectSubmission('journal_submissions', btn.dataset.id);
      });
    });
  } catch (error) {
    document.getElementById('journalsList').innerHTML = '<div class="alert alert-warning">Belum ada submission atau collection belum dibuat.</div>';
    document.getElementById('journalCount').textContent = '0';
  }
}

async function approveJournal(id) {
  try {
    const submissionDoc = await getDocs(query(collection(db, 'journal_submissions')));
    let submissionData = null;
    submissionDoc.forEach(d => { if (d.id === id) submissionData = d.data(); });
    if (!submissionData) return;
    
    // Create journal with all data from submission
    const journalData = {
      nama: submissionData.nama,
      instansi: submissionData.instansi,
      scope: submissionData.scope,
      akreditasi: submissionData.akreditasi,
      harga: submissionData.harga,
      frekuensi: submissionData.frekuensi,
      waktuReview: submissionData.waktuReview,
      fastTrack: submissionData.fastTrack,
      fastTrackBiaya: submissionData.fastTrackBiaya,
      tautan: submissionData.tautan,
      status: 'aktif',
      timestamp: serverTimestamp(),
      contributedBy: submissionData.contributor
    };
    
    await addDoc(collection(db, 'journals'), journalData);
    await deleteDoc(doc(db, 'journal_submissions', id));
    showToast('Berhasil', 'Jurnal berhasil dipublikasikan!');
    loadJournalSubmissions();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

async function loadArticleSubmissions() {
  try {
    const q = query(collection(db, 'article_submissions'), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    document.getElementById('articleCount').textContent = snapshot.size;
    if (snapshot.empty) {
      document.getElementById('articlesList').innerHTML = '<div class="alert alert-info">Semua selesai! Tidak ada submission artikel.</div>';
      return;
    }
    let html = '';
    snapshot.forEach(d => {
      const data = d.data();
      const submittedDate = data.submittedAt ? new Date(data.submittedAt.toDate()).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';
      
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="mb-0">${data.judul}</h5>
              <span class="badge bg-warning text-dark">Pending Review</span>
            </div>
            
            <!-- CONTRIBUTOR INFO -->
            <div class="contributor-box">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div>
                  <strong>Kontributor:</strong><br>
                  ${data.contributor?.nama || 'N/A'}<br>
                  <a href="mailto:${data.contributor?.email || ''}">${data.contributor?.email || 'N/A'}</a>
                </div>
                <div style="text-align:right">
                  <strong>Tanggal & Waktu Kirim:</strong><br>
                  ${submittedDate}
                </div>
              </div>
            </div>
            
            <!-- ARTICLE DATA -->
            <div style="border-top:1px solid #dee2e6;padding-top:12px;margin-top:12px">
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Kategori:</div>
                <div><span class="badge bg-secondary">${data.kategori}</span></div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500">Penulis:</div>
                <div>${data.penulis}</div>
              </div>
              <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;font-size:13px;margin-bottom:12px">
                <div style="color:#6c757d;font-weight:500">Slug:</div>
                <div><code>${data.slug}</code></div>
              </div>
              <div style="font-size:13px;margin-bottom:6px">
                <div style="color:#6c757d;font-weight:500;margin-bottom:8px">Konten Preview:</div>
                <div class="content-preview" style="font-size:12px;color:#495057">${data.konten}</div>
              </div>
            </div>
            
            <div class="action-buttons" style="margin-top:16px">
              <button class="btn btn-success btn-sm approve-article" data-id="${d.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Approve & Publish
              </button>
              <button class="btn btn-danger btn-sm reject-article" data-id="${d.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('articlesList').innerHTML = html;
    document.querySelectorAll('.approve-article').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Approve dan publish artikel ini ke website?')) approveArticle(btn.dataset.id);
      });
    });
    document.querySelectorAll('.reject-article').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Reject submission ini? Data akan dihapus permanen.')) rejectSubmission('article_submissions', btn.dataset.id);
      });
    });
  } catch (error) {
    document.getElementById('articlesList').innerHTML = '<div class="alert alert-warning">Belum ada submission atau collection belum dibuat.</div>';
    document.getElementById('articleCount').textContent = '0';
  }
}

async function approveArticle(id) {
  try {
    const submissionDoc = await getDocs(query(collection(db, 'article_submissions')));
    let submissionData = null;
    submissionDoc.forEach(d => { if (d.id === id) submissionData = d.data(); });
    if (!submissionData) return;
    
    const articleData = {
      judul: submissionData.judul,
      slug: submissionData.slug,
      kategori: submissionData.kategori,
      penulis: submissionData.penulis,
      konten: submissionData.konten,
      status: 'published',
      tanggalPublish: serverTimestamp(),
      views: 0,
      contributedBy: submissionData.contributor
    };
    
    await addDoc(collection(db, 'articles'), articleData);
    await deleteDoc(doc(db, 'article_submissions', id));
    showToast('Berhasil', 'Artikel berhasil dipublikasikan!');
    loadArticleSubmissions();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

async function rejectSubmission(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    showToast('Berhasil', 'Submission ditolak dan dihapus.');
    if (collectionName === 'journal_submissions') loadJournalSubmissions();
    else loadArticleSubmissions();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

loadJournalSubmissions();
document.getElementById('articles-tab').addEventListener('click', () => loadArticleSubmissions());