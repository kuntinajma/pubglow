import { protectAdminPage } from './auth.js';
import { db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { loadScopes, renderScopeCheckboxes } from './admin-scope-kategori.js';

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

document.getElementById('fastTrackTersedia').addEventListener('change', (e) => {
  document.getElementById('fastTrackBiayaContainer').style.display = e.target.checked ? 'block' : 'none';
});

async function loadScopesForForm() {
  try {
    const scopes = await loadScopes();
    document.getElementById('scopeCheckboxContainer').innerHTML = renderScopeCheckboxes(scopes);
  } catch (error) {
    document.getElementById('scopeCheckboxContainer').innerHTML = '<p class="text-danger mb-0">Error loading scopes</p>';
  }
}

function getSelectedScopes() {
  return Array.from(document.querySelectorAll('.scope-checkbox:checked')).map(cb => cb.value);
}

function getSelectedMonths() {
  return Array.from(document.querySelectorAll('.month-checkbox:checked')).map(cb => cb.value);
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
      const fastTrackText = data.fastTrack?.tersedia ? `Fast Track: Rp ${data.fastTrack.biaya?.toLocaleString('id-ID')}` : 'No fast track';
      let frekuensiText = Array.isArray(data.frekuensi) ? data.frekuensi.join(', ') : data.frekuensi || 'N/A';
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
                <p class="mb-1" style="font-size:12px;color:#6c757d">Rp ${data.harga?.toLocaleString('id-ID')} | ${data.waktuReview} bulan | ${frekuensiText}</p>
                <p class="mb-1" style="font-size:12px;color:#6c757d">${fastTrackText}</p>
                <p class="mb-0" style="font-size:12px"><a href="${data.tautan}" target="_blank">${data.tautan}</a></p>
              </div>
              <div>
                <button class="btn btn-sm btn-warning edit-journal" data-id="${doc.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-journal" data-id="${doc.id}">Hapus</button>
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
    document.getElementById('waktuReview').value = journalData.waktuReview;
    document.getElementById('tautan').value = journalData.tautan;
    document.getElementById('status').value = journalData.status;
    const fastTrackChecked = journalData.fastTrack?.tersedia || false;
    document.getElementById('fastTrackTersedia').checked = fastTrackChecked;
    document.getElementById('fastTrackBiayaContainer').style.display = fastTrackChecked ? 'block' : 'none';
    if (fastTrackChecked) document.getElementById('fastTrackBiaya').value = journalData.fastTrack.biaya || 0;
    await loadScopesForForm();
    const scopes = Array.isArray(journalData.scope) ? journalData.scope : [journalData.scope];
    scopes.forEach(scope => {
      const checkbox = document.querySelector(`.scope-checkbox[value="${scope}"]`);
      if (checkbox) checkbox.checked = true;
    });
    const months = Array.isArray(journalData.frekuensi) ? journalData.frekuensi : [];
    months.forEach(month => {
      const checkbox = document.querySelector(`.month-checkbox[value="${month}"]`);
      if (checkbox) checkbox.checked = true;
    });
    new bootstrap.Modal(document.getElementById('modalJournal')).show();
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
  const form = document.getElementById('formJournal');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const selectedScopes = getSelectedScopes();
  if (selectedScopes.length === 0) { showToast('Error', 'Pilih minimal 1 scope!', 'error'); return; }
  const selectedMonths = getSelectedMonths();
  if (selectedMonths.length === 0) { showToast('Error', 'Pilih minimal 1 bulan!', 'error'); return; }
  const data = {
    nama: document.getElementById('nama').value.trim(),
    instansi: document.getElementById('instansi').value.trim(),
    scope: selectedScopes,
    akreditasi: document.getElementById('akreditasi').value,
    harga: parseInt(document.getElementById('harga').value),
    frekuensi: selectedMonths,
    waktuReview: parseFloat(document.getElementById('waktuReview').value),
    fastTrack: {
      tersedia: document.getElementById('fastTrackTersedia').checked,
      biaya: document.getElementById('fastTrackTersedia').checked ? parseInt(document.getElementById('fastTrackBiaya').value || 0) : 0
    },
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
    bootstrap.Modal.getInstance(document.getElementById('modalJournal')).hide();
    form.reset();
    document.getElementById('journalId').value = '';
    loadJournals();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
});

document.getElementById('modalJournal').addEventListener('hidden.bs.modal', () => {
  document.getElementById('formJournal').reset();
  document.getElementById('journalId').value = '';
  document.getElementById('modalTitle').textContent = 'Tambah Jurnal Baru';
  document.getElementById('fastTrackBiayaContainer').style.display = 'none';
  loadScopesForForm();
});

loadJournals();