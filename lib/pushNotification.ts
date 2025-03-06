import { messaging, getToken, onMessage } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};
