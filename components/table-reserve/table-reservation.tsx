"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase/config"
import { collection, getDocs } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { ref, getDownloadURL } from "firebase/storage"
import { PiArmchairFill } from "react-icons/pi"
import { motion } from "framer-motion"
import { Search, Filter, MapPin, Calendar, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Table {
  id: string
  name: string
  location: string
  status: string
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

  const [restaurantName, setRestaurantName] = useState("Table Reservation");
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = new URLSearchParams(window.location.search).get("name");
      const id = new URLSearchParams(window.location.search).get("id");
      if (name && id) {
        setRestaurantName(name);
        setRestaurantId(id);

      }

    }
  }, []);

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

  // Filter tables based on search term and status
  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus ? table.status.toLowerCase() === selectedStatus.toLowerCase() : true
    return matchesSearch && matchesStatus
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
              <TableCard key={table.id} table={table} restaurantId={restaurantId} onClick={() => handleTableClick(table.id)} />
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
  restaurantId: string
}

function TableCard({ table, onClick, restaurantId }: TableCardProps) {
  const isAvailable = table.status && table.status.toLowerCase() === "available"
  const seats = table.seats || 0
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Get table dimensions based on number of seats
  const getTableDimensions = (seats: number) => {
    if (seats <= 2) {
      return {
        width: isMobile ? 70 : 80,
        height: isMobile ? 50 : 60,
      } // Small table for 2 or fewer
    } else if (seats <= 4) {
      return {
        width: isMobile ? 100 : 120,
        height: isMobile ? 70 : 80,
      } // Medium table for 3-4
    } else {
      return {
        width: isMobile ? 150 : 180,
        height: isMobile ? 80 : 90,
      } // Large table for 5+ (made wider for 6 chairs)
    }
  }

  const { width, height } = getTableDimensions(seats)

  // Calculate chair positions based on number of seats
  const getChairPositions = (seats: number) => {
    const positions = []
    const chairOffset = isMobile ? 10 : 12 // Distance from table edge to chair

    if (seats === 2) {
      // Two chairs facing each other (top and bottom centers)
      positions.push({ side: "top", index: 0, total: 1 })
      positions.push({ side: "bottom", index: 0, total: 1 })
    } else if (seats === 6) {
      // Three chairs on top and three on bottom, facing each other
      for (let i = 0; i < 3; i++) {
        positions.push({ side: "top", index: i, total: 3 })
      }
      for (let i = 0; i < 3; i++) {
        positions.push({ side: "bottom", index: i, total: 3 })
      }
    } else if (seats === 4) {
      // Two chairs on top and two on bottom
      for (let i = 0; i < 2; i++) {
        positions.push({ side: "top", index: i, total: 2 })
      }
      for (let i = 0; i < 2; i++) {
        positions.push({ side: "bottom", index: i, total: 2 })
      }
    } else if (seats === 3) {
      // Two chairs on one side, one on the other
      positions.push({ side: "top", index: 0, total: 2 })
      positions.push({ side: "top", index: 1, total: 2 })
      positions.push({ side: "bottom", index: 0, total: 1 })
    } else if (seats === 1) {
      // Single chair at the bottom center
      positions.push({ side: "bottom", index: 0, total: 1 })
    } else {
      // For 5 or more (except 6), distribute evenly on top and bottom
      const halfSeats = Math.ceil(seats / 2)
      const topChairs = Math.min(halfSeats, 3)
      const bottomChairs = seats - topChairs

      for (let i = 0; i < topChairs; i++) {
        positions.push({ side: "top", index: i, total: topChairs })
      }
      for (let i = 0; i < bottomChairs; i++) {
        positions.push({ side: "bottom", index: i, total: bottomChairs })
      }
    }

    return positions
  }

  const chairPositions = getChairPositions(seats)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md p-4 sm:p-5",
        isAvailable ? "bg-emerald-50 border-2 border-emerald-200" : "bg-gray-50 border-2 border-gray-200",
      )}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{table.name}</h3>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{restaurantId}</h3>
          <div className="flex items-center mt-1 text-gray-600">
            <MapPin size={12} className="mr-1" />
            <span className="text-xs sm:text-sm">{table.location}</span>
          </div>
        </div>
        <Badge className={isAvailable ? "bg-green-600" : "bg-red-600"}>
          {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : "Unknown"}
        </Badge>
      </div>

      <div className="table-visualization my-4 sm:my-6">
        <div className="table-container" style={{ height: height + 40 + "px" }}>
          {/* Table */}
          <div
            className={cn(
              "table-shape",
              isAvailable ? "bg-emerald-100 border-emerald-200" : "bg-gray-100 border-gray-300",
            )}
            style={{
              width: width + "px",
              height: height + "px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Chairs */}
          {chairPositions.map((chair, idx) => {
            const { side, index, total } = chair
            const chairOffset = isMobile ? 10 : 12 // Distance from table edge to chair center
            const chairSize = isMobile ? 5 : 6 // Chair icon size

            // Calculate position percentage
            let positionStyle = {}
            const tableHalfWidth = width / 2
            const tableHalfHeight = height / 2

            if (side === "top") {
              const spacing = width / (total + 1)
              const leftPos = spacing * (index + 1)
              positionStyle = {
                top: "50%",
                left: "50%",
                marginTop: -tableHalfHeight - chairOffset + "px",
                marginLeft: leftPos - tableHalfWidth - chairSize * 2 + "px",
                transform: "rotate(0deg)",
              }
            } else if (side === "bottom") {
              const spacing = width / (total + 1)
              const leftPos = spacing * (index + 1)
              positionStyle = {
                top: "50%",
                left: "50%",
                marginTop: tableHalfHeight - chairOffset + "px",
                marginLeft: leftPos - tableHalfWidth - chairSize * 2 + "px",
                transform: "rotate(180deg)",
              }
            }

            return (
              <div key={idx} className="chair-icon absolute" style={positionStyle as React.CSSProperties}>
                <PiArmchairFill
                  className={cn(isMobile ? "w-5 h-5" : "w-6 h-6", isAvailable ? "text-emerald-700" : "text-gray-500")}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Total Seats: {table.seats}</p>
      </div>
    </motion.div>
  )
}

