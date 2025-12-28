# Firestore Collections Setup - Complete Guide

## 📚 **ALL COLLECTIONS untuk PubGlow**

PubGlow membutuhkan **6 collections utama**:

1. ✅ `scopes` - Bidang ilmu/scope jurnal
2. ✅ `kategori_artikel` - Kategori artikel
3. 📰 `articles` - Artikel yang dipublikasi
4. 📚 `journals` - Database jurnal
5. 📝 `journal_submissions` - Usulan jurnal dari user
6. 📝 `article_submissions` - Usulan artikel dari user

---

## 🗄️ **STEP-BY-STEP: Buat Semua Collections**

### **1. Collection: `scopes`** ✅

**Fungsi:** Bidang ilmu untuk filter jurnal

**Cara buat:**
1. Firestore Console > **Start collection**
2. Collection ID: `scopes`
3. Add documents:

**Document 1:**
```
Document ID: (Auto-ID)
Fields:
  nama: "Teknik Informatika" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 2:**
```
nama: "Kesehatan" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 3:**
```
nama: "Ekonomi" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 4:**
```
nama: "Pendidikan" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 5:**
```
nama: "Pengabdian Masyarakat" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

---

### **2. Collection: `kategori_artikel`** ✅

**Fungsi:** Kategori untuk artikel blog

**Document 1:**
```
Document ID: (Auto-ID)
Fields:
  nama: "Tips Publikasi" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 2:**
```
nama: "Riset & Akademik" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 3:**
```
nama: "Berita" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 4:**
```
nama: "Tutorial" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

**Document 5:**
```
nama: "Opini" (string)
createdAt: "2025-12-28T11:00:00Z" (string)
```

---

### **3. Collection: `journals`** 📚

**Fungsi:** Database jurnal yang tersedia untuk publikasi

**Cara buat:**
1. Firestore Console > **Start collection**
2. Collection ID: `journals`
3. Add documents dengan data contoh:

**Document 1: Jurnal Teknik Informatika**
```
Document ID: (Auto-ID)
Fields:
  nama: "Jurnal Teknik Informatika dan Sistem Informasi" (string)
  instansi: "Universitas Indonesia" (string)
  akreditasi: "Sinta 2" (string)
  scope: "Teknik Informatika" (string)
  harga: 750000 (number)
  estimasiWaktu: 3 (number) // dalam bulan
  url: "https://jtisi.ui.ac.id" (string)
  deskripsi: "Jurnal yang membahas tentang perkembangan teknologi informasi, sistem informasi, dan aplikasinya dalam berbagai bidang." (string)
  fastTrack: true (boolean)
  hargaFastTrack: 1500000 (number)
  estimasiFastTrack: 1.5 (number) // dalam bulan
  status: "active" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

**Document 2: Jurnal Kesehatan**
```
Fields:
  nama: "Jurnal Kesehatan Masyarakat Indonesia" (string)
  instansi: "Universitas Gadjah Mada" (string)
  akreditasi: "Sinta 1" (string)
  scope: "Kesehatan" (string)
  harga: 1000000 (number)
  estimasiWaktu: 4 (number)
  url: "https://jkmi.ugm.ac.id" (string)
  deskripsi: "Jurnal ilmiah yang memuat hasil penelitian kesehatan masyarakat, epidemiologi, dan promosi kesehatan." (string)
  fastTrack: true (boolean)
  hargaFastTrack: 2000000 (number)
  estimasiFastTrack: 2 (number)
  status: "active" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

**Document 3: Jurnal Ekonomi**
```
Fields:
  nama: "Jurnal Ekonomi dan Bisnis" (string)
  instansi: "Institut Teknologi Bandung" (string)
  akreditasi: "Sinta 2" (string)
  scope: "Ekonomi" (string)
  harga: 600000 (number)
  estimasiWaktu: 3 (number)
  url: "https://jeb.itb.ac.id" (string)
  deskripsi: "Jurnal yang mempublikasikan artikel penelitian di bidang ekonomi, manajemen, dan bisnis." (string)
  fastTrack: false (boolean)
  hargaFastTrack: 0 (number)
  estimasiFastTrack: 0 (number)
  status: "active" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

