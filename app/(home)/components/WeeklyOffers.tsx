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

        {offers.length === 0 ? (
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
                  <ChefHat className="h-10 w-10 text-[#FA4032]" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
                Cooking Up New Offers
              </h3>

              <p className="text-gray-500 mb-6">Our chefs are preparing something special just for you!</p>

              <div className="w-32 h-1 bg-gradient-to-r from-[#FFECEB] via-[#FA4032] to-[#FFECEB] mx-auto"></div>

              <motion.p
                className="text-sm text-gray-500 mt-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Check back soon for delicious savings
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Offers display with creative card design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
              {offers.map((offer, index) => {
                const discount = calculateDiscount(offer.old_price, offer.this_week_price)
                const isActive = activeIndex === index

                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    className="relative"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {/* Animated plate background */}
                    <motion.div
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none z-0"
                      animate={{
                        rotate: isActive ? [0, 5, -5, 0] : 0,
                        scale: isActive ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <svg viewBox="0 0 200 200" className="w-full">
                        <circle cx="100" cy="100" r="90" fill="#FFECEB" opacity="0.3" />
                      </svg>
                    </motion.div>

                    {/* Floating discount badge */}
                    <motion.div
                      className="absolute -top-8 -right-8 z-20 w-20 h-20"
                      initial={{ rotate: -10 }}
                      animate={{
                        rotate: isActive ? [-10, 5, -10] : -10,
                        y: isActive ? [0, -5, 0] : 0,
                      }}
                      transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                        <defs>
                          <linearGradient id={`discountGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FA4032" />
                            <stop offset="100%" stopColor="#FF6B60" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill={`url(#discountGradient-${index})`} />
                        <text x="50" y="45" textAnchor="middle" fill="white" fontWeight="bold" fontSize="24">
                          {discount}%
                        </text>
                        <text x="50" y="65" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">
                          OFF
                        </text>
                      </svg>
                    </motion.div>

                    <Link href={`/offers/${offer.id}`}>
                      <motion.div
                        className="bg-white rounded-3xl overflow-hidden cursor-pointer relative group"
                        whileHover={{
                          y: -10,
                          transition: { duration: 0.3, type: "spring" },
                        }}
                        style={{
                          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Card content with creative design */}
                        <div className="relative">
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
                                y: isActive ? -10 : 0,
                                scale: isActive ? 1.05 : 1,
                              }}
                              transition={{ duration: 0.5 }}
                              className="relative z-10 h-full"
                            >
                              <img
                                src={offer.offer_image || "/placeholder.svg?height=224&width=400"}
                                alt={offer.offer_name}
                                className="w-full h-full object-cover"
                              />

                              {/* Creative overlay with gradient and pattern */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
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

                            {/* Restaurant badge */}
                            <div className="absolute bottom-4 left-4 z-20">
                              <motion.div
                                className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
                                  <ChefHat className="h-3 w-3 text-[#FA4032]" />
                                </div>
                                <p className="font-medium text-white text-sm">{offer.restaurant}</p>
                              </motion.div>
                            </div>
                          </div>

                          {/* Content section with creative design */}
                          <div className="p-6 relative">
                            {/* Limited time indicator */}
                            <div className="absolute -top-5 right-6 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 flex items-center">
                              <Clock className="h-3 w-3 text-[#FA4032] mr-1" />
                              <motion.span
                                className="text-xs font-medium"
                                animate={{ opacity: isActive ? [1, 0.7, 1] : 1 }}
                                transition={{ duration: 1.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                              >
                                Limited Time
                              </motion.span>
                            </div>

                            {/* Offer name with creative styling */}
                            <div className="mb-5">
                              <motion.h3
                                className="text-xl font-bold text-gray-800 group-hover:text-[#FA4032] transition-colors"
                                animate={{
                                  y: isActive ? [0, -2, 0] : 0,
                                }}
                                transition={{ duration: 1, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                              >
                                {offer.offer_name}
                              </motion.h3>

                              {/* Animated underline */}
                              <div className="relative h-0.5 w-full mt-2 overflow-hidden">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-[#FA4032]/30 via-[#FA4032] to-[#FA4032]/30"
                                  initial={{ x: "-100%" }}
                                  animate={{ x: isActive ? "0%" : "-100%" }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                            </div>

                            {/* Price display with creative animation */}
                            <div className="flex items-end justify-between mb-4">
                              <motion.div
                                animate={{
                                  scale: isActive ? [1, 1.05, 1] : 1,
                                }}
                                transition={{ duration: 1, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                              >
                                <div className="flex items-center mb-1">
                                  <span className="text-sm text-gray-500 line-through mr-2">
                                    Rs. {offer.old_price.toLocaleString()}
                                  </span>
                                  <span className="text-xs bg-[#FFECEB] text-[#FA4032] px-2 py-0.5 rounded-full">
                                    Save Rs. {(offer.old_price - offer.this_week_price).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
                                  Rs. {offer.this_week_price.toLocaleString()}
                                </div>
                              </motion.div>
                            </div>

                            {/* Interactive plate icon */}
                            <motion.div
                              className="absolute bottom-6 right-6 w-10 h-10"
                              animate={{
                                rotate: isActive ? [0, 360] : 0,
                              }}
                              transition={{
                                duration: 5,
                                repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                                ease: "linear",
                              }}
                            >
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="45" fill="#FFECEB" />
                                <g transform="translate(50 50)">
                                  <motion.g
                                    animate={{ rotate: isActive ? [0, 360] : 0 }}
                                    transition={{
                                      duration: 10,
                                      repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                                      ease: "linear",
                                    }}
                                  >
                                    {[...Array(8)].map((_, i) => (
                                      <rect
                                        key={`rect-${i}`}
                                        width="4"
                                        height="12"
                                        rx="2"
                                        fill="#FA4032"
                                        transform={`rotate(${i * 45}) translate(0 -30)`}
                                        opacity={0.7}
                                      />
                                    ))}
                                  </motion.g>
                                </g>
                                <circle cx="50" cy="50" r="20" fill="#FA4032" />
                                <circle cx="50" cy="50" r="15" fill="#FFECEB" />
                                <path
                                  d="M45,50 L55,50 M50,45 L50,55"
                                  stroke="#FA4032"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-[#FA4032]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          animate={{
                            opacity: isActive ? [0, 0.1, 0] : 0,
                          }}
                          transition={{ duration: 1.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                        />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FA4032] rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FA4032] rounded-tr-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FA4032] rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FA4032] rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
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

export default WeeklyOffers

