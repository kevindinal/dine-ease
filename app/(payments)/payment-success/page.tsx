// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { CheckCircle, ArrowRight, Clock, ShieldCheck, Download } from "lucide-react";
// import { useRef } from "react";

// const PaymentSuccessPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const amount = searchParams.get("amount");
//   const receiptRef = useRef(null);

//   // Generate a random order number
//   const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
//   // Function to generate and download receipt
//   const downloadReceipt = () => {
//     const date = new Date().toLocaleDateString();
//     const time = new Date().toLocaleTimeString();
    
//     // Create receipt content
//     const receiptContent = `
// PAYMENT RECEIPT
// -----------------------
// Order Number: ${orderNumber}
// Date: ${date}
// Time: ${time}
// Amount: Rs.${amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : "0"}
// Payment Status: Successful
// -----------------------
// Thank you for your purchase!
// `;

//     // Create blob and download
//     const blob = new Blob([receiptContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Receipt-${orderNumber}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };
  
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFECEB] p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
//         {/* Success Header */}
//         <div className="bg-gradient-to-r from-[#FA4032] to-[#FB665B] text-white p-8 text-center relative">
//           <div className="absolute top-0 left-0 w-full overflow-hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="opacity-10">
//               <path fill="#FFFFFF" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,170.7C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
//             </svg>
//           </div>
          
//           <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
//             <CheckCircle className="w-10 h-10 text-green-500" />
//           </div>
          
//           <h1 className="text-3xl font-bold relative">
//             Payment Successful!
//           </h1>
//           <p className="text-white/80 mt-2 relative">
//             Your transaction has been completed
//           </p>
//         </div>
        
//         {/* Content Section */}
//         <div className="p-8">
//           {/* Order Information */}
//           <div className="mb-6">
//             <div className="text-gray-600 text-sm mb-1">ORDER NUMBER</div>
//             <div className="text-gray-900 font-medium">{orderNumber}</div>
//           </div>
          
//           {/* Amount Display Section */}
//           <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
//             <div className="text-gray-600 text-sm mb-1">AMOUNT PAID</div>
//             <div className="text-3xl font-bold text-[#FA4032]">
//               Rs.{amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : "0"}
//             </div>
//           </div>
          
//           {/* Success Messages */}
//           <div className="space-y-4 mb-8">
//             <div className="flex items-start">
//               <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
//                 <CheckCircle className="w-4 h-4 text-green-600" />
//               </div>
//               <p className="text-gray-700">
//                 Your payment has been processed successfully
//               </p>
//             </div>
            
//             <div className="flex items-start">
//               <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
//                 <Clock className="w-4 h-4 text-blue-600" />
//               </div>
//               <p className="text-gray-700">
//                 You will receive a confirmation email shortly
//               </p>
//             </div>
//           </div>
          
//           {/* Download Receipt Button */}
//           <button
//             onClick={downloadReceipt}
//             className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-all shadow-md flex items-center justify-center mb-3"
//           >
//             Download Receipt
//             <Download className="w-5 h-5 ml-2" />
//           </button>
          
//           {/* Order Status Button */}
//           <button
//             onClick={() => router.push("/order-status")}
//             className="w-full bg-[#FA4032] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#FB665B] transition-all shadow-md flex items-center justify-center"
//           >
//             View Order Status
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </button>
          
//           {/* Return to Home Button */}
// <button
//   onClick={() => router.push("/home-main")}
//   className="w-full mt-3 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all"
// >
//   Return to Home
// </button>
          
//           {/* Additional Footer Information */}
//           <div className="mt-8 text-center flex items-center justify-center text-sm text-gray-500">
//             <ShieldCheck className="w-4 h-4 mr-1" />
//             Secured & encrypted payment with Stripe
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;
// pages/payment-success.tsx
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
          
          // Initialize order status states (all false by default)
          setOrderState({
            isTableReady: false,
            isMealReady: false,
            isReservationReady: false
          });
          
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