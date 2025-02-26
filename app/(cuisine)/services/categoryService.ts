import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Category } from "../types/category";

export const categoryService = {
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