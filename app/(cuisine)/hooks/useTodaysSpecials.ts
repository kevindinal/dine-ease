import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { todaysSpecialService } from "../services/todaysSpecialService";

interface UseTodaysSpecialsReturn {
    meals: Meal[];
    loading: boolean;
    error: string | null;
}

export const useTodaysSpecials = (restaurantId: string): UseTodaysSpecialsReturn => {
    const [ meals, setMeals ] = useState<Meal[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecials = async () => {
            try {
                setLoading(true);
                const data = await todaysSpecialService.getTodaysSpecials(restaurantId);
                setMeals(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occured");
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

    return { meals, loading, error};
};