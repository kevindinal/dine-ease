import { addPointsToUser } from "@/lib/firebase/points";

/**
 * Process payment success and add reward points
 * @param userId User ID to award points to
 * @param amount Payment amount (for potential future use in calculating points)
 * @param paymentIntentId Stripe payment intent ID for tracking
 * @returns Promise that resolves to true if points were successfully awarded
 */
export const processPaymentSuccess = async (
  userId: string,
  amount: number,
  paymentIntentId: string
): Promise<boolean> => {
  if (!userId || !paymentIntentId) {
    console.error("Cannot process payment: Missing user ID or payment intent");
    return false;
  }

  try {
    // Add standard 10 points for completing a purchase
    // You could modify this to be based on the purchase amount
    const pointsAdded = await addPointsToUser(userId, 10);
    
    // Here you could also log the transaction in a separate collection for tracking
    // e.g., recording that this payment earned points in a payment_rewards collection
    
    return pointsAdded;
  } catch (error) {
    console.error("Error processing payment rewards:", error);
    return false;
  }
};