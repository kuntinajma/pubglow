import { protectAdminPage } from './auth.js';
import { db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { loadKategoriArtikel, renderKategoriDropdown } from './admin-scope-kategori.js';

await protectAdminPage();

let quill;
function initQuillEditor() {
  quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Tulis konten artikel...',
    modules: {
      toolbar: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  });
}

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

document.getElementById('judul').addEventListener('input', (e) => {
  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  document.getElementById('slug').value = slug;
});

async function loadKategoriForForm() {
  try {
    const kategori = await loadKategoriArtikel();
    document.getElementById('kategori').innerHTML = renderKategoriDropdown(kategori);
  } catch (error) {
    document.getElementById('kategori').innerHTML = '<option value="">Error loading kategori</option>';
  }
}

loadKategoriForForm();

async function loadArticles() {
  try {
    const q = query(collection(db, 'articles'), orderBy('tanggalPublish', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      document.getElementById('articlesList').innerHTML = '<div class="alert alert-info">Belum ada artikel. Klik "Tulis Artikel Baru"!</div>';
      return;
    }
    let html = '';
    snapshot.forEach(d => {
      const data = d.data();
      const isPublished = data.status === 'published';
      const statusBadge = isPublished ? '<span class="badge bg-success">Published</span>' : '<span class="badge bg-secondary">Draft</span>';
      const kontenPreview = data.konten ? data.konten.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No content';
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h5 class="mb-2">${data.judul}</h5>
                <p class="mb-2" style="font-size:13px;color:#6c757d">
                  <strong>${data.penulis}</strong> | <span class="badge bg-secondary">${data.kategori}</span> | ${statusBadge}
                </p>
                <p class="mb-1" style="font-size:12px;color:#6c757d">${kontenPreview}</p>
                <p class="mb-0" style="font-size:12px"><code>${data.slug}</code> | ${data.views || 0} views</p>
              </div>
              <div>
                <button class="btn btn-sm btn-warning edit-article" data-id="${d.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-article" data-id="${d.id}">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('articlesList').innerHTML = html;
    attachEventListeners();
  } catch (error) {
    document.getElementById('articlesList').innerHTML = '<div class="alert alert-warning">Collection belum ada. Tambahkan artikel pertama!</div>';
  }
}

function attachEventListeners() {
  document.querySelectorAll('.edit-article').forEach(btn => {
    btn.addEventListener('click', () => editArticle(btn.dataset.id));
  });
  document.querySelectorAll('.delete-article').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Yakin hapus artikel ini?')) deleteArticle(btn.dataset.id);
    });
  });
}

async function editArticle(id) {
  try {
    const docSnap = await getDocs(collection(db, 'articles'));
    let articleData = null;
    docSnap.forEach(d => { if (d.id === id) articleData = d.data(); });
    if (!articleData) return;
    document.getElementById('articleId').value = id;
    document.getElementById('modalTitle').textContent = 'Edit Artikel';
    document.getElementById('judul').value = articleData.judul;
    document.getElementById('slug').value = articleData.slug;
    document.getElementById('penulis').value = articleData.penulis;
    document.getElementById('status').value = articleData.status;
    await loadKategoriForForm();
    document.getElementById('kategori').value = articleData.kategori;
    if (!quill) initQuillEditor();
    quill.root.innerHTML = articleData.konten || '';
    new bootstrap.Modal(document.getElementById('modalArticle')).show();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

async function deleteArticle(id) {
  try {
    await deleteDoc(doc(db, 'articles', id));
    showToast('Berhasil', 'Artikel dihapus!');
    loadArticles();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
}

document.getElementById('btnSaveArticle').addEventListener('click', async () => {
  const form = document.getElementById('formArticle');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const konten = quill.root.innerHTML.trim();
  if (!konten || konten === '<p><br></p>') { showToast('Error', 'Konten tidak boleh kosong!', 'error'); return; }
  const data = {
    judul: document.getElementById('judul').value.trim(),
    slug: document.getElementById('slug').value.trim(),
    kategori: document.getElementById('kategori').value,
    penulis: document.getElementById('penulis').value.trim(),
    konten: konten,
    status: document.getElementById('status').value,
    tanggalPublish: serverTimestamp(),
    views: 0
  };
  try {
    const articleId = document.getElementById('articleId').value;
    if (articleId) {
      const docSnap = await getDocs(collection(db, 'articles'));
      let existingViews = 0;
      docSnap.forEach(d => { if (d.id === articleId) existingViews = d.data().views || 0; });
      data.views = existingViews;
      await updateDoc(doc(db, 'articles', articleId), data);
      showToast('Berhasil', 'Artikel diupdate!');
    } else {
      await addDoc(collection(db, 'articles'), data);
      showToast('Berhasil', 'Artikel dipublikasi!');
    }
    bootstrap.Modal.getInstance(document.getElementById('modalArticle')).hide();
    form.reset();
    document.getElementById('articleId').value = '';
    quill.setContents([]);
    loadArticles();
  } catch (error) {
    showToast('Error', error.message, 'error');
  }
});

document.getElementById('modalArticle').addEventListener('shown.bs.modal', () => {
  if (!quill) initQuillEditor();
});

document.getElementById('modalArticle').addEventListener('hidden.bs.modal', () => {
  document.getElementById('formArticle').reset();
  document.getElementById('articleId').value = '';
  document.getElementById('modalTitle').textContent = 'Tulis Artikel Baru';
  if (quill) quill.setContents([]);
  loadKategoriForForm();
});

loadArticles();