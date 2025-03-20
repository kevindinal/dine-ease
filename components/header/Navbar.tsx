"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Menu, X, LogOut, Settings, ChevronRight, Sparkles, Coffee, ChefHat, Pizza } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const navLinks = [
  { title: "Home", href: "/home-main" },
  { title: "Menu", href: "/menu" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState(0)
  const [hoverLink, setHoverLink] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const navRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const navBackground = useTransform(scrollY, [0, 100], ["rgba(250, 64, 50, 0.9)", "rgba(250, 64, 50, 1)"])
  const navBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(8px)"])
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98])
  const navShadow = useTransform(scrollY, [0, 100], ["0 0 0 rgba(0,0,0,0)", "0 10px 30px rgba(0,0,0,0.1)"])

  const [user, setUser] = useState({
    uid: "",
    name: "Guest",
    email: "guest@example.com",
    image: "/placeholder.svg?height=32&width=32",
  })

  useEffect(() => {
    const uid = searchParams.get("uid")
    const name = searchParams.get("name")
    const email = searchParams.get("email")

    if (uid && name && email) {
      setUser({
        uid,
        name,
        email,
        image: "/placeholder.svg?height=32&width=32",
      })
    }
  }, [searchParams])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Generate particles for animation effects
  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
  }

  const particles = generateParticles(10)
  const foodIcons = [
    <Coffee key="coffee" size={16} />,
    <ChefHat key="chef" size={16} />,
    <Pizza key="pizza" size={16} />,
  ]

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 w-full py-4 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBackground,
        boxShadow: navShadow,
        backdropFilter: isScrolled ? navBlur : "none",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/home-main"
            className="transition-all duration-300 hover:opacity-90 relative group"
            onMouseEnter={() => setHoverLink(-1)}
            onMouseLeave={() => setHoverLink(null)}
          >
            <motion.div
              className="relative z-10 flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <motion.span
                  className="absolute -inset-1 rounded-md bg-white/20"
                  initial={{ scale: 0 }}
                  animate={hoverLink === -1 ? { scale: 1, opacity: [0, 0.5, 0] } : { scale: 0 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="w-32 h-12 rounded-md bg-white flex items-center justify-center shadow-md">
                  <div className="relative h-8 w-24">
                    <Image src="/logo.png" alt="DineEase Logo" fill className="object-contain" priority />
                  </div>
                </div>
              </div>

              {/* Particle effects on hover */}
              <AnimatePresence>
                {hoverLink === -1 && (
                  <>
                    {particles.map((particle) => (
                      <motion.span
                        key={`logo-particle-${particle.id}`}
                        className="absolute w-1 h-1 rounded-full bg-white"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          x: (Math.random() - 0.5) * 50,
                          y: (Math.random() - 0.5) * 50,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: particle.duration, delay: particle.delay }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Animated underline */}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-white"
              initial={{ width: 0 }}
              animate={hoverLink === -1 ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          
        
      </div>
    </motion.nav>
  )
}

export default Navbar

