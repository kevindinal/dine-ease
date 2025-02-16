'use client';

import React, {useEffect, useState} from "react";
import{
    useStripe,
    useElements,
    PaymentElement,
}from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckoutPage = ({ amount } : {amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

};

export default CheckoutPage;