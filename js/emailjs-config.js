// EmailJS Configuration for PubGlow
// Documentation: https://www.emailjs.com/docs/

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_qzsmxcn',
  // TODO: Add your template IDs from EmailJS dashboard
  TEMPLATES: {
    CONTACT_FORM: 'YOUR_CONTACT_TEMPLATE_ID',
    JOURNAL_SUBMISSION: 'YOUR_JOURNAL_SUBMISSION_TEMPLATE_ID',
    ARTICLE_SUBMISSION: 'YOUR_ARTICLE_SUBMISSION_TEMPLATE_ID',
    ADMIN_NOTIFICATION: 'YOUR_ADMIN_NOTIFICATION_TEMPLATE_ID'
  },
  // TODO: Add your public key from EmailJS dashboard
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY'
};

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  console.log('📧 EmailJS initialized');
}

/**
 * Send email using EmailJS
 * @param {string} templateId - Template ID from EmailJS
 * @param {object} templateParams - Parameters for the email template
 * @returns {Promise}
 */
export async function sendEmail(templateId, templateParams) {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      templateParams
    );
    console.log('✅ Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

/**
 * Send contact form email
 * @param {object} formData - Form data {name, email, subject, message}
 */
export async function sendContactEmail(formData) {
  return sendEmail(EMAILJS_CONFIG.TEMPLATES.CONTACT_FORM, {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_email: 'admin@pubglow.com'
  });
}

/**
 * Send journal submission notification to admin
 * @param {object} submissionData - Journal submission data
 */
export async function sendJournalSubmissionEmail(submissionData) {
  return sendEmail(EMAILJS_CONFIG.TEMPLATES.JOURNAL_SUBMISSION, {
    journal_name: submissionData.nama,
    institution: submissionData.instansi,
    submitter_name: submissionData.namaPengusul,
    submitter_email: submissionData.emailPengusul,
    submission_date: new Date().toLocaleDateString('id-ID'),
    admin_link: `https://pubglow.vercel.app/admin.html#pendingJurnal`
  });
}

/**
 * Send article submission notification to admin
 * @param {object} submissionData - Article submission data
 */
export async function sendArticleSubmissionEmail(submissionData) {
  return sendEmail(EMAILJS_CONFIG.TEMPLATES.ARTICLE_SUBMISSION, {
    article_title: submissionData.judul,
    category: submissionData.kategori,
    author_name: submissionData.penulis,
    author_email: submissionData.emailPenulis,
    submission_date: new Date().toLocaleDateString('id-ID'),
    admin_link: `https://pubglow.vercel.app/admin.html#pendingArtikel`
  });
}