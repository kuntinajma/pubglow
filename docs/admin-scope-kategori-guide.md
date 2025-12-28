# Guide: Kelola Scope & Kategori di Admin

## 📚 **Overview**

System ini memungkinkan admin untuk:
- ✅ **Mengelola Scope Jurnal** - CRUD operations
- ✅ **Mengelola Kategori Artikel** - CRUD operations
- ✅ **Scope**: Multiple selection (checkbox) untuk jurnal
- ✅ **Kategori**: Single selection (dropdown) untuk artikel

---

## 🎯 **Use Cases**

### **Scope Jurnal:**
- Digunakan saat **menambah/edit jurnal**
- Bisa **pilih lebih dari 1 scope** (checkbox)
- Contoh: Jurnal bisa punya scope ["Teknik Informatika", "AI", "Data Science"]

### **Kategori Artikel:**
- Digunakan saat **menambah/edit artikel**
- Hanya bisa **pilih 1 kategori** (dropdown)
- Contoh: Artikel hanya punya 1 kategori "Tips Publikasi"

---

## 📂 **Files Created**

### **1. `js/admin-scope-kategori.js`**

**Fungsi utama:**

#### **Scope Management:**
```javascript
// Load all scopes
loadScopes() → Promise<Array>

// Add new scope
addScope(namaScope) → Promise<string>

// Update scope
updateScope(scopeId, newNama) → Promise<void>

// Delete scope
deleteScope(scopeId) → Promise<void>
```

#### **Kategori Management:**
```javascript
// Load all kategori
loadKategoriArtikel() → Promise<Array>

// Add new kategori
addKategoriArtikel(namaKategori) → Promise<string>

// Update kategori
updateKategoriArtikel(kategoriId, newNama) → Promise<void>

// Delete kategori
deleteKategoriArtikel(kategoriId) → Promise<void>
```

#### **UI Helpers:**
```javascript
// Render checkboxes (untuk form jurnal)
renderScopeCheckboxes(scopes, selectedScopes) → HTML string

// Render dropdown (untuk form artikel)
renderKategoriDropdown(kategori, selectedKategori) → HTML string

// Get selected scopes dari checkboxes
getSelectedScopes() → Array<string>

// Render admin tables
renderScopeTable(scopes) → HTML string
renderKategoriTable(kategori) → HTML string
```

---

### **2. `admin-scope-kategori.html`**

**Halaman admin untuk:**
- ➕ Tambah scope/kategori baru
- ✏️ Edit scope/kategori existing
- 🗑️ Hapus scope/kategori
- 👁️ View semua scope & kategori dalam table

**Access:** `https://pubglow.vercel.app/admin-scope-kategori.html`

---

## 🔧 **How to Use di Form Jurnal**

### **Add Jurnal Form dengan Multiple Scope:**

```html
<!-- Form Tambah Jurnal -->
<form id="formAddJurnal">
  <!-- Other fields... -->
  
  <!-- Scope Selection (Multiple Checkboxes) -->
  <div class="mb-3">
    <label class="form-label">Scope (Pilih 1 atau lebih)</label>
    <div id="scopeCheckboxContainer">
      <!-- Will be populated by JS -->
    </div>
  </div>
  
  <!-- Submit button -->
</form>

<script type="module">
  import { 
    loadScopes, 
    renderScopeCheckboxes, 
    getSelectedScopes 
  } from './js/admin-scope-kategori.js';
  import { addDoc, collection } from 'firebase/firestore';
  import { db } from './js/firebase.js';

  // Load & render scopes
  const scopes = await loadScopes();
  document.getElementById('scopeCheckboxContainer').innerHTML = 
    renderScopeCheckboxes(scopes);

  // On form submit
  document.getElementById('formAddJurnal').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get selected scopes
    const selectedScopes = getSelectedScopes();
    
    if (selectedScopes.length === 0) {
      alert('Pilih minimal 1 scope!');
      return;
    }
    
    // Save jurnal dengan scope array
    await addDoc(collection(db, 'journals'), {
      nama: e.target.nama.value,
      instansi: e.target.instansi.value,
      scope: selectedScopes, // Array!
      // ... other fields
    });
    
    alert('Jurnal berhasil ditambahkan!');
  });
</script>
```

---

## 🔧 **How to Use di Form Artikel**

### **Add Artikel Form dengan Single Kategori:**

```html
<!-- Form Tambah Artikel -->
<form id="formAddArtikel">
  <!-- Other fields... -->
  
  <!-- Kategori Selection (Single Dropdown) -->
  <div class="mb-3">
    <label for="selectKategori" class="form-label">Kategori</label>
    <select id="selectKategori" name="kategori" class="form-select" required>
      <!-- Will be populated by JS -->
    </select>
  </div>
  
  <!-- Submit button -->
</form>

<script type="module">
  import { 
    loadKategoriArtikel, 
    renderKategoriDropdown 
  } from './js/admin-scope-kategori.js';
  import { addDoc, collection } from 'firebase/firestore';
  import { db } from './js/firebase.js';

  // Load & render kategori
  const kategori = await loadKategoriArtikel();
  document.getElementById('selectKategori').innerHTML = 
    renderKategoriDropdown(kategori);

  // On form submit
  document.getElementById('formAddArtikel').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get selected kategori
    const selectedKategori = e.target.kategori.value;
    
    if (!selectedKategori) {
      alert('Pilih kategori!');
      return;
    }
    
    // Save artikel dengan kategori string
    await addDoc(collection(db, 'articles'), {
      judul: e.target.judul.value,
      slug: e.target.slug.value,
      kategori: selectedKategori, // String!
      // ... other fields
    });
    
    alert('Artikel berhasil ditambahkan!');
  });
</script>
```

---

## 📊 **Firestore Structure**

