# Firebase Setup Guide untuk PubGlow

## 📋 Langkah-langkah Setup Firebase

### 1. Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau "Buat project"
3. Masukkan nama project: **PubGlow**
4. (Optional) Disable Google Analytics jika tidak perlu
5. Klik "Create project"

---

### 2. Register Web App

1. Di Firebase Console, klik ⚙️ (Settings) > Project settings
2. Scroll ke bawah, klik "Add app" > pilih icon **</>** (Web)
3. Masukkan nickname: **PubGlow Web**
4. ✅ Centang "Also set up Firebase Hosting" (optional)
5. Klik "Register app"
6. **Copy firebaseConfig object** yang muncul

---

### 3. Setup Firestore Database

1. Di sidebar Firebase Console, klik **Firestore Database**
2. Klik "Create database"
3. Pilih mode:
   - **Production mode** (untuk live) - Recommended
   - Test mode (untuk development)
4. Pilih location: **asia-southeast2 (Jakarta)**
5. Klik "Enable"

#### Firestore Security Rules (Production):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read for journals
    match /journals/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users
    }
    
    // Public read for articles
    match /articles/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read for scopes
    match /scopes/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read for categories
    match /kategori_artikel/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Submissions only writable by anyone, readable by authenticated
    match /journal_submissions/{document} {
      allow read: if request.auth != null;
      allow create: if true; // Public can submit
      allow update, delete: if request.auth != null;
    }
    
    match /article_submissions/{document} {
      allow read: if request.auth != null;
      allow create: if true; // Public can submit
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

### 4. Setup Authentication

1. Di sidebar, klik **Authentication**
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Enable **Email/Password**:
   - Toggle ON untuk "Email/Password"
   - Klik "Save"

#### Buat Admin User:
1. Klik tab "Users"
2. Klik "Add user"
3. Email: `admin@pubglow.com` (atau email Anda)
4. Password: `[BuatPasswordKuat]`
5. Klik "Add user"

---

### 5. Setup Storage (Optional - untuk upload gambar)

1. Di sidebar, klik **Storage**
2. Klik "Get started"
3. Pilih **Production mode**
4. Pilih location: **asia-southeast2 (Jakarta)**
5. Klik "Done"

#### Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Only authenticated write
    }
  }
}
```

---

### 6. Update Konfigurasi di Code

1. Buka file `js/firebase.js`
2. Replace konfigurasi dengan config dari Firebase Console:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // Dari Firebase Console
  authDomain: "pubglow-xxxxx.firebaseapp.com",
  projectId: "pubglow-xxxxx",
  storageBucket: "pubglow-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

3. Commit dan push ke GitHub

---

### 7. Setup Firestore Collections

Buat collections berikut di Firestore:

#### a. `journals`
```javascript
{
  nama: "Jurnal Teknologi Informasi",
  instansi: "Universitas Indonesia",
  akreditasi: "Sinta 2",
  scope: "Teknik Informatika",
  harga: 500000,
  estimasiWaktu: 3, // dalam bulan
  url: "https://example.com",
  deskripsi: "Jurnal tentang...",
  fastTrack: true,
  hargaFastTrack: 1000000,
  estimasiFastTrack: 1.5,
  status: "active",
  createdAt: "2025-12-27T13:00:00Z"
}
```

#### b. `articles`
```javascript
{
  judul: "Tips Publikasi Jurnal",
  slug: "tips-publikasi-jurnal",
  kategori: "Tips Publikasi",
  penulis: "Admin",
  konten: "<p>Konten HTML...</p>",
  status: "published",
  views: 0,
  tanggalPublish: "2025-12-27T13:00:00Z",
  createdAt: "2025-12-27T13:00:00Z",
  updatedAt: "2025-12-27T13:00:00Z"
}
```

#### c. `scopes`
```javascript
{
  nama: "Teknik Informatika",
  createdAt: "2025-12-27T13:00:00Z"
}
```

#### d. `kategori_artikel`
```javascript
{
  nama: "Tips Publikasi",
  createdAt: "2025-12-27T13:00:00Z"
}
```

#### e. `journal_submissions`
```javascript
{
  nama: "Jurnal XYZ",
  instansi: "Universitas ABC",
  akreditasi: "Sinta 3",
  scope: "Teknik",
  harga: 300000,
  url: "https://example.com",
  namaPengusul: "John Doe",
  emailPengusul: "john@example.com",
  status: "pending",
  tanggalSubmit: "2025-12-27T13:00:00Z"
}
```

#### f. `article_submissions`
```javascript
{
  judul: "Artikel ABC",
  kategori: "Tutorial",
  konten: "<p>Konten...</p>",
  penulis: "Jane Doe",
  emailPenulis: "jane@example.com",
  status: "pending",
  tanggalSubmit: "2025-12-27T13:00:00Z"
}
```

---

### 8. Test Connection

1. Buka website: `https://pubglow.vercel.app`
2. Buka Browser Console (F12)
3. Cari pesan: `🔥 Firebase initialized successfully`
4. Jika muncul ✅ berarti Firebase sudah terkoneksi!

---

### 9. Deploy ke Production

```bash
# Commit changes
git add .
git commit -m "Add Firebase configuration"
git push origin main

# Vercel akan auto-deploy
```

---

## 🔐 Environment Variables (Recommended)

Untuk keamanan production, simpan Firebase config di environment variables:

### Vercel Environment Variables:

1. Buka Vercel Dashboard > Project Settings > Environment Variables
2. Tambahkan:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=pubglow-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pubglow-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=pubglow-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

3. Update `js/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};
```

---

## 📊 Firestore Indexes (Jika diperlukan)

Jika query kompleks error, buat composite indexes:

1. Firestore Console > Indexes
2. Klik "Create Index"
3. Collection: `journals`
4. Fields:
   - `status` (Ascending)
   - `createdAt` (Descending)
5. Query scope: Collection
6. Klik "Create"

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Firestore Database enabled
- [ ] Security rules configured
- [ ] Authentication enabled
- [ ] Admin user created
- [ ] Storage enabled (optional)
- [ ] `js/firebase.js` updated with config
- [ ] Collections created in Firestore
- [ ] Website tested and connected
- [ ] Environment variables set (production)

---

## 🆘 Troubleshooting

### Error: "Firebase not initialized"
- Cek apakah `firebaseConfig` sudah diisi dengan benar
- Pastikan API key valid

### Error: "Permission denied"
- Cek Firestore Security Rules
- Pastikan user sudah authenticated (untuk admin)

### Error: "Collection not found"
- Buat collection manual di Firestore Console
- Tambahkan minimal 1 dummy document

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Setup selesai! 🎉 PubGlow siap menggunakan Firebase!**