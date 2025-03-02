import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { mealService } from "../services/mealService";

interface UseMealsReturn {
  meals: Meal[] | null;
  loading: boolean;
  error: string | null;
}

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

export const useMealsById = (mealId: string, restaurantId: string, categoryId: string) => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const data: Meal | null = await mealService.getMealsById(restaurantId, categoryId, mealId);
        if (data) {
          setMeal(data);
          setError(null);
        } else {
          setError("Meal not found");
        }
      } catch (error) {
        console.error("Error fetching meal: ", error);
        setError(error instanceof Error? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (mealId && restaurantId && categoryId) {
      fetchMeal();
    } else {
      setMeal(null);
      setLoading(false);
    }
  }, [mealId, restaurantId, categoryId]);

  return { meal, loading, error };
};