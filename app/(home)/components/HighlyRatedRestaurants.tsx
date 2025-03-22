"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Star, MapPin, Clock, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Restaurant } from "../hooks/models"
import { fetchHighlyRatedRestaurants } from "../services/restaurantService"
import { startBackgroundAnimation } from "../services/animationService"

const HighlyRatedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const highlyRatedRestaurants = await fetchHighlyRatedRestaurants()
        setRestaurants(highlyRatedRestaurants)
      } catch (error) {
        console.error("Error fetching highly rated restaurants:", error)
        setError("Failed to load restaurants. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
    startBackgroundAnimation(controls)
  }, [controls])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setHoverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleShowMore = () => setVisibleCount((prev) => Math.min(prev + 3, restaurants.length))

  if (loading) {
    return (
      <div className="bg-[#FFECEB] py-16">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh]">
          <motion.div
            className="w-32 h-32 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FA4032" />
                  <stop offset="100%" stopColor="#FF6B60" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FFECEB" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#loaderGradient)"
                strokeWidth="8"
                strokeDasharray="70 283"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="h-12 w-12 text-[#FA4032] fill-current" />
            </div>
          </motion.div>
          <motion.p
            className="mt-8 text-lg font-medium text-[#FA4032]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Discovering culinary excellence...
          </motion.p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#FFECEB] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="w-20 h-20 mx-auto mb-6 text-[#FA4032]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#FA4032] hover:bg-[#E63326] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="relative py-24 overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      animate={controls}
      style={{
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(255, 236, 235, 0.8) 0%, rgba(252, 251, 255, 0.9) 90%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: i % 2 === 0 ? "#FA4032" : "#FFECEB",
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              x: [0, i % 2 === 0 ? 50 : -50],
              y: [0, i % 3 === 0 ? 30 : -30],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10 + i * 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        ))}

        {/* Removed floating star icons */}
      </div>

      {/* Cursor effect */}
      <motion.div
        className="fixed w-16 h-16 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: hoverPosition.x - 32,
          y: hoverPosition.y - 32,
          scale: activeIndex !== null ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative inline-block mb-8">
            <motion.div
              className="w-32 h-32 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFECEB" />
                    <stop offset="100%" stopColor="#FA4032" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#starGradient)" strokeWidth="1" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#starGradient)"
                  strokeWidth="1"
                  strokeDasharray="1,3"
                />

                <g transform="translate(50, 50)">
                  {[...Array(5)].map((_, i) => (
                    <motion.path
                      key={`star-path-${i}`}
                      d="M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z"
                      fill="none"
                      stroke="url(#starGradient)"
                      strokeWidth="1"
                      transform={`rotate(${i * 72})`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </g>

                <motion.path
                  d="M50,30 L55,45 L70,45 L60,55 L65,70 L50,60 L35,70 L40,55 L30,45 L45,45 Z"
                  fill="#FA4032"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  style={{ transformOrigin: "center" }}
                />
              </svg>
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
              Highly Rated Restaurants
            </span>
          </h2>

          <div className="relative h-1 w-40 mx-auto mt-4 mb-6 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FA4032] to-[#FF6B60]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Discover extraordinary dining experiences with ratings above 4.5 stars
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <AnimatePresence>
              {restaurants.slice(0, visibleCount).map((restaurant, index) => {
                const isActive = activeIndex === index
                return (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="relative"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <Link href={`/restaurants-profile/${restaurant.id}`}>
                      <motion.div
                        className="bg-white rounded-3xl overflow-hidden cursor-pointer relative group"
                        whileHover={{ y: -10, transition: { duration: 0.3, type: "spring" } }}
                        style={{ boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        {/* Image container with rating badge */}
                        <div className="relative">
                          <div className="h-56 overflow-hidden">
                            <img
                              src={restaurant.image || "/placeholder.svg?height=224&width=400"}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Rating badge */}
                          <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-[#FA4032] flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">{Number(restaurant.rating).toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Content section */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[#6D1A36] mb-4">{restaurant.name}</h3>

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
                              <span className="text-sm">reviews</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={`star-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <div className="flex items-center text-[#FA4032] font-medium">
                              <span>View Details</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Show more button */}
          {visibleCount < restaurants.length && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleShowMore}
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-[#FA4032] border-2 border-[#FA4032] rounded-full hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FA4032] to-[#FF6B60] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Discover More
                  <Sparkles className="ml-2 h-4 w-4" />
                </span>
              </motion.button>
            </motion.div>
          )}
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

export default HighlyRatedRestaurants

