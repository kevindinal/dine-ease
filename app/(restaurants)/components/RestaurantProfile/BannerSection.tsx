"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Users, ChevronRight, Search } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from "@/app/(restaurants)/components/timePicker" 

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState("18:00")
  const [isHovered, setIsHovered] = useState(false)

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Format date for URL
  function formatDateForUrl(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleFindTable = () => {
    router.push(
      `/table-reservation?name=${encodeURIComponent(restaurant.name)}&id=${encodeURIComponent(restaurant.id)}&guests=${guestCount}&date=${encodeURIComponent(formatDateForUrl(selectedDate))}&time=${encodeURIComponent(selectedTime)}`,
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

          {/* Enhanced Reservation Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mt-6 w-full max-w-3xl text-gray-800 border border-white/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.h3
              className="text-2xl font-bold mb-6 text-center"
              animate={{
                scale: isHovered ? 1.05 : 1,
                color: isHovered ? "#e11d48" : "#1f2937",
              }}
              transition={{ duration: 0.3 }}
            >
              Reserve Your Table
            </motion.h3>

            {/* Fixed layout with flex instead of grid */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Guests Selector */}
              <div className="space-y-2 w-full md:w-1/4">
                <label className="text-sm font-medium text-gray-600 block">Guests</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    <Users size={18} />
                  </div>
                  <select
                    className="pl-10 w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 appearance-none shadow-sm hover:border-red-300"
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

              {/* Enhanced Date Selector */}
              <div className="space-y-2 w-full md:w-1/3">
                <label className="text-sm font-medium text-gray-600 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-gray-300 hover:border-red-300 shadow-sm",
                        "pl-10 relative",
                      )}
                    >
                      <CalendarIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
                        size={18}
                      />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      disabled={(date) => {
                        // Disable dates in the past
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Enhanced Time Selector */}
              <div className="space-y-2 w-full md:w-1/4">
                <label className="text-sm font-medium text-gray-600 block">Time</label>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
              </div>

              {/* Enhanced Find Table Button */}
              <div className="space-y-2 w-full md:w-1/4">
                <label className="text-sm font-medium text-transparent block">Find</label>
                <motion.button
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                  onClick={handleFindTable}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="h-4 w-4" />
                  <span>Find Table</span>
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              className="mt-6 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>Special requests? Let us know when you complete your reservation.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

