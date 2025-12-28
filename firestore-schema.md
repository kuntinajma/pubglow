# Firestore Database Schema - PubGlow

## 📚 **Collections Structure**

---

## 1. `journals` Collection

### Schema:
```javascript
journals (collection)
  └── {journalId} (document)
      ├── nama: "Nama Jurnal" (string)
      ├── instansi: "Universitas Indonesia" (string)
      ├── scope: ["Teknik Informatika", "AI", "Data Science"] (array)
      ├── akreditasi: "SINTA 2" (string) // SINTA 1-6
      ├── harga: 500000 (number)
      ├── frekuensi: "Januari, April, Juli, Oktober" (string) // bulan terbit
      ├── waktuReview: 3 (number) // dalam bulan
      ├── fastTrack: (map/object)
      │   ├── tersedia: true (boolean)
      │   └── biaya: 1000000 (number)
      ├── tautan: "https://journal-url.com" (string)
      ├── status: "aktif" (string) // "aktif" atau "hidden"
      └── timestamp: (timestamp) // auto, Firestore timestamp
```

### Example Document:
```javascript
{
  nama: "Jurnal Teknik Informatika dan Sistem Informasi",
  instansi: "Universitas Indonesia",
  scope: ["Teknik Informatika", "Sistem Informasi", "AI"],
  akreditasi: "SINTA 2",
  harga: 750000,
  frekuensi: "Januari, April, Juli, Oktober",
  waktuReview: 3,
  fastTrack: {
    tersedia: true,
    biaya: 1500000
  },
  tautan: "https://jtisi.ui.ac.id",
  status: "aktif",
  timestamp: Timestamp // Auto-generated
}
```

### Field Types:
- `nama`: **string** - Nama lengkap jurnal
- `instansi`: **string** - Universitas/institusi penerbit
- `scope`: **array** - Multiple bidang ilmu (bisa lebih dari 1)
- `akreditasi`: **string** - SINTA 1, SINTA 2, SINTA 3, SINTA 4, SINTA 5, SINTA 6
- `harga`: **number** - Biaya publikasi dalam rupiah
- `frekuensi`: **string** - Bulan-bulan terbit (contoh: "Januari, April, Juli, Oktober")
- `waktuReview`: **number** - Estimasi waktu review dalam bulan
- `fastTrack`: **map** - Object dengan 2 properties:
  - `tersedia`: **boolean** - true/false
  - `biaya`: **number** - Biaya fast track (0 jika tidak tersedia)
- `tautan`: **string** - URL website jurnal
- `status`: **string** - "aktif" (tampil di public) atau "hidden" (tidak tampil)
- `timestamp`: **timestamp** - Waktu pembuatan/update (auto)

---

## 2. `articles` Collection

### Schema:
```javascript
articles (collection)
  └── {articleId} (document)
      ├── judul: "Tips Memilih Jurnal yang Tepat" (string)
      ├── slug: "tips-memilih-jurnal" (string)
      ├── konten: "Isi artikel lengkap..." (string) // HTML content
      ├── ringkasan: "Excerpt 150-200 karakter..." (string)
      ├── kategori: "Tips" (string)
      ├── penulis: "Admin" (string)
      ├── tanggalPublish: (timestamp)
      ├── views: 0 (number)
      └── status: "published" (string) // "published" atau "draft"
```

### Example Document:
```javascript
{
  judul: "5 Tips Sukses Publikasi di Jurnal Internasional",
  slug: "tips-publikasi-jurnal-internasional",
  konten: "<h2>1. Pilih Jurnal yang Tepat</h2><p>Memilih jurnal yang sesuai...</p>",
  ringkasan: "Panduan lengkap untuk meningkatkan peluang artikel Anda diterima di jurnal internasional bereputasi.",
  kategori: "Tips",
  penulis: "Tim PubGlow",
  tanggalPublish: Timestamp,
  views: 0,
  status: "published"
}
```

### Field Types:
- `judul`: **string** - Judul artikel
- `slug`: **string** - URL-friendly identifier (lowercase, hyphen)
- `konten`: **string** - Isi artikel lengkap (HTML format)
- `ringkasan`: **string** - Summary/excerpt 150-200 karakter
- `kategori`: **string** - Kategori artikel (Tips, Berita, Tutorial, dll)
- `penulis`: **string** - Nama penulis
- `tanggalPublish`: **timestamp** - Tanggal publikasi
- `views`: **number** - Jumlah views (increment setiap kali dibaca)
- `status`: **string** - "published" (tampil) atau "draft" (tidak tampil)

---

## 3. `scopes` Collection

### Schema:
```javascript
scopes (collection)
  └── {scopeId} (document)
      └── nama: "Teknik Informatika" (string)
```

### Example Documents:
```javascript
{ nama: "Teknik Informatika" }
{ nama: "Kesehatan" }
{ nama: "Ekonomi" }
{ nama: "Pendidikan" }
{ nama: "Pengabdian Masyarakat" }
{ nama: "AI" }
{ nama: "Data Science" }
{ nama: "Sistem Informasi" }
```

**Purpose:** Master data untuk scope options. Dipakai untuk:
- Filter di halaman journals
- Dropdown saat add/edit jurnal
- Multiple selection (jurnal bisa punya banyak scope)

---

## 4. `kategori_artikel` Collection

### Schema:
```javascript
kategori_artikel (collection)
  └── {kategoriId} (document)
      └── nama: "Tips" (string)
```

