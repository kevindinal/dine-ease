import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium text-gray-900">Availability</h3>
      </div>

      {/* Days of the week */}
      <div className="flex justify-between mb-4">
        {days.map((day) => (
          <div key={day.key} className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{day.label}</span>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                availability[day.key as keyof typeof availability]
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400",
              )}
            >
              {availability[day.key as keyof typeof availability] ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>

      {/* Time ranges */}
      <div className="mt-4">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Available Hours</span>
        </div>
        <div className="space-y-1">
          {availability.timeRanges.map((range, index) => (
            <Badge key={index} variant="outline" className="mr-2 mb-2 bg-gray-50">
              {formatTime(range.from)} - {formatTime(range.to)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

