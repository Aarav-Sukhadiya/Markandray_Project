import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

function notesCollection(userId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  return collection(db, 'users', userId, 'notes');
}

export function subscribeToNotes(userId, callback, onError) {
  if (!isFirebaseConfigured || !db || !userId) {
    callback([]);
    return () => {};
  }
  const q = query(notesCollection(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error('[notes] snapshot error', err);
      if (onError) onError(err);
    },
  );
}

export async function createNote(userId, data) {
  const ref = notesCollection(userId);
  return addDoc(ref, {
    ...data,
    tags: data.tags ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateNote(userId, noteId, patch) {
  const ref = doc(db, 'users', userId, 'notes', noteId);
  return updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteNote(userId, noteId) {
  const ref = doc(db, 'users', userId, 'notes', noteId);
  return deleteDoc(ref);
}
