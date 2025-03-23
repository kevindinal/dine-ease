"use client"

import { useState } from "react"
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
}

export default function TableVisualization({ tables, onTableSelect, selectedTableId }: TableVisualizationProps) {
  const [activeTab, setActiveTab] = useState("indoor")
  const [searchTerm, setSearchTerm] = useState("")

  // Define the restaurant layout with improved positioning
  const restaurantLayout: TablePosition[] = [
    // Row 1
    {
      id: "T1",
      name: "T1",
      x: 200,
      y: 150,
      width: 200,
      height: 80,
      shape: "rectangle",
      status: "reserved",
      seats: 5,
      customer: "Jhon ciena",
      time: "11:30am",
      chairs: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
      },
    },
    {
      id: "T2",
      name: "T2",
      x: 500,
      y: 150,
      width: 120,
      height: 80,
      shape: "rectangle",
      status: "checked-in",
      seats: 2,
      chairs: {
        top: 1,
        right: 0,
        bottom: 1,
        left: 0,
      },
    },
    {
      id: "T3",
      name: "T3",
      x: 750,
      y: 150,
      width: 200,
      height: 80,
      shape: "rectangle",
      status: "reserved",
      seats: 4,
      customer: "Kathryn",
      time: "11:30pm",
      chairs: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
      },
    },

    // Row 2
    {
      id: "T4",
      name: "T4",
      x: 200,
      y: 350,
      width: 120,
      height: 80,
      shape: "rectangle",
      status: "checked-in",
      seats: 2,
      chairs: {
        top: 1,
        right: 0,
        bottom: 1,
        left: 0,
      },
    },
    {
      id: "T5",
      name: "T5",
      x: 500,
      y: 350,
      width: 160,
      height: 80,
      shape: "rectangle",
      status: "free",
      seats: 4,
      chairs: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
      },
    },
    {
      id: "T6",
      name: "T6",
      x: 750,
      y: 350,
      width: 200,
      height: 80,
      shape: "rectangle",
      status: "checked-in",
      seats: 5,
      chairs: {
        top: 3,
        right: 0,
        bottom: 3,
        left: 0,
      },
    },

    // Row 3
    {
      id: "T7",
      name: "T7",
      x: 200,
      y: 550,
      width: 200,
      height: 80,
      shape: "rectangle",
      status: "reserved",
      seats: 3,
      customer: "Donald",
      time: "11:30am",
      chairs: {
        top: 2,
        right: 0,
        bottom: 2,
        left: 0,
      },
    },
    {
      id: "T8",
      name: "T8",
      x: 500,
      y: 550,
      width: 200,
      height: 80,
      shape: "rectangle",
      status: "free",
      seats: 6,
      chairs: {
        top: 3,
        right: 0,
        bottom: 3,
        left: 0,
      },
    },
    {
      id: "T9",
      name: "T9",
      x: 750,
      y: 550,
      width: 120,
      height: 80,
      shape: "rectangle",
      status: "free",
      seats: 2,
      chairs: {
        top: 1,
        right: 0,
        bottom: 1,
        left: 0,
      },
    },
  ]

  // Map the status from the database tables to the visualization status
  const getTableStatus = (tableId: string) => {
    const layoutTable = restaurantLayout.find((t) => t.id === tableId)
    if (!layoutTable) return "free"

    const dbTable = tables.find((t) => t.name === tableId)
    if (dbTable) {
      const status = dbTable.status.toLowerCase()
      if (status === "available") return "free"
      if (status === "reserved") return "reserved"
      if (status === "billed") return "checked-in"
      return status
    }

    return layoutTable.status
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "free":
        return "bg-emerald-100 border-emerald-400"
      case "reserved":
        return "bg-amber-100 border-amber-400"
      case "checked-in":
        return "bg-orange-400 border-orange-500"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "free":
        return "text-emerald-700"
      case "reserved":
        return "text-amber-700"
      case "checked-in":
        return "text-white"
      default:
        return "text-gray-700"
    }
  }

  // Get the count of tables by status
  const getStatusCounts = () => {
    const counts = {
      free: 0,
      reserved: 0,
      checkedIn: 0,
    }

    restaurantLayout.forEach((table) => {
      const status = getTableStatus(table.id)
      if (status === "free") counts.free++
      if (status === "reserved") counts.reserved++
      if (status === "checked-in") counts.checkedIn++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  // Filter tables based on search term
  const filteredTables = restaurantLayout.filter((table) => {
    if (!searchTerm) return true
    return (
      table.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    return (
      <div className="relative w-full overflow-x-auto bg-white rounded-xl" style={{ minHeight: "600px" }}>
        <div className="relative w-full h-[700px]">
          {/* Tables */}
          <TooltipProvider>
            {filteredTables.map((table) => {
              const status = getTableStatus(table.id)
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
                          getStatusColor(status),
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
                        <span className={cn("font-bold text-lg", getStatusTextColor(status))}>{table.name}</span>
                        {status === "free" && <span className={cn("text-sm", getStatusTextColor(status))}>Free</span>}
                        {status === "checked-in" && (
                          <span className={cn("text-sm", getStatusTextColor(status))}>Checked-in</span>
                        )}
                        {status === "reserved" && table.customer && (
                          <>
                            <span className={cn("text-sm", getStatusTextColor(status))}>{table.customer}</span>
                            <span className={cn("text-xs", getStatusTextColor(status))}>{table.time}</span>
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-bold">{table.name}</p>
                        <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
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
            Checked-in ({statusCounts.checkedIn})
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
            <span className="text-sm">Free : {statusCounts.free}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-300"></div>
            <span className="text-sm">Reserved : {statusCounts.reserved}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm">Checked-in : {statusCounts.checkedIn}</span>
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