**Document 4: Jurnal Pendidikan**
```
Fields:
  nama: "Jurnal Pendidikan dan Pembelajaran" (string)
  instansi: "Universitas Negeri Malang" (string)
  akreditasi: "Sinta 3" (string)
  scope: "Pendidikan" (string)
  harga: 500000 (number)
  estimasiWaktu: 2.5 (number)
  url: "https://jpp.um.ac.id" (string)
  deskripsi: "Jurnal yang memfokuskan pada penelitian dan kajian dalam bidang pendidikan, pembelajaran, dan kurikulum." (string)
  fastTrack: true (boolean)
  hargaFastTrack: 900000 (number)
  estimasiFastTrack: 1 (number)
  status: "active" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

**Document 5: Jurnal Pengabdian Masyarakat**
```
Fields:
  nama: "Jurnal Pengabdian kepada Masyarakat" (string)
  instansi: "Universitas Brawijaya" (string)
  akreditasi: "Sinta 4" (string)
  scope: "Pengabdian Masyarakat" (string)
  harga: 400000 (number)
  estimasiWaktu: 2 (number)
  url: "https://jpkm.ub.ac.id" (string)
  deskripsi: "Jurnal yang memuat hasil kegiatan pengabdian kepada masyarakat dalam berbagai bidang." (string)
  fastTrack: false (boolean)
  hargaFastTrack: 0 (number)
  estimasiFastTrack: 0 (number)
  status: "active" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

---

### **4. Collection: `articles`** 📰

**Fungsi:** Artikel blog yang dipublikasi di website

**Document 1: Tips Publikasi Jurnal**
```
Document ID: (Auto-ID)
Fields:
  judul: "5 Tips Sukses Publikasi di Jurnal Internasional" (string)
  slug: "tips-publikasi-jurnal-internasional" (string)
  kategori: "Tips Publikasi" (string)
  penulis: "Tim PubGlow" (string)
  gambar: "" (string) // URL gambar, kosongkan dulu
  ringkasan: "Panduan lengkap untuk meningkatkan peluang artikel Anda diterima di jurnal internasional bereputasi." (string)
  konten: "<h2>1. Pilih Jurnal yang Tepat</h2><p>Memilih jurnal yang sesuai dengan topik penelitian Anda adalah langkah pertama yang krusial...</p><h2>2. Perhatikan Format Penulisan</h2><p>Setiap jurnal memiliki guideline penulisan yang berbeda...</p><h2>3. Pastikan Originalitas Riset</h2><p>Jurnal internasional sangat memperhatikan originalitas penelitian...</p><h2>4. Peer Review adalah Teman</h2><p>Mintalah rekan sejawat untuk mereview draft artikel Anda...</p><h2>5. Sabar dalam Proses Review</h2><p>Proses review bisa memakan waktu 3-6 bulan, bahkan lebih...</p>" (string)
  status: "published" (string)
  views: 0 (number)
  tanggalPublish: "2025-12-28T11:00:00Z" (string)
  createdAt: "2025-12-28T11:00:00Z" (string)
  updatedAt: "2025-12-28T11:00:00Z" (string)
```

**Document 2: Memahami Akreditasi Jurnal**
```
Fields:
  judul: "Memahami Sistem Akreditasi Jurnal: Sinta vs Scopus" (string)
  slug: "sistem-akreditasi-jurnal-sinta-scopus" (string)
  kategori: "Riset & Akademik" (string)
  penulis: "Dr. Ahmad Fauzi" (string)
  gambar: "" (string)
  ringkasan: "Perbedaan dan pentingnya memahami sistem akreditasi jurnal nasional (Sinta) dan internasional (Scopus)." (string)
  konten: "<h2>Apa itu Sinta?</h2><p>Sinta (Science and Technology Index) adalah portal yang mengintegrasikan informasi tentang kinerja riset di Indonesia...</p><h2>Mengenal Scopus</h2><p>Scopus adalah database abstrak dan sitasi yang dikembangkan oleh Elsevier...</p><h2>Perbedaan Sinta dan Scopus</h2><p>Sinta fokus pada jurnal nasional Indonesia, sementara Scopus mencakup jurnal internasional...</p>" (string)
  status: "published" (string)
  views: 0 (number)
  tanggalPublish: "2025-12-27T10:00:00Z" (string)
  createdAt: "2025-12-27T10:00:00Z" (string)
  updatedAt: "2025-12-27T10:00:00Z" (string)
```

