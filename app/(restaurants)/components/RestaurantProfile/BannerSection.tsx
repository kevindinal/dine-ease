"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Users, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

type BannerSectionProps = {
  restaurant: {
    id: string
    name: string
    bannerImage: string
    description: string
  }
}

export default function BannerSection({ restaurant }: BannerSectionProps) {
  const router = useRouter()
  const [guestCount, setGuestCount] = useState(2)
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [selectedTime, setSelectedTime] = useState("18:00")

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Format date for display
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const handleFindTable = () => {
    router.push(
      `/table-reservation?name=${encodeURIComponent(restaurant.name)}&id=${encodeURIComponent(restaurant.id)}&guests=${guestCount}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`,
    )
  }

  return (
    <div className="text-gray-900">
      <div className="relative h-[600px] overflow-hidden">
        {/* Parallax Banner Image */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src={restaurant.bannerImage || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{restaurant.name}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100">{restaurant.description}</p>
          </motion.div>

          {/* Make a Reservation Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl mt-6 w-full max-w-3xl text-gray-800"
          >
            <h3 className="text-xl font-bold mb-4 text-center">Reserve Your Table</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Guests Selector */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Guests</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    <Users size={18} />
                  </div>
                  <select
                    className="pl-10 w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 appearance-none"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Selector */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Date</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    <CalendarIcon size={18} />
                  </div>
                  <input
                    type="date"
                    className="pl-10 w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayDate()}
                  />
                </div>
              </div>

              {/* Time Selector */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Time</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    <Clock size={18} />
                  </div>
                  <select
                    className="pl-10 w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 appearance-none"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(
                      (time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Find Table Button */}
              <div className="relative">
                <label className="text-sm font-medium text-transparent mb-1 block">Find</label>
                <button
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                  onClick={handleFindTable}
                >
                  <span>Find Table</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

