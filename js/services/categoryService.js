/**
 * Category Service
 * Handles category operations for both journal scope and blog
 */

import { db, COLLECTIONS } from '../config/firebase.js';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Get categories by type
 * @param {string} type - 'scope' or 'blog'
 * @returns {Promise<Array>} Array of categories
 */
export async function getCategoriesByType(type) {
  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('tipe', '==', type),
      orderBy('nama')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get all scope categories
 * @returns {Promise<Array>} Array of scope categories
 */
export async function getScopeCategories() {
  return getCategoriesByType('scope');
}

/**
 * Get all blog categories
 * @returns {Promise<Array>} Array of blog categories
 */
export async function getBlogCategories() {
  return getCategoriesByType('blog');
}

/**
 * Get all categories (for admin)
 * @returns {Promise<Array>} Array of all categories
 */
export async function getAllCategories() {
  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      orderBy('tipe'),
      orderBy('nama')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
}

/**
 * Create new category
 * @param {string} nama - Category name
 * @param {string} tipe - Category type ('scope' or 'blog')
 * @returns {Promise<string>} New category ID
 */
export async function createCategory(nama, tipe) {
  try {
    const data = { nama, tipe };
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

/**
 * Update category
 * @param {string} id - Category ID
 * @param {string} nama - New name
 * @returns {Promise<void>}
 */
export async function updateCategory(id, nama) {
  try {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(docRef, { nama });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

/**
 * Delete category
 * @param {string} id - Category ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  try {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

/**
 * Bulk delete categories
 * @param {Array<string>} ids - Array of category IDs
 * @returns {Promise<void>}
 */
export async function bulkDeleteCategories(ids) {
  try {
    const promises = ids.map(id => deleteCategory(id));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error bulk deleting categories:', error);
    throw error;
  }
}

/**
 * Check if category is in use
 * @param {string} categoryName - Category name
 * @param {string} type - 'scope' or 'blog'
 * @returns {Promise<boolean>} True if in use
 */
export async function isCategoryInUse(categoryName, type) {
  try {
    if (type === 'scope') {
      // Check journals
      const q = query(
        collection(db, COLLECTIONS.JOURNALS),
        where('scope', 'array-contains', categoryName)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } else if (type === 'blog') {
      // Check articles
      const q = query(
        collection(db, COLLECTIONS.ARTICLES),
        where('kategori', '==', categoryName)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    }
    return false;
  } catch (error) {
    console.error('Error checking category usage:', error);
    return false;
  }
}