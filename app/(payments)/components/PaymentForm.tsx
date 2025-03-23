"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "../checkout-page/page"; // Ensure this file handles Stripe checkout
import convertToSubcurrency from "@/lib/convertToSubcurrency";

// Ensure Stripe public key is set
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

type PaymentFormProps = {
  amount: number;
  onPaymentComplete: () => void;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ amount }) => {
  // Ensure the amount is valid before proceeding
  if (!amount || amount <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-xl font-bold">
          Invalid payment amount. Please try again.
        </p>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FA4032] to-[#FB665B] p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col h-full max-h-screen overflow-y-auto">
          {/* Header Section */}
          <div className="bg-[#FA4032] text-white text-center p-6">
            <h2 className="text-3xl font-bold">Secure Payment</h2>
            <p className="mt-2 text-lg">Complete your transaction safely</p>
          </div>


          {/* Scrollable Payment Info Section */}
          <div className="p-6 flex-grow">
            <p className="text-xl font-semibold text-gray-800 text-center">
              You are about to pay{" "}
              <span className="text-[#FA4032] font-bold">Rs.{amount.toFixed(2)}</span>
            </p>


            {/* Stripe Elements for payment processing */}
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "lkr",
              }}
            >
              <div className="bg-gray-100 p-6 mt-6 rounded-xl shadow-inner">
                <CheckoutPage amount={amount} />
              </div>
            </Elements>
          </div>


          {/* Footer Section */}
          <div className="text-center text-gray-500 text-sm p-4 border-t">
            Payments are secured & encrypted with <span className="font-semibold">Stripe</span>.
          </div>
        </div>
      </div>
    </div>
  );
};


export default PaymentForm;





