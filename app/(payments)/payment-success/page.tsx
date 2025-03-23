"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "../hooks/useOrder";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAuthState(auth);
  const { processOrder, loading, error, orderSuccess, preOrders } = useOrder();
  
  const [processingOrder, setProcessingOrder] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Use a ref to track if the order has been processed
  const hasProcessedOrder = useRef(false);
  
  // Track order status states
  const [orderState, setOrderState] = useState({
    isTableReady: false,
    isMealReady: false,
    isReservationReady: false
  });

  // Get parameters from URL
  const amount = searchParams.get("amount") ? parseInt(searchParams.get("amount")!) : 0;
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    // Only process the order if we have the necessary information
    const handleOrderCreation = async () => {
      // IMPORTANT: Check if we've already processed this order using the ref
      if (hasProcessedOrder.current) {
        console.log("Order already processed, skipping");
        return;
      }
      
      if (!user) {
        // If user is not loaded yet, wait
        return;
      }
  
      if (!paymentIntentId) {
        // If payment intent is missing, something went wrong
        setProcessingOrder(false);
        return;
      }
  
      try {
        // Set the ref BEFORE processing to prevent race conditions
        hasProcessedOrder.current = true;
        
        console.log("Processing order...");
        
        // Process the order using preOrders from the hook
        const newOrderId = await processOrder(
          amount,
          paymentIntentId,
          preOrders // This is now directly accessed from useOrder
        );
  
        if (newOrderId) {
          setOrderId(newOrderId);
          setOrderProcessed(true);
<<<<<<< Updated upstream
          
          // Initialize order status states (all false by default)
          setOrderState({
            isTableReady: false,
            isMealReady: false,
            isReservationReady: false
          });
          
=======
          // Save the order ID to localStorage
          localStorage.setItem('currentOrderId', newOrderId);
>>>>>>> Stashed changes
          console.log("Order processed successfully with ID:", newOrderId);
        }
      } catch (err) {
        console.error("Failed to create order:", err);
      } finally {
        setProcessingOrder(false);
      }
    };
  
    // Only attempt to process the order if conditions are met and we haven't already processed it
    if (user && paymentIntentId && !hasProcessedOrder.current) {
      handleOrderCreation();
    } else if (!user || !paymentIntentId) {
      setProcessingOrder(false);
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed, but having this function ensures the effect behaves properly
    };
  }, [user?.uid, paymentIntentId]); // Minimal dependencies to prevent re-runs

  // While authentication is still loading
  if (!user && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Verifying your account...</p>
      </div>
    );
  }

  // When order is being processed
  if (processingOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <h1 className="mt-6 text-2xl font-bold text-gray-800">Processing Your Order</h1>
        <p className="mt-2 text-gray-600">Please wait while we finalize your order...</p>
      </div>
    );
  }

  // If there was an error
  if (error || !paymentIntentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-2xl font-bold text-gray-800">Payment Verification Failed</h1>
        <p className="mt-2 text-gray-600">
          {error || "We couldn't verify your payment. Please contact customer support."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/checkout" 
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>
          <Link 
            href="/contact" 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-2xl font-bold text-gray-800">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">Thank you for your order.</p>
      
      <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between border-b pb-4">
          <span className="font-medium">Order Amount:</span>
          <span>Rs. {amount}</span>
        </div>
        
        {orderId && (
          <div className="flex justify-between pt-4 border-b pb-4">
            <span className="font-medium">Order ID:</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-4 border-b pb-4">
          <span className="font-medium">Status:</span>
          <span className="text-green-600">Order Confirmed</span>
        </div>
        
        {/* Restaurant ready state indicators */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Table Ready:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              orderState.isTableReady 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {orderState.isTableReady ? "Ready" : "Not Ready"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Meal Ready:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              orderState.isMealReady 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {orderState.isMealReady ? "Ready" : "Not Ready"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Reservation Ready:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              orderState.isReservationReady 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {orderState.isReservationReady ? "Ready" : "Not Ready"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/orders" 
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          View My Orders
        </Link>
        <Link 
          href="/"
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;