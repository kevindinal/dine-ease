"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { db, storage } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { PiArmchairFill, PiSeatFill } from "react-icons/pi"
import {
  MapPin,
  Info,
  Trash2,
  Edit2,
  Camera,
  Upload,
  Plus,
  X,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ImageIcon,
  LayoutGrid,
  LayoutList,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Cigarette, CigaretteOff, Wifi, Award, Sparkles, Zap, Coffee, Users, Wind, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface AvailableTime {
  from: string
  to: string
}

interface AvailabilitySchedule {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  timeRanges: AvailableTime[]
}

interface Table {
  id: string
  name: string
  seats: number
  location: string
  imageUrl?: string
  description?: string
  status?: string
  createdAt?: Date
  features?: string[]
  availability?: AvailabilitySchedule
}

// Add this constant at the top of the file, after the existing interfaces
const AVAILABLE_FEATURES = [
  { id: "window-view", label: "Window View", icon: <Coffee className="h-4 w-4 mr-2" /> },
  { id: "premium-service", label: "Premium Service", icon: <Award className="h-4 w-4 mr-2" /> },
  { id: "charging-outlets", label: "Charging Outlets", icon: <Zap className="h-4 w-4 mr-2" /> },
  { id: "ambient-lighting", label: "Ambient Lighting", icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { id: "privacy", label: "Privacy", icon: <Users className="h-4 w-4 mr-2" /> },
  { id: "air-conditioning", label: "Air Conditioning", icon: <Wind className="h-4 w-4 mr-2" /> },
  { id: "smoking-allowed", label: "Smoking Allowed", icon: <Cigarette className="h-4 w-4 mr-2" /> },
  { id: "non-smoking", label: "Non-Smoking", icon: <CigaretteOff className="h-4 w-4 mr-2" /> },
  { id: "wifi", label: "Free WiFi", icon: <Wifi className="h-4 w-4 mr-2" /> },
]

// Helper function to convert feature IDs to display names
const getFeatureDisplayName = (featureId: string): string => {
  const feature = AVAILABLE_FEATURES.find((f) => f.id === featureId)
  return feature
    ? feature.label
    : featureId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
]

const DEFAULT_AVAILABILITY: AvailabilitySchedule = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
  timeRanges: [{ from: "09:00", to: "22:00" }],
}

// Helper function to format time for display
const formatTime = (time: string): string => {
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

const SeatingPlanEditor = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [tableData, setTableData] = useState<Omit<Table, "id">>({
    name: "",
    seats: 0,
    location: "",
    imageUrl: "",
    description: "",
    status: "available",
    features: [],
    availability: DEFAULT_AVAILABILITY,
  })
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingTableId, setEditingTableId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [currentPage, setCurrentPage] = useState(1)
  const tablesPerPage = 6

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 1024px)")
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch tables from Firestore
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

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null
    try {
      const storageRef = ref(storage, `table-images/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error("Error in uploadImage function:", error)
      return null
    }
  }

  // Handle save/update table
  const handleSaveTable = async () => {
    if (!tableData.name || !tableData.seats || !tableData.location) {
      setFormError("Please fill in all required fields")
      return
    }

    setFormError("")
    setLoading(true)

    try {
      let uploadedImageUrl = tableData.imageUrl
      if (imageFile) {
        try {
          const url = await uploadImage(imageFile)
          if (url) {
            uploadedImageUrl = url
          } else {
            console.error("Image upload returned null")
            // Continue with existing image URL if upload fails
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError)
          // Continue with existing image URL if upload fails
        }
      }
      const tableWithImage = {
        ...tableData,
        imageUrl: uploadedImageUrl,
        seats: Number(tableData.seats),
      }

      if (editingTableId) {
        // Update existing table
        const tableRef = doc(db, "tables", editingTableId)
        await updateDoc(tableRef, tableWithImage)

        setTables((prevTables) =>
          prevTables.map((table) => (table.id === editingTableId ? { ...table, ...tableWithImage } : table)),
        )
        setEditingTableId(null)
      } else {
        // Add new table
        const newTableRef = await addDoc(collection(db, "tables"), {
          ...tableWithImage,
          status: "available",
          createdAt: new Date(),
        })

        setTables([...tables, { id: newTableRef.id, ...tableWithImage, createdAt: new Date() }])
      }

      // Reset form
      setTableData({
        name: "",
        seats: 0,
        location: "",
        imageUrl: "",
        description: "",
        status: "available",
        features: [],
        availability: DEFAULT_AVAILABILITY,
      })
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Error saving table:", error)
      setFormError("Failed to save table. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle delete table
  const handleDeleteTable = async (tableId: string) => {
    setLoading(true)
    try {
      const tableRef = doc(db, "tables", tableId)
      await deleteDoc(tableRef)
      setTables(tables.filter((table) => table.id !== tableId))
    } catch (error) {
      console.error("Error deleting table:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle edit table
  const handleEditTable = (table: Table) => {
    setTableData({
      name: table.name,
      seats: table.seats,
      location: table.location,
      imageUrl: table.imageUrl || "",
      description: table.description || "",
      status: table.status || "available",
      features: table.features || [],
      availability: table.availability || DEFAULT_AVAILABILITY,
    })
    setEditingTableId(table.id)

    if (table.imageUrl) {
      setImagePreview(table.imageUrl)
    } else {
      setImagePreview(null)
    }

    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  // Filter tables based on search and status
  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.description && table.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter ? table.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredTables.length / tablesPerPage)
  const paginatedTables = filteredTables.slice((currentPage - 1) * tablesPerPage, currentPage * tablesPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Reset form
  const resetForm = () => {
    setTableData({
      name: "",
      seats: 0,
      location: "",
      imageUrl: "",
      description: "",
      status: "available",
      features: [],
      availability: DEFAULT_AVAILABILITY,
    })
    setEditingTableId(null)
    setImageFile(null)
    setImagePreview(null)
    setFormError("")
  }

  // Handle day selection
  const handleDayToggle = (day: keyof Omit<AvailabilitySchedule, "timeRanges">) => {
    setTableData({
      ...tableData,
      availability: {
        ...tableData.availability!,
        [day]: !tableData.availability![day],
      },
    })
  }

  // Handle time range changes
  const handleTimeRangeChange = (index: number, field: "from" | "to", value: string) => {
    const updatedTimeRanges = [...tableData.availability!.timeRanges]
    updatedTimeRanges[index] = {
      ...updatedTimeRanges[index],
      [field]: value,
    }

    setTableData({
      ...tableData,
      availability: {
        ...tableData.availability!,
        timeRanges: updatedTimeRanges,
      },
    })
  }

  // Add a new time range
  const addTimeRange = () => {
    setTableData({
      ...tableData,
      availability: {
        ...tableData.availability!,
        timeRanges: [...tableData.availability!.timeRanges, { from: "09:00", to: "22:00" }],
      },
    })
  }

  // Remove a time range
  const removeTimeRange = (index: number) => {
    const updatedTimeRanges = [...tableData.availability!.timeRanges]
    updatedTimeRanges.splice(index, 1)

    setTableData({
      ...tableData,
      availability: {
        ...tableData.availability!,
        timeRanges: updatedTimeRanges,
      },
    })
  }

  // Add this function inside the SeatingPlanEditor component
  const toggleFeature = (featureId: string) => {
    setTableData((prev) => {
      const features = prev.features || []
      return {
        ...prev,
        features: features.includes(featureId) ? features.filter((id) => id !== featureId) : [...features, featureId],
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-2rem)]">
        {/* Form Section */}
        <div ref={formRef} className="w-full lg:w-1/3 lg:sticky lg:top-4 self-start">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="text-2xl">{editingTableId ? "Edit Table" : "Add New Table"}</CardTitle>
              <CardDescription>
                {editingTableId
                  ? "Update the details of your existing table"
                  : "Create a new table for your seating plan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {formError && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{formError}</div>}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Table Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Table 1, VIP Table"
                    value={tableData.name}
                    onChange={(e) => setTableData({ ...tableData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">
                    Number of Seats <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    placeholder="e.g. 4"
                    value={tableData.seats || ""}
                    onChange={(e) => setTableData({ ...tableData, seats: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Near Window, Patio"
                    value={tableData.location}
                    onChange={(e) => setTableData({ ...tableData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional details about this table"
                    value={tableData.description || ""}
                    onChange={(e) => setTableData({ ...tableData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Features Section - Add this new section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                    <Label className="text-base font-medium">Table Features</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_FEATURES.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature.id}`}
                          checked={(tableData.features || []).includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                        <Label htmlFor={`feature-${feature.id}`} className="flex items-center text-sm cursor-pointer">
                          {feature.icon}
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Section */}

                {/* Availability Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <Label className="text-base font-medium">Table Availability</Label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm">Available Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.key}
                          type="button"
                          className={cn(
                            "h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                            tableData.availability![day.key as keyof Omit<AvailabilitySchedule, "timeRanges">]
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80",
                          )}
                          onClick={() => handleDayToggle(day.key as keyof Omit<AvailabilitySchedule, "timeRanges">)}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Available Time Periods
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTimeRange}
                        disabled={tableData.availability!.timeRanges.length >= 3}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Time
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {tableData.availability!.timeRanges.map((timeRange, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">From</Label>
                            <Input
                              type="time"
                              value={timeRange.from}
                              onChange={(e) => handleTimeRangeChange(index, "from", e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">To</Label>
                            <Input
                              type="time"
                              value={timeRange.to}
                              onChange={(e) => handleTimeRangeChange(index, "to", e.target.value)}
                              className="h-9"
                            />
                          </div>
                          {tableData.availability!.timeRanges.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 mt-5"
                              onClick={() => removeTimeRange(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Table Image</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {imagePreview && (
                      <div className="relative rounded-md overflow-hidden aspect-video bg-gray-100">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={() => {
                            setImagePreview(null)
                            setImageFile(null)
                            if (editingTableId) {
                              setTableData({ ...tableData, imageUrl: "" })
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>

                      <div className="relative">
                        <Input
                          id="camera-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById("camera-input")?.click()}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
              <Button variant="outline" onClick={resetForm}>
                {editingTableId ? "Cancel" : "Reset"}
              </Button>
              <Button onClick={handleSaveTable} disabled={loading} className="relative">
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    {editingTableId ? (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Update Table
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Table
                      </>
                    )}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="w-full lg:w-2/3">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-2xl font-bold">Your Tables</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search tables..."
                  className="pl-9 w-full sm:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-1">
                      <Filter size={16} />
                      {statusFilter ? statusFilter : "All Status"}
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("available")}>Available</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("reserved")}>Reserved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {loading && tables.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <Skeleton className="h-48 rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tables found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filters"
                  : "Add your first table to get started"}
              </p>
              {searchTerm || statusFilter ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter(null)
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Table
                </Button>
              )}
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedTables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onView={() => setSelectedTable(table)}
                      onEdit={() => handleEditTable(table)}
                      onDelete={() => handleDeleteTable(table.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedTables.map((table) => (
                    <TableRow
                      key={table.id}
                      table={table}
                      onView={() => setSelectedTable(table)}
                      onEdit={() => handleEditTable(table)}
                      onDelete={() => handleDeleteTable(table.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination Controls */}
          {filteredTables.length > tablesPerPage && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {paginatedTables.length} of {filteredTables.length} tables (Page {currentPage} of {totalPages})
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current
                    let pageToShow: number | null = null

                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all page numbers
                      pageToShow = i + 1
                    } else if (i === 0) {
                      // First button is always page 1
                      pageToShow = 1
                    } else if (i === 4) {
                      // Last button is always the last page
                      pageToShow = totalPages
                    } else if (currentPage <= 2) {
                      // Near the start
                      pageToShow = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      // Near the end
                      pageToShow = totalPages - 4 + i
                    } else {
                      // In the middle
                      pageToShow = currentPage - 1 + i
                    }

                    // Show ellipsis instead of page numbers in certain cases
                    if (totalPages > 5) {
                      if (i === 1 && currentPage > 3) {
                        return (
                          <span key="ellipsis-start" className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      if (i === 3 && currentPage < totalPages - 2) {
                        return (
                          <span key="ellipsis-end" className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        )
                      }
                    }

                    if (pageToShow !== null) {
                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => goToPage(pageToShow!)}
                        >
                          {pageToShow}
                        </Button>
                      )
                    }

                    return null
                  })}
                </div>

                <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Details Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTable?.name}</DialogTitle>
            <DialogDescription>Table details and information</DialogDescription>
          </DialogHeader>

          {selectedTable && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedTable.imageUrl ? (
                  <div className="w-full sm:w-1/2 aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={selectedTable.imageUrl || "/placeholder.svg"}
                      alt={selectedTable.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-1/2 aspect-video rounded-md bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}

                <div className="w-full sm:w-1/2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={selectedTable.status === "available" ? "bg-green-500" : "bg-red-500"}>
                      {selectedTable.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PiSeatFill className="h-4 w-4" />
                    <span>{selectedTable.seats} Seats</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedTable.location}</span>
                  </div>

                  {selectedTable.description && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Info className="h-3 w-3" /> Description
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedTable.description}</p>
                    </div>
                  )}

                  {/* Add this new section to display features */}
                  {selectedTable.features && selectedTable.features.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Features
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTable.features.map((featureId) => {
                          const feature = AVAILABLE_FEATURES.find((f) => f.id === featureId)
                          return (
                            <Badge key={featureId} variant="outline" className="flex items-center gap-1 bg-primary/5">
                              {feature?.icon && <span className="scale-75">{feature.icon}</span>}
                              {getFeatureDisplayName(featureId)}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedTable.availability && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Availability
                      </h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <Badge
                            key={day.key}
                            variant={
                              selectedTable.availability![day.key as keyof Omit<AvailabilitySchedule, "timeRanges">]
                                ? "default"
                                : "outline"
                            }
                            className={
                              selectedTable.availability![day.key as keyof Omit<AvailabilitySchedule, "timeRanges">]
                                ? "bg-primary"
                                : "text-muted-foreground"
                            }
                          >
                            {day.label}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" /> Hours:
                        </div>
                        {selectedTable.availability.timeRanges.map((time, i) => (
                          <div key={i} className="ml-4">
                            {formatTime(time.from)} - {formatTime(time.to)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTable(null)
                    handleEditTable(selectedTable)
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the table "{selectedTable.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleDeleteTable(selectedTable.id)
                          setSelectedTable(null)
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Table Card Component for Grid View
const TableCard = ({
  table,
  onView,
  onEdit,
  onDelete,
}: {
  table: Table
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) => {
  const isAvailable = table.status === "available"

  return (
    <Card
      className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onView}
    >
      <div className="relative h-48 bg-muted">
        {table.imageUrl ? (
          <img src={table.imageUrl || "/placeholder.svg"} alt={table.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <Badge className={cn("absolute top-3 right-3", isAvailable ? "bg-green-500" : "bg-red-500")}>
          {isAvailable ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Available
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Reserved
            </span>
          )}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{table.name}</h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <PiArmchairFill className="h-4 w-4 mr-2" />
            <span className="text-sm">{table.seats} Seats</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{table.location}</span>
          </div>

          {table.availability && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {
                  DAYS_OF_WEEK.filter(
                    (day) => table.availability![day.key as keyof Omit<AvailabilitySchedule, "timeRanges">],
                  ).length
                }{" "}
                days available
              </span>
            </div>
          )}

          {/* Add this new section to display features */}
          {table.features && table.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {table.features.slice(0, 2).map((featureId) => (
                <Badge key={featureId} variant="outline" className="bg-primary/5 text-xs">
                  {getFeatureDisplayName(featureId)}
                </Badge>
              ))}
              {table.features.length > 2 && (
                <Badge variant="outline" className="bg-gray-100 text-xs">
                  +{table.features.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-muted/20 border-t flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the table "{table.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

// Table Row Component for List View
const TableRow = ({
  table,
  onView,
  onEdit,
  onDelete,
}: {
  table: Table
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) => {
  const isAvailable = table.status === "available"

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-card"
      onClick={onView}
    >
      <div className="w-full sm:w-24 h-24 bg-muted flex-shrink-0">
        {table.imageUrl ? (
          <img src={table.imageUrl || "/placeholder.svg"} alt={table.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex-grow p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{table.name}</h3>
            <Badge className={cn("ml-2", isAvailable ? "bg-green-500" : "bg-red-500")}>{table.status}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <PiArmchairFill className="h-4 w-4 mr-1" />
              <span>{table.seats} Seats</span>
            </div>

            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{table.location}</span>
            </div>

            {table.availability && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {table.availability.timeRanges.length > 0
                    ? `${formatTime(table.availability.timeRanges[0].from)} - ${formatTime(table.availability.timeRanges[0].to)}`
                    : "No hours set"}
                </span>
              </div>
            )}
          </div>

          {/* Add this new section to display features */}
          {table.features && table.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {table.features.slice(0, 3).map((featureId) => (
                <Badge key={featureId} variant="outline" className="bg-primary/5 text-xs">
                  {getFeatureDisplayName(featureId)}
                </Badge>
              ))}
              {table.features.length > 3 && (
                <Badge variant="outline" className="bg-gray-100 text-xs">
                  +{table.features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the table "{table.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default SeatingPlanEditor

