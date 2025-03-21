"use client"

import { motion } from "framer-motion"
import { Star, Quote, User } from "lucide-react"
import type { Review } from "../../types/restaurant"

interface GuestReviewsProps {
  reviews?: Review[] | null // Make the prop optional and allow null
}

export default function GuestReviews({ reviews }: GuestReviewsProps) {
  // Check if reviews exists and is an array
  const reviewsArray = Array.isArray(reviews) ? reviews : []

  // Sample reviews if none provided
  const sampleReviews: Review[] = [
    {
      id: "1",
      username: "Sarah Johnson",
      rating: 5,
      date: "2023-05-15",
      comment:
        "Absolutely amazing experience! The food was delicious and the service was impeccable. Will definitely be coming back soon.",
    },
    {
      id: "2",
      username: "Michael Chen",
      rating: 4,
      date: "2023-06-22",
      comment:
        "Great atmosphere and excellent food. The chef's special was outstanding. Highly recommend for a nice evening out.",
    },
    {
      id: "3",
      username: "Emily Rodriguez",
      rating: 5,
      date: "2023-07-10",
      comment:
        "One of the best dining experiences I've had in a long time. The attention to detail in every dish was remarkable.",
    },
  ]

  // Use provided reviews or sample reviews
  const reviewsToDisplay = reviewsArray.length > 0 ? reviewsArray : sampleReviews

  return (
    <div className="py-12 sm:py-16 bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Guest Reviews</h2>
          <div className="h-1 w-20 bg-red-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">
            See what our guests have to say about their dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {reviewsToDisplay.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-md relative"
            >
              <div className="absolute -top-4 -left-4 bg-red-500 text-white p-2 sm:p-3 rounded-full">
                <Quote className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <div className="flex items-center mb-4">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{review.username}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {new Date(review.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>

              <p className="text-gray-600 text-sm sm:text-base italic line-clamp-4">"{review.comment}"</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  )
}

