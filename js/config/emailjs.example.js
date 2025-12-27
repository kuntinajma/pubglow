/**
 * EmailJS Configuration Example
 * Copy this file to emailjs.js and fill in your credentials
 */

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

// Initialize EmailJS
export function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(emailConfig.publicKey);
  }
}