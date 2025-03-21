"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Users, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type BannerSectionProps = {
  restaurant?: {
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
  const [selectedTime, setSelectedTime] = useState("19:00")

  // Format date for URL and display
  function formatDateForUrl(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function formatDateForDisplay(date: Date) {
    const month = date.toLocaleString("default", { month: "long" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}${getDaySuffix(day)}, ${year}`
  }

  function getDaySuffix(day: number) {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const handleFindTable = () => {
    router.push(
      `/table-reservation?name=${encodeURIComponent(restaurant?.name || "Restaurant")}&id=${encodeURIComponent(restaurant?.id || "1")}&guests=${guestCount}&date=${encodeURIComponent(formatDateForUrl(selectedDate))}&time=${encodeURIComponent(selectedTime)}`,
    )
  }

  return (
    <div className="text-gray-900">
      <div className="relative h-[600px] sm:h-[650px] md:h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={
              restaurant?.bannerImage ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" ||
              "/placeholder.svg"
            }
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 py-6">
          {/* Header Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mb-8 sm:mb-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              {restaurant?.name || "Restaurant Name"}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto">
              {restaurant?.description || "Experience exceptional dining at our restaurant"}
            </p>
          </motion.div>

          {/* Reservation Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl text-gray-800 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              {/* Date Selection */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center text-left">
                    <CalendarIcon className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-800 font-medium">{formatDateForDisplay(selectedDate)}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>

              {/* Time Selection */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center text-left">
                    <Clock className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-800 font-medium">
                      {selectedTime === "19:00" ? "7:00 PM" : format(new Date(`2023-01-01T${selectedTime}`), "h:mm a")}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <div className="p-4 w-[300px]">
                    <div className="grid grid-cols-3 gap-2">
                      {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className={cn("text-sm", selectedTime === time ? "bg-red-500 text-white border-red-500" : "")}
                          onClick={() => setSelectedTime(time)}
                        >
                          {format(new Date(`2023-01-01T${time}`), "h:mm a")}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* People Selection */}
              <button
                className="w-full mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center text-left"
                onClick={() => {
                  // This would typically open a dropdown, but for simplicity we'll just cycle through options
                  setGuestCount(guestCount === 10 ? 1 : guestCount + 1)
                }}
              >
                <Users className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-800 font-medium">
                  {guestCount} {guestCount === 1 ? "person" : "people"}
                </span>
              </button>

              {/* Find Tables Button */}
              <button
                className="w-full p-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl flex items-center justify-center transition-colors duration-300"
                onClick={handleFindTable}
              >
                <span>Find Tables</span>
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

