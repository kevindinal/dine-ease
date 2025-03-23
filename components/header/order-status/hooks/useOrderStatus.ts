import { useState, useEffect } from "react";
import { OrderStatus } from "../types/OrderStatus";
import { subscribeToOrderStatus } from "../services/OrderService";

export const useOrderStatus = () => {
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      // Get user ID and order ID from localStorage
      const userId = JSON.parse(localStorage.getItem('user') || '{}').uid;
      const orderId = localStorage.getItem('currentOrderId');
  
      if (!userId || !orderId) {
        setError('User ID or Order ID not found in localStorage');
        setLoading(false);
        return;
      }
  
      // Subscribe to order status changes
      const unsubscribe = subscribeToOrderStatus(
        orderId,
        userId,
        (status) => {
          setOrderStatus(status);
          setLoading(false);
        }
      );
  
      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    }, []);
  
    return { orderStatus, loading, error };
  };