### **Collection: `scopes`**
```javascript
scopes/
  └── {scopeId}/
      ├── nama: "Teknik Informatika" (string)
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp (optional)
```

### **Collection: `kategori_artikel`**
```javascript
kategori_artikel/
  └── {kategoriId}/
      ├── nama: "Tips Publikasi" (string)
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp (optional)
```

### **Collection: `journals` (using scopes)**
```javascript
journals/
  └── {journalId}/
      ├── nama: "Jurnal ABC"
      ├── scope: ["Teknik Informatika", "AI"] // ARRAY!
      └── ...
```

### **Collection: `articles` (using kategori)**
```javascript
articles/
  └── {articleId}/
      ├── judul: "Artikel XYZ"
      ├── kategori: "Tips Publikasi" // STRING!
      └── ...
```

---

## 🚀 **Workflow**

### **Admin Setup Scope:**

1. Admin buka: `admin-scope-kategori.html`
2. Tambah scope baru:
   - Input: "Teknik Informatika"
   - Click: ➕ Tambah Scope
   - Saved to Firestore `scopes` collection
3. Repeat untuk scope lain

### **Admin Tambah Jurnal:**

1. Buka form tambah jurnal
2. Scope otomatis load dari Firestore sebagai **checkboxes**
3. Admin centang multiple scope:
   - ☑️ Teknik Informatika
   - ☑️ AI
   - ☑️ Data Science
4. Submit → Saved dengan `scope: ["Teknik Informatika", "AI", "Data Science"]`

### **Admin Setup Kategori:**

1. Admin buka: `admin-scope-kategori.html`
2. Tambah kategori baru:
   - Input: "Tips Publikasi"
   - Click: ➕ Tambah Kategori
   - Saved to Firestore `kategori_artikel` collection
3. Repeat untuk kategori lain

### **Admin Tambah Artikel:**

1. Buka form tambah artikel
2. Kategori otomatis load dari Firestore sebagai **dropdown**
3. Admin pilih 1 kategori:
   - 🔽 Tips Publikasi
4. Submit → Saved dengan `kategori: "Tips Publikasi"`

---

## ⚠️ **Important Notes**

### **1. Scope adalah Array:**
```javascript
// Jurnal bisa punya multiple scopes
scope: ["Teknik Informatika", "AI", "Data Science"]

// Minimal 1 scope harus dipilih
if (selectedScopes.length === 0) {
  alert('Pilih minimal 1 scope!');
}
```

### **2. Kategori adalah String:**
```javascript
// Artikel hanya 1 kategori
kategori: "Tips Publikasi"

// Harus dipilih
if (!selectedKategori) {
  alert('Pilih kategori!');
}
```

### **3. Hapus Scope/Kategori:**
- Menghapus scope/kategori **TIDAK otomatis update** jurnal/artikel yang sudah ada
- Jurnal/artikel yang sudah ada masih akan memiliki scope/kategori tersebut
- Best practice: Jangan hapus scope/kategori yang sudah dipakai, atau update manual

### **4. Edit Scope/Kategori:**
- Edit nama **TIDAK otomatis update** jurnal/artikel existing
- Untuk consistency, perlu update manual jurnal/artikel yang terpengaruh

---

## 🔐 **Security Rules**

Pastikan di `firestore.rules`:

```javascript
// Scopes - Public read, auth write
match /scopes/{scopeId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null;
}

// Kategori - Public read, auth write
match /kategori_artikel/{kategoriId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null;
}
```

---

## ✅ **Testing Checklist**

### **Scope Management:**
- [ ] Buka `admin-scope-kategori.html`
- [ ] Tambah scope baru → muncul di table
- [ ] Edit scope → nama berubah
- [ ] Hapus scope → hilang dari table
- [ ] Load di form jurnal → muncul sebagai checkbox
- [ ] Pilih multiple → save dengan array

### **Kategori Management:**
- [ ] Tambah kategori baru → muncul di table
- [ ] Edit kategori → nama berubah
- [ ] Hapus kategori → hilang dari table
- [ ] Load di form artikel → muncul sebagai dropdown
- [ ] Pilih 1 kategori → save dengan string

---

## 🎨 **UI Examples**

### **Scope Checkboxes:**
```
☑️ Teknik Informatika
☑️ AI
☐ Data Science
☐ Kesehatan
☑️ Ekonomi
```
Result: `["Teknik Informatika", "AI", "Ekonomi"]`

### **Kategori Dropdown:**
```
🔽 -- Pilih Kategori --
   Tips Publikasi
   Berita
   Tutorial
   Riset & Akademik
   Opini
```
Result: `"Tips Publikasi"`

---

## 📚 **Quick Reference**

```javascript
// Import functions
import { 
  loadScopes,
  addScope,
  updateScope,
  deleteScope,
  renderScopeCheckboxes,
  getSelectedScopes,
  loadKategoriArtikel,
  addKategoriArtikel,
  updateKategoriArtikel,
  deleteKategoriArtikel,
  renderKategoriDropdown
} from './js/admin-scope-kategori.js';

// Load scopes
const scopes = await loadScopes();
// → [{id: 'abc', nama: 'Teknik Informatika'}, ...]

// Render checkboxes
const html = renderScopeCheckboxes(scopes, ['AI']);
// → HTML with checkboxes, 'AI' pre-checked

// Get selected
const selected = getSelectedScopes();
// → ['Teknik Informatika', 'AI']

// Add scope
await addScope('Machine Learning');

// Load kategori
const kategori = await loadKategoriArtikel();

// Render dropdown
const html2 = renderKategoriDropdown(kategori, 'Tips');
// → HTML with options, 'Tips' pre-selected

// Add kategori
await addKategoriArtikel('Podcast');
```

---

**Ready to use! 🚀**