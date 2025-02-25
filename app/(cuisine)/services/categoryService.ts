import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Category } from "../types/category";

export const categoryService = {
    getCategoriesByRestaurantId: async (restaurantId: string): Promise<Category[]> => {
        try {
            const categoriesRef = collection(db, "categories");
            const categoryQuery = query(categoriesRef, where("restaurant_id", "==", restaurantId));
            const snapshot = await getDocs(categoryQuery);

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