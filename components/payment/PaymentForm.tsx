'use client'

import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = 1499.99;

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-[#FA4032] to-[#FB665B] shadow-lg">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-[#FFECEB]">DineEase</h1>
        <h2 className="text-2xl text-[#FEC6C2]">
          has requested
          <span className="font-bold text-[#FEC6C2]"> Rs.{amount}</span>
        </h2>
      </div>

      {/* Payment Section */}
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "lkr",
        }}
      >
        <div className="bg-[#FFECEB] p-6 rounded-lg shadow-md">
          <CheckoutPage amount={amount} />
        </div>
      </Elements>
    </main>
  );
}
