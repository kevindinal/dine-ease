import { db } from "@/lib/firebase";
import { collection, doc, getDoc, DocumentData } from "firebase/firestore";
import { Restaurant } from "../types/restaurant";

export const restaurantDataService = {
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