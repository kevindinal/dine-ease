
"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  if (!user) {
    setErrorMessage("You must be logged in to make a payment");
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
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements: elements,
    clientSecret: clientSecret,
    redirect: 'if_required',
    confirmParams: {
      return_url: `${window.location.origin}/payment-success?amount=${amount}`,
    },
  });

  if (error) {
    setErrorMessage(error.message || "Payment failed");
    setLoading(false);
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    // Instead of setting paymentSuccess to true, redirect to the success page
    router.push(`/payment-success?amount=${amount}&payment_intent=${paymentIntent.id}`);
  } else {
    // Handle other payment intent statuses
    setLoading(false);
    setErrorMessage("Payment is processing. Please wait...");
  }
};  // Display loading indicator if clientSecret is missing
  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-solid border-gray-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md text-center">
      {!paymentSuccess ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <PaymentElement />
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}

          <button
            className="text-white w-full p-4 bg-black mt-4 rounded-md font-bold disabled:opacity-50"
            onClick={handlePayment}
            disabled={loading}
          >
            {!loading ? `Pay Rs.${amount}` : "Processing..."}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-green-600 text-lg font-semibold">
              Payment Successful 🎉
            </h2>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => router.push(`/payment-success?amount=${amount}`)}
            >
              View Order Details
            </button>
            
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => router.push("/")}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;