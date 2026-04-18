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

function goalsCollection(userId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  return collection(db, 'users', userId, 'goals');
}

export function subscribeToGoals(userId, callback, onError) {
  if (!isFirebaseConfigured || !db || !userId) {
    callback([]);
    return () => {};
  }
  const q = query(goalsCollection(userId), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const goals = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(goals);
    },
    (err) => {
      console.error('[goals] snapshot error', err);
      if (onError) onError(err);
    },
  );
}

export async function createGoal(userId, data) {
  const ref = goalsCollection(userId);
  return addDoc(ref, {
    ...data,
    status: data.status ?? 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateGoal(userId, goalId, patch) {
  const ref = doc(db, 'users', userId, 'goals', goalId);
  return updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteGoal(userId, goalId) {
  const ref = doc(db, 'users', userId, 'goals', goalId);
  return deleteDoc(ref);
}
