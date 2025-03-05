import { useState, useEffect } from "react";
import { Restaurant } from "../types/restaurant";
import { restaurantDataService } from "../services/restaurantDataService";

interface UseRestaurantReturn {
    restaurant: Restaurant | null;
    loading: boolean;
    error: string | null;
}

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