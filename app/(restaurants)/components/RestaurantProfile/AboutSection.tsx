"use client"

import { motion } from "framer-motion"
import { Tag, MapPin, DollarSign, Utensils } from "lucide-react"

type AboutSectionProps = {
  restaurant: {
    name: string
    about: string
    cuisine: string[]
    priceRange: string
    category: string
    location: string
    photos: string[]
  }
}

export default function AboutSection({ restaurant }: AboutSectionProps) {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
      >
        {/* Left Side - About, Cuisine & Details */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 relative">
              About <span className="text-red-500">{restaurant.name}</span>
              <div className="h-1 w-20 bg-red-500 mt-4 rounded-full"></div>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">{restaurant.about}</p>
          </div>

          {/* Two Columns for Cuisine & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {/* Cuisine List */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <Utensils className="mr-2 text-red-500" size={20} />
                Cuisine
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(restaurant.cuisine) ? (
                  restaurant.cuisine.map((cuisine, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm flex items-center"
                    >
                      <Tag size={14} className="mr-1 text-red-500" />
                      {cuisine}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No cuisine information available</span>
                )}
              </div>
            </div>

            {/* Restaurant Details */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <MapPin className="mr-2 text-red-500" size={20} />
                Details
              </h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <DollarSign className="mr-2 text-red-500" size={16} />
                  <span className="font-medium">Price Range:</span>
                  <span className="ml-2">{restaurant.priceRange || "Not specified"}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <Utensils className="mr-2 text-red-500" size={16} />
                  <span className="font-medium">Dining Style:</span>
                  <span className="ml-2">{restaurant.category || "Not specified"}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="mr-2 text-red-500" size={16} />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{restaurant.location || "Not specified"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Grid */}
        <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[500px]">
          {Array.isArray(restaurant.photos) && restaurant.photos.length > 0 ? (
            <>
              {restaurant.photos[0] && (
                <motion.div
                  className="col-span-6 row-span-3 overflow-hidden rounded-xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={restaurant.photos[0] || "/placeholder.svg"}
                    className="w-full h-full object-cover"
                    alt={`${restaurant.name} main photo`}
                  />
                </motion.div>
              )}
              <div className="col-span-6 row-span-3 grid grid-cols-3 gap-4">
                {restaurant.photos.slice(1, 4).map((photo, index) => (
                  <motion.div
                    key={index}
                    className="col-span-1 overflow-hidden rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                      alt={`${restaurant.name} photo ${index + 2}`}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-6 row-span-6 flex justify-center items-center bg-gray-100 rounded-xl">
              <p className="text-gray-500">No photos available</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

