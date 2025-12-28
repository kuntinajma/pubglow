// Admin Management untuk Scope & Kategori Artikel
import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ========================================
// SCOPE MANAGEMENT
// ========================================

/**
 * Load all scopes dari Firestore
 * @returns {Promise<Array>} Array of scope objects {id, nama}
 */
export async function loadScopes() {
  try {
    const scopesRef = collection(db, 'scopes');
    const q = query(scopesRef, orderBy('nama', 'asc'));
    const snapshot = await getDocs(q);
    
    const scopes = [];
    snapshot.forEach(doc => {
      scopes.push({
        id: doc.id,
        nama: doc.data().nama
      });
    });
    
    console.log('✅ Loaded', scopes.length, 'scopes');
    return scopes;
  } catch (error) {
    console.error('❌ Error loading scopes:', error);
    throw error;
  }
}

/**
 * Tambah scope baru
 * @param {string} namaScope - Nama scope yang akan ditambahkan
 * @returns {Promise<string>} Document ID yang baru dibuat
 */
export async function addScope(namaScope) {
  try {
    // Validasi
    if (!namaScope || namaScope.trim() === '') {
      throw new Error('Nama scope tidak boleh kosong');
    }
    
    const scopesRef = collection(db, 'scopes');
    const docRef = await addDoc(scopesRef, {
      nama: namaScope.trim(),
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Scope added:', namaScope);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding scope:', error);
    throw error;
  }
}

/**
 * Update scope
 * @param {string} scopeId - Document ID
 * @param {string} newNama - Nama baru
 */
export async function updateScope(scopeId, newNama) {
  try {
    if (!newNama || newNama.trim() === '') {
      throw new Error('Nama scope tidak boleh kosong');
    }
    
    const scopeRef = doc(db, 'scopes', scopeId);
    await updateDoc(scopeRef, {
      nama: newNama.trim(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Scope updated:', scopeId);
  } catch (error) {
    console.error('❌ Error updating scope:', error);
    throw error;
  }
}

/**
 * Hapus scope
 * @param {string} scopeId - Document ID
 */
export async function deleteScope(scopeId) {
  try {
    const scopeRef = doc(db, 'scopes', scopeId);
    await deleteDoc(scopeRef);
    
    console.log('✅ Scope deleted:', scopeId);
  } catch (error) {
    console.error('❌ Error deleting scope:', error);
    throw error;
  }
}

// ========================================
// KATEGORI ARTIKEL MANAGEMENT
// ========================================

/**
 * Load all kategori artikel dari Firestore
 * @returns {Promise<Array>} Array of kategori objects {id, nama}
 */
export async function loadKategoriArtikel() {
  try {
    const kategoriRef = collection(db, 'kategori_artikel');
    const q = query(kategoriRef, orderBy('nama', 'asc'));
    const snapshot = await getDocs(q);
    
    const kategori = [];
    snapshot.forEach(doc => {
      kategori.push({
        id: doc.id,
        nama: doc.data().nama
      });
    });
    
    console.log('✅ Loaded', kategori.length, 'kategori artikel');
    return kategori;
  } catch (error) {
    console.error('❌ Error loading kategori:', error);
    throw error;
  }
}

/**
 * Tambah kategori artikel baru
 * @param {string} namaKategori - Nama kategori yang akan ditambahkan
 * @returns {Promise<string>} Document ID yang baru dibuat
 */
export async function addKategoriArtikel(namaKategori) {
  try {
    if (!namaKategori || namaKategori.trim() === '') {
      throw new Error('Nama kategori tidak boleh kosong');
    }
    
    const kategoriRef = collection(db, 'kategori_artikel');
    const docRef = await addDoc(kategoriRef, {
      nama: namaKategori.trim(),
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Kategori added:', namaKategori);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding kategori:', error);
    throw error;
  }
}

/**
 * Update kategori artikel
 * @param {string} kategoriId - Document ID
 * @param {string} newNama - Nama baru
 */
export async function updateKategoriArtikel(kategoriId, newNama) {
  try {
    if (!newNama || newNama.trim() === '') {
      throw new Error('Nama kategori tidak boleh kosong');
    }
    
    const kategoriRef = doc(db, 'kategori_artikel', kategoriId);
    await updateDoc(kategoriRef, {
      nama: newNama.trim(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Kategori updated:', kategoriId);
  } catch (error) {
    console.error('❌ Error updating kategori:', error);
    throw error;
  }
}

/**
 * Hapus kategori artikel
 * @param {string} kategoriId - Document ID
 */
export async function deleteKategoriArtikel(kategoriId) {
  try {
    const kategoriRef = doc(db, 'kategori_artikel', kategoriId);
    await deleteDoc(kategoriRef);
    
    console.log('✅ Kategori deleted:', kategoriId);
  } catch (error) {
    console.error('❌ Error deleting kategori:', error);
    throw error;
  }
}

// ========================================
// UI HELPERS - RENDER FUNCTIONS
// ========================================

/**
 * Render scopes sebagai checkbox list (untuk form jurnal - multiple selection)
 * @param {Array} scopes - Array of scope objects
 * @param {Array} selectedScopes - Array of selected scope names
 * @returns {string} HTML string
 */
export function renderScopeCheckboxes(scopes, selectedScopes = []) {
  if (!scopes || scopes.length === 0) {
    return '<p class="text-muted">Belum ada scope. <a href="#kelolaScope">Tambah scope</a></p>';
  }
  
  return scopes.map(scope => {
    const isChecked = selectedScopes.includes(scope.nama) ? 'checked' : '';
    return `
      <div class="form-check">
        <input 
          class="form-check-input scope-checkbox" 
          type="checkbox" 
          value="${scope.nama}" 
          id="scope-${scope.id}"
          ${isChecked}
        >
        <label class="form-check-label" for="scope-${scope.id}">
          ${scope.nama}
        </label>
      </div>
    `;
  }).join('');
}

/**
 * Render kategori sebagai dropdown options (untuk form artikel - single selection)
 * @param {Array} kategori - Array of kategori objects
 * @param {string} selectedKategori - Selected kategori name
 * @returns {string} HTML string
 */
export function renderKategoriDropdown(kategori, selectedKategori = '') {
  if (!kategori || kategori.length === 0) {
    return '<option value="">Belum ada kategori</option>';
  }
  
  let html = '<option value="">-- Pilih Kategori --</option>';
  
  kategori.forEach(kat => {
    const isSelected = kat.nama === selectedKategori ? 'selected' : '';
    html += `<option value="${kat.nama}" ${isSelected}>${kat.nama}</option>`;
  });
  
  return html;
}

/**
 * Get selected scopes dari checkboxes
 * @returns {Array<string>} Array of selected scope names
 */
export function getSelectedScopes() {
  const checkboxes = document.querySelectorAll('.scope-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Render scope management table untuk admin
 * @param {Array} scopes - Array of scope objects
 * @returns {string} HTML string
 */
export function renderScopeTable(scopes) {
  if (!scopes || scopes.length === 0) {
    return `
      <div class="alert alert-info">
        <p class="mb-0">Belum ada scope. Tambahkan scope pertama Anda!</p>
      </div>
    `;
  }
  
  return `
    <table class="table table-hover">
      <thead>
        <tr>
          <th style="width:60px">#</th>
          <th>Nama Scope</th>
          <th style="width:180px">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${scopes.map((scope, index) => `
          <tr data-scope-id="${scope.id}">
            <td>${index + 1}</td>
            <td class="scope-name">${scope.nama}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-action btn-action-edit edit-scope" data-id="${scope.id}" data-name="${scope.nama}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button class="btn btn-action btn-action-delete delete-scope" data-id="${scope.id}" data-name="${scope.nama}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Render kategori management table untuk admin
 * @param {Array} kategori - Array of kategori objects
 * @returns {string} HTML string
 */
export function renderKategoriTable(kategori) {
  if (!kategori || kategori.length === 0) {
    return `
      <div class="alert alert-info">
        <p class="mb-0">Belum ada kategori artikel. Tambahkan kategori pertama Anda!</p>
      </div>
    `;
  }
  
  return `
    <table class="table table-hover">
      <thead>
        <tr>
          <th style="width:60px">#</th>
          <th>Nama Kategori</th>
          <th style="width:180px">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${kategori.map((kat, index) => `
          <tr data-kategori-id="${kat.id}">
            <td>${index + 1}</td>
            <td class="kategori-name">${kat.nama}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-action btn-action-edit edit-kategori" data-id="${kat.id}" data-name="${kat.nama}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button class="btn btn-action btn-action-delete delete-kategori" data-id="${kat.id}" data-name="${kat.nama}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}