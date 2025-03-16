"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users, Tag, AlertCircle, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ReservationFormProps {
  tablePrice: number
  tableSeats: number
  isAvailable: boolean
  onReservation: () => void
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
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState(2)
  const [promoCode, setPromoCode] = useState("")
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [location, setLocation] = useState("indoor")
  const [specialRequests, setSpecialRequests] = useState("")

  // Calculate the total price with discount
  const discountAmount = (tablePrice * promoDiscount) / 100
  const totalPrice = tablePrice - discountAmount

  // Check if the selected date is available
  useEffect(() => {
    if (date && availability) {
      const selectedDate = new Date(date)
      const dayOfWeek = selectedDate.getDay() // 0 = Sunday, 1 = Monday, etc.

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
          `This table is not available on ${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}s. Please select another day.`,
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

    onReservation()
  }

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode)
    }
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle>Make a Reservation</CardTitle>
        <CardDescription>Reserve this table for your dining experience</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={cn(dateError ? "border-red-500" : "")}
            />
            {dateError && (
              <Alert variant="destructive" className="py-2 mt-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">{dateError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={cn(timeError ? "border-red-500" : "")}
            />
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

          {/* Location Preference */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              Seating Preference
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="bar">Bar Area</SelectItem>
                <SelectItem value="private">Private Room</SelectItem>
                <SelectItem value="no-preference">No Preference</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button
          className={cn("w-full", isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-gray-400")}
          disabled={!isAvailable || !date || !time || !!dateError || !!timeError}
          onClick={handleReservation}
        >
          {isAvailable ? "Reserve Now" : "Not Available"}
        </Button>
      </CardFooter>
    </Card>
  )
}

