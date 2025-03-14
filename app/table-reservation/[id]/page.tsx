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
  RotateCw,
  Maximize,
  Minimize,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import ThreeSixtyViewer from "@/app/table-reservation/thresixty"
import { useMediaQuery } from "@/hooks/use-media-query"
import Fallback360Viewer from "@/app/table-reservation/fall-back-360"

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
  const isMobile = useMediaQuery("(max-width: 768px)")

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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">{table.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images and 360 View */}
        <div>
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="gallery" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" /> Gallery
              </TabsTrigger>
              {table.threeSixtyImageUrl && (
                <TabsTrigger value="360" className="flex items-center gap-1">
                  <RotateCw className="h-4 w-4" /> 360° View
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="gallery" className="mt-0">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                {allImages.length > 0 ? (
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
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "cursor-pointer rounded-md overflow-hidden h-20 w-20 flex-shrink-0 border-2",
                        currentImageIndex === idx ? "border-primary" : "border-transparent",
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
            </TabsContent>

            {table.threeSixtyImageUrl && (
              <TabsContent value="360" className="mt-0">
                <div className="rounded-xl overflow-hidden bg-gray-100 h-[400px]">
                  {process.env.NODE_ENV === "development" ? (
                    <Fallback360Viewer imageUrl={table.threeSixtyImageUrl} />
                  ) : (
                    <ThreeSixtyViewer imageUrl={table.threeSixtyImageUrl} />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500">
                    {process.env.NODE_ENV === "development"
                      ? "Using basic viewer due to CORS restrictions in development mode"
                      : "Click and drag to explore the 360° view of this table"}
                  </p>
                  {process.env.NODE_ENV === "development" && (
                    <p className="text-xs text-gray-400 mt-1">
                      <a
                        href="https://firebase.google.com/docs/storage/web/download-files#cors_configuration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Learn how to configure CORS for Firebase Storage
                      </a>
                    </p>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Right Column - Table Details and Reservation */}
        <div>
          <div className="flex flex-wrap items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{table.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Seats {table.seats} people</span>
              </div>
            </div>

            <Badge className={cn("px-3 py-1 text-sm", isAvailable ? "bg-green-600" : "bg-red-600")}>
              {table.status}
            </Badge>
          </div>

          {table.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About this table</h3>
              <p className="text-gray-700">{table.description}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Make a Reservation</h3>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="guest-count">Number of Guests</Label>
                <div className="relative">
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
                  <p className="text-red-500 text-sm mt-1">Please enter a valid number of guests (1-{table.seats})</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <DatePicker date={selectedDate} setDate={setSelectedDate} className="pl-10 w-full" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      id="time"
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {Array.from({ length: 13 }).map((_, i) => {
                        const hour = i + 10 // Start from 10 AM
                        const time = `${hour}:00`
                        const display = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
                        return (
                          <option key={time} value={time}>
                            {display}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleReservation}
              disabled={!isAvailable || !isValidGuestCount}
            >
              {isAvailable ? "Reserve Now" : "Not Available"}
            </Button>

            <Button variant="outline" size="lg" className="flex-1" onClick={handleGoBack}>
              View Other Tables
            </Button>
          </div>

          {table.price && (
            <p className="text-sm text-gray-500 mt-4 text-center">Reservation fee: ${table.price.toFixed(2)}</p>
          )}
        </div>
      </div>
    </div>
  )
}

