import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { db, auth } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const messaging = getMessaging();

// Function to request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // Set in .env.local
      });

      console.log("FCM Token:", token);
      if (token) {
        await saveFCMTokenToFirestore(token);
      }
      return token;
    } else {
      console.warn("Notification permission not granted.");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

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
