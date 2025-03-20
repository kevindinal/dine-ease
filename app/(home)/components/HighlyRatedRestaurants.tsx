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

}

export default HighlyRatedRestaurants

