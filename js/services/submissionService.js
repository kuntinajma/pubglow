/**
 * Submission Service
 * Handles journal and article submissions
 */

import { db, COLLECTIONS } from '../config/firebase.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { createJournal } from './journalService.js';
import { createArticle, generateSlug, generateExcerpt } from './blogService.js';

/**
 * Submit journal proposal
 * @param {Object} journalData - Journal data
 * @param {string} submitterEmail - Submitter email
 * @returns {Promise<string>} Submission ID
 */
export async function submitJournal(journalData, submitterEmail) {
  try {
    const data = {
      ...journalData,
      submittedBy: submitterEmail,
      submittedAt: Timestamp.now(),
      status: 'pending',
      adminNotes: ''
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.SUBMISSIONS), data);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting journal:', error);
    throw error;
  }
}

/**
 * Submit article proposal
 * @param {Object} articleData - Article data
 * @returns {Promise<string>} Submission ID
 */
export async function submitArticle(articleData) {
  try {
    const data = {
      ...articleData,
      submittedAt: Timestamp.now(),
      status: 'pending',
      adminNotes: ''
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.ARTICLE_SUBMISSIONS), data);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting article:', error);
    throw error;
  }
}

/**
 * Get all journal submissions
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Array of submissions
 */
export async function getJournalSubmissions(status = null) {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, COLLECTIONS.SUBMISSIONS),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.SUBMISSIONS),
        orderBy('submittedAt', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching journal submissions:', error);
    throw error;
  }
}

/**
 * Get all article submissions
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Array of submissions
 */
export async function getArticleSubmissions(status = null) {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, COLLECTIONS.ARTICLE_SUBMISSIONS),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.ARTICLE_SUBMISSIONS),
        orderBy('submittedAt', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching article submissions:', error);
    throw error;
  }
}

/**
 * Get submission by ID
 * @param {string} id - Submission ID
 * @param {string} type - 'journal' or 'article'
 * @returns {Promise<Object>} Submission data
 */
export async function getSubmissionById(id, type) {
  try {
    const collectionName = type === 'journal' 
      ? COLLECTIONS.SUBMISSIONS 
      : COLLECTIONS.ARTICLE_SUBMISSIONS;
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Submission not found');
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
}

/**
 * Update submission
 * @param {string} id - Submission ID
 * @param {string} type - 'journal' or 'article'
 * @param {Object} updates - Updated data
 * @returns {Promise<void>}
 */
export async function updateSubmission(id, type, updates) {
  try {
    const collectionName = type === 'journal' 
      ? COLLECTIONS.SUBMISSIONS 
      : COLLECTIONS.ARTICLE_SUBMISSIONS;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating submission:', error);
    throw error;
  }
}

/**
 * Approve journal submission
 * @param {string} id - Submission ID
 * @returns {Promise<string>} New journal ID
 */
export async function approveJournalSubmission(id) {
  try {
    const submission = await getSubmissionById(id, 'journal');
    
    // Create journal from submission
    const { submittedBy, submittedAt, status, adminNotes, id: _, ...journalData } = submission;
    const journalId = await createJournal(journalData);
    
    // Update submission status
    await updateSubmission(id, 'journal', { status: 'approved' });
    
    return journalId;
  } catch (error) {
    console.error('Error approving journal submission:', error);
    throw error;
  }
}

/**
 * Approve article submission
 * @param {string} id - Submission ID
 * @returns {Promise<string>} New article ID
 */
export async function approveArticleSubmission(id) {
  try {
    const submission = await getSubmissionById(id, 'article');
    
    // Determine author name
    let penulis = 'Kontributor Anonim';
    if (submission.publikasiNama && submission.namaKontributor) {
      penulis = submission.namaKontributor;
    }
    
    // Create article from submission
    const articleData = {
      judul: submission.judul,
      slug: generateSlug(submission.judul),
      konten: submission.konten,
      ringkasan: generateExcerpt(submission.konten),
      kategori: submission.kategori,
      penulis: penulis,
      status: 'published'
    };
    
    const articleId = await createArticle(articleData);
    
    // Update submission status
    await updateSubmission(id, 'article', { status: 'approved' });
    
    return articleId;
  } catch (error) {
    console.error('Error approving article submission:', error);
    throw error;
  }
}

/**
 * Reject submission
 * @param {string} id - Submission ID
 * @param {string} type - 'journal' or 'article'
 * @param {string} adminNotes - Rejection reason
 * @returns {Promise<void>}
 */
export async function rejectSubmission(id, type, adminNotes) {
  try {
    await updateSubmission(id, type, {
      status: 'rejected',
      adminNotes: adminNotes
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    throw error;
  }
}

/**
 * Delete submission
 * @param {string} id - Submission ID
 * @param {string} type - 'journal' or 'article'
 * @returns {Promise<void>}
 */
export async function deleteSubmission(id, type) {
  try {
    const collectionName = type === 'journal' 
      ? COLLECTIONS.SUBMISSIONS 
      : COLLECTIONS.ARTICLE_SUBMISSIONS;
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
}

/**
 * Get pending submissions count
 * @returns {Promise<Object>} Count of pending submissions
 */
export async function getPendingCount() {
  try {
    const [journalSubmissions, articleSubmissions] = await Promise.all([
      getJournalSubmissions('pending'),
      getArticleSubmissions('pending')
    ]);
    
    return {
      journals: journalSubmissions.length,
      articles: articleSubmissions.length,
      total: journalSubmissions.length + articleSubmissions.length
    };
  } catch (error) {
    console.error('Error getting pending count:', error);
    return { journals: 0, articles: 0, total: 0 };
  }
}