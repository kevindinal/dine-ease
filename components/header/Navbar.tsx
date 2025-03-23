"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Menu, X, LogOut, Settings, ChevronRight, Sparkles, Coffee, ChefHat, Pizza } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useAuthState } from "react-firebase-hooks/auth"
import { getUserData } from "@/lib/auth"
import { UserProp } from "@/types"

const navLinks = [
  { title: "Home", href: "/home-main" },
  { title: "Restaurants", href: "/restaurants" },
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

  // const [user, setUser] = useState({
  //   uid: "",
  //   name: "Guest",
  //   email: "guest@example.com",
  //   image: "/placeholder.svg?height=32&width=32",
  // })

    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState<UserProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserData(await getUserData());
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchData();

    const uid = userData?.uid;
    const name = userData?.firstName;
    const email = userData?.email;

  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("user");
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

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Cleanup function
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white relative group py-2"
                onMouseEnter={() => setHoverLink(index)}
                onMouseLeave={() => setHoverLink(null)}
              >
                <motion.div
                  className="relative z-10 flex items-center"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span>{link.title}</span>

                  {/* Animated icon on hover */}
                  <AnimatePresence>
                    {hoverLink === index && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-1"
                      >
                        {React.cloneElement(foodIcons[index % foodIcons.length])}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Animated underline with gradient */}
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-white/50 via-white to-white/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={hoverLink === index ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Particle effects on hover */}
                <AnimatePresence>
                  {hoverLink === index && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={`nav-particle-${index}-${i}`}
                          className="absolute w-1 h-1 rounded-full bg-white"
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            x: (Math.random() - 0.5) * 30,
                            y: (Math.random() - 0.5) * 30,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </Link>
            ))}

            {/* For Businesses Button */}
            <Link href="/business">
              <Button
                variant="ghost"
                className="relative rounded-full bg-white/10 hover:bg-white/20 p-1 transition-all duration-300 hover:scale-105 group"
              >
                <motion.div
                  className="flex items-center gap-2 px-2"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white transition-transform duration-300 group-hover:border-primary">
                      <ChefHat className="h-4 w-4 text-white" />
                    </div>

                    {/* Animated ring */}
                    <motion.div
                      className="absolute -inset-1 rounded-full border border-white/30"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.2, opacity: 1, rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-white font-medium hidden sm:inline">For Businesses</span>

                  {/* Animated sparkle */}
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="absolute -top-1 -right-1 text-yellow-300"
                  >
                    <Sparkles size={12} />
                  </motion.div>
                </motion.div>
              </Button>
            </Link>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full bg-white/10 hover:bg-white/20 p-1 transition-all duration-300 hover:scale-105 group"
                >
                  <motion.div
                    className="flex items-center gap-2 px-2"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-white transition-transform duration-300 group-hover:border-primary">
                        {/* <AvatarImage src={userData.image} alt={userData?.firstName} /> */}
                        <AvatarFallback className="bg-primary text-white">{userData?.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>

                      {/* Animated ring */}
                      <motion.div
                        className="absolute -inset-1 rounded-full border border-white/30"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.2, opacity: 1, rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="text-white font-medium hidden sm:inline">{userData?.firstName}</span>

                    {/* Animated sparkle */}
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 0.8, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                      className="absolute -top-1 -right-1 text-yellow-300"
                    >
                      <Sparkles size={12} />
                    </motion.div>
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData?.firstName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-[#FA4032]/10 group">
                  <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer transition-colors duration-200 hover:bg-[#FA4032]/10 group"
                  onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 transition-colors duration-200 rounded-full relative"
              onClick={toggleMobileMenu}>
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}/>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 bg-gradient-to-b from-[#FA4032]/90 to-[#FA4032] rounded-lg p-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" className="opacity-10">
                  <pattern id="mobile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#mobile-pattern)" />
                </svg>

                {/* Floating food icons */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`mobile-icon-${i}`}
                    className="absolute text-white/10"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      rotate: Math.random() * 360,
                      scale: 0.5 + Math.random() * 0.5,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 360],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 5 + Math.random() * 5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}>
                    {React.cloneElement(foodIcons[i % foodIcons.length], { size: 20 + (i % 10) })}
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.title}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}>
                    <Link
                      href={link.href}
                      className="block py-2 text-white hover:text-white hover:bg-[#FA4032]/50 px-3 rounded transition-colors duration-200 relative group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{link.title}</span>
                        <motion.div
                          initial={{ x: -5, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-white/70">
                          <ChevronRight size={16} />
                        </motion.div>
                      </div>

                      {/* Animated line */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-[1px] bg-white/20"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      />
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  className="flex items-center gap-2 mt-4 py-2 border-t border-white/10 pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={user.image} alt={user.name} /> */}
                    <AvatarFallback>{userData?.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white">{userData?.firstName}</span>
                </motion.div>

                <div className="mt-2 space-y-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <Link href="/business">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-[#FA4032]/50 transition-colors duration-200 group"
                      >
                        <ChefHat className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                        For Businesses
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-[#FA4032]/50 transition-colors duration-200 group"
                    >
                      <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                      Profile Settings
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-[#FA4032]/50 transition-colors duration-200 group"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      Log out
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar

