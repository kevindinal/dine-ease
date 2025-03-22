// hooks/usePoints.ts
import { useState, useCallback } from 'react';
import { getUserPoints, addPoints, awardPaymentPoints } from '../services/pointsService';

export const usePoints = (userId: string) => {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user points
  const fetchPoints = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userPoints = await getUserPoints(userId);
      setPoints(userPoints);
    } catch (err) {
      setError('Failed to fetch points');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Award points for payment
  const awardPointsForPayment = useCallback(async (amount: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await awardPaymentPoints(userId, amount);
      // Refresh points after awarding
      await fetchPoints();
      return true;
    } catch (err) {
      setError('Failed to award points');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchPoints]);

  return {
    points,
    loading,
    error,
    fetchPoints,
    awardPointsForPayment
  };
};