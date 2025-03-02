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
        categoryId, // Add categoryId to each meal
        ...(doc.data() as Omit<Meal, "id" | "categoryId">)
      }));
    } catch (error) {
      console.error("Error fetching meals: ", error);
      throw error;
    }
  },

  // Find which category a meal belongs to
  findMealCategory: async (restaurantId: string, mealId: string): Promise<string | null> => {
    try {
      // Get all categories for the restaurant
      const categoriesRef = collection(db, "restaurants", restaurantId, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
      
      // Check each category for the meal
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryId = categoryDoc.id;
        const mealRef = doc(db, "restaurants", restaurantId, "categories", categoryId, "meals", mealId);
        const mealSnapshot = await getDoc(mealRef);
        
        if (mealSnapshot.exists()) {
          return categoryId;
        }
      }
      
      return null; // Meal not found in any category
    } catch (error) {
      console.error("Error finding meal category: ", error);
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
        categoryId, // Make sure categoryId is included
        ...(snapshot.data() as Omit<Meal, "id" | "categoryId">)
      };
    } catch (error) {
      console.error("Error fetching meal: ", error);
      throw error;
    }
  }
};