"use client"

import { useState } from "react"
import { Users, Calendar, Clock, Loader2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ReservationFormProps {
  tablePrice: number
  tableSeats: number
  isAvailable: boolean
  onReservation: () => void
  promoDiscount?: number
  onApplyPromoCode: (code: string) => void
}

export default function ReservationForm({
  tablePrice,
  tableSeats,
  isAvailable,
  onReservation,
  promoDiscount = 0,
  onApplyPromoCode,
}: ReservationFormProps) {
  console.log("ReservationForm props:", { tablePrice, tableSeats, isAvailable, promoDiscount })
  const [guestCount, setGuestCount] = useState("1")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("18:00")
  const [specialRequests, setSpecialRequests] = useState("")
  const [selectedOccasion, setSelectedOccasion] = useState<string>("none")
  const [showPromoCode, setShowPromoCode] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Check if guest count is valid for this table
  const isValidGuestCount =
    tableSeats > 0 && !isNaN(Number(guestCount)) && Number(guestCount) <= tableSeats && Number(guestCount) > 0

  console.log("Guest count validation:", { guestCount, tableSeats, isValidGuestCount })

  // Calculate price with discount
  const calculatePrice = (basePrice: number) => {
    if (promoDiscount > 0) {
      const discountAmount = basePrice * (promoDiscount / 100)
      return basePrice - discountAmount
    }
    return basePrice
  }

  const handleReservation = () => {
    // Simulate reservation process
    setIsSubmittingReservation(true)

    setTimeout(() => {
      setIsSubmittingReservation(false)
      onReservation()
    }, 2000)
  }

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-20"
    >
      <h3 className="text-xl font-bold mb-6 text-gray-800">Make a Reservation</h3>

      <div className="space-y-5">
        <div>
          <Label htmlFor="guest-count" className="text-gray-700 font-medium">
            Number of Guests
          </Label>
          <div className="relative mt-1.5">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="guest-count"
              type="number"
              min="1"
              max={tableSeats}
              className="pl-10"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
          </div>
          {!isValidGuestCount && (
            <p className="text-red-500 text-sm mt-1.5">Please enter a valid number of guests (1-{tableSeats})</p>
          )}
        </div>

        <div>
          <Label htmlFor="date" className="text-gray-700 font-medium">
            Date
          </Label>
          <div className="relative mt-1.5">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <DatePicker date={selectedDate} setDate={setSelectedDate} className="pl-10 w-full" />
          </div>
        </div>

        <div>
          <Label htmlFor="time" className="text-gray-700 font-medium">
            Time
          </Label>
          <div className="relative mt-1.5">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Select defaultValue={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }).map((_, i) => {
                  const hour = i + 10 // Start from 10 AM
                  const time = `${hour}:00`
                  const display = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
                  return (
                    <SelectItem key={time} value={time}>
                      {display}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="occasion" className="text-gray-700 font-medium">
            Occasion (optional)
          </Label>
          <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
              <SelectItem value="date">Date Night</SelectItem>
              <SelectItem value="business">Business Meeting</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="special-requests" className="text-gray-700 font-medium">
            Special Requests (optional)
          </Label>
          <Textarea
            id="special-requests"
            placeholder="Any special requests or dietary requirements?"
            className="mt-1.5"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        {/* Promo Code */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-code" className="text-gray-700 font-medium">
              Promo Code
            </Label>
            <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setShowPromoCode(!showPromoCode)}>
              {showPromoCode ? "Hide" : "Have a code?"}
            </Button>
          </div>
          {showPromoCode && (
            <div className="flex gap-2 mt-1.5">
              <Input
                id="promo-code"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleApplyPromoCode} disabled={!promoCode.trim()}>
                Apply
              </Button>
            </div>
          )}
        </div>

        {tablePrice > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-gray-700">
              <span>Reservation fee</span>
              <span className="font-medium">${tablePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 mt-2">
              <span>Service fee</span>
              <span className="font-medium">${(tablePrice * 0.1).toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between items-center text-green-600 mt-2">
                <span>Discount ({promoDiscount}%)</span>
                <span className="font-medium">
                  -${((tablePrice + tablePrice * 0.1) * (promoDiscount / 100)).toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${calculatePrice(tablePrice * 1.1).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-gray-700 font-medium">Payment Method</Label>
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
            >
              {showPaymentOptions ? "Hide" : "Select method"}
            </Button>
          </div>
          {showPaymentOptions && (
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                  Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="apple-pay" id="apple-pay" />
                <Label htmlFor="apple-pay">Apple Pay</Label>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
          >
            I agree to the reservation policies and terms of service
          </label>
        </div>

        <Button
          className={cn(
            "w-full py-6 text-base font-medium transition-all",
            isAvailable && isValidGuestCount && termsAccepted
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed",
          )}
          onClick={handleReservation}
          disabled={!isAvailable || !isValidGuestCount || !termsAccepted || isSubmittingReservation}
        >
          {isSubmittingReservation ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </span>
          ) : isAvailable ? (
            "Reserve Now"
          ) : (
            "Not Available"
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By clicking "Reserve Now", you agree to our reservation policies
        </p>
      </div>
    </motion.div>
  )
}