### Example Documents:
```javascript
{ nama: "Tips" }
{ nama: "Berita" }
{ nama: "Tutorial" }
{ nama: "Riset & Akademik" }
{ nama: "Opini" }
```

**Purpose:** Master data untuk kategori artikel. Dipakai untuk:
- Filter di halaman articles
- Dropdown saat add/edit artikel
- Single selection (artikel hanya 1 kategori)

---

## 5. `journal_submissions` Collection

### Schema:
```javascript
journal_submissions (collection)
  └── {submissionId} (document)
      ├── nama: "Nama Jurnal" (string)
      ├── instansi: "Universitas ABC" (string)
      ├── scope: ["Teknik", "AI"] (array)
      ├── akreditasi: "SINTA 3" (string)
      ├── harga: 400000 (number)
      ├── frekuensi: "Maret, September" (string)
      ├── waktuReview: 2 (number)
      ├── fastTrack: (map)
      │   ├── tersedia: false (boolean)
      │   └── biaya: 0 (number)
      ├── tautan: "https://example.com" (string)
      ├── namaPengusul: "John Doe" (string)
      ├── emailPengusul: "john@example.com" (string)
      ├── status: "pending" (string) // "pending", "approved", "rejected"
      └── tanggalSubmit: (timestamp)
```

**Purpose:** Menyimpan usulan jurnal baru dari user public.

**Status flow:**
- `pending` - Baru masuk, belum direview admin
- `approved` - Disetujui admin, dipindah ke collection `journals`
- `rejected` - Ditolak admin

---

## 6. `article_submissions` Collection

### Schema:
```javascript
article_submissions (collection)
  └── {submissionId} (document)
      ├── judul: "Judul Artikel" (string)
      ├── slug: "judul-artikel" (string) // auto-generated
      ├── konten: "<p>Isi artikel...</p>" (string)
      ├── ringkasan: "Summary artikel..." (string)
      ├── kategori: "Tips" (string)
      ├── penulis: "Jane Doe" (string)
      ├── emailPenulis: "jane@example.com" (string)
      ├── status: "pending" (string) // "pending", "approved", "rejected"
      └── tanggalSubmit: (timestamp)
```

**Purpose:** Menyimpan usulan artikel baru dari user public.

**Status flow:**
- `pending` - Baru masuk, belum direview admin
- `approved` - Disetujui admin, dipindah ke collection `articles`
- `rejected` - Ditolak admin

---

## 🔍 **Indexes Needed**

Untuk query performance, buat indexes:

### Journals:
```
Collection: journals
Fields:
  - status (Ascending)
  - timestamp (Descending)
```

### Articles:
```
Collection: articles
Fields:
  - status (Ascending)
  - tanggalPublish (Descending)
```

**Cara buat:** Firestore Console > Indexes > Create Index

---

## 🔒 **Security Rules**

Sudah ada di file `firestore.rules`, highlights:

```javascript
// Journals - Public read aktif only, auth write
match /journals/{journalId} {
  allow read: if resource.data.status == 'aktif' || request.auth != null;
  allow write: if request.auth != null;
}

// Articles - Public read published only, auth write
match /articles/{articleId} {
  allow read: if resource.data.status == 'published' || request.auth != null;
  allow write: if request.auth != null;
}

// Submissions - Public create, auth read/update
match /journal_submissions/{id} {
  allow create: if true;
  allow read, update, delete: if request.auth != null;
}
```

---

## 📋 **Quick Reference: Field Names**

### Journals:
```
nama, instansi, scope[], akreditasi, harga, frekuensi,
waktuReview, fastTrack{tersedia, biaya}, tautan, status, timestamp
```

### Articles:
```
judul, slug, konten, ringkasan, kategori, penulis,
tanggalPublish, views, status
```

### Scopes & Kategori:
```
nama
```

### Submissions:
```
(same as journals/articles) + namaPengusul, emailPengusul,
status, tanggalSubmit
```

---

## 💡 **Important Notes**

1. **Scope is Array** - Jurnal bisa punya multiple scopes
   ```javascript
   scope: ["Teknik Informatika", "AI", "Data Science"]
   ```

2. **FastTrack is Object** - Nested object dengan 2 fields
   ```javascript
   fastTrack: {
     tersedia: true,
     biaya: 1000000
   }
   ```

3. **Timestamp Auto** - Gunakan `serverTimestamp()` saat create/update
   ```javascript
   timestamp: firebase.firestore.FieldValue.serverTimestamp()
   ```

4. **Views Increment** - Saat artikel dibuka, increment:
   ```javascript
   views: firebase.firestore.FieldValue.increment(1)
   ```

5. **Status Values:**
   - Journals: `"aktif"` atau `"hidden"`
   - Articles: `"published"` atau `"draft"`
   - Submissions: `"pending"`, `"approved"`, atau `"rejected"`

---

## 🎯 **Data Validation**

### Akreditasi Options:
- SINTA 1
- SINTA 2
- SINTA 3
- SINTA 4
- SINTA 5
- SINTA 6

### Frekuensi Format:
```
"Januari, April, Juli, Oktober"
"Maret, September"
"Setiap bulan"
```

### Slug Format:
```
lowercase, hyphen-separated, no spaces
"tips-memilih-jurnal"
"panduan-publikasi-2025"
```

---

**Updated: 28 Desember 2025**