import { useState, useCallback, useEffect } from "react";
import { addPointsToUser, getUserPoints } from "@/lib/firebase/points";

/**
 * Hook for managing user points
 * @param userId The user ID to manage points for
 * @returns Object with points data and functions
 */
export const usePoints = (userId: string) => {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch points function
  const fetchPoints = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentPoints = await getUserPoints(userId);
      setPoints(currentPoints);
    } catch (err) {
      console.error("Error fetching points:", err);
      setError("Failed to load points");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add points function
  const addPoints = useCallback(async (pointsToAdd: number = 10) => {
    if (!userId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await addPointsToUser(userId, pointsToAdd);
      if (success) {
        // Refresh points after adding
        await fetchPoints();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding points:", err);
      setError("Failed to add points");
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchPoints]);

  // Fetch points on initial load
  useEffect(() => {
    if (userId) {
      fetchPoints();
    }
  }, [userId, fetchPoints]);

  return { 
    points, 
    loading, 
    error, 
    fetchPoints, 
    addPoints 
  };
};