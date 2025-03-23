import { useState, useEffect, useCallback, useRef } from 'react';
import { createOrder, ensureCollectionsExist } from '../services/orderService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { PreOrderItem } from '@/app/(cuisine)/types/preOrderTypes';
import usePreOrder from '@/app/(cuisine)/hooks/usePreOrder';

export const useOrder = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [collectionsReady, setCollectionsReady] = useState(false);
    
    // Keep track of processed payment intents to prevent duplicates
    const processedPaymentIntents = useRef<Set<string>>(new Set());
    
    // Get the preOrder hook to access preOrders and clear them after successful order
    const { preOrders, clearPreOrder } = usePreOrder();

    // Initialize orderId from localStorage if available
    useEffect(() => {
      // Only run in client side
      if (typeof window !== 'undefined') {
        const storedOrderId = localStorage.getItem('currentOrderId');
        if (storedOrderId) {
          setOrderId(storedOrderId);
        }
      }
    }, []);
  
    // Update localStorage whenever orderId changes
    useEffect(() => {
      if (orderId && typeof window !== 'undefined') {
        localStorage.setItem('currentOrderId', orderId);
        console.log(`Updated localStorage with currentOrderId: ${orderId}`);
      }
    }, [orderId]);
  
    // Ensure collections exist when the hook is initialized
    useEffect(() => {
      const initializeCollections = async () => {
        try {
          await ensureCollectionsExist();
          setCollectionsReady(true);
        } catch (e) {
          console.error("Failed to initialize collections:", e);
          // Still set as ready to prevent blocking, as setDoc will create collections when needed
          setCollectionsReady(true);
        }
      };
  
      initializeCollections();
    }, []);
  
    // Use useCallback to prevent this function from being recreated on every render
    const processOrder = useCallback(async (
      amount: number,
      paymentIntentId: string,
      items: PreOrderItem[] = preOrders
    ) => {
      if (!user?.uid) {
        setError('User not authenticated');
        return false;
      }
  
      // Check if we've already processed this payment intent
      if (processedPaymentIntents.current.has(paymentIntentId)) {
        console.log(`Payment intent ${paymentIntentId} already processed, skipping`);
        return orderId || false; // Return existing order ID if available
      }
  
      // Skip if already loading to prevent duplicate orders
      if (loading) {
        console.log("Already processing an order, skipping");
        return false;
      }
  
      setLoading(true);
      setError(null);
      
      try {
        // Make sure collections are ready before proceeding
        if (!collectionsReady) {
          await ensureCollectionsExist();
        }
        
        // Add to processed set BEFORE creating the order to prevent race conditions
        processedPaymentIntents.current.add(paymentIntentId);
        
        console.log(`Creating order for payment intent ${paymentIntentId}`);
        
        const newOrderId = await createOrder(
          user.uid,
          amount,
          paymentIntentId,
          items
        );
        
        // Clear preOrders after successful order creation
        clearPreOrder();
        
        // Update both state and localStorage with new orderId
        setOrderId(newOrderId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentOrderId', newOrderId);
          console.log(`Set new currentOrderId in localStorage: ${newOrderId}`);
        }
        
        setOrderSuccess(true);
        return newOrderId;
      } catch (err) {
        setError('Failed to process order');
        console.error(err);
        // If there was an error, remove from processed set to allow retry
        processedPaymentIntents.current.delete(paymentIntentId);
        return false;
      } finally {
        setLoading(false);
      }
    }, [user?.uid, collectionsReady, loading, preOrders, clearPreOrder]);
    
    return {
      processOrder,
      loading,
      error,
      orderSuccess,
      orderId,
      collectionsReady,
      preOrders // Expose preOrders for convenience
    };
};