import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { WeeklyOffer } from "../hooks/models"

/**
 * Fetches all weekly offers from Firestore
 */
export const fetchWeeklyOffers = async (): Promise<WeeklyOffer[]> => {
  try {
    const offersRef = collection(db, "weekly_offers")
    const snapshot = await getDocs(offersRef)

    const offersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WeeklyOffer[]

    return offersData
  } catch (error) {
    console.error("Error fetching weekly offers:", error)
    throw error
  }
}

/**
 * Calculates discount percentage between old and new price
 */
export const calculateDiscount = (oldPrice: number, newPrice: number): number => {
  if (!oldPrice || !newPrice) return 0
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100)
}

/**
 * Utility function to generate a random number between min and max
 */
export const getRandomNumber = (min: number, max: number, seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return min + (hash % (max - min + 1))
}
