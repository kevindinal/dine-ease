"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  error?: boolean
  className?: string
}

export function TimePicker({ value, onChange, error, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState<number>(0)
  const [selectedMinute, setSelectedMinute] = useState<number>(0)

  // Parse the initial value
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(":").map(Number)
      setSelectedHour(hours)
      setSelectedMinute(minutes)
    }
  }, [value])

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 15, 30, 45]

  // Format time for display
  const formatTimeForDisplay = (hour: number, minute: number): string => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
  }

  // Format time for value
  const formatTimeForValue = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  // Handle time selection
  const handleTimeSelection = (hour: number, minute: number) => {
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange(formatTimeForValue(hour, minute))
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-gray-200 bg-white hover:bg-gray-50",
            error ? "border-red-500" : "",
            className,
          )}
        >
          <Clock className="mr-2 h-5 w-5 text-red-500" />
          <span className="text-gray-800 font-medium">
            {value ? formatTimeForDisplay(selectedHour, selectedMinute) : "Select time"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 w-[300px]">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Popular times</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { hour: 12, minute: 0 },
                { hour: 13, minute: 0 },
                { hour: 18, minute: 0 },
                { hour: 19, minute: 0 },
                { hour: 20, minute: 0 },
                { hour: 21, minute: 0 },
              ].map((time) => (
                <Button
                  key={`${time.hour}:${time.minute}`}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    selectedHour === time.hour && selectedMinute === time.minute
                      ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
                      : "",
                  )}
                  onClick={() => handleTimeSelection(time.hour, time.minute)}
                >
                  {formatTimeForDisplay(time.hour, time.minute)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">All times</h4>
            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
              {hours.map((hour) =>
                minutes.map((minute) => (
                  <Button
                    key={`${hour}:${minute}`}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs",
                      selectedHour === hour && selectedMinute === minute
                        ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
                        : "",
                    )}
                    onClick={() => handleTimeSelection(hour, minute)}
                  >
                    {formatTimeForDisplay(hour, minute)}
                  </Button>
                )),
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

