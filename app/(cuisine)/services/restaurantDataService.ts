import { db } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData } from "firebase/firestore";
import { Restaurant } from "../types/restaurant";

export const restaurantDataService = {
/**
Fetches the details of a specific restaurant by its ID.
 * This function retrieves the restaurant's data from Firestore based on the provided 
 * `restaurantId`. If the restaurant exists in the database, the function returns the 
 * restaurant details, including its ID. If the restaurant is not found, it throws an error 
 * with the message "Restaurant not found". In case of any issues during the fetch process, 
 * such as Firestore connectivity issues, it logs the error and throws it.
 */
    getRestaurantById: async (restaurantId: string): Promise<Restaurant> => {
        try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const snapshot = await getDoc(restaurantRef);

            if(!snapshot.exists()) {
                throw new Error("Restaurant not found");
            }

            return {
                id: snapshot.id,
                ...(snapshot.data() as Omit<Restaurant, 'id'>)
            };
        } catch (error) {
            console.error("Error fetching restaurant: ", error);
            throw error;
        }
    }
};