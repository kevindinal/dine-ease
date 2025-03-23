import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";

/**
 * Record a points transaction for tracking
 * @param userId User ID
 * @param points Number of points (positive for additions, negative for redemptions)
 * @param reason Reason for the point transaction
 * @param paymentId Optional payment ID for tracking
 * @returns Promise that resolves to the new document ID
 */
export const recordPointsTransaction = async (
  userId: string,
  points: number,
  reason: string,
  paymentId?: string
) => {
  if (!userId) {
    console.error("Cannot record transaction: No user ID provided");
    return null;
  }

  try {
    const pointsHistoryRef = collection(db, "pointsHistory");
    
    const docRef = await addDoc(pointsHistoryRef, {
      userId,
      points,
      reason,
      paymentId,
      timestamp: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error recording points transaction:", error);
    return null;
  }
};

/**
 * Get points history for a user
 * @param userId User ID to get history for
 * @returns Promise that resolves to an array of history items
 */
export const getPointsHistory = async (userId: string) => {
  if (!userId) {
    console.error("Cannot get history: No user ID provided");
    return [];
  }

  try {
    const pointsHistoryRef = collection(db, "pointsHistory");
    const q = query(
      pointsHistoryRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting points history:", error);
    return [];
  }
};