**Document 3: Berita Terbaru**
```
Fields:
  judul: "PubGlow Resmi Diluncurkan: Platform Publikasi Jurnal Terpadu" (string)
  slug: "pubglow-diluncurkan-platform-publikasi" (string)
  kategori: "Berita" (string)
  penulis: "Redaksi PubGlow" (string)
  gambar: "" (string)
  ringkasan: "PubGlow hadir sebagai solusi terpadu untuk membantu peneliti menemukan jurnal yang tepat dan mempublikasikan karya ilmiah." (string)
  konten: "<p>Jakarta, 28 Desember 2025 - PubGlow resmi diluncurkan sebagai platform yang memudahkan peneliti dalam mencari dan mempublikasikan artikel di jurnal ilmiah...</p><p>Platform ini menyediakan database jurnal terakreditasi, sistem tracking submission, dan konsultasi publikasi...</p>" (string)
  status: "published" (string)
  views: 0 (number)
  tanggalPublish: "2025-12-28T09:00:00Z" (string)
  createdAt: "2025-12-28T09:00:00Z" (string)
  updatedAt: "2025-12-28T09:00:00Z" (string)
```

---

### **5. Collection: `journal_submissions`** 📝

**Fungsi:** Menyimpan usulan jurnal baru dari user

**Structure (akan auto-created saat ada submission):**
```
Fields:
  nama: (string) - Nama jurnal
  instansi: (string) - Instansi penerbit
  akreditasi: (string) - Status akreditasi
  scope: (string) - Bidang ilmu
  harga: (number) - Biaya publikasi
  url: (string) - Website jurnal
  namaPengusul: (string) - Nama user yang mengusulkan
  emailPengusul: (string) - Email user
  status: "pending" (string) - Status review admin
  tanggalSubmit: (string) - Waktu submit
```

**TIDAK perlu buat document manual**, akan otomatis terisi saat user submit form.

---

### **6. Collection: `article_submissions`** 📝

**Fungsi:** Menyimpan usulan artikel baru dari user

**Structure (akan auto-created saat ada submission):**
```
Fields:
  judul: (string) - Judul artikel
  kategori: (string) - Kategori artikel
  konten: (string) - Isi artikel (HTML)
  penulis: (string) - Nama penulis
  emailPenulis: (string) - Email penulis
  status: "pending" (string) - Status review admin
  tanggalSubmit: (string) - Waktu submit
```

**TIDAK perlu buat document manual**, akan otomatis terisi saat user submit form.

---

## 🎯 **QUICK SETUP CHECKLIST**

### **Collections yang HARUS dibuat manual:**

- [ ] **1. `scopes`** - 5 documents (Teknik Informatika, Kesehatan, Ekonomi, Pendidikan, Pengabdian Masyarakat)
- [ ] **2. `kategori_artikel`** - 5 documents (Tips Publikasi, Riset & Akademik, Berita, Tutorial, Opini)
- [ ] **3. `journals`** - 5 documents (contoh jurnal dari berbagai scope)
- [ ] **4. `articles`** - 3 documents (artikel contoh untuk blog)

### **Collections yang auto-created:**

- ⏳ **5. `journal_submissions`** - Akan terisi otomatis saat user submit jurnal
- ⏳ **6. `article_submissions`** - Akan terisi otomatis saat user submit artikel

---

## 📋 **CARA BUAT DOCUMENT DI FIRESTORE**

### **Step-by-step untuk setiap document:**

1. **Open Firestore Console**
   - Go to: https://console.firebase.google.com/
   - Project: pubglow
   - Sidebar: Firestore Database

