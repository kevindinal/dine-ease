import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { Meal } from "../types/meal";

export const mealService = {
  getMealsByCategory: async (restaurantId: string, categoryId: string): Promise<Meal[] | null> => {
    try {
      const mealsRef = collection(db, "restaurants", restaurantId, "categories", categoryId, "meals");
      const snapshot = await getDocs(mealsRef);

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
       ...(doc.data() as Omit<Meal, "id">)
      }));
    } catch (error) {
      console.error("Error fetching meals: ", error);
      throw error;
    }
  },

  getMealsById: async (restaurantId: string, categoryId: string, mealId: string): Promise<Meal | null> => {
    try {
      console.log("Fetching meal with:", restaurantId, categoryId, mealId);
      const mealRef = doc(db, "restaurants", restaurantId, "categories", categoryId, "meals", mealId);
      const snapshot = await getDoc(mealRef);
  
      if (!snapshot.exists()) {
        return null;
      }
  
      return {
        id: snapshot.id,
       ...(snapshot.data() as Omit<Meal, "id">)
      };
    } catch (error) {
      console.error("Error fetching meal: ", error);
      throw error;
    }
  }
};