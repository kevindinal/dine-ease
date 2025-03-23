"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  CreditCard,
  Heart,
  History,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  Star,
  Bell,
  Gift,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Truck,
  ShoppingBag,
  CalendarClock,
  BadgePercent,
  X,
  Menu,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { db } from "@/lib/firebase/tables"
import { doc, getDoc } from "firebase/firestore"

// Mock data for the dashboard
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
  memberSince: "January 2023",
  level: "Gold Member",
  points: 1250,
  nextLevel: {
    name: "Platinum",
    pointsNeeded: 2000,
    progress: 62, // percentage
  },
}

const activeOrders = [
  {
    id: "ORD-7829",
    restaurant: "Bella Italia",
    items: ["Margherita Pizza", "Tiramisu", "Sparkling Water"],
    total: "$42.50",
    date: "Today at 1:30 PM",
    status: "preparing",
    estimatedDelivery: "Today, 2:15 PM",
    trackingSteps: [
      { name: "Order Placed", completed: true, time: "1:30 PM" },
      { name: "Preparing", completed: true, time: "1:45 PM" },
      { name: "Ready for Pickup", completed: false, time: "" },
      { name: "On the Way", completed: false, time: "" },
      { name: "Delivered", completed: false, time: "" },
    ],
  },
  {
    id: "ORD-7823",
    restaurant: "Sushi Express",
    items: ["California Roll (8pcs)", "Miso Soup", "Green Tea"],
    total: "$28.75",
    date: "Today at 12:15 PM",
    status: "on the way",
    estimatedDelivery: "Today, 1:00 PM",
    trackingSteps: [
      { name: "Order Placed", completed: true, time: "12:15 PM" },
      { name: "Preparing", completed: true, time: "12:30 PM" },
      { name: "Ready for Pickup", completed: true, time: "12:45 PM" },
      { name: "On the Way", completed: true, time: "12:50 PM" },
      { name: "Delivered", completed: false, time: "" },
    ],
  },
]

const pastOrders = [
  {
    id: "ORD-7801",
    restaurant: "Burger Delight",
    items: ["Double Cheeseburger", "Fries", "Chocolate Shake"],
    total: "$24.99",
    date: "Yesterday at 7:30 PM",
    status: "delivered",
    deliveryTime: "8:05 PM",
  },
  {
    id: "ORD-7785",
    restaurant: "Thai Spice",
    items: ["Pad Thai", "Spring Rolls", "Thai Iced Tea"],
    total: "$36.50",
    date: "May 15, 2023 at 1:15 PM",
    status: "delivered",
    deliveryTime: "1:55 PM",
  },
  {
    id: "ORD-7742",
    restaurant: "Mediterranean Grill",
    items: ["Falafel Wrap", "Greek Salad", "Hummus Plate"],
    total: "$32.25",
    date: "May 10, 2023 at 6:45 PM",
    status: "delivered",
    deliveryTime: "7:20 PM",
  },
]

const upcomingReservations = [
  {
    id: "RES-4523",
    restaurant: "The Grand Bistro",
    date: "May 25, 2023",
    time: "7:30 PM",
    guests: 4,
    status: "confirmed",
    table: "Window Table 12",
    specialRequests: "Anniversary celebration",
  },
  {
    id: "RES-4531",
    restaurant: "Seaside Grill",
    date: "June 3, 2023",
    time: "6:00 PM",
    guests: 2,
    status: "pending",
    table: "Pending assignment",
    specialRequests: "Outdoor seating preferred",
  },
]

const pastReservations = [
  {
    id: "RES-4498",
    restaurant: "Sakura Japanese",
    date: "May 12, 2023",
    time: "8:00 PM",
    guests: 3,
    status: "completed",
    table: "Tatami Room 2",
  },
  {
    id: "RES-4467",
    restaurant: "Vineyard Restaurant",
    date: "April 28, 2023",
    time: "7:00 PM",
    guests: 2,
    status: "completed",
    table: "Table 8",
  },
  {
    id: "RES-4432",
    restaurant: "Urban Kitchen",
    date: "April 15, 2023",
    time: "6:30 PM",
    guests: 5,
    status: "cancelled",
    table: "Table 20",
    cancellationReason: "Weather conditions",
  },
]

