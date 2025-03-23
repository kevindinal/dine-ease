import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

/**
 * Add points to a user's account
 * @param userId User ID to award points to
 * @param pointsToAdd Number of points to add (default: 10)
 * @returns Promise that resolves when points are added
 */
export const addPointsToUser = async (userId: string, pointsToAdd: number = 10) => {
  if (!userId) {
    console.error("Cannot add points: No user ID provided");
    return false;
  }

  try {
    const userRef = doc(db, "users", userId);
    
    // Check if user document exists
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // User exists, update their points
      await updateDoc(userRef, {
        points: increment(pointsToAdd)
      });
    } else {
      // User document doesn't exist yet, create it with points
      await setDoc(userRef, {
        points: pointsToAdd,
        createdAt: new Date()
      });
    }
    
    console.log(`Successfully added ${pointsToAdd} points to user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error adding points to user:", error);
    return false;
  }
};

/**
 * Get the current points balance for a user
 * @param userId User ID to get points for
 * @returns Promise that resolves to user's points or null if error
 */
export const getUserPoints = async (userId: string): Promise<number | null> => {
  if (!userId) {
    console.error("Cannot get points: No user ID provided");
    return null;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().points !== undefined) {
      return userDoc.data().points;
    } else {
      // User exists but has no points yet, or user doesn't exist
      return 0;
    }
  } catch (error) {
    console.error("Error getting user points:", error);
    return null;
  }
};