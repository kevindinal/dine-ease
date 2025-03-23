"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CalendarIcon, Users, Search, MapPin, ChevronRight, Star, TrendingUp, Filter, ChevronDown } from "lucide-react"
import RestaurantCard from "./RestaurantCard"
import { useAllRestaurants } from "../hooks/useRestaurants"
import type { Restaurant } from "../types/restaurant"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from "@/app/(restaurants)/components/timePicker"

export default function AllRestaurants() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-02-02"))
  const [time, setTime] = useState("19:00")
  const [people, setPeople] = useState(2)
  const [search, setSearch] = useState("")
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchType, setSearchType] = useState<"all" | "restaurant" | "food">("all")

  const router = useRouter()
  const { restaurants, loading, error } = useAllRestaurants()

  // Filter restaurants based on search input
  useEffect(() => {
    if (restaurants) {
      let filtered = restaurants

      if (search) {
        const searchLower = search.toLowerCase()

        if (searchType === "all" || searchType === "restaurant") {
          // Filter by restaurant properties
          filtered = filtered.filter(
            (restaurant) =>
              restaurant.name.toLowerCase().includes(searchLower) ||
              restaurant.category.toLowerCase().includes(searchLower) ||
              restaurant.cuisine.some((item) => item.toLowerCase().includes(searchLower)) ||
              restaurant.location.toLowerCase().includes(searchLower),
          )
        }

        if (searchType === "all" || searchType === "food") {
          // If we're only searching for food or if no restaurants matched the above criteria
          if (searchType === "food" || (searchType === "all" && filtered.length === 0)) {
            // Filter by featured menu items
            filtered = restaurants.filter((restaurant) => {
              // Check if restaurant has featuredMenu property and it's an array
              if (restaurant.featuredMenu && Array.isArray(restaurant.featuredMenu)) {
                // Check if any menu item matches the search
                return restaurant.featuredMenu.some((menuItem) => {
                  // Handle both string menu items and object menu items with a name property
                  if (typeof menuItem === "string") {
                    return menuItem.toLowerCase().includes(searchLower)
                  } else if (typeof menuItem === "object" && menuItem !== null && "name" in menuItem) {
                    return menuItem.name.toLowerCase().includes(searchLower)
                  }
                  return false
                })
              }
              return false
            })
          }
        }
      }

      // Apply category filter if not "All"
      if (activeCategory !== "All") {
        filtered = filtered.filter(
          (restaurant) => restaurant.category === activeCategory || restaurant.cuisine.includes(activeCategory),
        )
      }

      setFilteredRestaurants(filtered)
    }
  }, [search, restaurants, activeCategory, searchType])

  // Extract unique categories from restaurants
  const categories = restaurants ? ["All", ...new Set(restaurants.flatMap((r) => [r.category, ...r.cuisine]))] : ["All"]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // You can add additional search logic here if needed
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[450px] sm:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Discover & Reserve
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white"
          >
            Find the perfect table at the best restaurants in Sri Lanka
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Picker */}
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12 border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-red-500" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Picker */}
                <div className="w-full">
                  <TimePicker value={time} onChange={setTime} />
                </div>

                {/* People Selector */}
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-red-500" />
                  </div>
                  <select
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="pl-10 w-full h-12 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 transition-all duration-300 mb-4 sm:mb-0"
                >
                  <span>Find Tables</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 md:gap-4 justify-start md:justify-center">
            {categories.slice(0, 10).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-red-500 text-white font-medium shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Listing */}
      <div className="container mx-auto px-4 py-8">
        {/* Dedicated Search Bar */}
        <div className="mb-2">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-red-500" />
            </div>
            <input
              type="text"
              placeholder="Search restaurants, cuisine, or food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className="h-5 w-5 rotate-45" />
              </button>
            )}
          </div>

          {/* Search Type Selector */}
          <div className="flex justify-center mt-2 space-x-2">
            <button
              onClick={() => setSearchType("all")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                searchType === "all" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchType("restaurant")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                searchType === "restaurant" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setSearchType("food")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                searchType === "food" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Food Items
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            {activeCategory === "All" ? "Popular Restaurants" : `${activeCategory} Restaurants`}
          </motion.h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-700 w-full sm:w-auto">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>

            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none w-full px-5 py-2.5 pr-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-gray-700 border-0 cursor-pointer"
                defaultValue="recommended"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-xl text-gray-600">Discovering restaurants...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 bg-red-50 rounded-xl border border-red-200">
            <div className="text-xl text-red-500 text-center px-4">
              <p className="font-semibold">Unable to load restaurants</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-xl border border-gray-200">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-xl text-gray-600 text-center px-4">No restaurants found matching your search.</div>
            <button
              onClick={() => {
                setSearch("")
                setActiveCategory("All")
                setSearchType("all")
              }}
              className="mt-4 px-6 py-2.5 bg-red-500 rounded-lg hover:bg-red-600 transition-all text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Trending Section */}
      {!loading && !error && filteredRestaurants.length > 0 && (
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.slice(0, 3).map((restaurant, index) => (
              <motion.div
                key={`trending-${restaurant.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl h-48 sm:h-64 cursor-pointer shadow-lg"
                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${restaurant.image || "/placeholder-restaurant.jpg"})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full">Trending</span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm">{restaurant.rating || "4.5"}</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{restaurant.name}</h3>

                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

