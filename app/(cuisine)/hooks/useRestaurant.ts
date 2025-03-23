import { useState, useEffect } from "react";
import { Restaurant } from "../types/restaurant";
import { restaurantDataService } from "../services/restaurantDataService";

interface UseRestaurantReturn {
    restaurant: Restaurant | null;
    loading: boolean;
    error: string | null;
}

/** 
Custom React hook to fetch and manage restaurant data.
 * This hook is responsible for retrieving restaurant details based on the provided `restaurantId`. 
 * It handles loading, error states, and provides the restaurant data once fetched.
 * 
 * - **restaurant**: Contains the fetched restaurant data (null if not fetched or in case of an error).
 * - **loading**: A boolean flag indicating if the data is still being fetched.
 * - **error**: A string representing the error message in case of failure to fetch the data.
 * 
 * The hook automatically fetches the restaurant data when the `restaurantId` changes.
*/
export const useRestaurant = (restaurantId: string): UseRestaurantReturn => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await restaurantDataService.getRestaurantById(restaurantId);
                setRestaurant(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occured");
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurant();
        }
    }, [restaurantId]);

    return { restaurant, loading, error};
};