import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Category } from "../types/category";

export const categoryService = {
/**
Fetches the categories for a specific restaurant from the Firestore database.
 * This function queries the "categories" sub-collection of a given restaurant in Firestore and retrieves all the category documents. 
 * If no categories are found, it returns an empty array. 
 * If an error occurs while fetching the data, it logs the error and rethrows it.
 */
    getCategoriesByRestaurantId: async (restaurantId: string): Promise<Category[]> => {
        try {
            const categoriesRef = collection(db, "restaurants", restaurantId, "categories");
            const snapshot = await getDocs(categoriesRef);

            if (snapshot.empty) {
                return [];
            }

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Category, "id">)
            }));
        } catch (error) {
            console.error("Error fetching categories: ", error);
            throw error;
        }
    }
};