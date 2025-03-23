import { useState, useEffect } from "react";
import { OrderStatus } from "../types/OrderStatus";
import { subscribeToOrderStatus } from "../services/OrderService";

export const useOrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

/**
This effect runs once when the component mounts.
 * The logic inside this effect fetches the current user ID and order ID from `localStorage`. If either 
 * of these values is not found, it sets an error message and stops the loading state.
 * If both `userId` and `orderId` are available, it subscribes to the order status updates using the 
 * `subscribeToOrderStatus` function. The `subscribeToOrderStatus` function is passed the `orderId` and 
 * `userId`, and it provides a callback function to update the `orderStatus` when the status changes. 
 * Once the status is received, the loading state is set to `false`.
 * The effect also ensures that when the component unmounts, it unsubscribes from the order status updates 
 * by returning the `unsubscribe` function.
 */
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').uid;
    const orderId = localStorage.getItem('currentOrderId');

    if (!userId || !orderId) {
      setError('User ID or Order ID not found in localStorage');
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToOrderStatus(
      orderId,
      userId,
      (status) => {
        setOrderStatus(status);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { orderStatus, loading, error };
};