// Visitor Tracker - Track page views per day
import { db } from './firebase.js';
import { doc, getDoc, setDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Track visitor - increment count for today's date
 * Call this on page load of public pages (index.html, journals.html, articles.html, etc)
 */
export async function trackVisitor() {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Reference to today's visitor stats document
    const visitorRef = doc(db, 'visitor_stats', dateStr);
    
    // Check if document exists
    const docSnap = await getDoc(visitorRef);
    
    if (docSnap.exists()) {
      // Document exists, increment count
      await updateDoc(visitorRef, {
        count: increment(1),
        lastVisit: new Date()
      });
    } else {
      // Document doesn't exist, create with count 1
      await setDoc(visitorRef, {
        date: dateStr,
        count: 1,
        firstVisit: new Date(),
        lastVisit: new Date()
      });
    }
    
    console.log('✅ Visitor tracked for', dateStr);
  } catch (error) {
    console.error('❌ Error tracking visitor:', error);
    // Don't throw error - tracking should not break the app
  }
}

/**
 * Get visitor stats for a specific date
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Promise<number>} Visitor count
 */
export async function getVisitorCount(dateStr) {
  try {
    const visitorRef = doc(db, 'visitor_stats', dateStr);
    const docSnap = await getDoc(visitorRef);
    
    if (docSnap.exists()) {
      return docSnap.data().count || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 0;
  }
}

/**
 * Get visitor stats for last N days
 * @param {number} days - Number of days to retrieve
 * @returns {Promise<Array>} Array of {date, count}
 */
export async function getVisitorStats(days = 7) {
  const stats = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = await getVisitorCount(dateStr);
    stats.push({
      date: dateStr,
      count: count
    });
  }
  
  return stats;
}