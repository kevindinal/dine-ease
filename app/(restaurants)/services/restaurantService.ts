// services/restaurantService.ts

import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    query, 
    where, 
    DocumentData 
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase';
  import { Restaurant } from '../types/restaurant';
  
  const COLLECTION_NAME = 'restaurants';
  
  export const restaurantService = {
    async getAllRestaurants(): Promise<Restaurant[]> {
      try {
        const restaurantsRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(restaurantsRef);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
      }
    },
  
    async getRestaurantById(id: string): Promise<Restaurant | null> {
      try {
        const restaurantRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(restaurantRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          } as Restaurant;
        } else {
          return null;
        }
      } catch (error) {
        console.error(`Error fetching restaurant with id ${id}:`, error);
        throw error;
      }
    },
  
    async getRestaurantsByCategory(category: string): Promise<Restaurant[]> {
      try {
        const restaurantsRef = collection(db, COLLECTION_NAME);
        const q = query(restaurantsRef, where("category", "==", category));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
      } catch (error) {
        console.error(`Error fetching restaurants in category ${category}:`, error);
        throw error;
      }
    },
  
    async getRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
      try {
        const restaurantsRef = collection(db, COLLECTION_NAME);
        const q = query(restaurantsRef, where("cuisine", "array-contains", cuisine));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
      } catch (error) {
        console.error(`Error fetching restaurants with cuisine ${cuisine}:`, error);
        throw error;
      }
    }
  };