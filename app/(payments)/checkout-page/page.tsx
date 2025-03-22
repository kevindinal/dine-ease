// "use client";

// import React, { useEffect, useState } from "react";
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";
// import { useRouter } from "next/navigation";

// const CheckoutPage = ({ amount }: { amount: number }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const router = useRouter();

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [clientSecret, setClientSecret] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   // Fetch clientSecret from backend
//   useEffect(() => {
//     const fetchClientSecret = async () => {
//       try {
//         const response = await fetch("/api/create-payment-intent", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
//         });

//         const data = await response.json();
//         if (data.clientSecret) {
//           setClientSecret(data.clientSecret);
//         } else {
//           setErrorMessage("Failed to initialize payment");
//         }
//       } catch (error) {
//         setErrorMessage("Failed to initialize payment");
//       }
//     };

//     fetchClientSecret();
//   }, [amount]);

//   // Handle payment submission
//   const handlePayment = async () => {
//     if (!stripe) {
//       setErrorMessage("Stripe has not loaded yet.");
//       return;
//     }

//     if (!elements) {
//       setErrorMessage("Elements have not loaded yet.");
//       return;
//     }

//     if (!clientSecret) {
//       setErrorMessage("Payment could not be initialized");
//       return;
//     }

//     setLoading(true);

//     // First, submit the payment form to validate inputs
//     const { error: submitError } = await elements.submit();
//     if (submitError) {
//       setErrorMessage(submitError.message || "An unknown error occurred.");
//       setLoading(false);
//       return;
//     }

//     // Then, confirm the payment with the client secret
//     const { error } = await stripe.confirmPayment({
//       elements: elements, // Ensure elements is not null
//       clientSecret: clientSecret, // Ensure clientSecret is not empty
//       confirmParams: {
//         return_url: `${window.location.origin}/payment-success?amount=${amount}`,
//       },
//     });

//     if (error) {
//       setErrorMessage(error.message || "Payment failed");
//       setLoading(false);
//     } else {
//       setPaymentSuccess(true);
//       setLoading(false);
//     }
//   };

//   // Display loading indicator if clientSecret is missing
//   if (!clientSecret) {
//     return (
//       <div className="flex items-center justify-center">
//         <div className="animate-spin h-8 w-8 border-4 border-solid border-gray-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-md text-center">
//       {!paymentSuccess ? (
//         <form onSubmit={(e) => e.preventDefault()}>
//           <PaymentElement />
//           {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}

//           <button
//             className="text-white w-full p-4 bg-black mt-4 rounded-md font-bold disabled:opacity-50"
//             onClick={handlePayment}
//             disabled={loading}
//           >
//             {!loading ? `Pay Rs.${amount}` : "Processing..."}
//           </button>
//         </form>
//       ) : (
//         <div>
//           <h2 className="text-green-600 text-lg font-semibold mt-4">
//             Payment Successful 🎉
//           </h2>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
//             onClick={() => router.push("/order-status")}
//           >
//             View Order Status
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";
import { usePoints } from "../hooks/usePoints";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  // Assuming you have an auth system to get the userId
  const { user } = useAuth();
  const userId = user?.uid;
  
  // Use our points hook
  const { awardPointsForPayment } = usePoints(userId);

  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // Fetch clientSecret from backend
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        });
        
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setErrorMessage("Failed to initialize payment");
        }
      } catch (error) {
        setErrorMessage("Failed to initialize payment");
      }
    };
    
    fetchClientSecret();
  }, [amount]);

  // Award points after successful payment
  useEffect(() => {
    const awardPoints = async () => {
      if (paymentSuccess && userId && !pointsAwarded) {
        try {
          await awardPointsForPayment(amount);
          setPointsAwarded(true);
          console.log("Awarded 10 points for payment!");
        } catch (error) {
          console.error("Failed to award points:", error);
        }
      }
    };

    awardPoints();
  }, [paymentSuccess, userId, amount, awardPointsForPayment, pointsAwarded]);

  // Handle payment submission
  const handlePayment = async () => {
    if (!stripe) {
      setErrorMessage("Stripe has not loaded yet.");
      return;
    }

    if (!elements) {
      setErrorMessage("Elements have not loaded yet.");
      return;
    }

    if (!clientSecret) {
      setErrorMessage("Payment could not be initialized");
      return;
    }

    setLoading(true);

    // First, submit the payment form to validate inputs
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || "An unknown error occurred.");
      setLoading(false);
      return;
    }

    // Then, confirm the payment with the client secret
    const { error } = await stripe.confirmPayment({
      elements: elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setLoading(false);
    } else {
      setPaymentSuccess(true);
      setLoading(false);
    }
  };

  // Display loading indicator if clientSecret is missing
  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-2">Initializing payment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      {!paymentSuccess ? (
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}>
          <PaymentElement />
          
          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!stripe || loading} 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {!loading ? `Pay Rs.${amount}` : "Processing..."}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-green-600">
            Payment Successful 🎉
          </div>
          {pointsAwarded && (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
              You earned 10 points for this purchase!
            </div>
          )}
          <button 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push("/order-status")}
          >
            View Order Status
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
