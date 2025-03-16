"use client"

import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase/tables"
import { collection, getDocs } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { ref, getDownloadURL } from "firebase/storage"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Coffee,
  Star,
  Info,
  DollarSign,
  Wifi,
  Wind,
  Zap,
  Sparkles,
  Award,
  Cigarette,
  CigaretteOff,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface Table {
  id: string
  name: string
  location: string
  status: string
  restaurantId: string
  seats: number
  imageUrl?: string
  price?: number
  features?: string[]
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

// Define available features for filtering
const AVAILABLE_FEATURES = [
  { id: "window-view", label: "Window View", icon: <Coffee className="h-4 w-4 mr-2" /> },
  { id: "premium-service", label: "Premium Service", icon: <Award className="h-4 w-4 mr-2" /> },
  { id: "charging-outlets", label: "Charging Outlets", icon: <Zap className="h-4 w-4 mr-2" /> },
  { id: "ambient-lighting", label: "Ambient Lighting", icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { id: "wifi", label: "Free WiFi", icon: <Wifi className="h-4 w-4 mr-2" /> },
  { id: "air-conditioning", label: "Air Conditioning", icon: <Wind className="h-4 w-4 mr-2" /> },
]

export default function TableReservation() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const router = useRouter()

  const isMobile = useMediaQuery("(max-width: 768px)")

  const [restaurantName, setRestaurantName] = useState("Table Reservation")
  const [restaurantId, setRestaurantId] = useState("")
  const [guestCount, setGuestCount] = useState<number>(0)
  const [reservationDate, setReservationDate] = useState("")
  const [reservationTime, setReservationTime] = useState("")

  // Date/time dialog state
  const [showDateTimeDialog, setShowDateTimeDialog] = useState(false)
  const [newDate, setNewDate] = useState(reservationDate)
  const [newTime, setNewTime] = useState(reservationTime)

  // Additional filters state
  const [showFiltersPopover, setShowFiltersPopover] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [minSeats, setMinSeats] = useState(0)
  const [maxSeats, setMaxSeats] = useState(20)

  // Function to handle date/time changes
  const handleDateTimeChange = () => {
    if (newDate && newTime) {
      // Update the URL with new parameters
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.set("date", newDate)
      currentUrl.searchParams.set("time", newTime)

      // Navigate to the updated URL
      router.push(currentUrl.toString())

      // Update local state
      setReservationDate(newDate)
      setReservationTime(newTime)
      setShowDateTimeDialog(false)
    }
  }

  // Function to apply filters
  const applyFilters = () => {
    setShowFiltersPopover(false)
  }

  // Function to reset filters
  const resetFilters = () => {
    setPriceRange([0, 100])
    setSelectedFeatures([])
    setSortOption(null)
    setMinSeats(0)
    setMaxSeats(20)
  }

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = new URLSearchParams(window.location.search).get("name")
      const id = new URLSearchParams(window.location.search).get("id")
      const guestCount = new URLSearchParams(window.location.search).get("guests")
      const reservationDate = new URLSearchParams(window.location.search).get("date")
      const reservationTime = new URLSearchParams(window.location.search).get("time")

      if (name && id && guestCount && reservationDate && reservationTime) {
        setRestaurantName(name)
        setRestaurantId(id)
        setGuestCount(Number.parseInt(guestCount, 10))
        setReservationDate(reservationDate)
        setReservationTime(reservationTime)
        setNewDate(reservationDate)
        setNewTime(reservationTime)
      }
    }
  }, [])

  // Fetch Tables from Firestore
  useEffect(() => {
    let isMounted = true

    const fetchTables = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "tables"))

        const tablesData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data()
            let imageUrl = data.imageUrl

            if (imageUrl && !imageUrl.startsWith("http")) {
              try {
                const storageRef = ref(storage, imageUrl)
                imageUrl = await getDownloadURL(storageRef)
              } catch (error) {
                console.error("Error fetching image URL: ", error)
              }
            }

            return { id: docSnap.id, ...data, imageUrl } as Table
          }),
        )

        if (isMounted) {
          setTables(tablesData)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching tables:", error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTables()

    return () => {
      isMounted = false
    }
  }, [])

  // Filter tables based on all criteria
  const filteredTables = tables.filter((table) => {
    const matchesRestaurant = table.restaurantId === restaurantId
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus ? table.status.toLowerCase() === selectedStatus.toLowerCase() : true
    const matchesGuestCount = !guestCount || (!isNaN(Number(guestCount)) && Number(guestCount) <= table.seats)

    // Price range filter
    const matchesPrice = !table.price || (table.price >= priceRange[0] && table.price <= priceRange[1])

    // Seats range filter
    const matchesSeats = table.seats >= minSeats && table.seats <= maxSeats

    // Features filter
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) =>
        table.features?.some((tableFeature) => tableFeature.toLowerCase().replace(/\s+/g, "-") === feature),
      )

    // Check if the table is available on the selected date and time
    let matchesDateTime = true

    if (reservationDate && reservationTime && table.availability) {
      // Convert reservation date to day of week
      const reservationDay = new Date(reservationDate).getDay()
      // Convert JS day (0=Sunday) to our day keys
      const dayMap: Record<number, keyof typeof table.availability> = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      }

      const dayKey = dayMap[reservationDay]

      // Check if the table is available on this day of week
      const isAvailableOnDay = table.availability[dayKey]

      // Check if the time is within available time ranges
      let isAvailableAtTime = false

      if (isAvailableOnDay && table.availability.timeRanges && table.availability.timeRanges.length > 0) {
        // Convert reservation time to minutes for easier comparison
        const [resHours, resMinutes] = reservationTime.split(":").map(Number)
        const reservationTimeInMinutes = resHours * 60 + resMinutes

        // Check each time range
        isAvailableAtTime = table.availability.timeRanges.some((range) => {
          const [fromHours, fromMinutes] = range.from.split(":").map(Number)
          const [toHours, toMinutes] = range.to.split(":").map(Number)

          const fromTimeInMinutes = fromHours * 60 + fromMinutes
          const toTimeInMinutes = toHours * 60 + toMinutes

          // Check if reservation time falls within this range
          return reservationTimeInMinutes >= fromTimeInMinutes && reservationTimeInMinutes <= toTimeInMinutes
        })
      }

      matchesDateTime = isAvailableOnDay && isAvailableAtTime
    }

    return (
      matchesRestaurant &&
      matchesSearch &&
      matchesStatus &&
      matchesGuestCount &&
      matchesDateTime &&
      matchesPrice &&
      matchesSeats &&
      matchesFeatures
    )
  })

  // Sort tables based on selected sort option
  const sortedTables = [...filteredTables].sort((a, b) => {
    if (sortOption === "price-low-high") {
      return (a.price || 0) - (b.price || 0)
    } else if (sortOption === "price-high-low") {
      return (b.price || 0) - (a.price || 0)
    } else if (sortOption === "seats-most") {
      return b.seats - a.seats
    } else if (sortOption === "seats-least") {
      return a.seats - b.seats
    }
    return 0
  })

  const handleTableClick = (tableId: string) => {
    router.push(`/table-reservation/${tableId}?date=${reservationDate}&time=${reservationTime}&guests=${guestCount}`)
  }

  // Helper function to format time
  function formatTime(time: string): string {
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

  // Helper function to format date
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-800">{restaurantName}</h1>
        <p className="text-sm sm:text-base text-gray-600">Select a table to make your reservation</p>
      </div>

      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by table name or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isMobile ? (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "available" ? "default" : "outline"}
                onClick={() => setSelectedStatus(selectedStatus === "available" ? null : "available")}
                className={cn(
                  "text-xs px-3 py-1 h-auto",
                  selectedStatus === "available" ? "bg-green-600 hover:bg-green-700" : "",
                )}
              >
                Available
              </Button>
              <Button
                variant={selectedStatus === "reserved" ? "default" : "outline"}
                onClick={() => setSelectedStatus(selectedStatus === "reserved" ? null : "reserved")}
                className={cn(
                  "text-xs px-3 py-1 h-auto",
                  selectedStatus === "reserved" ? "bg-red-600 hover:bg-red-700" : "",
                )}
              >
                Reserved
              </Button>
            </div>

            <Popover open={showFiltersPopover} onOpenChange={setShowFiltersPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 px-2">
                  <Filter size={14} />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Filters</span>
                  {(selectedFeatures.length > 0 ||
                    sortOption ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 100 ||
                    minSeats > 0 ||
                    maxSeats < 20) && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {selectedFeatures.length +
                        (sortOption ? 1 : 0) +
                        (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) +
                        (minSeats > 0 || maxSeats < 20 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> Price Range
                    </h4>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Seats
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="min-seats" className="text-xs">
                          Min Seats
                        </Label>
                        <Input
                          id="min-seats"
                          type="number"
                          min={0}
                          max={maxSeats}
                          value={minSeats}
                          onChange={(e) => setMinSeats(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-seats" className="text-xs">
                          Max Seats
                        </Label>
                        <Input
                          id="max-seats"
                          type="number"
                          min={minSeats}
                          max={20}
                          value={maxSeats}
                          onChange={(e) => setMaxSeats(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_FEATURES.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature.id}
                            checked={selectedFeatures.includes(feature.id)}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <Label htmlFor={feature.id} className="flex items-center text-sm cursor-pointer">
                            {feature.icon}
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sort By</h4>
                    <div className="space-y-1">
                      {[
                        { id: "price-low-high", label: "Price: Low to High" },
                        { id: "price-high-low", label: "Price: High to Low" },
                        { id: "seats-most", label: "Seats: Most to Least" },
                        { id: "seats-least", label: "Seats: Least to Most" },
                      ].map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.id}
                            name="sort-option"
                            checked={sortOption === option.id}
                            onChange={() => setSortOption(option.id)}
                            className="text-primary"
                          />
                          <Label htmlFor={option.id} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "available" ? "default" : "outline"}
                onClick={() => setSelectedStatus(selectedStatus === "available" ? null : "available")}
                className={selectedStatus === "available" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Available
              </Button>
              <Button
                variant={selectedStatus === "reserved" ? "default" : "outline"}
                onClick={() => setSelectedStatus(selectedStatus === "reserved" ? null : "reserved")}
                className={selectedStatus === "reserved" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Reserved
              </Button>
            </div>

            <Popover open={showFiltersPopover} onOpenChange={setShowFiltersPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  More Filters
                  {(selectedFeatures.length > 0 ||
                    sortOption ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 100 ||
                    minSeats > 0 ||
                    maxSeats < 20) && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {selectedFeatures.length +
                        (sortOption ? 1 : 0) +
                        (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) +
                        (minSeats > 0 || maxSeats < 20 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> Price Range
                    </h4>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Seats
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-seats" className="text-xs">
                          Min Seats
                        </Label>
                        <Input
                          id="min-seats"
                          type="number"
                          min={0}
                          max={maxSeats}
                          value={minSeats}
                          onChange={(e) => setMinSeats(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-seats" className="text-xs">
                          Max Seats
                        </Label>
                        <Input
                          id="max-seats"
                          type="number"
                          min={minSeats}
                          max={20}
                          value={maxSeats}
                          onChange={(e) => setMaxSeats(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_FEATURES.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature.id}
                            checked={selectedFeatures.includes(feature.id)}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <Label htmlFor={feature.id} className="flex items-center text-sm cursor-pointer">
                            {feature.icon}
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "price-low-high", label: "Price: Low to High" },
                        { id: "price-high-low", label: "Price: High to Low" },
                        { id: "seats-most", label: "Seats: Most to Least" },
                        { id: "seats-least", label: "Seats: Least to Most" },
                      ].map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.id}
                            name="sort-option"
                            checked={sortOption === option.id}
                            onChange={() => setSortOption(option.id)}
                            className="text-primary"
                          />
                          <Label htmlFor={option.id} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedFeatures.length > 0 ||
        sortOption ||
        priceRange[0] > 0 ||
        priceRange[1] < 100 ||
        minSeats > 0 ||
        maxSeats < 20) && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>

          {priceRange[0] > 0 || priceRange[1] < 100 ? (
            <Badge variant="secondary" className="bg-gray-100">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <button className="ml-1 hover:text-red-500" onClick={() => setPriceRange([0, 100])}>
                ×
              </button>
            </Badge>
          ) : null}

          {minSeats > 0 || maxSeats < 20 ? (
            <Badge variant="secondary" className="bg-gray-100">
              Seats: {minSeats} - {maxSeats}
              <button
                className="ml-1 hover:text-red-500"
                onClick={() => {
                  setMinSeats(0)
                  setMaxSeats(20)
                }}
              >
                ×
              </button>
            </Badge>
          ) : null}

          {selectedFeatures.map((feature) => {
            const featureObj = AVAILABLE_FEATURES.find((f) => f.id === feature)
            return (
              <Badge key={feature} variant="secondary" className="bg-gray-100">
                {featureObj?.label || feature}
                <button className="ml-1 hover:text-red-500" onClick={() => toggleFeature(feature)}>
                  ×
                </button>
              </Badge>
            )
          })}

          {sortOption && (
            <Badge variant="secondary" className="bg-gray-100">
              {sortOption === "price-low-high"
                ? "Price: Low to High"
                : sortOption === "price-high-low"
                  ? "Price: High to Low"
                  : sortOption === "seats-most"
                    ? "Seats: Most to Least"
                    : "Seats: Least to Most"}
              <button className="ml-1 hover:text-red-500" onClick={() => setSortOption(null)}>
                ×
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-gray-500" onClick={resetFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Enhanced Date & Time Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl mb-8 overflow-hidden shadow-md"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-800">Your Reservation</h3>
              <p className="text-sm text-gray-600">Selected date and time for your dining experience</p>
            </div>

            <Button
              size={isMobile ? "sm" : "default"}
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowDateTimeDialog(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Change Date & Time
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Date</p>
                <p className="text-lg font-semibold text-gray-800">
                  {reservationDate ? formatDate(reservationDate) : "Select a date"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Time</p>
                <p className="text-lg font-semibold text-gray-800">
                  {reservationTime ? formatTime(reservationTime) : "Select a time"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-48 sm:h-64 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm sm:text-base text-gray-600">
              {sortedTables.length} tables found for {reservationDate && formatTime(reservationTime)}
            </p>
          </div>
          {sortedTables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedTables.map((table) => (
                <TableCard key={table.id} table={table} onClick={() => handleTableClick(table.id)} />
              ))}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-amber-800">No Tables Available</h3>
              <p className="text-amber-700 mb-4">
                There are no tables available with your current filters. Please try different filters or change your
                reservation time.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setShowDateTimeDialog(true)}>
                  Change Reservation Time
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-700 hover:bg-amber-50"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Date & Time Selection Dialog */}
      <Dialog open={showDateTimeDialog} onOpenChange={setShowDateTimeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Reservation Date & Time</DialogTitle>
            <DialogDescription>Select a new date and time for your table reservation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reservation-date">Date</Label>
              <Input
                id="reservation-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reservation-time">Time</Label>
              <Input id="reservation-time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDateTimeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDateTimeChange}>Update Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface TableCardProps {
  table: Table
  onClick: () => void
}

function TableCard({ table, onClick }: TableCardProps) {
  const isAvailable = table.status && table.status.toLowerCase() === "available"
  const seats = table.seats || 0

  // Generate a random rating between 4.0 and 5.0 for demo purposes
  const rating = (4 + Math.random()).toFixed(1)

  // Get a suitable background image if none is provided
  const tableImage = table.imageUrl || `/placeholder.svg?height=300&width=400`

  // Get appropriate seat arrangement description
  const getSeatArrangement = (seats: number) => {
    if (seats <= 2) return "Intimate setting for couples"
    if (seats <= 4) return "Perfect for small groups"
    if (seats <= 6) return "Great for medium-sized groups"
    return "Ideal for large gatherings"
  }

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-200 transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={tableImage || "/placeholder.svg"}
            alt={table.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-0 right-0 m-3">
            <Badge
              className={cn(
                "px-3 py-1 text-sm font-medium shadow-md",
                isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
              )}
            >
              {isAvailable ? (
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} />
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle size={14} />
                  Reserved
                </span>
              )}
            </Badge>
          </div>

          {/* Seats Indicator */}
          <div className="absolute bottom-0 left-0 m-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80 px-3 py-1">
                  <Users size={14} className="mr-1" />
                  {seats} {seats === 1 ? "seat" : "seats"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{getSeatArrangement(seats)}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Price Badge (if available) */}
          {table.price && (
            <div className="absolute bottom-0 right-0 m-3">
              <Badge variant="secondary" className="bg-primary text-white px-3 py-1">
                <DollarSign size={14} className="mr-1" />
                {table.price.toFixed(2)}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{table.name}</h3>
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-amber-500" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{table.location}</span>
          </div>

          {/* Features Section */}
          <div className="flex flex-wrap gap-2 mb-3">
            {table.features && table.features.length > 0 ? (
              <>
                {/* Display first 2 features with colorful badges */}
                {table.features.slice(0, 2).map((feature, index) => {
                  if (feature === "window-view") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600 border border-purple-200">
                            <Coffee size={12} className="mr-1 text-purple-600" />
                            Window View
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enjoy a beautiful view while dining</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "premium-service") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600 border border-amber-200">
                            <Award size={12} className="mr-1 text-amber-600" />
                            Premium
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium table with enhanced service</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "charging-outlets") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 border border-blue-200">
                            <Zap size={12} className="mr-1 text-blue-600" />
                            Charging
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Power outlets available at this table</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "smoking-allowed") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600 border border-orange-200">
                            <Cigarette size={12} className="mr-1 text-orange-600" />
                            Smoking
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Smoking is permitted in this area</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "non-smoking") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-600 border border-teal-200">
                            <CigaretteOff size={12} className="mr-1 text-teal-600" />
                            Non-Smoking
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Smoking is not permitted in this area</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "ambient-lighting") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600 border border-pink-200">
                            <Sparkles size={12} className="mr-1 text-pink-600" />
                            Ambient
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Special lighting for a pleasant atmosphere</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "free-wifi" || feature === "wifi") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600 border border-indigo-200">
                            <Wifi size={12} className="mr-1 text-indigo-600" />
                            WiFi
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Free wireless internet access</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  } else if (feature === "air-conditioning") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-600 border border-cyan-200">
                            <Wind size={12} className="mr-1 text-cyan-600" />
                            Air Conditioning
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Climate controlled environment</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                    
                  } else if (feature === "privacy") {
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 border border-green-200">
                            <Users size={12} className="mr-1  text-green-500" />
                            Privacy
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Offers good privacy</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                    
                  } 
                  else {
                    // Default badge for other features
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                            <CheckCircle size={12} className="mr-1 text-gray-600" />
                            {feature}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This table offers {feature}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                })}

                {/* Show "+X more" badge if there are more than 2 features */}
                {table.features.length > 2 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                        +{table.features.length - 2} more
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">Additional features:</p>
                        <ul className="text-xs">
                          {table.features.slice(2).map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-500">No special features</span>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Button
              className={cn(
                "w-full transition-all",
                isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500 cursor-not-allowed",
              )}
              disabled={!isAvailable}
            >
              {isAvailable ? "Reserve Now" : "Not Available"}
            </Button>
          </div>
        </div>

        {/* Quick Info Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <Info size={14} className="mr-1" />
            <span className="text-xs">Tap for details</span>
          </div>
          <span className="text-xs font-medium text-gray-700">ID: {table.id.substring(0, 6)}</span>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

