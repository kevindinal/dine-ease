import { useState, useEffect } from "react";
import { Meal } from "../types/meal";
import { todaysSpecialService } from "../services/todaysSpecialService";

interface UseTodaysSpecialsReturn {
    meals: Meal[] | null;
    loading: boolean;
    error: string | null;
}

/** 
Custom React hook to fetch and manage today's specials for a restaurant.
 * This hook is responsible for retrieving the special meals for the current day based on the provided `restaurantId`. 
 * It handles loading and error states and provides the special meals once fetched.
 * 
 * - **meals**: An array of the special meals for today (null if no specials or error occurred).
 * - **loading**: A boolean flag indicating if the special meals are still being fetched.
 * - **error**: A string representing the error message in case of failure to fetch the data.
 * 
 * The hook automatically fetches the specials when the `restaurantId` changes.
*/
export const useTodaysSpecials = (restaurantId: string): UseTodaysSpecialsReturn => {
    const [ meals, setMeals ] = useState<Meal[] | null>(null);
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