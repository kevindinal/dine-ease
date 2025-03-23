"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock, Users, Tag, AlertCircle, GlassWater, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "./time-picker"

interface ReservationFormProps {
  tablePrice: number
  tableSeats: number
  isAvailable: boolean
  onReservation: (reservationData: {
    date: Date | undefined
    time: string
    guests: number
    occasion: string
    specialRequests: string
    promoCode?: string
    promoDiscount?: number
  }) => void
  promoDiscount: number
  onApplyPromoCode: (code: string) => void
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

export default function ReservationForm({
  tablePrice,
  tableSeats,
  isAvailable,
  onReservation,
  promoDiscount,
  onApplyPromoCode,
  availability,
}: ReservationFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState(2)
  const [promoCode, setPromoCode] = useState("")
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [occasion, setOccasion] = useState("none")
  const [specialRequests, setSpecialRequests] = useState("")

  // Calculate the total price with discount
  const discountAmount = (tablePrice * promoDiscount) / 100
  const totalPrice = tablePrice - discountAmount

  // Check if the selected date is available
  useEffect(() => {
    if (date && availability) {
      const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

      // Map JavaScript day to our availability object keys
      const dayMap: Record<number, keyof typeof availability> = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      }

      const dayKey = dayMap[dayOfWeek]
      const isDayAvailable = availability[dayKey]

      if (!isDayAvailable) {
        setDateError(
          `This table is not available on ${
            dayKey.charAt(0).toUpperCase() + dayKey.slice(1)
          }s. Please select another day.`,
        )
      } else {
        setDateError(null)
      }
    } else {
      setDateError(null)
    }
  }, [date, availability])

  // Check if the selected time is within available time ranges
  useEffect(() => {
    if (time && availability && !dateError) {
      const [hours, minutes] = time.split(":").map(Number)
      const timeInMinutes = hours * 60 + minutes

      let isTimeAvailable = false

      if (availability.timeRanges && availability.timeRanges.length > 0) {
        isTimeAvailable = availability.timeRanges.some((range) => {
          const [fromHours, fromMinutes] = range.from.split(":").map(Number)
          const [toHours, toMinutes] = range.to.split(":").map(Number)

          const fromTimeInMinutes = fromHours * 60 + fromMinutes
          const toTimeInMinutes = toHours * 60 + toMinutes

          return timeInMinutes >= fromTimeInMinutes && timeInMinutes <= toTimeInMinutes
        })
      }

      if (!isTimeAvailable) {
        setTimeError("The selected time is outside available hours. Please choose a time within the available ranges.")
      } else {
        setTimeError(null)
      }
    } else {
      setTimeError(null)
    }
  }, [time, availability, dateError])

  const handleReservation = () => {
    if (!date || !time) {
      alert("Please select a date and time for your reservation.")
      return
    }

    if (dateError || timeError) {
      alert("Please correct the errors before making a reservation.")
      return
    }

    // Pass all the reservation data to the parent component
    onReservation({
      date,
      time,
      guests,
      occasion,
      specialRequests,
      promoCode: promoCode.trim() ? promoCode : undefined,
      promoDiscount: promoDiscount > 0 ? promoDiscount : undefined,
    })
  }

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-red-500">Make a Reservation</CardTitle>
        <CardDescription>Reserve this table for your dining experience</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Date Selection with Calendar Popover */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    dateError && "border-red-500 text-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
            {dateError && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">{dateError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Time Selection with Time Picker */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              Time
            </Label>
            <TimePicker value={time} onChange={handleTimeChange} error={!!timeError} />
            {timeError && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">{timeError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Guests Selection */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              Number of Guests
            </Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
              >
                -
              </Button>
              <Input
                id="guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                min={1}
                max={tableSeats}
                className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => setGuests(Math.min(tableSeats, guests + 1))}
                disabled={guests >= tableSeats}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-gray-500">This table can accommodate up to {tableSeats} guests</p>
          </div>

          {/* Occasion */}
          <div className="space-y-2">
            <Label htmlFor="occasion" className="flex items-center">
              <GlassWater className="h-4 w-4 mr-2 text-gray-500" />
              Occasion
            </Label>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger id="occasion">
                <SelectValue placeholder="Select occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None / Regular Dining</SelectItem>
                <SelectItem value="birthday">Birthday Celebration</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="date">Date Night</SelectItem>
                <SelectItem value="business">Business Meeting</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="other">Other Special Occasion</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Let us know if you're celebrating something special</p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
              Special Requests
            </Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or dietary requirements?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500">We'll do our best to accommodate your requests</p>
          </div>

          {/* Promo Code */}
          {showPromoInput ? (
            <div className="space-y-2">
              <Label htmlFor="promo" className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                Promo Code
              </Label>
              <div className="flex gap-2">
                <Input
                  id="promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                />
                <Button type="button" onClick={handleApplyPromo}>
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-primary w-full"
              onClick={() => setShowPromoInput(true)}
            >
              <Tag className="h-4 w-4 mr-2" />
              Add promo code
            </Button>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Table price</span>
              <span className="font-medium">${tablePrice.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({promoDiscount}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Reservation Button */}
          <Button
            className={cn("w-full mt-4", isAvailable ? "bg-red-500 hover:bg-red-600" : "bg-gray-400")}
            disabled={!isAvailable || !date || !time || !!dateError || !!timeError}
            onClick={handleReservation}
          >
            {isAvailable ? "Reserve Now" : "Not Available"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

