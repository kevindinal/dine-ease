// "use client";

// import { useRouter, useSearchParams } from "next/navigation";

// const PaymentSuccessPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const amount = searchParams.get("amount");

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFECEB] via-[#F9D8D4] to-[#F8B9B5]">
//       <div className="bg-gradient-to-r from-[#FA4032] to-[#FB665B] text-white p-10 rounded-3xl shadow-lg w-full max-w-lg">
//         <h1 className="text-4xl font-extrabold text-center">
//           🎉 Thank you for your payment!
//         </h1>
//         <p className="text-lg mt-4 text-center">
//           Your payment was successful and we've received your order.
//         </p>

//         {/* Amount Display Section */}
// <div className="text-4xl font-bold bg-[#FEC6C2] text-[#FA4032] p-6 rounded-xl mt-6 mb-8 shadow-xl text-center mx-auto">
//   Rs.{amount}
// </div>


//         {/* Order Status Button */}
//         <button
//           onClick={() => router.push("/order-status")}
//           className="w-full bg-[#6f0303] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#FC8C84] transition duration-300 shadow-lg transform hover:scale-105"
//         >
//           View Order Status
//         </button>

//         {/* Additional Footer Information */}
//         <div className="mt-6 text-center text-sm text-gray-200">
//           Payments are secured & encrypted with <span className="font-semibold">Stripe</span>.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;






// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { CheckCircle, ArrowRight, Clock, ShieldCheck } from "lucide-react";

// const PaymentSuccessPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const amount = searchParams.get("amount");

//   // Generate a random order number
//   const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
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
          
//           {/* Order Status Button */}
//           <button
//             onClick={() => router.push("/order-status")}
//             className="w-full bg-[#FA4032] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#FB665B] transition-all shadow-md flex items-center justify-center"
//           >
//             View Order Status
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </button>
          
//           {/* Return to Home Button */}
//           <button
//             onClick={() => router.push("/")}
//             className="w-full mt-3 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all"
//           >
//             Return to Home
//           </button>
          
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



"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Download } from "lucide-react";
import { useRef } from "react";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const receiptRef = useRef(null);

  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Function to generate and download receipt
  const downloadReceipt = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    // Create receipt content
    const receiptContent = `
PAYMENT RECEIPT
-----------------------
Order Number: ${orderNumber}
Date: ${date}
Time: ${time}
Amount: Rs.${amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : "0"}
Payment Status: Successful
-----------------------
Thank you for your purchase!
`;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFECEB] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-[#FA4032] to-[#FB665B] text-white p-8 text-center relative">
          <div className="absolute top-0 left-0 w-full overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="opacity-10">
              <path fill="#FFFFFF" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,170.7C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
          
          <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold relative">
            Payment Successful!
          </h1>
          <p className="text-white/80 mt-2 relative">
            Your transaction has been completed
          </p>
        </div>
        
        {/* Content Section */}
        <div className="p-8">
          {/* Order Information */}
          <div className="mb-6">
            <div className="text-gray-600 text-sm mb-1">ORDER NUMBER</div>
            <div className="text-gray-900 font-medium">{orderNumber}</div>
          </div>
          
          {/* Amount Display Section */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
            <div className="text-gray-600 text-sm mb-1">AMOUNT PAID</div>
            <div className="text-3xl font-bold text-[#FA4032]">
              Rs.{amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : "0"}
            </div>
          </div>
          
          {/* Success Messages */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                Your payment has been processed successfully
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-gray-700">
                You will receive a confirmation email shortly
              </p>
            </div>
          </div>
          
          {/* Download Receipt Button */}
          <button
            onClick={downloadReceipt}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-all shadow-md flex items-center justify-center mb-3"
          >
            Download Receipt
            <Download className="w-5 h-5 ml-2" />
          </button>
          
          {/* Order Status Button */}
          <button
            onClick={() => router.push("/order-status")}
            className="w-full bg-[#FA4032] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#FB665B] transition-all shadow-md flex items-center justify-center"
          >
            View Order Status
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          {/* Return to Home Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full mt-3 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Return to Home
          </button>
          
          {/* Additional Footer Information */}
          <div className="mt-8 text-center flex items-center justify-center text-sm text-gray-500">
            <ShieldCheck className="w-4 h-4 mr-1" />
            Secured & encrypted payment with Stripe
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

