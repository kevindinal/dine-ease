import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, DocumentData } from "firebase/firestore";
import { Restaurant } from "../types/restaurant";
import { Category } from "../types/category";
import { Meal } from "../types/meal";

export const chefsSpecials = {
    getChefsSpecials: async (restaurantId: string): Promise<Meal[]> => {
        try {
            const specialsRef = collection(db, "restaurants", restaurantId, "chefsSpecial");
            const snapshot = await getDocs(specialsRef);

            if (snapshot.empty) {
                return [];
            }

            // Fetch the full meal details for each special
            const meals = await Promise.all(
                snapshot.docs.map(async (specialDoc) => {
                    // Get all categories
                    const categoriesRef = collection(db, "restaurants", restaurantId, "categories");
                    const categoriesSnapshot = await getDocs(categoriesRef);

                    // Look for the meal in each category
                    for (const categoryDoc of categoriesSnapshot.docs) {
                        const mealRef = doc(
                            db,
                            "restaurants",
                            restaurantId,
                            "categories",
                            categoryDoc.id,
                            "meals",
                            specialDoc.id
                        );

                        const mealSnapshot = await getDoc(mealRef);

                        if (mealSnapshot.exists()) {
                            return {
                                id: mealSnapshot.id,
                                categoryId: categoryDoc.id,
                                categoryName: categoryDoc.data().name,
                                ...(mealSnapshot.data() as Omit<Meal, 'id'>)
                            };
                        }
                    }

                    return null;
                })
            );

            return meals.filter((meal): meal is Meal => meal !== null);
        } catch (error) {
            console.error("Error fetching chef's specials: ", error);
            throw error;
        }
    }
}