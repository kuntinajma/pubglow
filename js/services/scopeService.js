import { db } from '../firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const COLLECTION = 'scopes';

export async function getAllScopes() {
  const q = query(collection(db, COLLECTION), orderBy('nama', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addScope(data) {
  return await addDoc(collection(db, COLLECTION), {
    nama: data.nama,
    createdAt: new Date().toISOString()
  });
}

export async function deleteScope(id) {
  return await deleteDoc(doc(db, COLLECTION, id));
}