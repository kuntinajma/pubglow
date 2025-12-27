// Firebase Configuration for PubGlow
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqGEs0MLRG7d7g1Es9ykaHk0YqpJbfFUM",
  authDomain: "pubglow.firebaseapp.com",
  projectId: "pubglow",
  storageBucket: "pubglow.firebasestorage.app",
  messagingSenderId: "469006947432",
  appId: "1:469006947432:web:c219865310f3019e9f57dd",
  measurementId: "G-R3Z0S176WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

console.log('🔥 Firebase initialized successfully');
console.log('📊 Project:', firebaseConfig.projectId);