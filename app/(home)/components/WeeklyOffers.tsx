"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Clock, Utensils, Star, Heart, ChefHat } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import type { WeeklyOffer } from "../hooks/models"
import { fetchWeeklyOffers, calculateDiscount, getRandomNumber } from "../services/offerService"
import { startBackgroundAnimation } from "../services/animationService"

const WeeklyOffers = () => {
  const [offers, setOffers] = useState<WeeklyOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const offersData = await fetchWeeklyOffers()
        setOffers(offersData)
      } catch (error) {
        console.error("Error fetching weekly offers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
    startBackgroundAnimation(controls)
  }, [controls])

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
      <div className="py-24 px-4">
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
              <ChefHat className="h-8 w-8 text-[#FA4032]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="py-24 px-4 relative overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      animate={controls}
      style={{
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(255, 236, 235, 0.3) 0%, rgba(252, 251, 255, 0.4) 90%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: i % 2 === 0 ? "#FA4032" : "#FFECEB",
              width: `${getRandomNumber(100, 300, `size-${i}`)}px`,
              height: `${getRandomNumber(100, 300, `size-${i}`)}px`,
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
        {[...Array(12)].map((_, i) => {
          const icons = [<Utensils key={i} size={24} />, <Star key={i} size={24} />, <Heart key={i} size={24} />]
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Animated heading */}
        <motion.div
          className="text-center mb-20 relative"
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
                <circle
                  cx="50"
                  cy="50"
                  r="24"
                  fill="none"
                  stroke="url(#plateGradient)"
                  strokeWidth="1"
                  strokeDasharray="1,2"
                />
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
                <ChefHat className="h-8 w-8 text-[#FA4032]" />
              </div>
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
              Culinary Delights
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
            "Extraordinary flavors at exceptional prices"
          </p>
        </motion.div>

        
      </div>
    </motion.div>
  )
}

export default WeeklyOffers

