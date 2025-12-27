/**
 * Email Service
 * Handles email notifications via EmailJS
 */

import { emailConfig } from '../config/emailjs.js';

/**
 * Send email via EmailJS
 * @param {string} templateId - EmailJS template ID
 * @param {Object} params - Template parameters
 * @returns {Promise<void>}
 */
async function sendEmail(templateId, params) {
  try {
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS not loaded');
    }
    
    await emailjs.send(
      emailConfig.serviceId,
      templateId,
      params
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send journal approval email
 * @param {string} toEmail - Recipient email
 * @param {string} journalName - Journal name
 * @returns {Promise<void>}
 */
export async function sendJournalApprovedEmail(toEmail, journalName) {
  const params = {
    to_email: toEmail,
    jurnal_nama: journalName
  };
  await sendEmail(emailConfig.templates.jurnalApproved, params);
}

/**
 * Send journal rejection email
 * @param {string} toEmail - Recipient email
 * @param {string} journalName - Journal name
 * @param {string} reason - Rejection reason
 * @returns {Promise<void>}
 */
export async function sendJournalRejectedEmail(toEmail, journalName, reason) {
  const params = {
    to_email: toEmail,
    jurnal_nama: journalName,
    admin_notes: reason
  };
  await sendEmail(emailConfig.templates.jurnalRejected, params);
}

/**
 * Send article approval email
 * @param {string} toEmail - Recipient email
 * @param {string} contributorName - Contributor name
 * @param {string} articleTitle - Article title
 * @param {string} articleUrl - Article URL
 * @returns {Promise<void>}
 */
export async function sendArticleApprovedEmail(toEmail, contributorName, articleTitle, articleUrl) {
  const params = {
    to_email: toEmail,
    nama_kontributor: contributorName,
    artikel_judul: articleTitle,
    artikel_url: articleUrl
  };
  await sendEmail(emailConfig.templates.artikelApproved, params);
}

/**
 * Send article rejection email
 * @param {string} toEmail - Recipient email
 * @param {string} contributorName - Contributor name
 * @param {string} articleTitle - Article title
 * @param {string} reason - Rejection reason
 * @returns {Promise<void>}
 */
export async function sendArticleRejectedEmail(toEmail, contributorName, articleTitle, reason) {
  const params = {
    to_email: toEmail,
    nama_kontributor: contributorName,
    artikel_judul: articleTitle,
    admin_notes: reason
  };
  await sendEmail(emailConfig.templates.artikelRejected, params);
}