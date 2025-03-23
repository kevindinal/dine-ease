import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { OrderStatus } from "../types/OrderStatus";

export const subscribeToOrderStatus = (
  orderId: string,
  userId: string,
  callback: (status: OrderStatus) => void
) => {
  console.log("Subscribing to order:", orderId, userId);
  const orderRef = doc(collection(db, 'orders'), orderId);

  /**
   * Subscribes to real-time updates on the order document in Firestore using the `onSnapshot` method.
   * This function listens for changes to the `orderRef` document. Every time the document is updated, 
   * the snapshot of the document is passed to the callback function. The snapshot contains the latest data 
   * about the order status.
   * - If the document exists, it processes the data and maps it to an `OrderStatus` object, 
   *   which includes the readiness status of the table, meal, and reservation.
   * - If the document does not exist, it logs that the document is not found.
   * - Any errors during the subscription are logged in the console.
   */
  return onSnapshot(orderRef, (docSnapshot) => {
    console.log("Snapshot received:", docSnapshot.exists(), docSnapshot.data());

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      const orderStatus: OrderStatus = {
        isTableReady: data.isTableReady || false,
        isMealReady: data.isMealReady || false,
        isReservationReady: data.isReservationReady || false,
        id: orderId,
        userId
      };

      console.log("Processed order status:", orderStatus);
      callback(orderStatus);
    } else {
      console.log("Document doesn't exist");
    }
  }, error => {
    console.error("Firestore subscription error:", error);
  });
};