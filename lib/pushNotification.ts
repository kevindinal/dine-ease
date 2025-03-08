import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { db, auth } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const messaging = getMessaging();

// Ensure the service worker is registered before calling getToken
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service Worker Registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Function to request permission and get FCM token
export const requestNotificationPermission = async () => {
  if (typeof window === "undefined") return; // Ensure it's running in the browser

  const permission = await Notification.requestPermission();
  if (permission === "granted" && messaging) {
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY, // Ensure this is set in .env
      });
      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }
};

// Listen for messages
if (typeof window !== "undefined" && messaging) {
  onMessage(messaging, (payload) => {
    console.log("Foreground Message Received:", payload);
  });
}

// Function to save the FCM token to Firestore
export const saveFCMTokenToFirestore = async (token: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { FCMToken: token });
    console.log("FCM token saved to Firestore.");
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

// Listen for foreground messages
export const onForegroundMessage = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground Notification Received:", payload);
    new Notification(payload.notification?.title || "Notification", {
      body: payload.notification?.body,
      icon: payload.notification?.image,
    });
  });
};


// Listen for token refresh and update Firestore
export const checkForTokenRefresh = async () => {
  try {
    const newToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!newToken) {
      console.log("No new FCM token available.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    // Compare with the stored token (You should fetch the user's current token from Firestore)
    await saveFCMTokenToFirestore(newToken);
  } catch (error) {
    console.error("Error checking for token refresh:", error);
  }
}