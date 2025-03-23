import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, DocumentData } from "firebase/firestore";
import { Restaurant } from "../types/restaurant";
import { Category } from "../types/category";
import { Meal } from "../types/meal";

export const chefsSpecialsService = {
/**
Fetches the chef's specials for a specific restaurant from the Firestore database.
 * This function queries the "categories" collection for a given restaurant and retrieves all meals within each category. 
 * It then filters out the meals that are marked as chef's specials and returns a flat list of these meals.
 * If no chef's specials are found, it returns `null`.
 * If an error occurs during the fetch operation, it logs the error and rethrows it.
 */
    getChefsSpecials: async (restaurantId: string): Promise<Meal[] | null> => {
        try {
            const mealsRef = collection(db, "restaurants", restaurantId, "categories");
            const mealsSnapshot = await getDocs(mealsRef);

            const meals: Meal[][] = await Promise.all(
                mealsSnapshot.docs.map(async (categoryDoc) => {
                    const categoryMealsRef = collection(db, "restaurants", restaurantId, "categories", categoryDoc.id, "meals");
                    const categoryMealsSnapshot = await getDocs(categoryMealsRef);

                    const categoryMeals: (Meal | null)[] = await Promise.all(
                        categoryMealsSnapshot.docs.map(async (mealDoc) => {
                            const mealData = mealDoc.data();
                            if (mealData.isChefsSpecial) {
                                return {
                                    ...(mealData as Omit<Meal, 'id'>),
                                    id: mealDoc.id,
                                    categoryId: categoryDoc.id,
                                    categoryName: categoryDoc.data().name
                                };
                            } else {
                                return null;
                            }
                        })
                    );

                    return categoryMeals.filter((meal): meal is Meal => meal!== null) as Meal[];
                })
            );

            const filteredMeals = meals.flat().filter((meal): meal is Meal => meal!== null) as Meal[];
            return filteredMeals.length > 0? filteredMeals : null;
        } catch (error) {
            console.error("Error fetching chef's specials: ", error);
            throw error;
        }
    }
}