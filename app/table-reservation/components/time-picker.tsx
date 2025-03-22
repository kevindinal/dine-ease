"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  error?: boolean
}

export function TimePicker({ value, onChange, error }: TimePickerProps) {
  // Format the displayed time
  const formatDisplayTime = () => {
    if (value) {
      const [hours, minutes] = value.split(":").map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const hour12 = hours % 12 || 12
        const ampm = hours >= 12 ? "PM" : "AM"
        return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`
      }
    }
    return "Select time"
  }

  // Generate time options in 30-minute increments
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour.toString().padStart(2, "0")
        const m = minute.toString().padStart(2, "0")
        const timeString = `${h}:${m}`

        const hour12 = hour % 12 || 12
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayTime = `${hour12}:${m} ${ampm}`

        options.push({ value: timeString, label: displayTime })
      }
    }
    return options
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500 text-red-500",
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <ScrollArea className="h-60">
          <div className="p-1">
            {timeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  value === option.value && "bg-primary/10 font-medium",
                )}
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

