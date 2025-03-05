import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { chefsSpecialsService } from "../services/chefsSpecialService";

interface UseChefsSpecialsReturn {
    meals: Meal[];
    loading: boolean;
    error: string | null;
}

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