// services/pointsService.ts
import { 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    increment, 
    serverTimestamp, 
    Timestamp 
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase';
  import { UserPoints, AddPointsParams } from '../types/points';
  
  const POINTS_COLLECTION = 'points';
  
  // Get user points from Firebase
  export const getUserPoints = async (userId: string): Promise<number> => {
    try {
      const pointsRef = doc(db, POINTS_COLLECTION, userId);
      const pointsSnap = await getDoc(pointsRef);
      
      if (pointsSnap.exists()) {
        const userData = pointsSnap.data() as UserPoints;
        return userData.points;
      } else {
        // User doesn't have points yet
        return 0;
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
      throw error;
    }
  };
  
  // Add points to a user account
  export const addPoints = async ({ userId, pointsToAdd }: AddPointsParams): Promise<void> => {
    try {
      const pointsRef = doc(db, POINTS_COLLECTION, userId);
      const pointsSnap = await getDoc(pointsRef);
      
      if (pointsSnap.exists()) {
        // Update existing points
        await updateDoc(pointsRef, {
          points: increment(pointsToAdd),
          lastUpdated: serverTimestamp(),
        });
      } else {
        // Create new points document
        await setDoc(pointsRef, {
          userId,
          points: pointsToAdd,
          lastUpdated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding points:", error);
      throw error;
    }
  };
  
  // Award points for successful payment
  export const awardPaymentPoints = async (userId: string, amount: number): Promise<void> => {
    // Award fixed 10 points per payment
    const POINTS_PER_PAYMENT = 10;
    await addPoints({ userId, pointsToAdd: POINTS_PER_PAYMENT });
  };