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
      className="relative w-full overflow-hidden py-16 px-4"
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

        {/* Food-themed icons */}
        {[...Array(8)].map((_, i) => {
          const icons = [<Utensils key={i} size={20} />, <Star key={i} size={20} />, <Heart key={i} size={20} />]
          const IconComponent = icons[i % 3]

          return (
            <motion.div
              key={`icon-${i}`}
              className="absolute text-[#FA4032]/10"
              initial={{
                x: getRandomNumber(10, 90, `icon-x-${i}`),
                y: -20,
                rotate: getRandomNumber(-20, 20, `icon-r-${i}`),
                scale: getRandomNumber(0.8, 1.5, `icon-s-${i}`),
              }}
              animate={{
                y: ["0%", "100%"],
                rotate: [getRandomNumber(-20, 20, `icon-r1-${i}`), getRandomNumber(-20, 20, `icon-r2-${i}`)],
              }}
              transition={{
                duration: getRandomNumber(15, 25, `icon-d-${i}`),
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 0.5,
              }}
              style={{ left: `${getRandomNumber(0, 100, `icon-pos-${i}`)}%` }}
            >
              {IconComponent}
            </motion.div>
          )
        })}
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

      

      
    </motion.div>
  )
}

export default RestaurantCarousel

