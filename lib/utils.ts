// lib/firebase/utils.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { restaurants } from '@/data/restaurrants';

// Seed the database with initial restaurant data
export const seedRestaurants = async (): Promise<void> => {
  try {
    // Check if restaurants already exist
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    if (!querySnapshot.empty) {
      console.log('Restaurants already exist in the database');
      return;
    }
    
    // Create a batch to write multiple documents
    const batch = writeBatch(db);
    
    // Add each restaurant to the batch
    restaurants.forEach((restaurant) => {
      const restaurantRef = doc(collection(db, 'restaurants'));
      const restaurantData = {
        ...restaurant,
        // Convert id to string if it's a number
        id: restaurant.id.toString(),
        // Change "times" field to match our schema
        availableTimes: restaurant.times,
        // Add timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Remove fields we don't want to store
      // delete restaurantData.times;
      
      batch.set(restaurantRef, restaurantData);
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded restaurants');
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    throw error;
  }
};

// Generate sample time slots for a restaurant
export const generateTimeSlots = (
  startTime: string = '11:00', 
  endTime: string = '22:00', 
  interval: number = 15
): string[] => {
  const timeSlots = [];
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Generate time slots
  while (currentMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    
    timeSlots.push(`${displayHour}:${displayMinute} ${period}`);
    
    currentMinutes += interval;
  }
  
  return timeSlots;
};

// Delete all documents in a collection (careful with this one!)
export const clearCollection = async (collectionName: string): Promise<void> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    const batch = writeBatch(db);
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, collectionName, document.id));
    });
    
    await batch.commit();
    console.log(`Successfully cleared ${collectionName} collection`);
  } catch (error) {
    console.error(`Error clearing ${collectionName} collection:`, error);
    throw error;
  }
};

import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