// Mock data for favorite restaurants - will be replaced with data from Firebase
const favoriteRestaurants = [
  {
    id: "REST-1234",
    name: "Bella Italia",
    cuisine: "Italian",
    rating: 4.8,
    image: "/placeholder.svg?height=80&width=80",
    lastVisited: "May 15, 2023",
  },
  {
    id: "REST-2345",
    name: "Sushi Express",
    cuisine: "Japanese",
    rating: 4.6,
    image: "/placeholder.svg?height=80&width=80",
    lastVisited: "May 5, 2023",
  },
  {
    id: "REST-3456",
    name: "The Grand Bistro",
    cuisine: "French",
    rating: 4.9,
    image: "/placeholder.svg?height=80&width=80",
    lastVisited: "April 28, 2023",
  },
  {
    id: "REST-4567",
    name: "Spice Garden",
    cuisine: "Indian",
    rating: 4.7,
    image: "/placeholder.svg?height=80&width=80",
    lastVisited: "April 20, 2023",
  },
]

// Interface for favorite tables
interface FavoriteTable {
  id: string
  name: string
  location: string
  seats: number
  price?: number
  status: string
  imageUrl?: string
  rating?: number
  cuisine?: string
  lastVisited?: string
}

const recentActivity = [
  {
    id: "ACT-1",
    type: "order",
    description: "Placed an order at Bella Italia",
    date: "Today at 1:30 PM",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    id: "ACT-2",
    type: "reservation",
    description: "Made a reservation at The Grand Bistro",
    date: "Yesterday at 10:15 AM",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    id: "ACT-3",
    type: "favorite",
    description: "Added Spice Garden to favorites",
    date: "May 18, 2023",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: "ACT-4",
    type: "review",
    description: "Left a 5-star review for Sushi Express",
    date: "May 15, 2023",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "ACT-5",
    type: "points",
    description: "Earned 150 points from your order at Thai Spice",
    date: "May 15, 2023",
    icon: <Gift className="h-4 w-4" />,
  },
]

const notifications = [
  {
    id: "NOTIF-1",
    title: "Your order is on the way!",
    description: "Your order from Sushi Express is on the way and will arrive soon.",
    time: "10 minutes ago",
    read: false,
    type: "order",
  },
  {
    id: "NOTIF-2",
    title: "Reservation reminder",
    description: "Your reservation at The Grand Bistro is tomorrow at 7:30 PM.",
    time: "2 hours ago",
    read: false,
    type: "reservation",
  },
  {
    id: "NOTIF-3",
    title: "Special offer for you!",
    description: "Get 20% off your next order at Bella Italia. Valid for 3 days.",
    time: "Yesterday",
    read: true,
    type: "promotion",
  },
  {
    id: "NOTIF-4",
    title: "Points milestone reached!",
    description: "Congratulations! You've reached 1,000 points and unlocked Gold status.",
    time: "3 days ago",
    read: true,
    type: "points",
  },
]

const paymentMethods = [
  {
    id: "CARD-1",
    type: "Visa",
    last4: "4242",
    expiry: "05/25",
    name: "Alex Johnson",
    isDefault: true,
  },
  {
    id: "CARD-2",
    type: "Mastercard",
    last4: "8888",
    expiry: "09/24",
    name: "Alex Johnson",
    isDefault: false,
  },
]

