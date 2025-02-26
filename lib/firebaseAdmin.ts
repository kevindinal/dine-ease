// Server-side Firebase Admin initialization
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminMessaging = admin.messaging();