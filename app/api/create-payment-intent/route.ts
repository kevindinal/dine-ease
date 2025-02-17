import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    if (!amount) return NextResponse.json({ error: "Amount is required" }, { status: 400 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in subunits (e.g., cents)
      currency: "lkr",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