const addresses = [
  {
    id: "ADDR-1",
    name: "Home",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    isDefault: true,
  },
  {
    id: "ADDR-2",
    name: "Work",
    street: "456 Business Ave, Floor 12",
    city: "New York",
    state: "NY",
    zip: "10022",
    isDefault: false,
  },
]

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [favoriteTables, setFavoriteTables] = useState<FavoriteTable[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Fetch favorite tables from Firebase
  useEffect(() => {
    const fetchFavoriteTables = async () => {
      setLoading(true)

      try {
        // Get user data from local storage
        const localStorageUser = localStorage.getItem("user")

        if (!localStorageUser) {
          setLoading(false)
          return
        }

        // Parse user data from local storage
        const userData = JSON.parse(localStorageUser)

        // Check if user has favorites
        if (!userData.favorites || !Array.isArray(userData.favorites) || userData.favorites.length === 0) {
          setLoading(false)
          return
        }

        // Get the favorite table IDs from the user data
        const favoriteIds = userData.favorites

        // Fetch each table document from Firebase
        const tables: FavoriteTable[] = []

        for (const tableId of favoriteIds) {
          try {
            const tableDoc = await getDoc(doc(db, "tables", tableId))

            if (tableDoc.exists()) {
              const tableData = tableDoc.data()
              tables.push({
                id: tableDoc.id,
                name: tableData.name || "Unknown Table",
                location: tableData.location || "Unknown Location",
                seats: tableData.seats || 0,
                price: tableData.price,
                status: tableData.status || "unknown",
                imageUrl: tableData.imageUrl || "/placeholder.svg?height=80&width=80",
                rating: tableData.rating || 4.5,
                cuisine: tableData.cuisine || "Various",
                lastVisited: "Recently",
              })
            }
          } catch (error) {
            console.error(`Error fetching table ${tableId}:`, error)
          }
        }

        setFavoriteTables(tables)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching favorite tables:", error)
        setLoading(false)
      }
    }

    fetchFavoriteTables()
  }, [])

  const handleLogout = () => {
    // Implement logout functionality
    router.push("/sign-in")
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { id: "orders", label: "My Orders", icon: <Package className="h-5 w-5" /> },
    { id: "reservations", label: "Reservations", icon: <Calendar className="h-5 w-5" /> },
    { id: "favorites", label: "Favorites", icon: <Heart className="h-5 w-5" /> },
    { id: "activity", label: "Activity", icon: <History className="h-5 w-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { id: "payment", label: "Payment Methods", icon: <CreditCard className="h-5 w-5" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin className="h-5 w-5" /> },
    { id: "settings", label: "Account Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "bg-amber-500"
      case "on the way":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-amber-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return <Clock3 className="h-4 w-4 text-amber-500" />
      case "on the way":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  // Function to handle viewing a table
  const handleViewTable = (tableId: string) => {
    router.push(`/table-reservation/${tableId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">{userData.name}</h2>
            <p className="text-xs text-muted-foreground">{userData.level}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowMobileNav(!showMobileNav)}>
          {showMobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside
          className={`${isMobile ? (showMobileNav ? "block" : "hidden") : "block"} md:block w-full md:w-64 lg:w-72 bg-white border-r md:min-h-screen md:sticky md:top-0 z-20`}
        >
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{userData.level}</span>
                <span className="text-xs text-muted-foreground">{userData.points} points</span>
              </div>
              <Progress value={userData.nextLevel.progress} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">
                {userData.nextLevel.pointsNeeded - userData.points} points to {userData.nextLevel.name}
              </p>
            </div>
          </div>

          <nav className="p-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${activeTab === item.id ? "bg-primary/10 text-primary" : ""}`}
                onClick={() => {
                  setActiveTab(item.id)
                  if (isMobile) setShowMobileNav(false)
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {item.id === "notifications" && <Badge className="ml-auto bg-primary text-white">2</Badge>}
              </Button>
            ))}

            <Separator className="my-4" />

            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 ${isMobile && showMobileNav ? "hidden" : "block"}`}>
          <div className="max-w-5xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                        <Badge className="ml-2 bg-primary text-white">2</Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {notifications.slice(0, 3).map((notification) => (
                        <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                          <div className="flex gap-3 items-start">
                            <div className={`rounded-full p-2 ${notification.read ? "bg-gray-100" : "bg-primary/10"}`}>
                              {notification.type === "order" && <Package className="h-4 w-4 text-primary" />}
                              {notification.type === "reservation" && <Calendar className="h-4 w-4 text-primary" />}
                              {notification.type === "promotion" && <BadgePercent className="h-4 w-4 text-primary" />}
                              {notification.type === "points" && <Gift className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setActiveTab("notifications")}
                        >
                          View All Notifications
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{activeOrders.length + pastOrders.length}</div>
                          <p className="text-xs text-muted-foreground">
                            {activeOrders.length} active, {pastOrders.length} completed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{upcomingReservations.length}</div>
                          <p className="text-xs text-muted-foreground">
                            Next: {upcomingReservations[0]?.restaurant}, {upcomingReservations[0]?.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Reward Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Gift className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{userData.points}</div>
                          <p className="text-xs text-muted-foreground">
                            {userData.nextLevel.pointsNeeded - userData.points} points to {userData.nextLevel.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Orders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Active Orders</h2>
                    <Button variant="link" size="sm" onClick={() => setActiveTab("orders")}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {activeOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {activeOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardHeader className="bg-primary/5 pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{order.restaurant}</CardTitle>
                                <CardDescription>{order.date}</CardDescription>
                              </div>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="mb-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Order #{order.id}</span>
                                <span className="text-sm font-bold">{order.total}</span>
                              </div>
                              <div className="text-sm text-muted-foreground mb-3">{order.items.join(", ")}</div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Estimated delivery: {order.estimatedDelivery}</span>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="flex justify-between mb-2 relative z-10">
                                {order.trackingSteps.map((step, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        step.completed ? "bg-primary text-white" : "bg-gray-200"
                                      }`}
                                    >
                                      {step.completed ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                      ) : (
                                        <span className="text-xs">{index + 1}</span>
                                      )}
                                    </div>
                                    <span className="text-xs mt-1 text-center max-w-[60px] truncate">{step.name}</span>
                                    {step.completed && step.time && (
                                      <span className="text-xs text-muted-foreground">{step.time}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 -z-0"></div>
                              <div
                                className="absolute top-3 left-3 h-0.5 bg-primary -z-0"
                                style={{
                                  width: `${
                                    ((order.trackingSteps.filter((step) => step.completed).length - 1) /
                                      (order.trackingSteps.length - 1)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 border-t flex justify-between">
                            <Button variant="ghost" size="sm">
                              Contact Restaurant
                            </Button>
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-muted/50">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="rounded-full bg-primary/10 p-3 mb-3">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Active Orders</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don't have any active orders at the moment.
                        </p>
                        <Button>Order Now</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Upcoming Reservations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Upcoming Reservations</h2>
                    <Button variant="link" size="sm" onClick={() => setActiveTab("reservations")}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {upcomingReservations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {upcomingReservations.map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden">
                          <CardHeader className="bg-primary/5 pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{reservation.restaurant}</CardTitle>
                                <CardDescription>
                                  {reservation.date} at {reservation.time}
                                </CardDescription>
                              </div>
                              <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Table</p>
                                <p className="text-sm font-medium">{reservation.table}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Guests</p>
                                <p className="text-sm font-medium">{reservation.guests} people</p>
                              </div>
                            </div>
                            {reservation.specialRequests && (
                              <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Special Requests</p>
                                <p className="text-sm">{reservation.specialRequests}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="bg-gray-50 border-t flex justify-between">
                            <Button variant="ghost" size="sm">
                              Contact Restaurant
                            </Button>
                            <Button variant="outline" size="sm">
                              Modify Reservation
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-muted/50">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="rounded-full bg-primary/10 p-3 mb-3">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Upcoming Reservations</h3>
                        <p className="text-sm text-muted-foreground mb-4">You don't have any upcoming reservations.</p>
                        <Button>Make a Reservation</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Favorite Tables */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Favorite Tables</h2>
                    <Button variant="link" size="sm" onClick={() => setActiveTab("favorites")}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                      // Loading state
                      Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Card key={`skeleton-${index}`} className="overflow-hidden">
                            <div className="relative h-32 bg-gray-200 animate-pulse"></div>
                            <CardContent className="p-3">
                              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            </CardContent>
                          </Card>
                        ))
                    ) : favoriteTables.length > 0 ? (
                      // Display fetched favorite tables
                      favoriteTables
                        .slice(0, 4)
                        .map((table) => (
                          <Card key={table.id} className="overflow-hidden">
                            <div className="relative h-32">
                              <img
                                src={table.imageUrl || "/placeholder.svg?height=80&width=80"}
                                alt={table.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                >
                                  <Heart className="h-4 w-4 fill-primary text-primary" />
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium">{table.name}</h3>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                                  <span className="text-xs font-medium">{table.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{table.location}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  {table.seats} seats • ${table.price?.toFixed(2) || "N/A"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => handleViewTable(table.id)}
                                >
                                  View Table
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    ) : (
                      // No favorites state
                      <Card className="col-span-full bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            <Heart className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Favorite Tables</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            You haven't added any tables to your favorites yet.
                          </p>
                          <Button onClick={() => router.push("/table-reservation")}>Browse Tables</Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <Button variant="link" size="sm" onClick={() => setActiveTab("activity")}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {recentActivity.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-start p-4">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">{activity.icon}</div>
                            <div>
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Orders</h1>

                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
                    <TabsTrigger value="past">Order History ({pastOrders.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    {activeOrders.length > 0 ? (
                      <div className="space-y-4">
                        {activeOrders.map((order) => (
                          <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{order.restaurant}</CardTitle>
                                  <CardDescription>{order.date}</CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium">Order #{order.id}</span>
                                  <span className="text-sm font-bold">{order.total}</span>
                                </div>
                                <div className="text-sm text-muted-foreground mb-3">{order.items.join(", ")}</div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>Estimated delivery: {order.estimatedDelivery}</span>
                                </div>
                              </div>

                              <div className="relative">
                                <div className="flex justify-between mb-2 relative z-10">
                                  {order.trackingSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          step.completed ? "bg-primary text-white" : "bg-gray-200"
                                        }`}
                                      >
                                        {step.completed ? (
                                          <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                          <span className="text-xs">{index + 1}</span>
                                        )}
                                      </div>
                                      <span className="text-xs mt-1 text-center max-w-[60px] truncate">
                                        {step.name}
                                      </span>
                                      {step.completed && step.time && (
                                        <span className="text-xs text-muted-foreground">{step.time}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 -z-0"></div>
                                <div
                                  className="absolute top-3 left-3 h-0.5 bg-primary -z-0"
                                  style={{
                                    width: `${
                                      ((order.trackingSteps.filter((step) => step.completed).length - 1) /
                                        (order.trackingSteps.length - 1)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t flex justify-between">
                              <Button variant="ghost" size="sm">
                                Contact Restaurant
                              </Button>
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Active Orders</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            You don't have any active orders at the moment.
                          </p>
                          <Button>Order Now</Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="past">
                    {pastOrders.length > 0 ? (
                      <div className="space-y-4">
                        {pastOrders.map((order) => (
                          <Card key={order.id}>
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{order.restaurant}</CardTitle>
                                  <CardDescription>{order.date}</CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Order #{order.id}</span>
                                <span className="text-sm font-bold">{order.total}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{order.items.join(", ")}</div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t flex justify-between">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Order Again
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            <History className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Order History</h3>
                          <p className="text-sm text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                          <Button>Order Now</Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === "reservations" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Reservations</h1>

                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming ({upcomingReservations.length})</TabsTrigger>
                    <TabsTrigger value="past">Past Reservations ({pastReservations.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    {upcomingReservations.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingReservations.map((reservation) => (
                          <Card key={reservation.id} className="overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{reservation.restaurant}</CardTitle>
                                  <CardDescription>
                                    {reservation.date} at {reservation.time}
                                  </CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Table</p>
                                  <p className="text-sm font-medium">{reservation.table}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Guests</p>
                                  <p className="text-sm font-medium">{reservation.guests} people</p>
                                </div>
                              </div>
                              {reservation.specialRequests && (
                                <div className="mb-2">
                                  <p className="text-sm text-muted-foreground">Special Requests</p>
                                  <p className="text-sm">{reservation.specialRequests}</p>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t flex justify-between">
                              <Button variant="ghost" size="sm">
                                Contact Restaurant
                              </Button>
                              <Button variant="outline" size="sm">
                                Modify Reservation
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Upcoming Reservations</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            You don't have any upcoming reservations.
                          </p>
                          <Button>Make a Reservation</Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="past">
                    {pastReservations.length > 0 ? (
                      <div className="space-y-4">
                        {pastReservations.map((reservation) => (
                          <Card key={reservation.id}>
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{reservation.restaurant}</CardTitle>
                                  <CardDescription>
                                    {reservation.date} at {reservation.time}
                                  </CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Table</p>
                                  <p className="text-sm font-medium">{reservation.table}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Guests</p>
                                  <p className="text-sm font-medium">{reservation.guests} people</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t flex justify-between">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Book Again
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            <History className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No Past Reservations</h3>
                          <p className="text-sm text-muted-foreground mb-4">You haven't made any reservations yet.</p>
                          <Button>Make a Reservation</Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Favorites</h1>

                {loading ? (
                  // Loading state
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <Card key={`skeleton-${index}`} className="overflow-hidden">
                          <div className="relative h-40 bg-gray-200 animate-pulse"></div>
                          <CardContent className="p-4">
                            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 border-t h-12"></CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : favoriteTables.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteTables.map((table) => (
                      <Card key={table.id} className="overflow-hidden">
                        <div className="relative h-40">
                          <img
                            src={table.imageUrl || "/placeholder.svg?height=80&width=80"}
                            alt={table.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                            >
                              <Heart className="h-4 w-4 fill-primary text-primary" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{table.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                              <span className="text-xs font-medium">{table.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{table.location}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {table.seats} seats • ${table.price?.toFixed(2) || "N/A"}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t flex justify-between">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewTable(table.id)}>
                            Reserve Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No Favorite Tables</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven't added any tables to your favorites yet.
                      </p>
                      <Button onClick={() => router.push("/table-reservation")}>Browse Tables</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Activity History</h1>

                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start p-4">
                          <div className="rounded-full bg-primary/10 p-2 mr-3">{activity.icon}</div>
                          <div>
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Notifications</h1>

                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`flex p-4 ${!notification.read ? "bg-primary/5" : ""}`}>
                          <div
                            className={`rounded-full p-2 mr-3 ${notification.read ? "bg-gray-100" : "bg-primary/10"}`}
                          >
                            {notification.type === "order" && <Package className="h-4 w-4 text-primary" />}
                            {notification.type === "reservation" && <Calendar className="h-4 w-4 text-primary" />}
                            {notification.type === "promotion" && <BadgePercent className="h-4 w-4 text-primary" />}
                            {notification.type === "points" && <Gift className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Payment Methods</h1>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">
                                  {method.type} •••• {method.last4}
                                </p>
                                {method.isDefault && (
                                  <Badge className="ml-2 bg-primary/10 text-primary border-primary/20">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            {!method.isDefault && (
                              <Button variant="ghost" size="sm">
                                Set Default
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="mt-4">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Addresses</h1>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{address.name}</p>
                                {address.isDefault && (
                                  <Badge className="ml-2 bg-primary/10 text-primary border-primary/20">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{address.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zip}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button variant="ghost" size="sm">
                                Set Default
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="mt-4">
                  <MapPin className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Account Settings</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm" className="mb-1">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <input
                            type="text"
                            className="w-full p-2 rounded-md border border-input bg-background"
                            defaultValue="Alex"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <input
                            type="text"
                            className="w-full p-2 rounded-md border border-input bg-background"
                            defaultValue="Johnson"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 rounded-md border border-input bg-background"
                          defaultValue={userData.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full p-2 rounded-md border border-input bg-background"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input type="password" className="w-full p-2 rounded-md border border-input bg-background" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input type="password" className="w-full p-2 rounded-md border border-input bg-background" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input type="password" className="w-full p-2 rounded-md border border-input bg-background" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage your notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">Receive notifications about your orders</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reservation Reminders</p>
                          <p className="text-sm text-muted-foreground">Get reminded about upcoming reservations</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Special Offers</p>
                          <p className="text-sm text-muted-foreground">Receive promotions and special offers</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Newsletter</p>
                          <p className="text-sm text-muted-foreground">Subscribe to our monthly newsletter</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription className="text-red-600/80">
                      Permanently delete your account and all of your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-600/80">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="destructive">Delete Account</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

