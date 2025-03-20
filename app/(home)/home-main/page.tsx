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

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block mb-4 px-4 py-1 rounded-full bg-[#FFECEB] text-[#FA4032] font-medium text-sm"
              >
                #1 Food Delivery & Restaurant Platform
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="block">Discover</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA4032] to-[#FF6B60]">
                  Culinary Magic
                </span>
                <span className="block">At Your Fingertips</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Experience the future of dining with our AI-powered restaurant platform. Book tables, pre-order meals,
                and explore menus in AR.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-[#FA4032] hover:bg-[#E63326] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Make a Reservation
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#FA4032] text-[#FA4032] hover:bg-[#FFECEB] rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300"
                >
                  Explore Menu
                </Button>
              </motion.div>

              <motion.div
                className="mt-12 flex items-center justify-center lg:justify-start gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FA4032]">500+</div>
                  <div className="text-sm text-gray-500">Restaurants</div>
                </div>

                <div className="h-12 w-px bg-gray-200"></div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FA4032]">50k+</div>
                  <div className="text-sm text-gray-500">Happy Customers</div>
                </div>

                <div className="h-12 w-px bg-gray-200"></div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FA4032]">100+</div>
                  <div className="text-sm text-gray-500">Cities</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6 text-[#FA4032]" />
          </motion.div>
        </div>
      </motion.section>

      {/* Restaurant Carousel Section */}
      <section className="py-16 px-4 bg-white relative">
        <div className="absolute inset-0 bg-[#FFECEB]/20 skew-y-3 transform origin-top-right"></div>
        <div className="container mx-auto relative z-10">
          <RestaurantCarousel />
        </div>
      </section>

      {/* Highly Rated Restaurants Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-[#FFECEB]/30 -skew-y-3 transform origin-top-left"></div>
        <div className="relative z-10">
          <HighlyRatedRestaurants />
        </div>
      </section>

      {/* Weekly offers */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#FFECEB]/20"></div>
        <div className="relative z-10">
          <WeeklyOffers />
        </div>
      </section>

      {/* Testimonial Section */}
      <Testimonials />

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

