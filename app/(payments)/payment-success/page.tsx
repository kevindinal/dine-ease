"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "../hooks/useOrder";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
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

          
          // Initialize order status states (all false by default)
          setOrderState({
            isTableReady: false,
            isMealReady: false,
            isReservationReady: false
          });
          

          // Save the order ID to localStorage
          localStorage.setItem('currentOrderId', newOrderId);
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
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            <p className="mt-4 text-gray-500 font-medium">Verifying your account...</p>
          </div>
        </div>
      </div>
    );
  }

  // When order is being processed
  if (processingOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            <h1 className="mt-6 text-2xl font-bold text-gray-800">Processing Your Order</h1>
            <p className="mt-2 text-gray-500">Please wait while we finalize your order...</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#FA4032] h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error || !paymentIntentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertCircle className="h-16 w-16 text-[#FA4032]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-800">Payment Verification Failed</h1>
            <p className="mt-2 text-gray-500 text-center">
              {error || "We couldn't verify your payment. Please contact customer support."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
              <Link 
                href="/checkout" 
                className="w-full sm:w-auto text-center px-6 py-3 bg-[#FA4032] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Try Again
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-[#FA4032]" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="mt-2 text-gray-500">Thank you for your order.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-4">
            <span className="font-medium text-gray-700">Order Amount:</span>
            <span className="font-semibold">Rs. {amount.toLocaleString()}</span>
          </div>
          
          {orderId && (
            <div className="flex justify-between pt-4 border-b pb-4">
              <span className="font-medium text-gray-700">Order ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md">{orderId}</span>
            </div>
          )}
          
          <div className="flex justify-between pt-4 border-b pb-4">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="text-[#FA4032] font-semibold flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" /> Order Confirmed
            </span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          <Link 
            href="/order-status" 
            className="w-full px-6 py-3 bg-[#FA4032] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-center flex items-center justify-center"
          >
            View Order Status <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            href="/home-main"
            className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-center text-gray-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;