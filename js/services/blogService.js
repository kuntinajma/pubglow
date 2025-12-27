/**
 * Blog Service
 * Handles all blog article operations
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
  increment,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Get all published articles
 * @returns {Promise<Array>} Array of articles
 */
export async function getPublishedArticles() {
  try {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('status', '==', 'published'),
      orderBy('tanggalPublish', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

/**
 * Get all articles (for admin)
 * @returns {Promise<Array>} Array of all articles
 */
export async function getAllArticles() {
  try {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      orderBy('tanggalPublish', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all articles:', error);
    throw error;
  }
}

/**
 * Get article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} Article data
 */
export async function getArticleById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Article not found');
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

/**
 * Get article by slug
 * @param {string} slug - Article slug
 * @returns {Promise<Object>} Article data
 */
export async function getArticleBySlug(slug) {
  try {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    throw new Error('Article not found');
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw error;
  }
}

/**
 * Create new article
 * @param {Object} articleData - Article data
 * @returns {Promise<string>} New article ID
 */
export async function createArticle(articleData) {
  try {
    const data = {
      ...articleData,
      tanggalPublish: Timestamp.now(),
      views: 0,
      status: articleData.status || 'published'
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.ARTICLES), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * Update article
 * @param {string} id - Article ID
 * @param {Object} updates - Updated data
 * @returns {Promise<void>}
 */
export async function updateArticle(id, updates) {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete article
 * @param {string} id - Article ID
 * @returns {Promise<void>}
 */
export async function deleteArticle(id) {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

/**
 * Increment article views
 * @param {string} id - Article ID
 * @returns {Promise<void>}
 */
export async function incrementViews(id) {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw, views count is not critical
  }
}

/**
 * Generate slug from title
 * @param {string} title - Article title
 * @returns {string} Slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate excerpt from content
 * @param {string} content - Article content
 * @param {number} length - Max length (default: 200)
 * @returns {string} Excerpt
 */
export function generateExcerpt(content, length = 200) {
  // Strip HTML tags if any
  const plainText = content.replace(/<[^>]*>/g, '');
  if (plainText.length <= length) {
    return plainText;
  }
  return plainText.substring(0, length).trim() + '...';
}