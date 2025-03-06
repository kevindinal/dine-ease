import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

// Firestore trigger to send FCM notification when a booking/order is updated
exports.notifyUserOnBookingUpdate = functions.firestore
  .document("bookings/{bookingId}") // Change to your Firestore collection name
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    if (!newData || !previousData) {
      console.log("Data is undefined.");
      return null;
    }

    // If status hasn't changed, don't send notification
    if (newData.status === previousData.status) {
      return;
    }

    const userToken = newData.fcmToken; // Ensure you store the user's FCM token in Firestore

    if (!userToken) {
      console.log("No FCM token found for user.");
      return null;
    }

    const message = {
      notification: {
        title: "Order/Booking Update",
        body: `Your order/booking status is now: ${newData.status}`,
      },
      token: userToken,
    };

    try {
      await admin.messaging().send(message);
      console.log(`Notification sent to ${userToken}`);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
