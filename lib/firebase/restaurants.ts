// lib/firebase/restaurants.ts
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './config';
  import { Restaurant } from '@/app/(restaurants)/types/firebase.';
  
  const RESTAURANTS_COLLECTION = 'restaurants';
  
  // Convert Firestore document to Restaurant object
  const convertRestaurant = (doc: any): Restaurant => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      image: data.image,
      availability: data.availability,
      bannerImage: data.bannerImage,
      rating: data.rating,
      reviews: data.reviews,
      cuisine: data.cuisine,
      category: data.category,
      priceRange: data.priceRange,
      location: data.location,
      featuredMenu: data.featuredMenu,
      photos: data.photos,
      availableTimes: data.availableTimes,
      address: data.address,
      description: data.description,
      about: data.about,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  };
  
  // Get all restaurants
  export const getAllRestaurants = async (): Promise<Restaurant[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, RESTAURANTS_COLLECTION));
      return querySnapshot.docs.map(convertRestaurant);
    } catch (error) {
      console.error('Error getting restaurants:', error);
      throw error;
    }
  };
  
  // Get restaurant by ID
  export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
    try {
      const docRef = doc(db, RESTAURANTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertRestaurant(docSnap);
      } else {
        console.log('No such restaurant!');
        return null;
      }
    } catch (error) {
      console.error('Error getting restaurant:', error);
      throw error;
    }
  };
  
  // Search restaurants by name, cuisine, or location
  export const searchRestaurants = async (searchTerm: string): Promise<Restaurant[]> => {
    try {
      // In Firestore, we can't do direct text search, so we'll get all and filter
      // For production, consider using Algolia or similar search service
      const querySnapshot = await getDocs(collection(db, RESTAURANTS_COLLECTION));
      
      const results = querySnapshot.docs
        .map(convertRestaurant)
        .filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
          restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return results;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  };
  
  // Filter restaurants by cuisine type
  export const getRestaurantsByCuisine = async (cuisineType: string): Promise<Restaurant[]> => {
    try {
      const q = query(
        collection(db, RESTAURANTS_COLLECTION), 
        where('cuisine', 'array-contains', cuisineType)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertRestaurant);
    } catch (error) {
      console.error('Error filtering by cuisine:', error);
      throw error;
    }
  };
  
  // Filter restaurants by price range
  export const getRestaurantsByPriceRange = async (priceRange: string): Promise<Restaurant[]> => {
    try {
      const q = query(
        collection(db, RESTAURANTS_COLLECTION), 
        where('priceRange', '==', priceRange)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertRestaurant);
    } catch (error) {
      console.error('Error filtering by price range:', error);
      throw error;
    }
  };
  
  // Get top-rated restaurants
//   export const getTopRatedRestaurants = async (limit = 5): Promise<Restaurant[]> => {
//     try {
//       const q = query(
//         collection(db, RESTAURANTS_COLLECTION),
//         orderBy('rating', 'desc'),
//         limit(limit)
//       );
      
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(convertRestaurant);
//     } catch (error) {
//       console.error('Error getting top restaurants:', error);
//       throw error;
//     }
//   };
  
  // Add a new restaurant (admin function)
  export const addRestaurant = async (restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, RESTAURANTS_COLLECTION), {
        ...restaurantData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  };
  
  // Update a restaurant (admin function)
//   export const updateRestaurant = async (id: string, restaurantData: Partial<Restaurant>): Promise<void> => {
//     try {
//       const restaurantRef = doc(db, RESTAURANTS_COLLECTION, id);
      
//       await updateDoc(restaurantRef, {
//         ...restaurantData,
//         updatedAt: serverTimestamp(),
//       });
//     } catch (error) {
//       console.error('Error updating restaurant:', error);
//       throw error;
//     }
//   };
  
  // Delete a restaurant (admin function)
//   export const deleteRestaurant = async (id: string): Promise<void> => {
//     try {
//       await deleteDoc(doc(db, RESTAURANTS_COLLECTION, id));
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       throw error;
//     }
//   };