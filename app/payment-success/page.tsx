"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFECEB] via-[#F9D8D4] to-[#F8B9B5]">
      <div className="bg-gradient-to-r from-[#FA4032] to-[#FB665B] text-white p-10 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-center">
          🎉 Thank you for your payment!
        </h1>
        <p className="text-lg mt-4 text-center">
          Your payment was successful and we've received your order.
        </p>

        {/* Amount Display Section */}
<div className="text-4xl font-bold bg-[#FEC6C2] text-[#FA4032] p-6 rounded-xl mt-6 mb-8 shadow-xl text-center mx-auto">
  Rs.{amount}
</div>


        {/* Order Status Button */}
        <button
          onClick={() => router.push("/order-status")}
          className="w-full bg-[#6f0303] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#FC8C84] transition duration-300 shadow-lg transform hover:scale-105"
        >
          View Order Status
        </button>

        {/* Additional Footer Information */}
        <div className="mt-6 text-center text-sm text-gray-200">
          Payments are secured & encrypted with <span className="font-semibold">Stripe</span>.
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
