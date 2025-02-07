"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name,
        email,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const response = await fetch("/api/checkout_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: paymentMethod.id }),
    });

    const session = await response.json();

    if (session.error) {
      alert(session.error);
      setLoading(false);
      return;
    }

    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-lg font-medium text-gray-800">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-lg font-medium text-gray-800"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-800">
          Credit or Debit Card
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default function Home() {
  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-50">
        <header className="w-full max-w-4xl text-center py-6">
          <h1 className="text-4xl font-bold text-gray-800">Secure Payment</h1>
          <p className="text-lg text-gray-600 mt-2">
            Please fill in your details and card information to complete your payment securely.
          </p>
        </header>

        <main className="flex flex-col items-center justify-center gap-8 p-4">
          <section className="text-center max-w-lg">
            
            <p className="mt-4 text-gray-700 text-lg">
              Your payment is processed securely using Stripe. Please fill out your details below to complete the payment.
            </p>
          </section>

          <PaymentForm />
        </main>

        <footer className="w-full max-w-4xl text-center py-6 mt-auto text-gray-500">
          <p>© {new Date().getFullYear()} My Next.js App. All rights reserved.</p>
          <p className="text-sm mt-2">
            Your payment is handled securely by Stripe, a trusted leader in online payments.
          </p>
        </footer>
      </div>
    </Elements>
  );
}
