


"use client"

import { motion } from "framer-motion"
import { Star, MapPin, Clock, DollarSign, ChevronRight } from "lucide-react"
import type { Restaurant } from "../types/restaurant"
import { useRouter } from "next/navigation"
import { FaStar } from "react-icons/fa"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter()

  // Function to determine price level
  const getPriceLevel = (price = 2) => {
    return Array(price)
      .fill(0)
      .map((_, i) => <DollarSign key={i} className="h-3.5 w-3.5 fill-current" />)
  }

  // Function to get a random time slot for demo purposes
  const getRandomTimeSlots = () => {
    const slots = ["18:00", "19:00", "19:30", "20:00", "20:30", "21:00"]
    const randomSlots = []
    const numSlots = Math.floor(Math.random() * 3) + 1 // 1-3 slots

    for (let i = 0; i < numSlots; i++) {
      const randomIndex = Math.floor(Math.random() * slots.length)
      randomSlots.push(slots[randomIndex])
      slots.splice(randomIndex, 1)
    }

    return randomSlots.sort()
  }

  const timeSlots = getRandomTimeSlots()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        {/* {restaurant.isPromoted && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full">Featured</div>
        )} */}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1.5 rounded-full flex items-center shadow-md">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
          <span>{restaurant.rating || "4.5"}</span>
        </div>
      </div>

      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{restaurant.name}</h3>
          {/* <div className="flex text-yellow-500">{getPriceLevel(restaurant.priceLevel)}</div> */}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{restaurant.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.cuisine.slice(0, 3).map((cuisine, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
              {cuisine}
            </span>
          ))}
          {restaurant.cuisine.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
              +{restaurant.cuisine.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-yellow-500 mt-1">
          {[...Array(Math.floor(restaurant.rating || 0))].map((_, index) => (
            <FaStar key={index} />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {(restaurant.rating || 0).toFixed(1)} ({restaurant.reviews || 0})
          </span>
        </div>




        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {restaurant.description || "Experience the authentic flavors and ambiance at this popular restaurant."}
        </p>
      </div>

      <div className="p-5 pt-0">
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Available times</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                className="text-xs bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 px-4 py-2 rounded-full transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/restaurant/${restaurant.id}?time=${time}`)
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push(`/restaurants-profile/${restaurant.id}`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <span>Reserve a table</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}


