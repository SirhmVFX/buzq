import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function adminConfigured() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

export function adminDb() {
  if (!adminConfigured()) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return getFirestore();
}
