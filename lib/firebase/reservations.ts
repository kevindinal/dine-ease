// /app/lib/firebase/reservations.ts
import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Reservation } from '@/app/(restaurants)/types/restaurants';

export const reservationsCollection = collection(db, 'reservations');

// Create a new reservation
export async function createReservation(data: Omit<Reservation, 'id' | 'createdAt'>) {
  const docRef = await addDoc(reservationsCollection, {
    ...data,
    createdAt: serverTimestamp(),
    status: 'pending'
  });
  
  return docRef.id;
}

// Get all reservations for a restaurant
export async function getRestaurantReservations(restaurantId: string) {
  const q = query(
    reservationsCollection, 
    where('restaurantId', '==', restaurantId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Get user reservations
export async function getUserReservations(userId: string) {
  const q = query(
    reservationsCollection, 
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Update reservation status
export async function updateReservationStatus(
  reservationId: string, 
  status: 'pending' | 'confirmed' | 'cancelled'
) {
  const docRef = doc(db, 'reservations', reservationId);
  await updateDoc(docRef, { status });
}

// Check time slot availability
export async function checkTimeSlotAvailability(
  restaurantId: string,
  date: string,
  time: string
) {
  // Format date for query
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const q = query(
    reservationsCollection,
    where('restaurantId', '==', restaurantId),
    where('date', '==', date),
    where('time', '==', time),
    where('status', '!=', 'cancelled')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.size; // Number of reservations at this time
}