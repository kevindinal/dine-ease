// lib/firebase/reviews.ts
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  import { Review } from '@/app/(restaurants)/types/testdata';
  
  const REVIEWS_COLLECTION = 'reviews';
  
  // Convert Firestore document to Review object
  const convertReview = (doc: any): Review => {
    const data = doc.data();
    return {
      id: doc.id,
      restaurantId: data.restaurantId,
      userId: data.userId,
      rating: data.rating,
      text: data.text,
      customerName: data.customerName,
      date: data.date.toDate(),
      verified: data.verified
    };
  };
  
  // Add a new review
  export const addReview = async (reviewData: Omit<Review, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
        ...reviewData,
        date: reviewData.date instanceof Date ? Timestamp.fromDate(reviewData.date) : serverTimestamp(),
      });
      
      // Update restaurant rating
      await updateRestaurantRating(reviewData.restaurantId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };
  
  // Update restaurant's average rating and review count
  export const updateRestaurantRating = async (restaurantId: string): Promise<void> => {
    try {
      const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('restaurantId', '==', restaurantId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(convertReview);
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
        
        const restaurantRef = doc(db, 'restaurants', restaurantId);
        await updateDoc(restaurantRef, {
          rating: averageRating,
          reviews: reviews.length,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating restaurant rating:', error);
      throw error;
    }
  };
  
  // Get all reviews for a restaurant
  export const getRestaurantReviews = async (restaurantId: string): Promise<Review[]> => {
    try {
      const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('restaurantId', '==', restaurantId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertReview);
    } catch (error) {
      console.error('Error getting restaurant reviews:', error);
      throw error;
    }
  };
  
  // Get a single review by ID
  export const getReviewById = async (id: string): Promise<Review | null> => {
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertReview(docSnap);
      } else {
        console.log('No such review!');
        return null;
      }
    } catch (error) {
      console.error('Error getting review:', error);
      throw error;
    }
  };
  

  

  
  // Get reviews by user
  export const getUserReviews = async (userId: string): Promise<Review[]> => {
    try {
      const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertReview);
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  };