import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDC7E7Pz70UB7nm3S3i2xXHxXPyQdRkcLQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'oss-tracker-db8a9.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'oss-tracker-db8a9',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'oss-tracker-db8a9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1015800450242',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1015800450242:web:89ba0cf2e0b1a19c677f5b',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('repo');
githubProvider.addScope('read:org');

export { app, auth, db, githubProvider };
