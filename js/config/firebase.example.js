/**
 * Firebase Configuration Example
 * Copy this file to firebase.js and fill in your credentials
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection names (untuk konsistensi)
export const COLLECTIONS = {
  JOURNALS: 'journals',
  CATEGORIES: 'categories',
  SUBMISSIONS: 'submissions',
  ARTICLES: 'articles',
  ARTICLE_SUBMISSIONS: 'article_submissions'
};