// Authentication Module untuk PubGlow Admin
import { auth } from './firebase.js';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

/**
 * Login dengan email dan password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login berhasil:', userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error('❌ Login gagal:', error);
    throw error;
  }
}

/**
 * Logout
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✅ Logout berhasil');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('❌ Logout gagal:', error);
    throw error;
  }
}

/**
 * Check apakah user sudah login
 * @returns {Promise<User|null>}
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Protect halaman admin - redirect ke login jika belum login
 */
export async function protectAdminPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn('⚠️ User tidak login, redirect ke login page');
    window.location.href = 'login.html';
    return null;
  }
  
  console.log('✅ User authenticated:', user.email);
  return user;
}

/**
 * Redirect ke admin jika sudah login (untuk login page)
 */
export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();
  
  if (user) {
    console.log('✅ User sudah login, redirect ke admin');
    window.location.href = 'admin.html';
    return true;
  }
  
  return false;
}

/**
 * Get error message bahasa Indonesia
 */
export function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/invalid-email': 'Format email tidak valid',
    'auth/user-disabled': 'Akun ini telah dinonaktifkan',
    'auth/user-not-found': 'Email tidak terdaftar',
    'auth/wrong-password': 'Password salah',
    'auth/invalid-credential': 'Email atau password salah',
    'auth/too-many-requests': 'Terlalu banyak percobaan login. Coba lagi nanti.',
    'auth/network-request-failed': 'Koneksi internet bermasalah',
    'auth/weak-password': 'Password terlalu lemah (minimal 6 karakter)'
  };
  
  return errorMessages[errorCode] || 'Terjadi kesalahan. Silakan coba lagi.';
}