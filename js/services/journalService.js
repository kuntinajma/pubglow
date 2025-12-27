/**
 * Journal Service
 * Handles all journal-related operations
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

/**
 * Get all active journals
 * @returns {Promise<Array>} Array of journals
 */
export async function getActiveJournals() {
  try {
    const q = query(
      collection(db, COLLECTIONS.JOURNALS),
      where('status', '==', 'aktif'),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
}

/**
 * Get all journals (for admin)
 * @returns {Promise<Array>} Array of all journals
 */
export async function getAllJournals() {
  try {
    const q = query(
      collection(db, COLLECTIONS.JOURNALS),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all journals:', error);
    throw error;
  }
}

/**
 * Get journal by ID
 * @param {string} id - Journal ID
 * @returns {Promise<Object>} Journal data
 */
export async function getJournalById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.JOURNALS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Journal not found');
  } catch (error) {
    console.error('Error fetching journal:', error);
    throw error;
  }
}

/**
 * Create new journal
 * @param {Object} journalData - Journal data
 * @returns {Promise<string>} New journal ID
 */
export async function createJournal(journalData) {
  try {
    const data = {
      ...journalData,
      timestamp: Timestamp.now(),
      status: 'aktif'
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.JOURNALS), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating journal:', error);
    throw error;
  }
}

/**
 * Update journal
 * @param {string} id - Journal ID
 * @param {Object} updates - Updated data
 * @returns {Promise<void>}
 */
export async function updateJournal(id, updates) {
  try {
    const docRef = doc(db, COLLECTIONS.JOURNALS, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating journal:', error);
    throw error;
  }
}

/**
 * Delete journal
 * @param {string} id - Journal ID
 * @returns {Promise<void>}
 */
export async function deleteJournal(id) {
  try {
    const docRef = doc(db, COLLECTIONS.JOURNALS, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting journal:', error);
    throw error;
  }
}

/**
 * Toggle journal status (aktif/hidden)
 * @param {string} id - Journal ID
 * @param {string} currentStatus - Current status
 * @returns {Promise<void>}
 */
export async function toggleJournalStatus(id, currentStatus) {
  const newStatus = currentStatus === 'aktif' ? 'hidden' : 'aktif';
  await updateJournal(id, { status: newStatus });
}

/**
 * Bulk delete journals
 * @param {Array<string>} ids - Array of journal IDs
 * @returns {Promise<void>}
 */
export async function bulkDeleteJournals(ids) {
  try {
    const promises = ids.map(id => deleteJournal(id));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error bulk deleting journals:', error);
    throw error;
  }
}

/**
 * Bulk toggle journal status
 * @param {Array<string>} ids - Array of journal IDs
 * @param {string} newStatus - New status
 * @returns {Promise<void>}
 */
export async function bulkToggleStatus(ids, newStatus) {
  try {
    const promises = ids.map(id => updateJournal(id, { status: newStatus }));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error bulk toggling status:', error);
    throw error;
  }
}