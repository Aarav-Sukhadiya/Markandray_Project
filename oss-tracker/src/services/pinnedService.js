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

function pinnedCollection(userId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  return collection(db, 'users', userId, 'pinned');
}

export function subscribeToPinned(userId, callback, onError) {
  if (!isFirebaseConfigured || !db || !userId) {
    callback([]);
    return () => {};
  }
  const q = query(pinnedCollection(userId), orderBy('pinnedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error('[pinned] snapshot error', err);
      if (onError) onError(err);
    },
  );
}

export async function createPin(userId, data) {
  const ref = pinnedCollection(userId);
  return addDoc(ref, { ...data, pinnedAt: serverTimestamp() });
}

export async function updatePin(userId, pinId, patch) {
  const ref = doc(db, 'users', userId, 'pinned', pinId);
  return updateDoc(ref, patch);
}

export async function deletePin(userId, pinId) {
  const ref = doc(db, 'users', userId, 'pinned', pinId);
  return deleteDoc(ref);
}
