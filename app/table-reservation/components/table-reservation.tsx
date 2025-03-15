"use client"

import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase/config"
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
  Utensils,
  Star,
  Info,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Table {
  id: string
  name: string
  location: string
  status: string
  restaurantId: string
  seats: number
  imageUrl?: string
}

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = new URLSearchParams(window.location.search).get("name")
      const id = new URLSearchParams(window.location.search).get("id")
      const guestCount = new URLSearchParams(window.location.search).get("guests")

      if (name && id && guestCount) {
        setRestaurantName(name)
        setRestaurantId(id)
        setGuestCount(Number.parseInt(guestCount, 10))
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

  // Filter tables based on search term, status, and guest count
  const filteredTables = tables.filter((table) => {
    const matchesRestaurant = table.restaurantId === restaurantId
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus ? table.status.toLowerCase() === selectedStatus.toLowerCase() : true
    const matchesGuestCount = !guestCount || (!isNaN(Number(guestCount)) && Number(guestCount) <= table.seats)

    return matchesRestaurant && matchesSearch && matchesStatus && matchesGuestCount
  })

  const handleTableClick = (tableId: string) => {
    router.push(`/table-reservation/${tableId}`)
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 px-2">
                  <Filter size={14} />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Seats: Most to Least</DropdownMenuItem>
                <DropdownMenuItem>Seats: Least to Most</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button variant="outline" className="gap-2">
              <Filter size={16} /> More Filters
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={isMobile ? 16 : 20} />
            <span className="text-sm sm:text-base text-gray-700 font-medium">Today, March 12, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-gray-500" size={isMobile ? 16 : 20} />
            <span className="text-sm sm:text-base text-gray-700 font-medium">Current time: 5:45 PM</span>
          </div>
          <Button size={isMobile ? "sm" : "default"} className="bg-primary hover:bg-primary/90 mt-2 sm:mt-0">
            Change Date & Time
          </Button>
        </div>
      </div>

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
            <p className="text-sm sm:text-base text-gray-600">{filteredTables.length} tables found</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTables.map((table) => (
              <TableCard key={table.id} table={table} onClick={() => handleTableClick(table.id)} />
            ))}
          </div>
        </>
      )}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  <Coffee size={12} className="mr-1" />
                  Window View
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enjoy a beautiful view while dining</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                  <Utensils size={12} className="mr-1" />
                  Premium
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Premium table with enhanced service</p>
              </TooltipContent>
            </Tooltip>
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

