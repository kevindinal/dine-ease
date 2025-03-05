import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, DocumentData } from "firebase/firestore";
import { Restaurant } from "../types/restaurant";
import { Category } from "../types/category";
import { Meal } from "../types/meal";

export const todaysSpecialService = {
    getTodaysSpecials: async (restaurantId: string): Promise<Meal[] | null> => {
        try {
            const mealsRef = collection(db, "restaurants", restaurantId, "categories");
            const mealsSnapshot = await getDocs(mealsRef);

            const meals: (Meal | null)[] = await Promise.all(
                mealsSnapshot.docs.map(async (categoryDoc) => {
                    const categoryMealsRef = collection(db, "restaurants", restaurantId, "categories", categoryDoc.id, "meals");
                    const categoryMealsSnapshot = await getDocs(categoryMealsRef);

                    const categoryMeals: (Meal | null)[] = await Promise.all(
                        categoryMealsSnapshot.docs.map(async (mealDoc) => {
                            const mealData = mealDoc.data();
                            if (mealData.isTodaysSpecial) {
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
            ).then(meals => meals.flat()); 

            const filteredMeals = meals.filter((meal): meal is Meal => meal!== null) as Meal[];
            return filteredMeals.length > 0? filteredMeals : null;
        } catch (error) {
            console.error("Error fetching today's specials: ", error);
            throw error;
        }
    },
}