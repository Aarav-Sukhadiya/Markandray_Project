import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export async function createOrUpdateUserProfile(user, githubProfile) {
  if (!isFirebaseConfigured || !db || !user) return;

  const ref = doc(db, 'users', user.uid);
  const existing = await getDoc(ref);

  const base = {
    uid: user.uid,
    githubUsername: githubProfile?.login ?? user.reloadUserInfo?.screenName ?? '',
    githubId: githubProfile?.id ?? null,
    displayName: user.displayName ?? githubProfile?.name ?? '',
    avatarUrl: user.photoURL ?? githubProfile?.avatar_url ?? '',
    email: user.email ?? githubProfile?.email ?? '',
    lastLogin: serverTimestamp(),
  };

  if (existing.exists()) {
    await setDoc(ref, base, { merge: true });
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  }
}

export async function getUserProfile(userId) {
  if (!isFirebaseConfigured || !db || !userId) return null;
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
