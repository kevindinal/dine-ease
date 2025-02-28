"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New State

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handlePayment = async () => {
    setLoading(true);

    const order = { amount: convertToSubcurrency(amount) }; // Example order data

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const { sessionUrl } = await res.json();
    if (sessionUrl) {
      window.location.href = sessionUrl;
    } else {
      setErrorMessage("Failed to initiate payment.");
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md text-center">
      {!paymentSuccess ? (
        <form onSubmit={(e) => e.preventDefault()}>
          {clientSecret && <PaymentElement />}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <button
            disabled={loading}
            className="text-white w-full p-4 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            onClick={handlePayment}
          >
            {!loading ? `Pay Rs.${amount}` : "Processing..."}
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-green-600 text-lg font-semibold mt-4">
            Payment Successful 🎉
          </h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={() => router.push("/order-status")}
          >
            Order Status
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
