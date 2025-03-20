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

  
}

export default Testimonials

