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
      </div>

      {/* Interactive cursor effect */}
      <motion.div
        className="fixed w-16 h-16 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
          scale: activeIndex !== null ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative quote illustration */}
          <div className="relative inline-block mb-8">
            <motion.div
              className="w-32 h-32 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="quoteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFECEB" />
                    <stop offset="100%" stopColor="#FA4032" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#quoteGradient)" strokeWidth="1" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#quoteGradient)"
                  strokeWidth="1"
                  strokeDasharray="1,3"
                />
                <circle cx="50" cy="50" r="32" fill="none" stroke="url(#quoteGradient)" strokeWidth="1" />
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
                    <Quote className="h-3 w-3 text-[#FA4032]" />
                  ) : i === 1 ? (
                    <Star className="h-3 w-3 text-[#FA4032]" />
                  ) : i === 2 ? (
                    <Heart className="h-3 w-3 text-[#FA4032]" />
                  ) : (
                    <MessageCircle className="h-3 w-3 text-[#FA4032]" />
                  )}
                </motion.div>
              ))}

              {/* Center element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Quote className="h-8 w-8 text-[#FA4032]" />
              </div>
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
              What our Customers Say
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
            "Authentic experiences from our valued diners"
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            <motion.button
              onClick={prevTestimonial}
              className="absolute left-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "#FFECEB" }}
              whileTap={{ scale: 0.95 }}
              disabled={testimonials.length <= 1}
            >
              <ChevronLeft className="h-6 w-6 text-[#FA4032]" />
            </motion.button>

            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => {
                  const isActive = currentIndex === index
                  return (
                    <div
                      key={testimonial.uid}
                      className="min-w-full px-4"
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <motion.div
                        className="relative bg-white rounded-3xl p-8 shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -5 }}
                      >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <svg width="100%" height="100%">
                            <pattern
                              id={`testimonial-pattern-${index}`}
                              x="0"
                              y="0"
                              width="20"
                              height="20"
                              patternUnits="userSpaceOnUse"
                            >
                              <circle cx="10" cy="10" r="1" fill="#FA4032" />
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill={`url(#testimonial-pattern-${index})`} />
                          </svg>
                        </div>

                        {/* Large quote marks */}
                        <div className="absolute top-6 right-6 opacity-10">
                          <Quote className="h-24 w-24 text-[#FA4032]" />
                        </div>

                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                            <motion.div
                              className="mb-6 md:mb-0 md:mr-8"
                              animate={{
                                scale: isActive ? [1, 1.05, 1] : 1,
                              }}
                              transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                            >
                              <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFECEB] to-[#FA4032] p-1">
                                  <Avatar className="w-full h-full border-4 border-white">
                                    <AvatarFallback className="text-2xl bg-white text-[#FA4032]">
                                      {getInitials(testimonial.firstName)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>

                                {/* Animated ring */}
                                <motion.div
                                  className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FA4032]/30"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 20,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                  style={{ opacity: isActive ? 1 : 0 }}
                                />
                              </div>
                            </motion.div>

                            <div className="flex-1">
                              <div className="mb-4">
                                <motion.div
                                  className="inline-flex items-center space-x-1"
                                  animate={{
                                    y: isActive ? [0, -2, 0] : 0,
                                  }}
                                  transition={{ duration: 1, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                                >
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div
                                      key={`star-${i}`}
                                      animate={{
                                        scale: isActive ? [1, i === Math.floor(Math.random() * 5) ? 1.3 : 1, 1] : 1,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                                        repeatType: "reverse",
                                        delay: i * 0.1,
                                      }}
                                    >
                                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </div>

                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                              >
                                <motion.p
                                  className="text-lg md:text-xl text-gray-700 mb-6 italic relative"
                                  animate={{
                                    opacity: isActive ? [0.9, 1, 0.9] : 1,
                                  }}
                                  transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                                >
                                  <span className="text-[#FA4032] text-3xl font-serif absolute -left-2 -top-2">"</span>
                                  {testimonial.user_review}
                                  <span className="text-[#FA4032] text-3xl font-serif absolute -right-2">"</span>
                                </motion.p>

                                <div className="flex flex-col items-center md:items-start">
                                  <h4 className="font-bold text-xl text-[#6D1A36]">
                                    {testimonial.firstName} {testimonial.lastName || ""}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {testimonial.email ? testimonial.email.split("@")[0] : "Customer"}
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FA4032] to-transparent opacity-20"></div>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FA4032] rounded-tl-md opacity-30"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FA4032] rounded-tr-md opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FA4032] rounded-bl-md opacity-30"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FA4032] rounded-br-md opacity-30"></div>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="absolute right-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "#FFECEB" }}
              whileTap={{ scale: 0.95 }}
              disabled={testimonials.length <= 1}
            >
              <ChevronRight className="h-6 w-6 text-[#FA4032]" />
            </motion.button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={`dot-${index}`}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-[#FA4032]" : "bg-[#FFECEB]"
                } focus:outline-none`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: currentIndex === index ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: currentIndex === index ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
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

export default Testimonials

