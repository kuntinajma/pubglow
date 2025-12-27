# PubGlow - Setup Guide 🚀

Panduan lengkap untuk setup dan konfigurasi PubGlow.

## 📋 Prerequisites

- Browser modern (Chrome, Firefox, Safari, Edge)
- Akun Firebase (free tier sudah cukup)
- Akun EmailJS (free tier 200 emails/bulan)
- Text editor (VS Code recommended)

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **Add Project**
3. Nama project: `pubglow` (atau sesuai keinginan)
4. Disable Google Analytics (opsional)
5. Klik **Create Project**

### 2. Enable Firestore Database

1. Di sidebar, klik **Firestore Database**
2. Klik **Create Database**
3. Pilih **Start in test mode** (nanti kita ganti rules)
4. Pilih location terdekat (asia-southeast2 untuk Indonesia)
5. Klik **Enable**

### 3. Get Firebase Configuration

1. Klik icon gear (⚙️) > **Project Settings**
2. Scroll ke bawah, klik **Add app** > pilih **Web** (<//>)
3. App nickname: `PubGlow Web`
4. Jangan centang Firebase Hosting
5. Klik **Register app**
6. Copy kode konfigurasi

### 4. Configure Firebase in Project

1. Copy file `js/config/firebase.example.js` ke `js/config/firebase.js`
2. Paste konfigurasi dari Firebase:

```javascript
// js/config/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 5. Setup Firestore Security Rules

1. Di Firestore Database, klik tab **Rules**
2. Replace dengan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Journals - public read untuk yang aktif, write hanya admin
    match /journals/{document} {
      allow read: if resource.data.status == 'aktif';
      allow write: if request.auth != null;
    }
    
    // Articles - public read untuk yang published, write hanya admin
    match /articles/{document} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    // Submissions - anyone can read and write
    match /submissions/{document} {
      allow read, write: if true;
    }
    
    match /article_submissions/{document} {
      allow read, write: if true;
    }
    
    // Categories - public read, admin write
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

### 6. Initial Data (Opsional)

Tambahkan data awal untuk testing:

#### Categories (Scope Jurnal)
```javascript
// Collection: categories
{
  nama: "Teknik Informatika",
  tipe: "scope"
}
{
  nama: "Artificial Intelligence",
  tipe: "scope"
}
{
  nama: "Data Science",
  tipe: "scope"
}
```

#### Categories (Blog)
```javascript
{
  nama: "Tips",
  tipe: "blog"
}
{
  nama: "Info",
  tipe: "blog"
}
{
  nama: "Panduan",
  tipe: "blog"
}
```

## 📧 EmailJS Setup

### 1. Create EmailJS Account

1. Buka [EmailJS](https://www.emailjs.com/)
2. Klik **Sign Up** (free)
3. Verify email

### 2. Add Email Service

1. Di dashboard, klik **Email Services**
2. Klik **Add New Service**
3. Pilih provider (Gmail recommended)
4. Connect Gmail account Anda
5. Copy **Service ID**

### 3. Create Email Templates

Buat 4 templates:

#### Template 1: Jurnal Approved
```
Subject: Usulan Jurnal Anda Disetujui ✓

Halo,

Usulan jurnal "{{jurnal_nama}}" telah disetujui dan sekarang muncul di PubGlow!

Terima kasih atas kontribusinya! ✨

Salam,
Tim PubGlow
```
- Template ID: `template_jurnal_approved`
- Variables: `{{jurnal_nama}}`, `{{to_email}}`

#### Template 2: Jurnal Rejected
```
Subject: Usulan Jurnal Perlu Perbaikan

Halo,

Usulan jurnal "{{jurnal_nama}}" belum dapat kami setujui.

Alasan: {{admin_notes}}

Silakan submit ulang dengan informasi yang lebih lengkap.

Salam,
Tim PubGlow
```
- Template ID: `template_jurnal_rejected`

#### Template 3: Artikel Approved
```
Subject: Artikel Anda Dipublikasikan! 🎉

Halo {{nama_kontributor}},

Artikel "{{artikel_judul}}" telah dipublikasikan di blog PubGlow!

Lihat di: {{artikel_url}}

Terima kasih telah berbagi pengetahuan! 🙏

Salam,
Tim PubGlow
```
- Template ID: `template_artikel_approved`

#### Template 4: Artikel Rejected
```
Subject: Usulan Artikel Perlu Revisi

Halo {{nama_kontributor}},

Usulan artikel "{{artikel_judul}}" belum dapat kami publikasikan.

Alasan: {{admin_notes}}

Silakan revisi dan submit ulang.

Salam,
Tim PubGlow
```
- Template ID: `template_artikel_rejected`

### 4. Get Public Key

1. Klik **Account** di sidebar
2. Copy **Public Key**

### 5. Configure EmailJS in Project

1. Copy file `js/config/emailjs.example.js` ke `js/config/emailjs.js`
2. Paste konfigurasi:

```javascript
// js/config/emailjs.js
export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
  templates: {
    jurnalApproved: 'template_jurnal_approved',
    jurnalRejected: 'template_jurnal_rejected',
    artikelApproved: 'template_artikel_approved',
    artikelRejected: 'template_artikel_rejected'
  }
};
```

## 🔐 Admin Authentication (Opsional)

Untuk production, aktifkan Firebase Authentication:

1. Di Firebase Console, klik **Authentication**
2. Klik **Get Started**
3. Enable **Email/Password**
4. Tambahkan user admin
5. Uncomment kode auth di `js/pages/admin.js`

## 🚀 Running Locally

### Option 1: VS Code Live Server

1. Install extension "Live Server"
2. Right-click `index.html` > **Open with Live Server**

### Option 2: Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Buka http://localhost:8000
```

### Option 3: Node.js HTTP Server

```bash
npx http-server -p 8000
```

## 📦 Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Pilih project yang sudah dibuat
# Public directory: . (root)
# Single-page app: No

# Deploy
firebase deploy
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

1. Drag & drop folder ke [Netlify Drop](https://app.netlify.com/drop)
2. Atau connect GitHub repo

## ✅ Testing Checklist

- [ ] Homepage loading
- [ ] List jurnal tampil dengan data
- [ ] Filter & search berfungsi
- [ ] Export Excel & PDF berhasil
- [ ] Form usulan jurnal bisa submit
- [ ] Blog tampil artikel
- [ ] Detail artikel bisa dibuka
- [ ] Form usulan artikel bisa submit
- [ ] Admin panel bisa diakses
- [ ] Admin bisa approve/reject usulan
- [ ] Email notifikasi terkirim

## 🐛 Troubleshooting

### Error: Firebase not defined
- Cek koneksi internet
- Pastikan `firebase.js` sudah dikonfigurasi
- Clear browser cache

### Error: EmailJS failed
- Cek Service ID dan Public Key
- Pastikan template ID benar
- Cek quota EmailJS (free: 200/month)

### Firestore permission denied
- Cek security rules
- Pastikan dokumen punya field `status`

### Data tidak muncul
- Buka browser console (F12)
- Cek error messages
- Pastikan collection name benar

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)

## 💡 Tips

1. **Development**: Gunakan test mode rules dulu
2. **Production**: Aktifkan authentication untuk admin
3. **Backup**: Export Firestore data secara berkala
4. **Monitoring**: Setup Firebase Analytics (opsional)
5. **SEO**: Tambahkan meta tags di setiap halaman

---

Ada pertanyaan? Buka issue di GitHub! 🚀