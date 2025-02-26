"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFECEB]">
      <div className="bg-gradient-to-r from-[#FA4032] to-[#FB665B] text-white p-8 rounded-xl shadow-lg text-center w-96">
        <h1 className="text-3xl font-extrabold">🎉 Thank you!</h1>
        <p className="text-lg mt-2">Your payment was successful</p>
        <div className="text-3xl font-bold bg-[#FEC6C2] text-[#FA4032] p-3 rounded-lg my-5">
          Rs.{amount}
        </div>
        {/* Order Status Button */}
        <button
          onClick={() => router.push("/order-status")}
          className="bg-[#6f0303] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FC8C84] transition duration-300 shadow-md"
        >
          View Order Status
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
