# EmailJS Setup Guide untuk PubGlow

## 📧 Langkah-langkah Setup EmailJS

### 1. Buat Akun EmailJS

1. Buka [EmailJS.com](https://www.emailjs.com/)
2. Klik **"Sign Up"** atau **"Get Started"**
3. Register dengan email atau Google
4. Verifikasi email Anda
5. Login ke dashboard

---

### 2. Connect Email Service

1. Di dashboard EmailJS, klik **"Email Services"**
2. Klik **"Add New Service"**
3. Pilih provider email Anda:
   - **Gmail** (Recommended)
   - Outlook
   - Yahoo
   - Custom SMTP
4. Untuk Gmail:
   - Klik **"Connect Account"**
   - Login dengan Gmail Anda (untuk menerima email)
   - Allow permissions
5. Service Name: **PubGlow Notifications**
6. Service ID akan auto-generated: `service_qzsmxcn` ✅ (sudah ada!)
7. Klik **"Create Service"**

---

### 3. Create Email Templates

Buat 4 templates untuk PubGlow:

#### **Template 1: Contact Form**

1. Klik **"Email Templates"**
2. Klik **"Create New Template"**
3. Template Name: **Contact Form Submission**
4. Subject: `New Contact from {{from_name}}`
5. Content:

```html
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
<hr>
<p><small>Sent from PubGlow Contact Form</small></p>
```

6. **To Email:** `admin@pubglow.com` (atau email Anda)
7. Klik **"Save"**
8. **Copy Template ID** (misal: `template_abc123`)

---

#### **Template 2: Journal Submission Notification**

1. Create New Template
2. Template Name: **Journal Submission Notification**
3. Subject: `New Journal Submission: {{journal_name}}`
4. Content:

```html
<h2>🔔 New Journal Submission</h2>
<p><strong>Journal Name:</strong> {{journal_name}}</p>
<p><strong>Institution:</strong> {{institution}}</p>
<hr>
<p><strong>Submitted by:</strong> {{submitter_name}}</p>
<p><strong>Email:</strong> {{submitter_email}}</p>
<p><strong>Date:</strong> {{submission_date}}</p>
<hr>
<p><a href="{{admin_link}}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Submission</a></p>
<p><small>PubGlow Admin System</small></p>
```

5. **To Email:** `admin@pubglow.com`
6. Save & **Copy Template ID**

---

#### **Template 3: Article Submission Notification**

1. Create New Template
2. Template Name: **Article Submission Notification**
3. Subject: `New Article Submission: {{article_title}}`
4. Content:

```html
<h2>📰 New Article Submission</h2>
<p><strong>Title:</strong> {{article_title}}</p>
<p><strong>Category:</strong> {{category}}</p>
<hr>
<p><strong>Author:</strong> {{author_name}}</p>
<p><strong>Email:</strong> {{author_email}}</p>
<p><strong>Date:</strong> {{submission_date}}</p>
<hr>
<p><a href="{{admin_link}}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Submission</a></p>
<p><small>PubGlow Admin System</small></p>
```

5. **To Email:** `admin@pubglow.com`
6. Save & **Copy Template ID**

---

#### **Template 4: Admin Notification (Generic)**

1. Create New Template
2. Template Name: **Admin Notification**
3. Subject: `PubGlow Alert: {{notification_type}}`
4. Content:

```html
<h2>⚠️ {{notification_type}}</h2>
<p>{{notification_message}}</p>
<hr>
<p><strong>Time:</strong> {{timestamp}}</p>
<p><a href="https://pubglow.vercel.app/admin.html">Go to Admin Dashboard</a></p>
```

5. Save & **Copy Template ID**

---

### 4. Get Public Key

1. Di dashboard EmailJS, klik **"Account"** (top right)
2. Klik **"General"** tab
3. Scroll ke **"API Keys"**
4. Copy **"Public Key"** (misal: `abc123XYZ`)

---

### 5. Update Code dengan Config

1. Edit file: **`js/emailjs-config.js`**
2. Update dengan Template IDs dan Public Key:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_qzsmxcn', // ✅ Sudah benar
  TEMPLATES: {
    CONTACT_FORM: 'template_abc123',              // ← Paste Template ID #1
    JOURNAL_SUBMISSION: 'template_xyz456',        // ← Paste Template ID #2
    ARTICLE_SUBMISSION: 'template_def789',        // ← Paste Template ID #3
    ADMIN_NOTIFICATION: 'template_ghi012'         // ← Paste Template ID #4
  },
  PUBLIC_KEY: 'abc123XYZ'  // ← Paste Public Key
};
```

3. Commit & push

---

### 6. Add EmailJS SDK to HTML

Tambahkan script EmailJS di halaman yang perlu email:

**Untuk Contact Form:**
```html
<!-- Di contact.html atau index.html -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script type="module">
  import { sendContactEmail } from './js/emailjs-config.js';
  
  // Form submit handler
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value
    };
    
    try {
      await sendContactEmail(formData);
      alert('Pesan berhasil dikirim!');
    } catch (error) {
      alert('Gagal mengirim pesan.');
    }
  });
