import { useState, useEffect } from "react";
import { Category } from "../types/category";
import { categoryService } from "../services/categoryService";

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

export const useCategories = (restaurantId: string): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            console.log('Fetching categories for restaurant:', restaurantId);
            try {
                const data = await categoryService.getCategoriesByRestaurantId(restaurantId);
                console.log('Fetched categories:', data);
                setCategories(data);
            } catch (error) {
                console.error("Error in useCategories: ", error);
                setError(error instanceof Error ? error.message : "An error occured");
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchCategories();
        }
    }, [restaurantId]);

    return { categories, loading, error};
}