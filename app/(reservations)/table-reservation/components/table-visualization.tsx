"use client"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TablePosition {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  status: string
  seats: number
  customer?: string
  time?: string
  shape: "rectangle" | "square"
  chairs: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

interface TableVisualizationProps {
  tables: any[]
  onTableSelect: (tableId: string) => void
  selectedTableId?: string
  reservationTime?: string
}

export default function TableVisualization({
  tables,
  onTableSelect,
  selectedTableId,
  reservationTime,
}: TableVisualizationProps) {
  const [activeTab, setActiveTab] = useState("indoor")
  const [searchTerm, setSearchTerm] = useState("")
  const [visualizationTables, setVisualizationTables] = useState<TablePosition[]>([])

  // Generate a layout based on the actual table data
  useEffect(() => {
    if (!tables || tables.length === 0) return

    // Create a grid layout based on the number of tables
    const generateLayout = () => {
      const layout: TablePosition[] = []

      // Define grid parameters
      const columns = 3
      const rowHeight = 200
      const columnWidth = 300
      const startX = 200
      const startY = 150
      const tableWidths = {
        small: 120, // 1-2 seats
        medium: 160, // 3-4 seats
        large: 200, // 5+ seats
      }

      // Sort tables by name to ensure consistent layout
      const sortedTables = [...tables].sort((a, b) => {
        // Extract numbers from table names for proper sorting (T1, T2, T10, etc.)
        const aNum = Number.parseInt(a.name.replace(/\D/g, "")) || 0
        const bNum = Number.parseInt(b.name.replace(/\D/g, "")) || 0
        return aNum - bNum
      })

      sortedTables.forEach((table, index) => {
        // Calculate position in grid
        const row = Math.floor(index / columns)
        const col = index % columns

        // Determine table size based on seats
        let tableWidth
        if (table.seats <= 2) {
          tableWidth = tableWidths.small
        } else if (table.seats <= 4) {
          tableWidth = tableWidths.medium
        } else {
          tableWidth = tableWidths.large
        }

        // Calculate chair distribution
        const totalChairs = table.seats
        let topChairs, rightChairs, bottomChairs, leftChairs

        if (totalChairs <= 2) {
          // For small tables, put chairs on top and bottom
          topChairs = 1
          bottomChairs = 1
          rightChairs = 0
          leftChairs = 0
        } else if (totalChairs <= 4) {
          // For medium tables, distribute chairs on all sides
          topChairs = 2
          bottomChairs = 2
          rightChairs = 0
          leftChairs = 0
        } else {
          // For large tables, distribute chairs on all sides
          topChairs = Math.ceil(totalChairs / 2)
          bottomChairs = Math.floor(totalChairs / 2)
          rightChairs = 0
          leftChairs = 0
        }

        // Extract customer name and time from reviews if available
        let customer = ""
        let time = ""

        if (table.reviews && table.reviews.length > 0) {
          // Use the most recent review for customer info
          const latestReview = table.reviews[table.reviews.length - 1]
          customer = latestReview.userName || ""

          // Format the date if available
          if (latestReview.date) {
            try {
              const reviewDate = new Date(latestReview.date)
              time = reviewDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            } catch (e) {
              console.error("Error formatting review date:", e)
            }
          }
        }

        // If no time from reviews, use reservation time
        if (!time && reservationTime) {
          time = formatTime(reservationTime)
        }

        // Create table position object
        layout.push({
          id: table.id,
          name: table.name,
          x: startX + col * columnWidth,
          y: startY + row * rowHeight,
          width: tableWidth,
          height: 80,
          shape: "rectangle",
          status: table.status.toLowerCase(),
          seats: table.seats,
          customer: customer,
          time: time,
          chairs: {
            top: topChairs,
            right: rightChairs,
            bottom: bottomChairs,
            left: leftChairs,
          },
        })
      })

      return layout
    }

    setVisualizationTables(generateLayout())
  }, [tables, reservationTime])

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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 border-emerald-400"
      case "reserved":
        return "bg-amber-100 border-amber-400"
      case "billed":
        return "bg-orange-400 border-orange-500"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-emerald-700"
      case "reserved":
        return "text-amber-700"
      case "billed":
        return "text-white"
      default:
        return "text-gray-700"
    }
  }

  // Get display status text
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "available":
        return "Free"
      case "reserved":
        return "Reserved"
      case "billed":
        return "Checked-in"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  // Get the count of tables by status
  const getStatusCounts = () => {
    const counts = {
      available: 0,
      reserved: 0,
      billed: 0,
    }

    tables.forEach((table) => {
      const status = table.status.toLowerCase()
      if (status === "available") counts.available++
      if (status === "reserved") counts.reserved++
      if (status === "billed") counts.billed++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  // Filter tables based on search term
  const filteredTables = visualizationTables.filter((table) => {
    if (!searchTerm) return true
    return (
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.customer && table.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Generate chair positions for a table
  const generateChairPositions = (table: TablePosition) => {
    const chairs = []
    const chairWidth = 40
    const chairHeight = 10
    const spacing = 10 // Space between chairs

    // Top chairs
    const topChairStartX = table.x - (table.chairs.top * chairWidth + (table.chairs.top - 1) * spacing) / 2
    for (let i = 0; i < table.chairs.top; i++) {
      chairs.push({
        x: topChairStartX + i * (chairWidth + spacing),
        y: table.y - table.height / 2 - chairHeight - 5,
        width: chairWidth,
        height: chairHeight,
      })
    }

    // Bottom chairs
    const bottomChairStartX = table.x - (table.chairs.bottom * chairWidth + (table.chairs.bottom - 1) * spacing) / 2
    for (let i = 0; i < table.chairs.bottom; i++) {
      chairs.push({
        x: bottomChairStartX + i * (chairWidth + spacing),
        y: table.y + table.height / 2 + 5,
        width: chairWidth,
        height: chairHeight,
      })
    }

    // Left chairs
    const leftChairStartY = table.y - (table.chairs.left * chairWidth + (table.chairs.left - 1) * spacing) / 2
    for (let i = 0; i < table.chairs.left; i++) {
      chairs.push({
        x: table.x - table.width / 2 - chairHeight - 5,
        y: leftChairStartY + i * (chairWidth + spacing),
        width: chairHeight,
        height: chairWidth,
      })
    }

    // Right chairs
    const rightChairStartY = table.y - (table.chairs.right * chairWidth + (table.chairs.right - 1) * spacing) / 2
    for (let i = 0; i < table.chairs.right; i++) {
      chairs.push({
        x: table.x + table.width / 2 + 5,
        y: rightChairStartY + i * (chairWidth + spacing),
        width: chairHeight,
        height: chairWidth,
      })
    }

    return chairs
  }

  // Render indoor tables
  const renderIndoorTables = () => {
    if (visualizationTables.length === 0) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Loading table data...</p>
          </div>
        </div>
      )
    }

    // Calculate the required height based on the number of rows
    const rows = Math.ceil(visualizationTables.length / 3)
    const minHeight = Math.max(600, rows * 200 + 100) // At least 600px or enough for all rows

    return (
      <div className="relative w-full overflow-x-auto bg-white rounded-xl" style={{ minHeight: `${minHeight}px` }}>
        <div className="relative w-full h-full">
          {/* Tables */}
          <TooltipProvider>
            {filteredTables.map((table) => {
              const isSelected = selectedTableId === table.id
              const chairPositions = generateChairPositions(table)

              return (
                <div key={table.id}>
                  {/* Chair positions */}
                  {chairPositions.map((chair, index) => (
                    <div
                      key={`${table.id}-chair-${index}`}
                      className="absolute bg-gray-300 rounded-sm"
                      style={{
                        left: `${chair.x}px`,
                        top: `${chair.y}px`,
                        width: `${chair.width}px`,
                        height: `${chair.height}px`,
                      }}
                    />
                  ))}

                  {/* Table */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onTableSelect(table.id)}
                        className={cn(
                          "absolute flex flex-col items-center justify-center border-2 transition-all duration-200 rounded-2xl",
                          getStatusColor(table.status),
                          isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                        )}
                        style={{
                          left: `${table.x - table.width / 2}px`,
                          top: `${table.y - table.height / 2}px`,
                          width: `${table.width}px`,
                          height: `${table.height}px`,
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <span className={cn("font-bold text-lg", getStatusTextColor(table.status))}>{table.name}</span>
                        {table.status === "available" && (
                          <span className={cn("text-sm", getStatusTextColor(table.status))}>Free</span>
                        )}
                        {table.status === "billed" && (
                          <span className={cn("text-sm", getStatusTextColor(table.status))}>Checked-in</span>
                        )}
                        {table.status === "reserved" && table.customer && (
                          <>
                            <span className={cn("text-sm", getStatusTextColor(table.status))}>{table.customer}</span>
                            {table.time && (
                              <span className={cn("text-xs", getStatusTextColor(table.status))}>{table.time}</span>
                            )}
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-bold">{table.name}</p>
                        <p>Status: {getDisplayStatus(table.status)}</p>
                        <p>Seats: {table.seats}</p>
                        {table.customer && <p>Customer: {table.customer}</p>}
                        {table.time && <p>Time: {table.time}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
    )
  }

  // Render outdoor tables (empty state)
  const renderOutdoorTables = () => {
    return (
      <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-gray-200 rounded-xl">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Outdoor seating area not available</p>
          <Button variant="outline" onClick={() => setActiveTab("indoor")}>
            View Indoor Tables
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mb-8 overflow-hidden bg-white rounded-xl border shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Choose Tables</h2>
          </div>
          <div className="flex items-center gap-3">
            <Tabs defaultValue="indoor" className="w-[240px]" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="indoor" className="text-sm">
                  Indoor
                </TabsTrigger>
                <TabsTrigger value="outdoor" className="text-sm">
                  Outdoor
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search tables..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
            Reserved ({statusCounts.reserved})
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200">
            Checked-in ({statusCounts.billed})
          </Badge>
        </div>

        <Tabs defaultValue="indoor" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="indoor" className="mt-0">
            {renderIndoorTables()}
          </TabsContent>

          <TabsContent value="outdoor" className="mt-0">
            {renderOutdoorTables()}
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t">
          <div className="text-sm font-medium">Table</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
            <span className="text-sm">Free : {statusCounts.available}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-300"></div>
            <span className="text-sm">Reserved : {statusCounts.reserved}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm">Checked-in : {statusCounts.billed}</span>
          </div>

          <div className="ml-auto">
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Check-in</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

