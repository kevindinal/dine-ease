import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addPointsToUser } from '@/lib/firebase/points';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle successful payment intent
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // If you have user ID in the payment intent metadata, use it here
      const userId = paymentIntent.metadata?.userId;
      
      if (userId) {
        // Award points based on metadata or use default value
        const pointsToAward = Number(paymentIntent.metadata?.pointsToAward) || 10;
        await addPointsToUser(userId, pointsToAward);
        
        console.log(`Awarded ${pointsToAward} points to user ${userId} from webhook`);
      } else {
        console.log('No user ID found in payment intent metadata');
        // You might want to handle this case differently
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}