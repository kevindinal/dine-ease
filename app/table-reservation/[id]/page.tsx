"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { ref, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase/config"
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Star,
  Utensils,
  Coffee,
  CheckCircle,
  XCircle,
  Info,
  Heart,
  Share2,
  DollarSign,
  ImageIcon,
  RotateCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import ThreeSixtyViewer from "@/app/table-reservation/thresixty"
import { useMediaQuery } from "@/hooks/use-media-query"
import Fallback360Viewer from "@/app/table-reservation/fall-back-360"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Table {
  id: string
  name: string
  location: string
  status: string
  seats: number
  description?: string
  price?: number
  imageUrl?: string
  threeSixtyImageUrl?: string
  additionalImages?: string[]
}

export default function TableDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [table, setTable] = useState<Table | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guestCount, setGuestCount] = useState("1")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("18:00")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  // Add a state to track the active view (gallery or 360)
  const [activeView, setActiveView] = useState<"gallery" | "360">("gallery")

  // Generate a random rating between 4.0 and 5.0 for demo purposes
  const rating = (4 + Math.random()).toFixed(1)

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true)
      try {
        const tableDoc = await getDoc(doc(db, "tables", id as string))

        if (!tableDoc.exists()) {
          setError("Table not found")
          setLoading(false)
          return
        }

        const tableData = tableDoc.data() as Omit<Table, "id">
        let imageUrl = tableData.imageUrl
        let threeSixtyImageUrl = tableData.threeSixtyImageUrl
        const additionalImages = tableData.additionalImages || []

        // Process image URLs
        if (imageUrl && !imageUrl.startsWith("http")) {
          try {
            const storageRef = ref(storage, imageUrl)
            imageUrl = await getDownloadURL(storageRef)
          } catch (error) {
            console.error("Error fetching image URL: ", error)
          }
        }

        if (threeSixtyImageUrl && !threeSixtyImageUrl.startsWith("http")) {
          try {
            const storageRef = ref(storage, threeSixtyImageUrl)
            threeSixtyImageUrl = await getDownloadURL(storageRef)
          } catch (error) {
            console.error("Error fetching 360 image URL: ", error)
          }
        }

        // Process additional images
        const processedAdditionalImages = await Promise.all(
          additionalImages.map(async (imgUrl) => {
            if (imgUrl && !imgUrl.startsWith("http")) {
              try {
                const storageRef = ref(storage, imgUrl)
                return await getDownloadURL(storageRef)
              } catch (error) {
                console.error("Error fetching additional image URL: ", error)
                return null
              }
            }
            return imgUrl
          }),
        )

        setTable({
          id: tableDoc.id,
          ...tableData,
          imageUrl,
          threeSixtyImageUrl,
          additionalImages: processedAdditionalImages.filter(Boolean) as string[],
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching table:", error)
        setError("Failed to load table information")
        setLoading(false)
      }
    }

    if (id) {
      fetchTable()
    }
  }, [id])

  const handleGoBack = () => {
    router.back()
  }

  const handleReservation = () => {
    // Implement reservation logic here
    alert(`Table reserved for ${guestCount} guests on ${selectedDate?.toLocaleDateString()} at ${selectedTime}`)
  }

  const nextImage = () => {
    if (table?.additionalImages?.length) {
      setCurrentImageIndex((prev) => (prev === table.additionalImages!.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (table?.additionalImages?.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? table.additionalImages!.length - 1 : prev - 1))
    }
  }

  const toggleFullscreen = () => {
    const element = document.documentElement

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  // Check if guest count is valid for this table
  const isValidGuestCount = !table?.seats
    ? false
    : !isNaN(Number(guestCount)) && Number(guestCount) <= table.seats && Number(guestCount) > 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-[400px] w-full rounded-xl mb-4" />
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-md" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-10 w-36 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />

            <div className="grid gap-6">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Table</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Tables
          </Button>
        </div>
      </div>
    )
  }

  if (!table) {
    return null
  }

  const isAvailable = table.status && table.status.toLowerCase() === "available"
  const allImages = [table.imageUrl, ...(table.additionalImages || [])].filter(Boolean) as string[]

  // Get appropriate seat arrangement description
  const getSeatArrangement = (seats: number) => {
    if (seats <= 2) return "Intimate setting for couples"
    if (seats <= 4) return "Perfect for small groups"
    if (seats <= 6) return "Great for medium-sized groups"
    return "Ideal for large gatherings"
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header with Navigation */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate">{table.name}</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "")} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Rating */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium",
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

                {table.threeSixtyImageUrl && (
                  <div className="flex bg-gray-100 rounded-full p-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full px-3 text-xs h-8",
                        activeView === "gallery" ? "bg-white shadow-sm" : "bg-transparent",
                      )}
                      onClick={() => setActiveView("gallery")}
                    >
                      <ImageIcon className="h-3.5 w-3.5 mr-1" /> Gallery
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full px-3 text-xs h-8",
                        activeView === "360" ? "bg-white shadow-sm" : "bg-transparent",
                      )}
                      onClick={() => setActiveView("360")}
                    >
                      <RotateCw className="h-3.5 w-3.5 mr-1" /> 360° View
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center text-amber-500">
                <Star size={18} className="fill-amber-500 mr-1" />
                <span className="font-medium">{rating}</span>
              </div>
            </div>

            {/* Main Image Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[16/9] shadow-md">
              {activeView === "gallery" ? (
                <>
                  <img
                    src={allImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${table.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bottom-2 bg-white/80 hover:bg-white/90 rounded-full"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {currentImageIndex + 1} / {allImages.length}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {process.env.NODE_ENV === "production" ? (
                    <Fallback360Viewer imageUrl={table.threeSixtyImageUrl || ""} />
                  ) : (
                    <ThreeSixtyViewer imageUrl={"/ff.jpg"} />
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      360° View - Click and drag to explore
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {activeView === "gallery" && allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "cursor-pointer rounded-md overflow-hidden h-16 w-16 flex-shrink-0",
                      currentImageIndex === idx ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100",
                    )}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Table Information */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-gray-700">{table.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-700">Seats {table.seats} people</span>
                  {table.price && (
                    <>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center text-gray-700">
                        <DollarSign size={16} className="mr-0.5" />
                        <span className="font-medium">${table.price.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="flex flex-wrap gap-2 pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100">
                        <Users size={14} className="mr-1.5" />
                        {getSeatArrangement(table.seats)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Table for {table.seats} people</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        <Coffee size={14} className="mr-1.5" />
                        Window View
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enjoy a beautiful view while dining</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100">
                        <Utensils size={14} className="mr-1.5" />
                        Premium Service
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enhanced dining experience with premium service</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Description */}
            {table.description && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">About this table</h3>
                <p className="text-gray-600 leading-relaxed">{table.description}</p>
              </div>
            )}


            {/* Additional Information */}
            <div className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="amenities">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800">
                    Amenities & Features
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-2 gap-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Air Conditioning
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Comfortable Seating
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Ambient Lighting
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Privacy
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Charging Outlets
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Table Service
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="policies">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800">
                    Reservation Policies
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Reservations must be made at least 2 hours in advance
                      </li>
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Cancellations must be made at least 1 hour before reservation time
                      </li>
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Late arrivals may result in table being given to other guests
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column - Reservation Form */}
          <div>
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
                      max={table.seats}
                      className="pl-10"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                    />
                  </div>
                  {!isValidGuestCount && (
                    <p className="text-red-500 text-sm mt-1.5">
                      Please enter a valid number of guests (1-{table.seats})
                    </p>
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

                {table.price && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Reservation fee</span>
                      <span className="font-medium">${table.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 mt-2">
                      <span>Service fee</span>
                      <span className="font-medium">${(table.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>${(table.price * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className={cn(
                    "w-full py-6 text-base font-medium transition-all",
                    isAvailable && isValidGuestCount
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed",
                  )}
                  onClick={handleReservation}
                  disabled={!isAvailable || !isValidGuestCount}
                >
                  {isAvailable ? "Reserve Now" : "Not Available"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By clicking "Reserve Now", you agree to our reservation policies
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

