"use client"

import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AvailabilityCalendarProps {
  availability?: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
    timeRanges: Array<{
      from: string
      to: string
    }>
  }
}

export default function AvailabilityCalendar({ availability }: AvailabilityCalendarProps) {
  if (!availability) {
    return null
  }

  const days = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ]

  // Format time to 12-hour format
  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours, 10)
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 || 12
      return `${formattedHour}:${minutes} ${ampm}`
    } catch (e) {
      return time
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="bg-primary/5 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-gray-900">Available Days & Hours</h3>
        </div>
      </div>

      <div className="p-4">
        {/* Days of the week */}
        <div className="flex justify-between mb-6">
          {days.map((day) => {
            const isAvailable = availability[day.key as keyof typeof availability]
            return (
              <motion.div key={day.key} className="flex flex-col items-center" whileHover={{ y: -2 }}>
                <span className="text-xs text-gray-500 mb-1">{day.label}</span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    isAvailable
                      ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                      : "bg-red-50 text-red-400 ring-1 ring-red-200",
                  )}
                >
                  {isAvailable ? "✓" : "✗"}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Time ranges */}
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Available Hours</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availability.timeRanges.map((range, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-primary/10 rounded-full px-3 py-1.5 text-xs font-medium text-primary"
              >
                {formatTime(range.from)} - {formatTime(range.to)}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          Please note that reservations are only accepted during these hours and days.
        </div>
      </div>
    </motion.div>
  )
}

