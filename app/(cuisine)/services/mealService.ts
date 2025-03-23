import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { Meal } from "../types/meal";

export const mealService = {
/**
Fetches the list of meals for a specific category within a restaurant from the Firestore database.
 * This function queries the "meals" subcollection for a given category in a specific restaurant. 
 * It returns an array of meals from the category, each including the meal's ID, category ID, and other relevant data.
 * If no meals are found in the specified category, it returns `null`.
 * If an error occurs during the fetch operation, it logs the error and rethrows it.
 */
  getMealsByCategory: async (restaurantId: string, categoryId: string): Promise<Meal[] | null> => {
    try {
      const mealsRef = collection(db, "restaurants", restaurantId, "categories", categoryId, "meals");
      const snapshot = await getDocs(mealsRef);

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        categoryId, 
        ...(doc.data() as Omit<Meal, "id" | "categoryId">)
      }));
    } catch (error) {
      console.error("Error fetching meals: ", error);
      throw error;
    }
  },

/**
Finds the category of a specific meal within a restaurant.
 * This function queries all categories in the given restaurant and checks each one to find
 * if it contains the specified meal by its ID. If the meal is found, it returns the category ID.
 * If the meal is not found in any of the categories, it returns `null`.
 * In case of an error during the process, it logs the error and throws it.
 */
  findMealCategory: async (restaurantId: string, mealId: string): Promise<string | null> => {
    try {
      const categoriesRef = collection(db, "restaurants", restaurantId, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
      
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryId = categoryDoc.id;
        const mealRef = doc(db, "restaurants", restaurantId, "categories", categoryId, "meals", mealId);
        const mealSnapshot = await getDoc(mealRef);
        
        if (mealSnapshot.exists()) {
          return categoryId;
        }
      }
      
      return null; 
    } catch (error) {
      console.error("Error finding meal category: ", error);
      throw error;
    }
  },

/**
Fetches a specific meal by its ID from a given restaurant and category.
 * This function attempts to retrieve a meal from the Firestore database using the provided 
 * restaurant ID, category ID, and meal ID. If the meal is found, it returns the meal details, 
 * including its ID and category ID. If the meal doesn't exist or is not found, it returns `null`.
 * In case of any errors during the fetch process (e.g., Firestore connectivity issues), 
 * it logs the error and throws it.
 */
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
        categoryId, 
        ...(snapshot.data() as Omit<Meal, "id" | "categoryId">)
      };
    } catch (error) {
      console.error("Error fetching meal: ", error);
      throw error;
    }
  }
};

