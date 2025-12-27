# PubGlow ✨

**Glow Up Your Academic Game**

Platform modern untuk menemukan jurnal ilmiah yang tepat, dilengkapi dengan blog informatif dan sistem kontribusi komunitas.

## 🌟 Features

### Untuk Pengunjung
- 📊 **List Jurnal Interaktif** - Tabel dengan filter, search, sort, dan pagination
- 🔍 **Advanced Filter** - Filter berdasarkan akreditasi, scope, biaya, fast track, dan frekuensi
- 📥 **Export Data** - Download list jurnal dalam format Excel atau PDF
- 📝 **Blog Artikel** - Tips dan info seputar publikasi ilmiah
- 🤝 **Kontribusi** - Usulkan jurnal atau artikel untuk ditambahkan

### Untuk Admin
- ⚙️ **Kelola Jurnal** - CRUD lengkap dengan bulk actions
- 📁 **Kelola Kategori** - Manage scope jurnal & kategori blog
- ✅ **Verifikasi Usulan** - Review dan approve/reject usulan dari pengguna
- ✉️ **Email Notifikasi** - Otomatis kirim email ke pengusul
- 📊 **Export Report** - Download laporan lengkap dengan timestamp

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase Firestore
- **Email Service**: EmailJS
- **Export**: SheetJS (xlsx), jsPDF
- **Icons**: Lucide Icons

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/kuntinajma/pubglow.git
cd pubglow
```

### 2. Setup Firebase

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Copy konfigurasi Firebase
4. Buat file `js/config/firebase.js` (copy dari `firebase.example.js`)
5. Paste konfigurasi Anda

### 3. Setup EmailJS

1. Daftar di [EmailJS](https://www.emailjs.com/)
2. Buat email templates untuk notifikasi
3. Copy Service ID, Template IDs, dan Public Key
4. Buat file `js/config/emailjs.js` (copy dari `emailjs.example.js`)
5. Paste konfigurasi Anda

### 4. Firestore Security Rules

Paste rules berikut di Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /journals/{document} {
      allow read: if resource.data.status == 'aktif';
      allow write: if request.auth != null;
    }
    
    match /articles/{document} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    match /submissions/{document} {
      allow read, write: if true;
    }
    
    match /article_submissions/{document} {
      allow read, write: if true;
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Deploy

#### Option A: Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

#### Option B: Vercel
```bash
vercel
```

#### Option C: GitHub Pages
Push ke branch `gh-pages` atau setup di repository settings.

## 📁 Project Structure

```
pubglow/
├── index.html              # Beranda
├── jurnal.html             # List jurnal
├── blog.html               # List artikel
├── blog-detail.html        # Detail artikel
├── submit-jurnal.html      # Form usulan jurnal
├── submit-artikel.html     # Form usulan artikel
├── admin.html              # Admin dashboard
├── css/
│   ├── variables.css       # CSS variables
│   ├── base.css           # Base styles
│   ├── components.css     # Reusable components
│   ├── layout.css         # Layout & grid
│   └── pages.css          # Page-specific styles
├── js/
│   ├── config/            # Configuration files
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── components/        # UI components
│   └── pages/             # Page-specific logic
└── lib/                   # External libraries
```

## 🎨 Design System

### Colors
- **Primary Gradient**: `#667eea → #764ba2` (Purple/Blue)
- **Accent**: `#06b6d4` (Cyan)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### Typography
- **Heading**: Poppins
- **Body**: Inter

## 📖 Usage Guide

Lihat [SETUP.md](SETUP.md) untuk panduan lengkap setup dan konfigurasi.

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

MIT License - bebas digunakan untuk project apapun.

## 💬 Contact

Ada pertanyaan? Buka issue di repository ini!

---

**Made with ✨ by Najma**

*Glow Up Your Academic Game!* 🚀