import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { OrderStatus } from "../types/OrderStatus";

// In subscribeToOrderStatus
export const subscribeToOrderStatus = (
  orderId: string,
  userId: string,
  callback: (status: OrderStatus) => void
) => {
  console.log("Subscribing to order:", orderId, userId);
  const orderRef = doc(collection(db, 'orders'), orderId);
  
  return onSnapshot(orderRef, (docSnapshot) => {
    console.log("Snapshot received:", docSnapshot.exists(), docSnapshot.data());
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const orderStatus: OrderStatus = {
        isTableReady: data.isTableReady || false,
        isMealReady: data.isMealReady || false,
        isReservationReady: data.isReservationReady || false, // Fixed this bug
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