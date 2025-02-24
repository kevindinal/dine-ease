// /app/lib/firebase/restaurants.ts
import { db } from './config';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where 
} from 'firebase/firestore';
import { Restaurant } from '@/app/types/restaurants';

export const restaurantsCollection = collection(db, 'restaurants');

export async function getAllRestaurants() {
  const snapshot = await getDocs(restaurantsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getRestaurantById(id: string) {
  const docRef = doc(db, 'restaurants', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  };
}