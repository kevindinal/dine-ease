import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Meal } from "../types/meal";

export const mealService = {

    getMealsByRestaurantId: async (restaurantId: string): Promise<Meal[]> => {
        try {
            const mealsRef = collection(db, "meals");
            const mealQuery = query(mealsRef, where("restaurant_id", "==", restaurantId));
            const snapshot = await getDocs(mealQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Meal, "id">)
            }));
        } catch (error) {
            console.error("Error fetching meals by restaurant: ", error);
            throw error;
        }
    },

    getMealsByCategoryId: async (categoryId: string): Promise<Meal[]> => {
        try {
            const mealsRef = collection(db, "meals");
            const mealQuery = query(mealsRef, where("category_id", "==", categoryId));
            const snapshot = await getDocs(mealQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Meal, "id">)
            }));
        } catch (error) {
            console.error("Error fetching meals by restaurant: ", error);
            throw error;
        }
    },

    getMealsByRestaurantAndCategory: async (restaurantId: string, categoryId: string): Promise<Meal[]> => {
        try {
            const mealsRef = collection(db, "meals");
            const mealsQuery = query(mealsRef, where("restaurant_id", "==", restaurantId), where("category_id", "==", categoryId));
            const snapshot = await getDocs(mealsQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Meal, "id">)
            }));
        } catch (error) {
            console.error("Error fetching meals by restaurant and category: ", error);
            throw error;
        }
    },

    getMealById: async (mealId: string): Promise<Meal | null> => {
        try {
            const mealsRef = collection(db, "meals");
            const mealsQuery = query(mealsRef, where("id", "==", mealId));
            const snapshot = await getDocs(mealsQuery);

            if (snapshot.empty) {
                return null;
            }

            return {
                id: snapshot.docs[0].id,
                ...(snapshot.docs[0].data() as Omit<Meal, "id">)
            };
        } catch (error) {
            console.error("Error fetching meal by ID: ", error);
            throw error;
        }
    }
}