2. **Start Collection** (untuk collection baru)
   - Klik "Start collection"
   - Masukkan Collection ID (misal: `journals`)
   - Klik "Next"

3. **Add Document**
   - Document ID: (biarkan Auto-ID)
   - Add fields satu per satu:
     - Klik "+ Add field"
     - Field name: `nama`
     - Field type: `string`
     - Field value: `Jurnal Teknik Informatika...`
   - Ulangi untuk semua fields
   - Klik "Save"

4. **Add More Documents**
   - Di dalam collection, klik "+ Add document"
   - Ulangi proses add fields
   - Klik "Save"

---

## 🔍 **TIPS PENTING:**

### **Data Types di Firestore:**
- **string** - Untuk text (nama, deskripsi, url, dll)
- **number** - Untuk angka (harga, estimasi waktu, views)
- **boolean** - Untuk true/false (fastTrack, status aktif)
- **timestamp** - Untuk tanggal (tapi kita pakai string untuk simplicity)

### **Field Wajib untuk Jurnal:**
```
✅ nama (string)
✅ instansi (string)
✅ akreditasi (string)
✅ scope (string)
✅ harga (number)
✅ estimasiWaktu (number)
✅ url (string)
✅ status (string) - "active" atau "inactive"
```

### **Field Wajib untuk Artikel:**
```
✅ judul (string)
✅ slug (string)
✅ kategori (string)
✅ konten (string)
✅ status (string) - "published" atau "draft"
```

---

## 🚀 **AFTER SETUP:**

Setelah semua collections & documents dibuat:

1. **Test di Admin Dashboard:**
   - https://pubglow.vercel.app/admin.html
   - Login dengan admin account
   - Check semua data muncul

2. **Test di Public Pages:**
   - https://pubglow.vercel.app/journals.html - List jurnal
   - https://pubglow.vercel.app/articles.html - List artikel
   - https://pubglow.vercel.app/index.html - Homepage

3. **Test Submissions:**
   - Submit jurnal baru
   - Submit artikel baru
   - Check di admin dashboard apakah masuk ke pending

---

## 📊 **FIRESTORE STRUCTURE OVERVIEW:**

```
pubglow (database)
├── scopes/ (5 docs) ✅ BUAT MANUAL
│   ├── [auto-id-1]/
│   │   └── nama: "Teknik Informatika"
│   └── ...
│
├── kategori_artikel/ (5 docs) ✅ BUAT MANUAL
│   ├── [auto-id-1]/
│   │   └── nama: "Tips Publikasi"
│   └── ...
│
├── journals/ (5 docs) ✅ BUAT MANUAL
│   ├── [auto-id-1]/
│   │   ├── nama: "Jurnal Teknik Informatika..."
│   │   ├── instansi: "Universitas Indonesia"
│   │   ├── akreditasi: "Sinta 2"
│   │   ├── harga: 750000
│   │   └── ...
│   └── ...
│
├── articles/ (3 docs) ✅ BUAT MANUAL
│   ├── [auto-id-1]/
│   │   ├── judul: "5 Tips Sukses..."
│   │   ├── slug: "tips-publikasi..."
│   │   ├── kategori: "Tips Publikasi"
│   │   └── ...
│   └── ...
│
├── journal_submissions/ ⏳ AUTO-CREATED
│   └── (empty, akan terisi saat ada submission)
│
└── article_submissions/ ⏳ AUTO-CREATED
    └── (empty, akan terisi saat ada submission)
```

---

## ⚡ **SHORTCUT: Copy-Paste Data**

Untuk mempercepat, kamu bisa:

1. Buat 1 document lengkap di Firestore
2. **Duplicate** document tersebut (klik ⋮ > Duplicate)
3. Edit field yang perlu diubah saja
4. Save

Lebih cepat dari bikin dari nol! 🚀

---

**Total Collections: 6**
**Manual Setup: 4 collections (scopes, kategori_artikel, journals, articles)**
**Auto-Created: 2 collections (journal_submissions, article_submissions)**

**Estimated Time: 30-45 menit untuk manual setup** ⏱️
