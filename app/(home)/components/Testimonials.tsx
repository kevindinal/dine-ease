"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Quote, Star, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, useAnimation } from "framer-motion"
import type { User } from "../hooks/models"
import { fetchUserReviews, getInitials, getRandomNumber } from "../services/userService"
import { startBackgroundAnimation } from "../services/animationService"

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<User[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const usersWithReviews = await fetchUserReviews()
        setTestimonials(usersWithReviews)
      } catch (error) {
        console.error("Error fetching user reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
    startBackgroundAnimation(controls)
  }, [controls])

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
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
      <div className="bg-gradient-to-b from-white to-[#FFECEB]/30 py-16">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[50vh]">
          <motion.div
            className="w-32 h-32 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="quoteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                stroke="url(#quoteGradient)"
                strokeWidth="8"
                strokeDasharray="70 283"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Quote className="h-12 w-12 text-[#FA4032]" />
            </div>
          </motion.div>
          <motion.p
            className="ml-6 text-lg font-medium text-[#FA4032]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Loading customer stories...
          </motion.p>
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white to-[#FFECEB]/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center py-16 bg-white rounded-2xl shadow-xl max-w-lg mx-auto relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Empty state with animated elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-5">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={`dot-${i}`}
                    className="absolute w-4 h-4 rounded-full bg-[#FA4032]"
                    style={{
                      top: `${getRandomNumber(0, 100, `dot-top-${i}`)}%`,
                      left: `${getRandomNumber(0, 100, `dot-left-${i}`)}%`,
                      opacity: getRandomNumber(10, 40, `dot-op-${i}`) / 100,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 p-8">
              <motion.div
                className="w-24 h-24 mx-auto relative mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#FFECEB" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FA4032"
                    strokeWidth="8"
                    strokeDasharray="70 283"
                    strokeLinecap="round"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    style={{ transformOrigin: "center" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-[#FA4032]" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
                No Reviews Yet
              </h3>

              <p className="text-gray-500 mb-6">Be the first to share your dining experience with us!</p>

              <div className="w-32 h-1 bg-gradient-to-r from-[#FFECEB] via-[#FA4032] to-[#FFECEB] mx-auto"></div>

              <motion.p
                className="text-sm text-gray-400 mt-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Your feedback helps us improve
              </motion.p>
            </div>
          </motion.div>
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
          "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 236, 235, 0.5) 90%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Background elements */}
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

        {/* Floating quote icons */}
        {[...Array(12)].map((_, i) => {
          const icons = [<Quote key={i} size={24} />, <Star key={i} size={24} />, <Heart key={i} size={24} />]
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

      

      
    </motion.div>
  )
}

export default Testimonials

