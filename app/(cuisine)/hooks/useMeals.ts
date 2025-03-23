
import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { mealService } from "../services/mealService";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";


interface UseMealsReturn {
  meals: Meal[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch meals for a specific restaurant and category.
 * - Fetches meals using the `mealService.getMealsByCategory` method.
 * - Handles loading state and manages any errors encountered during the fetch.
 * - Returns meals, loading status, and error state to the calling component.
 */
export const useMeals = (restaurantId: string, categoryId: string): UseMealsReturn => {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const data: Meal[] | null = await mealService.getMealsByCategory(restaurantId, categoryId);
        setMeals(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching meals: ", error);
        setError(error instanceof Error? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId && categoryId) {
      fetchMeals();
    } else {
      setMeals(null);
      setLoading(false);
    }
  }, [restaurantId, categoryId]);

  return { meals, loading, error };
};

/**
 * Custom hook to fetch a specific meal by its mealId, restaurantId, and optional categoryId.
 * - Fetches the meal using the `mealService.getMealsById` method.
 * - If categoryId is not provided, attempts to fetch it using `mealService.findMealCategory`.
 * - Handles loading and error states, managing any issues during the fetch operation.
 */
export const useMealsById = (mealId: string, restaurantId: string, categoryId?: string) => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [foundCategoryId, setFoundCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        
        let effectiveCategoryId = categoryId;
        if (!effectiveCategoryId) {
          const foundCategory = await mealService.findMealCategory(restaurantId, mealId);

          if (!foundCategory) {
            setError("Could not determine category for this meal");
            setLoading(false);
            return;
          }

          effectiveCategoryId = foundCategory;
          setFoundCategoryId(foundCategory);
        }
        
        const data: Meal | null = await mealService.getMealsById(restaurantId, effectiveCategoryId, mealId);

        if (data) {
          setMeal(data);
          setError(null);
        } else {
          setError("Meal not found");
        }
      } catch (error) {
        setError(error instanceof Error? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (mealId && restaurantId) {
      fetchMeal();
    } else {
      setMeal(null);
      setLoading(false);
    }
  }, [mealId, restaurantId, categoryId]);

  return { meal, loading, error, categoryId: foundCategoryId || categoryId };
};
