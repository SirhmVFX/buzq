import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "placeholder",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "placeholder",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "placeholder",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "placeholder",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "placeholder",
};

export const firebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "placeholder"
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function getDb() {
  try {
    return initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = getDb();
export const auth = getAuth(app);
export default app;
