// /app/lib/firebase/search.ts
import { db } from './config';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { Restaurant } from '@/app/(restaurants)/types/firebase.';

export const restaurantsCollection = collection(db, 'restaurants');

export async function searchRestaurants({
  cuisine = '',
  location = '',
  date = '',
  priceRange = '',
  rating = 0,
  limit: resultLimit = 20
}: {
  cuisine?: string;
  location?: string;
  date?: string;
  priceRange?: string;
  rating?: number;
  limit?: number;
}) {
  let q = query(restaurantsCollection);
  
  // Apply filters
  if (cuisine) {
    q = query(q, where('cuisine', 'array-contains', cuisine));
  }
  
  if (priceRange) {
    q = query(q, where('priceRange', '==', priceRange));
  }
  
  if (rating > 0) {
    q = query(q, where('rating', '>=', rating));
  }
  
  // Sort by rating
  q = query(q, orderBy('rating', 'desc'));
  
  // Limit results
  q = query(q, limit(resultLimit));
  
  // Get results
  const snapshot = await getDocs(q);
  const restaurants = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Restaurant[];
  
  // Apply client-side filters (for location)
  if (location) {
    return restaurants.filter(restaurant => 
      restaurant.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Apply availability filter
  if (date) {
    return restaurants.filter(restaurant => 
      restaurant.availability[date] && restaurant.availability[date].length > 0
    );
  }
  
  return restaurants;
}