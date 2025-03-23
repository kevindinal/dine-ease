import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { chefsSpecialsService } from "../services/chefsSpecialService";

interface UseChefsSpecialsReturn {
    meals: Meal[];
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook to fetch the chef's specials meals for a specific restaurant based on its ID.
 * - Fetches meals using the `chefsSpecialsService.getChefsSpecials` method.
 * - Handles loading state while the data is being fetched, and stores any error encountered.
 * - Returns an object containing the fetched meals, loading status, and error message.
 */
export const useChefsSpecials = (restaurantId: string): UseChefsSpecialsReturn => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecials = async () => {
            try {
                setLoading(true);
                const data = await chefsSpecialsService.getChefsSpecials(restaurantId);
                setMeals(data ?? []);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchSpecials();
        } else {
            setMeals([]);
        }
    }, [restaurantId]);

    return { meals, loading, error };
};