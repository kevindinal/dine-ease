// functions/src/index.ts (Cloud Function v2)
import * as functions from 'firebase-functions';
import { adminDb, adminMessaging } from './firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { Change, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';

/**
 * Cloud Function triggered when a document in the 'reservations' collection is updated.
 * Sends a notification to the user associated with the reservation based on the updated status.
 */
export const sendReservationUpdate = functions.firestore
  .onDocumentUpdated('reservations/{reservationId}', async (event) => {
    // Extract reservation ID from the event parameters
    const reservationId = event.params.reservationId;

    // Extract the change data from the event
    const change: Change<QueryDocumentSnapshot> | undefined = event.data;

    // Extract the updated data from the change
    if (!change) return;
    const afterData = change.after.data();

    // If there's no updated data, exit the function
    if (!afterData) return;

    // Extract user ID, status, restaurant name, and date from the updated data
    const userId = afterData.userId;
    const status = afterData.status;
    const restaurantName = afterData.restaurantName;
    const date = afterData.date;

    // If there's no user ID, exit the function
    if (!userId) return;

    try {
      // Fetch the user's document from the 'users' collection
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();

      // If the user document or FCM token is missing, exit the function
      if (!userData || !userData.fcmToken) return;

      // Extract the FCM token from the user's data
      const fcmToken = userData.fcmToken;

      // Initialize the message body
      let messageBody = '';

      // Determine the message body based on the reservation status
      switch (status) {
        case 'booked':
          messageBody = `Your table is booked.`;
          break;
        case 'confirmed':
          // Check if the date is a Timestamp object
          if (date instanceof Timestamp) {
            // Convert the Timestamp to a JavaScript Date object
            const jsDate = date.toDate();
            // Format the date into a human-readable string
            const formattedDate = jsDate.toLocaleDateString();
            // Construct the message body with the formatted date
            messageBody = `Your reservation at ${restaurantName} on ${formattedDate} is confirmed.`;
          } else {
            // Construct the message body without the date if it's not a Timestamp
            messageBody = `Your reservation at ${restaurantName} is confirmed.`;
          }
          break;
        case 'ready':
          messageBody = `Your table is ready.`;
          break;
        case 'foodReady':
          messageBody = `Your pre-ordered food is ready.`;
          break;
        case 'feedback':
          messageBody = `Leave a feedback about your dining experience.`;
          break;
        default:
          // If the status is unknown, exit the function
          return;
      }

      // Construct the notification message
      const message = {
        notification: {
          title: 'Reservation Update',
          body: messageBody,
        },
        token: fcmToken,
      };

      // Send the notification message using FCM
      await adminMessaging.send(message);

      // Log a message indicating that the notification was sent
      console.log(`Message sent to user ${userId} for reservation ${reservationId}`);
    } catch (error) {
      // Log any errors that occurred during the process
      console.error('Error sending message:', error);
    }
  });