// Cloud Functions Firebase admin initialization
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminDb = admin.firestore();
export const adminMessaging = admin.messaging();