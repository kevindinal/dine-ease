// lib/firebase/reservations.ts
// import { 
//   collection, 
//   doc, 
//   getDoc, 
//   getDocs, 
//   query, 
//   where, 
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
//   Timestamp 
// } from 'firebase/firestore';
// import { db } from './config';
// import { Reservation } from '@/app/(restaurants)/types/firebase.';

// const RESERVATIONS_COLLECTION = 'reservations';

// Convert Firestore document to Reservation object
// const convertReservation = (doc: any): Reservation => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     restaurantId: data.restaurantId,
//     userId: data.userId,
//     date: data.date,
//     time: data.time,
//     numberOfGuests: data.numberOfGuests,
//     status: data.status,
//     customerName: data.customerName,
//     customerEmail: data.customerEmail,
//     customerPhone: data.customerPhone,
//     specialRequests: data.specialRequests,
//     createdAt: data.createdAt?.toDate(),
//     updatedAt: data.updatedAt?.toDate()
//   };
// };

// Create a new reservation
// export const createReservation = async (reservationData: {
//   restaurantId: string;
//   userId: string;
//   date: string;
//   time: string;
//   numberOfGuests: number;
//   status: 'pending' | 'confirmed' | 'cancelled';
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   specialRequests?: string;
// }): Promise<string> => {
//   try {
//     const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
//       ...reservationData,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
    
//     return docRef.id;
//   } catch (error) {
//     console.error('Error creating reservation:', error);
//     throw error;
//   }
// };

// Check time slot availability
// export const checkTimeSlotAvailability = async (
//   restaurantId: string, 
//   date: string, 
//   time: string
// ): Promise<number> => {
//   try {
//     const q = query(
//       collection(db, RESERVATIONS_COLLECTION),
//       where('restaurantId', '==', restaurantId),
//       where('date', '==', date),
//       where('time', '==', time),
//       where('status', 'in', ['pending', 'confirmed'])
//     );
    
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.size;
//   } catch (error) {
//     console.error('Error checking time slot availability:', error);
//     throw error;
//   }
// };

// Get all reservations for a restaurant
// export const getRestaurantReservations = async (restaurantId: string): Promise<Reservation[]> => {
//   try {
//     const q = query(
//       collection(db, RESERVATIONS_COLLECTION),
//       where('restaurantId', '==', restaurantId)
//     );
    
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(convertReservation);
//   } catch (error) {
//     console.error('Error getting restaurant reservations:', error);
//     throw error;
//   }
// };

// Get all reservations for a user
// export const getUserReservations = async (userId: string): Promise<Reservation[]> => {
//   try {
//     const q = query(
//       collection(db, RESERVATIONS_COLLECTION),
//       where('userId', '==', userId)
//     );
    
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(convertReservation);
//   } catch (error) {
//     console.error('Error getting user reservations:', error);
//     throw error;
//   }
// };

// Get a single reservation by ID
// export const getReservationById = async (id: string): Promise<Reservation | null> => {
//   try {
//     const docRef = doc(db, RESERVATIONS_COLLECTION, id);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//       return convertReservation(docSnap);
//     } else {
//       console.log('No such reservation!');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting reservation:', error);
//     throw error;
//   }
// };

// Update a reservation
// export const updateReservation = async (id: string, updateData: Partial<Reservation>): Promise<void> => {
//   try {
//     const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    
//     await updateDoc(reservationRef, {
//       ...updateData,
//       updatedAt: serverTimestamp(),
//     });
//   } catch (error) {
//     console.error('Error updating reservation:', error);
//     throw error;
//   }
// };

// Cancel a reservation
// export const cancelReservation = async (id: string): Promise<void> => {
//   try {
//     const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    
//     await updateDoc(reservationRef, {
//       status: 'cancelled',
//       updatedAt: serverTimestamp(),
//     });
//   } catch (error) {
//     console.error('Error cancelling reservation:', error);
//     throw error;
//   }
// };

// Delete a reservation (admin function)
// export const deleteReservation = async (id: string): Promise<void> => {
//   try {
//     await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
//   } catch (error) {
//     console.error('Error deleting reservation:', error);
//     throw error;
//   }
// };