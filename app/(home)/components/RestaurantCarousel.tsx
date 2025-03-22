"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Utensils, Heart, ChefHat } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import type { Restaurant } from "../hooks/models"
import { fetchAllRestaurants, getRandomNumber } from "../services/restaurantService"
import { startBackgroundAnimation } from "../services/animationService"

const RestaurantCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const restaurantData = await fetchAllRestaurants()
        setRestaurants(restaurantData)
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
    startBackgroundAnimation(controls)
  }, [controls])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === restaurants.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? restaurants.length - 1 : prevIndex - 1))
  }

  // Handle mouse move for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto flex justify-center items-center h-64">
          <div className="relative">
            {/* Plate loading animation */}
            <svg className="w-24 h-24 animate-spin" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FFECEB" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FA4032"
                strokeWidth="8"
                strokeDasharray="70 283"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Utensils className="h-8 w-8 text-[#FA4032]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden py-16 px-4 md:px-6"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      animate={controls}
      style={{
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.9) 0%, rgba(252, 251, 255, 1) 90%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: i % 2 === 0 ? "#FA4032" : "#FFECEB",
              width: `${getRandomNumber(100, 200, `size-${i}`)}px`,
              height: `${getRandomNumber(100, 200, `size-${i}`)}px`,
              left: `${getRandomNumber(-10, 110, `left-${i}`)}%`,
              top: `${getRandomNumber(-10, 110, `top-${i}`)}%`,
            }}
            animate={{
              x: [0, getRandomNumber(-20, 20, `move-x-${i}`)],
              y: [0, getRandomNumber(-20, 20, `move-y-${i}`)],
              scale: [1, getRandomNumber(0.9, 1.1, `scale-${i}`)],
            }}
            transition={{
              duration: getRandomNumber(15, 25, `duration-${i}`),
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* No floating food icons */}
      </div>

      {/* Interactive cursor effect */}
      <motion.div
        className="fixed w-12 h-12 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: activeIndex !== null ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      />

      <div className="container mx-auto relative z-10">
        {/* Animated heading */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative plate illustration */}
          <div className="relative inline-block mb-8">
            <motion.div
              className="w-32 h-32 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFECEB" />
                    <stop offset="100%" stopColor="#FA4032" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#plateGradient)" strokeWidth="1" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#plateGradient)"
                  strokeWidth="1"
                  strokeDasharray="1,3"
                />
                <circle cx="50" cy="50" r="32" fill="none" stroke="url(#plateGradient)" strokeWidth="1" />
              </svg>

              {/* Orbiting elements */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                  initial={{
                    rotate: i * 90,
                    translateX: 64,
                  }}
                  animate={{
                    rotate: [i * 90, i * 90 + 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    top: "50%",
                    left: "50%",
                    marginLeft: -12,
                    marginTop: -12,
                    transformOrigin: "center center",
                  }}
                >
                  {i === 0 ? (
                    <Utensils className="h-3 w-3 text-[#FA4032]" />
                  ) : i === 1 ? (
                    <Star className="h-3 w-3 text-[#FA4032]" />
                  ) : i === 2 ? (
                    <Heart className="h-3 w-3 text-[#FA4032]" />
                  ) : (
                    <ChefHat className="h-3 w-3 text-[#FA4032]" />
                  )}
                </motion.div>
              ))}

              {/* Center element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Utensils className="h-8 w-8 text-[#FA4032]" />
              </div>
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
              Top Restaurants of the Week
            </span>
          </h2>

          <div className="relative h-1 w-40 mx-auto mt-4 mb-6 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FA4032] to-[#FF6B60]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg italic">
            "Discover culinary excellence at our most popular dining destinations"
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center px-4 md:px-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div
            className="flex transition-transform duration-500 ease-in-out transform overflow-visible w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="min-w-full px-2 sm:px-4 sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%]"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Link href={`/restaurants/${restaurant.id}`}>
                  <motion.div
                    className="bg-white rounded-3xl overflow-hidden cursor-pointer relative group mx-auto max-w-[95%] sm:max-w-full"
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    style={{ boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    {/* Image container with creative overlay */}
                    <div className="relative h-56 overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-[#FA4032]/5 z-0">
                        <svg width="100%" height="100%" className="opacity-30">
                          <pattern
                            id={`pattern-${index}`}
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="10" cy="10" r="1.5" fill="#FA4032" />
                          </pattern>
                          <rect x="0" y="0" width="100%" height="100%" fill={`url(#pattern-${index})`} />
                        </svg>
                      </div>

                      {/* Main image with parallax effect */}
                      <motion.div
                        animate={{
                          y: activeIndex === index ? -10 : 0,
                          scale: activeIndex === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 h-full"
                      >
                        <img
                          src={restaurant.image || "/placeholder.svg?height=224&width=400"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Creative overlay with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          {/* Animated pattern overlay */}
                          <motion.div
                            className="absolute inset-0 opacity-20 mix-blend-overlay"
                            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='1' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
                              backgroundSize: "20px 20px",
                            }}
                          />
                        </div>
                      </motion.div>

                      {/* Rating badge */}
                      <motion.div
                        className="absolute top-4 right-4 z-20 w-16 h-16"
                        initial={{ rotate: -10 }}
                        animate={{
                          rotate: activeIndex === index ? [-10, 5, -10] : -10,
                          y: activeIndex === index ? [0, -5, 0] : 0,
                        }}
                        transition={{ duration: 2, repeat: activeIndex === index ? Number.POSITIVE_INFINITY : 0 }}
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                          <defs>
                            <linearGradient id={`ratingGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FA4032" />
                              <stop offset="100%" stopColor="#FF6B60" />
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="50" fill={`url(#ratingGradient-${index})`} />
                          <text x="50" y="55" textAnchor="middle" fill="white" fontWeight="bold" fontSize="28">
                            {Number(restaurant.rating).toFixed(1)}
                          </text>
                        </svg>
                      </motion.div>
                    </div>

                    {/* Content section with creative design */}
                    <div className="p-6 relative">
                      {/* Restaurant name with creative styling */}
                      <div className="mb-5">
                        <motion.h3
                          className="text-xl font-bold text-[#6D1A36] group-hover:text-[#FA4032] transition-colors"
                          animate={{
                            y: activeIndex === index ? [0, -2, 0] : 0,
                          }}
                          transition={{ duration: 1, repeat: activeIndex === index ? Number.POSITIVE_INFINITY : 0 }}
                        >
                          {restaurant.name}
                        </motion.h3>

                        {/* Animated underline */}
                        <div className="relative h-0.5 w-full mt-2 overflow-hidden">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#FA4032]/30 via-[#FA4032] to-[#FA4032]/30"
                            initial={{ x: "-100%" }}
                            animate={{ x: activeIndex === index ? "0%" : "-100%" }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-[#FA4032]" />
                          <span className="text-sm">{restaurant.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-[#FA4032]" />
                          <span className="text-sm">{restaurant.openingHours}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Star className="h-4 w-4 mr-2 text-[#FA4032]" />
                          <span className="text-sm">{restaurant.reviews} reviews</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={`star-${i}`}
                              animate={{
                                scale:
                                  activeIndex === index ? [1, i === Math.floor(Math.random() * 5) ? 1.3 : 1, 1] : 1,
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: activeIndex === index ? Number.POSITIVE_INFINITY : 0,
                                repeatType: "reverse",
                                delay: i * 0.1,
                              }}
                            >
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            </motion.div>
                          ))}
                        </div>
                        <motion.div
                          className="flex items-center text-[#FA4032] font-medium"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </motion.div>
                      </div>

                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FA4032] rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FA4032] rounded-tr-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FA4032] rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FA4032] rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Decorative bottom elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/30 to-transparent"></div>
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <svg viewBox="0 0 1200 30" height="30" width="100%">
            <path
              d="M0,15 Q30,5 60,15 T120,15 T180,15 T240,15 T300,15 T360,15 T420,15 T480,15 T540,15 T600,15 T660,15 T720,15 T780,15 T840,15 T900,15 T960,15 T1020,15 T1080,15 T1140,15 T1200,15"
              fill="none"
              stroke="#FA4032"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default RestaurantCarousel

