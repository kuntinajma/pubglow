import { protectAdminPage } from './auth.js';
import { db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

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

async function loadScopesForForm() {
  try {
    const snapshot = await getDocs(collection(db, 'scopes'));
    if (snapshot.empty) {
      document.getElementById('scopeContainer').innerHTML = '<p class="text-muted mb-0">Belum ada scope. Tambahkan di Scope & Kategori</p>';
      return;
    }
    let html = '<div style="max-height:150px;overflow-y:auto;border:1px solid #dee2e6;border-radius:6px;padding:12px">';
    snapshot.forEach(doc => {
      const scope = doc.data().nama;
      html += `
        <div class="form-check">
          <input class="form-check-input scope-checkbox" type="checkbox" value="${scope}" id="scope_${doc.id}">
          <label class="form-check-label" for="scope_${doc.id}">${scope}</label>
        </div>
      `;
    });
    html += '</div>';
    document.getElementById('scopeContainer').innerHTML = html;
  } catch (error) {
    document.getElementById('scopeContainer').innerHTML = '<p class="text-danger mb-0">Error loading scopes</p>';
  }
}

function getSelectedScopes() {
  return Array.from(document.querySelectorAll('.scope-checkbox:checked')).map(cb => cb.value);
}

loadScopesForForm();

async function loadJournals() {
  try {
    const q = query(collection(db, 'journals'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      document.getElementById('journalsList').innerHTML = '<div class="alert alert-info">Belum ada jurnal. Klik "Tambah Jurnal Baru"!</div>';
      return;
    }
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const scopes = Array.isArray(data.scope) ? data.scope : [data.scope];
      const scopeBadges = scopes.map(s => `<span class="badge bg-secondary" style="font-size:11px">${s}</span>`).join(' ');
      const isAktif = data.status === 'aktif';
      const statusBadge = isAktif ? '<span class="badge bg-success">Aktif</span>' : '<span class="badge bg-secondary">Hidden</span>';
      
      // Handle Fast Track
      let fastTrackText = 'No Fast Track';
      if (data.fastTrack === 'Ada' && data.fastTrackBiaya) {
        fastTrackText = `Fast Track: Rp ${data.fastTrackBiaya.toLocaleString('id-ID')}`;
      } else if (data.fastTrack === 'Ada') {
        fastTrackText = 'Fast Track: Tersedia';
      }
      
      html += `
        <div class="card mb-3" data-id="${doc.id}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h5 class="mb-2">${data.nama}</h5>
                <p class="mb-2" style="font-size:13px;color:#6c757d">
                  <strong>${data.instansi}</strong> | <span class="badge bg-success">${data.akreditasi}</span> | ${statusBadge}
                </p>
                <p class="mb-1" style="font-size:12px;color:#6c757d">Scope: ${scopeBadges}</p>
                <p class="mb-1" style="font-size:12px;color:#6c757d">Rp ${data.harga?.toLocaleString('id-ID')} | ${data.waktuReview} | ${data.frekuensi}</p>
                <p class="mb-1" style="font-size:12px;color:#6c757d">${fastTrackText}</p>
                <p class="mb-0" style="font-size:12px"><a href="${data.tautan}" target="_blank">${data.tautan}</a></p>
              </div>
              <div class="action-buttons">
                <button class="btn btn-action btn-action-edit edit-journal" data-id="${doc.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button class="btn btn-action btn-action-delete delete-journal" data-id="${doc.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('journalsList').innerHTML = html;
    attachEventListeners();
  } catch (error) {
    document.getElementById('journalsList').innerHTML = '<div class="alert alert-warning">Collection belum ada. Tambahkan jurnal pertama!</div>';
  }
}

function attachEventListeners() {
  document.querySelectorAll('.edit-journal').forEach(btn => {
    btn.addEventListener('click', () => editJournal(btn.dataset.id));
  });
  document.querySelectorAll('.delete-journal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Yakin hapus jurnal ini?')) deleteJournal(btn.dataset.id);
    });
  });
}

async function editJournal(id) {
  try {
    const docSnap = await getDocs(collection(db, 'journals'));
    let journalData = null;
    docSnap.forEach(d => { if (d.id === id) journalData = d.data(); });
    if (!journalData) return;
    
    document.getElementById('journalId').value = id;
    document.getElementById('modalTitle').textContent = 'Edit Jurnal';
    document.getElementById('nama').value = journalData.nama;
    document.getElementById('instansi').value = journalData.instansi;
    document.getElementById('akreditasi').value = journalData.akreditasi;
    document.getElementById('harga').value = journalData.harga;
    document.getElementById('frekuensi').value = journalData.frekuensi || '';
    document.getElementById('waktuReview').value = journalData.waktuReview;
    document.getElementById('tautan').value = journalData.tautan;
    document.getElementById('status').value = journalData.status;
    
    // Handle Fast Track checkbox
    const fastTrackChecked = journalData.fastTrack === 'Ada';
    document.getElementById('fastTrack').checked = fastTrackChecked;
    document.getElementById('fastTrackPriceWrapper').classList.toggle('show', fastTrackChecked);
    if (fastTrackChecked && journalData.fastTrackBiaya) {
      document.getElementById('fastTrackBiaya').value = journalData.fastTrackBiaya;
    }
    
    // Load scopes and check
    await loadScopesForForm();
    const scopes = Array.isArray(journalData.scope) ? journalData.scope : [journalData.scope];
    scopes.forEach(scope => {
      const checkbox = document.querySelector(`.scope-checkbox[value="${scope}"]`);
      if (checkbox) checkbox.checked = true;
    });
    
    new bootstrap.Modal(document.getElementById('modalJurnal')).show();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

async function deleteJournal(id) {
  try {
    await deleteDoc(doc(db, 'journals', id));
    showToast('Berhasil', 'Jurnal berhasil dihapus!');
    loadJournals();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

document.getElementById('btnSaveJournal').addEventListener('click', async () => {
  const form = document.getElementById('formJurnal');
  if (!form.checkValidity()) { 
    form.reportValidity(); 
    return; 
  }
  
  const selectedScopes = getSelectedScopes();
  if (selectedScopes.length === 0) { 
    showToast('Error', 'Pilih minimal 1 scope!', 'error'); 
    return; 
  }
  
  const fastTrackChecked = document.getElementById('fastTrack').checked;
  const fastTrackBiaya = fastTrackChecked ? parseInt(document.getElementById('fastTrackBiaya').value || 0) : null;
  
  const data = {
    nama: document.getElementById('nama').value.trim(),
    instansi: document.getElementById('instansi').value.trim(),
    scope: selectedScopes,
    akreditasi: document.getElementById('akreditasi').value,
    harga: parseInt(document.getElementById('harga').value),
    frekuensi: document.getElementById('frekuensi').value,
    waktuReview: document.getElementById('waktuReview').value,
    fastTrack: fastTrackChecked ? 'Ada' : 'Tidak Ada',
    fastTrackBiaya: fastTrackBiaya,
    tautan: document.getElementById('tautan').value.trim(),
    status: document.getElementById('status').value,
    timestamp: serverTimestamp()
  };
  
  try {
    const journalId = document.getElementById('journalId').value;
    if (journalId) {
      await updateDoc(doc(db, 'journals', journalId), data);
      showToast('Berhasil', 'Jurnal diupdate!');
    } else {
      await addDoc(collection(db, 'journals'), data);
      showToast('Berhasil', 'Jurnal ditambahkan!');
    }
    bootstrap.Modal.getInstance(document.getElementById('modalJurnal')).hide();
    form.reset();
    document.getElementById('journalId').value = '';
    loadJournals();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
});

document.getElementById('modalJurnal').addEventListener('hidden.bs.modal', () => {
  document.getElementById('formJurnal').reset();
  document.getElementById('journalId').value = '';
  document.getElementById('modalTitle').textContent = 'Tambah Jurnal Baru';
  document.getElementById('fastTrackPriceWrapper').classList.remove('show');
  loadScopesForForm();
});

loadJournals();