import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "../hooks/models"

/**
 * Fetches all users with reviews from Firestore
 */
export const fetchUserReviews = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, "users")
    const snapshot = await getDocs(usersRef)

    // Filter users who have reviews
    const usersWithReviews = snapshot.docs
      .map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          }) as User,
      )
      .filter((user) => user.user_review && user.user_review.trim() !== "")

    return usersWithReviews
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    throw error
  }
}

/**
 * Gets initials from a name for avatar fallback
 */
export const getInitials = (name: string): string => {
  if (!name) return "??"
  return name.substring(0, 2).toUpperCase()
}

/**
 * Utility function to generate a random number between min and max
 */
export const getRandomNumber = (min: number, max: number, seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return min + (hash % (max - min + 1))
}
