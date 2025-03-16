"use client"

import type React from "react"

import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

  // Count available days
  const availableDaysCount = Object.values(availability).filter(Boolean).length - 1 // Subtract 1 for timeRanges property

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden shadow-md"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-white mr-3" />
            <h3 className="font-semibold text-white text-lg">Table Availability</h3>
          </div>
          <Badge className="bg-white text-blue-700 hover:bg-blue-50">{availableDaysCount} days available</Badge>
        </div>
      </div>

      <div className="p-5">
        {/* Days of the week */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {days.map((day) => {
            const isAvailable = availability[day.key as keyof typeof availability]
            return (
              <motion.div key={day.key} className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                <div className="text-sm font-medium mb-2">{day.label}</div>
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                    isAvailable
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-red-50 text-red-400 border-2 border-red-200",
                  )}
                >
                  {isAvailable ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="mt-2 text-xs font-medium text-center">{isAvailable ? "Available" : "Closed"}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Time ranges */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-inner">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-base font-medium text-gray-800">Available Hours</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availability.timeRanges.map((range, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 text-blue-800 font-medium border border-blue-200 shadow-sm"
              >
                {formatTime(range.from)} - {formatTime(range.to)}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="flex items-center">
            <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
            Please select a date and time within these available periods when making your reservation.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Info icon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

