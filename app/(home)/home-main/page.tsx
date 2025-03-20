"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/header/Navbar"
import HighlyRatedRestaurants from "../components/HighlyRatedRestaurants"
import RestaurantCarousel from "../components/RestaurantCarousel"
import Testimonials from "../components/Testimonials"
import Footer from "@/components/footer/Footer"
import { ArrowRight, ChevronDown, Star, Clock, MapPin } from "lucide-react"
import WeeklyOffers from "../components/WeeklyOffers"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion"

export default function HomePage() {
  const searchParams = useSearchParams()
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollInView = useInView(scrollRef)
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  useEffect(() => {
    const uid = searchParams.get("uid")
    const name = searchParams.get("name")
    const email = searchParams.get("email")

    if (uid && name && email) {
      console.log("User logged in:", { uid, name, email })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [searchParams])

  useEffect(() => {
    if (scrollInView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      })
    }
  }, [scrollInView, controls])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero Section - Added pt-24 for mobile to prevent navbar overlap */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-24 md:pt-16"
        style={{ opacity, scale, y }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFECEB]/80 to-white"></div>

          {/* Animated Background Patterns */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`circle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background:
                    i % 2 === 0
                      ? `radial-gradient(circle, rgba(250,64,50,0.05) 0%, rgba(255,255,255,0) 70%)`
                      : `radial-gradient(circle, rgba(255,236,235,0.1) 0%, rgba(255,255,255,0) 70%)`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                  scale: [1, Math.random() * 0.2 + 0.9, 1],
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          {/* Food Icons Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => {
              const icons = ["🍕", "🍔", "🍣", "🍜", "🍲", "🥗", "🍱", "🍛", "🍝", "🌮"]
              const icon = icons[Math.floor(Math.random() * icons.length)]
              return (
                <motion.div
                  key={`food-${i}`}
                  className="absolute text-4xl opacity-10"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-50px`,
                  }}
                  animate={{
                    y: [0, window.innerHeight + 100],
                    rotate: [0, Math.random() * 360],
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 30,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 20,
                  }}
                >
                  {icon}
                </motion.div>
              )
            })}
          </div>

          {/* Main Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
              alt="Restaurant ambiance"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFECEB]/80 via-white/70 to-white"></div>
          </div>
        </div>

        

      
    </div>
  )
}

