import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { mealService } from "../services/mealService";

interface UseMealsReturn {
    meals: Meal[];
    loading: boolean;
    error: string | null;
}

export const useMealsByCategory = (restaurantId: string, categoryId: string): UseMealsReturn => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true);
                const data = await mealService.getMealsByCategoryId(restaurantId, categoryId);
                setMeals(data);
                setError(null);
            } catch (error) {
                console.error("Error in useMealsByCategory: ", error);
                setError(error instanceof Error ? error.message : "An error occured");
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId && categoryId) {
            fetchMeals();
        } else {
            setMeals([]);
            setLoading(false);
        }
    }, [restaurantId, categoryId]);

    return { meals, loading, error};
}

export const useMealsById = (mealId: string) => {
    const [ meal, setMeal ] = useState<Meal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                setLoading(true);
                const data = await mealService.getMealById(mealId);
                setMeal(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching useMealsById: ", error);
                setError(error instanceof Error ? error.message : "An error occurred");
            }
        };

        if (mealId) {
            fetchMeal();
        } else {
            setMeal(null);
            setLoading(false);
        }
    }, [mealId]);

    return { meal, loading, error};

}