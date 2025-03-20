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

  
}

export default RestaurantCarousel

