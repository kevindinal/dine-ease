import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Restaurant } from "../hooks/models"

/**
 * Fetches all restaurants from Firestore
 */
export const fetchAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const restaurantsRef = collection(db, "restaurants")
    const snapshot = await getDocs(restaurantsRef)

    const restaurantData = snapshot.docs.map((doc) => {
      const data = doc.data()
      const openingHours = ["10:00 AM - 10:00 PM", "11:00 AM - 11:00 PM", "9:00 AM - 9:00 PM", "12:00 PM - 12:00 AM"]

      return {
        id: doc.id,
        ...data,
        rating: typeof data.rating === "string" ? Number.parseFloat(data.rating) : data.rating,
        openingHours: data.openingHours || openingHours[Math.floor(Math.random() * openingHours.length)],
      } as Restaurant
    })

    return restaurantData
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    throw error
  }
}

/**
 * Fetches highly rated restaurants (rating >= 4.5)
 */
export const fetchHighlyRatedRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const allRestaurants = await fetchAllRestaurants()

    const cuisines = ["Italian", "Indian", "Chinese", "Japanese", "American", "French"]

    // Add cuisine to restaurants that don't have it
    const restaurantsWithCuisine = allRestaurants.map((restaurant) => ({
      ...restaurant,
      cuisine: restaurant.cuisine || cuisines[Math.floor(Math.random() * cuisines.length)],
    }))

    // Filter for highly rated restaurants
    const highlyRatedRestaurants = restaurantsWithCuisine.filter(
      (r) => !isNaN(Number(r.rating)) && Number(r.rating) >= 4.5,
    )

    return highlyRatedRestaurants
  } catch (error) {
    console.error("Error fetching highly rated restaurants:", error)
    throw error
  }
}

/**
 * Utility function to generate a random number between min and max
 */
export const getRandomNumber = (min: number, max: number, seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return min + (hash % (max - min + 1))
}
