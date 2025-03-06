import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

// // Add the public key generated from the console here.
// getToken(messaging, {vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY}).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });



// function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       // TODO(developer): Retrieve a registration token for use with FCM.
//       // ...
//     } else {
//       console.log('Unable to get permission to notify.');
//     }
//   });
// }

// export { app, auth, db };

// const messaging = async () => {
//   const supported = await isSupported();
//   return supported ? getMessaging(app) : null;
// };

// export const fetchToken = async () => {
//   try {
//     const fcmMessaging = await messaging();
//     if (fcmMessaging) {
//       const token = await getToken(fcmMessaging, {
//         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
//       });
//       return token;
//     }
//     return null;
//   } catch (err) {
//     console.error("An error occurred while fetching the token:", err);
//     return null;
//   }
// };

// export { messaging };