</script>
```

**Untuk Journal Submission:**
```javascript
import { sendJournalSubmissionEmail } from './js/emailjs-config.js';

// After successful submission to Firestore
await sendJournalSubmissionEmail(submissionData);
```

---

### 7. Test Email Sending

#### Test di EmailJS Dashboard:
1. Go to **Email Templates**
2. Pilih template
3. Klik **"Test It"** button
4. Fill dummy data
5. Send test email
6. Check inbox!

#### Test di Website:
1. Buka contact form / submission form
2. Fill & submit
3. Check browser console:
   - `✅ Email sent successfully` = BERHASIL
   - `❌ Email sending failed` = CEK CONFIG
4. Check email inbox

---

## 📊 EmailJS Dashboard Overview

```
EmailJS Dashboard
├── Email Services
│   └── service_qzsmxcn (Gmail) ✅
├── Email Templates
│   ├── Contact Form (template_xxx)
│   ├── Journal Submission (template_xxx)
│   ├── Article Submission (template_xxx)
│   └── Admin Notification (template_xxx)
├── Email History (logs sent emails)
└── Account Settings
    └── API Keys
        └── Public Key: abc123XYZ
```

---

## 🔐 Security Notes

1. **Public Key is safe** to expose in frontend code
2. **Service ID is safe** to expose
3. **Template IDs are safe** to expose
4. EmailJS validates domains automatically
5. Set **"Allowed Domains"** in EmailJS settings:
   - `pubglow.vercel.app`
   - `localhost` (for testing)

---

## ⚡ Free Tier Limits

- **200 emails/month** (Free)
- Upgrade untuk unlimited emails
- Check usage di dashboard

---

## 🆘 Troubleshooting

### Error: "Service ID not found"
- Check `SERVICE_ID` di config
- Pastikan service aktif di dashboard

### Error: "Template not found"
- Check template IDs di config
- Pastikan template sudah di-save

### Email tidak masuk:
- Check spam folder
- Verify email service connected
- Check EmailJS dashboard > Email History

### Error: "Public key not initialized"
- Add EmailJS SDK script
- Check PUBLIC_KEY di config

---

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Email service connected (Gmail)
- [ ] 4 templates created
- [ ] Template IDs copied
- [ ] Public Key copied
- [ ] `emailjs-config.js` updated
- [ ] EmailJS SDK added to HTML
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

## 📝 Template IDs to Update

**Save these IDs after creating templates:**

```javascript
CONTACT_FORM: 'template_______',           // From Template #1
JOURNAL_SUBMISSION: 'template_______',     // From Template #2
ARTICLE_SUBMISSION: 'template_______',     // From Template #3
ADMIN_NOTIFICATION: 'template_______'      // From Template #4
```

**And Public Key:**
```javascript
PUBLIC_KEY: '___________'  // From Account > API Keys
```

---

**Setup selesai! 📧 PubGlow siap mengirim email notifikasi!**