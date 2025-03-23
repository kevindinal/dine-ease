"use client";


import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; // Make sure db is exported from firebase.ts
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData } from "@/lib/auth";
import { UserProp } from "@/types";
import { doc, updateDoc, increment, DocumentReference } from "firebase/firestore";


const CheckoutPage = ({ amount }: { amount: number }) => {
 const stripe = useStripe();
 const elements = useElements();
 const router = useRouter();
 const [user] = useAuthState(auth);
 const [userData, setUserData] = useState<UserProp | null>(null);


 const [errorMessage, setErrorMessage] = useState<string | null>(null);
 const [clientSecret, setClientSecret] = useState("");
 const [loading, setLoading] = useState(false);
 const [paymentSuccess, setPaymentSuccess] = useState(false);


 // Fetch user data
 useEffect(() => {
   const fetchUserData = async () => {
     if (user) {
       try {
         const data = await getUserData();
         setUserData(data);
       } catch (error) {
         console.error("Error fetching user data:", error);
       }
     }
   };


   fetchUserData();
 }, [user]);


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
     elements: elements, // Ensure elements is not null
     clientSecret: clientSecret, // Ensure clientSecret is not empty
     confirmParams: {
       return_url: `${window.location.origin}/payment-success?amount=${amount}`,
     },
   });


   if (error) {
     setErrorMessage(error.message || "Payment failed");
     setLoading(false);
   } else {
     setPaymentSuccess(true);
    
     // Add 10 points to the user's points in Firebase
     if (user && user.uid) {
       try {
         // Reference to the user document
         const userRef: DocumentReference = doc(db, "users", user.uid);
        
         // Update the points field, incrementing by 10
         await updateDoc(userRef, {
           points: increment(10)
         });
        
         console.log("Successfully added 10 points to user account");
       } catch (error) {
         console.error("Error updating user points:", error);
       }
     }
    
     setLoading(false);
   }
 };


 // Handle profile navigation
 const handleProfileNavigation = () => {
   // Redirect to profile page with user data
   if (userData?.uid) {
     router.push(`/my-profile/${userData.uid}`);
   } else {
     router.push("/profile");
   }
 };


 // Display loading indicator if clientSecret is missing
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
       <div>
         <h2 className="text-green-600 text-lg font-semibold mt-4">
           Payment Successful 🎉
         </h2>
        
         {/* Modified button that redirects to profile page */}
         <button
           className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
           onClick={handleProfileNavigation}
         >
           View Order Status
         </button>
        
         {/* Display user data preview if available */}
         {userData && (
           <div className="mt-4 p-3 bg-gray-50 rounded-md text-left">
             <p className="font-medium">Order placed by:</p>
             <p>{userData.firstName} {userData.lastName}</p>
             <p className="text-sm text-gray-600">{userData.email}</p>
             <p className="text-sm text-green-600 mt-1">+10 loyalty points added!</p>
           </div>
         )}
       </div>
     )}
   </div>
 );
};


export default CheckoutPage;



