"use client"

import { useState, useEffect } from "react"
import { Menu, X, LogOut, Settings } from "lucide-react"
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
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

interface NavLink {
  title: string
  href: string
}

const navLinks: NavLink[] = [
  { title: "Home", href: "/home-main" },
  { title: "Restaurants", href: "/restaurants" },
  { title: "Contact", href: "#contact" },
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Fetch user data from Firestore when auth state changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          } else {
            // If no custom data exists, use basic auth data
            setUserData({
              firstName: user.displayName?.split(" ")[0] || "User",
              email: user.email,
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    if (!loading && user) {
      fetchUserData()
    }
  }, [user, loading])

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Get display name (firstName or email username or fallback)
  const getDisplayName = () => {
    if (userData?.firstName) return userData.firstName
    if (user?.displayName) return user.displayName.split(" ")[0]
    if (user?.email) return user.email.split("@")[0]
    return "User"
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.firstName) return userData.firstName.charAt(0)
    if (user?.displayName) return user.displayName.charAt(0)
    if (user?.email) return user.email.charAt(0)
    return "U"
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-4 ${isScrolled ? "bg-red-600 shadow-md" : "bg-red-600/90"} z-50 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/home-main"
            className="text-2xl font-bold text-white transition-all duration-300 hover:text-white/90 hover:scale-105"
          >
            DineEase
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.title} href={link.href} className="text-white relative group py-2">
                <span className="relative z-10">{link.title}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* User Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full bg-white/10 hover:bg-white/20 p-1 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8 border-2 border-white transition-transform duration-300 hover:border-primary">
                        <AvatarImage
                          src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                          alt={getDisplayName()}
                        />
                        <AvatarFallback className="bg-primary text-white">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium hidden sm:inline">{getDisplayName()}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-red-50">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer transition-colors duration-200 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/sign-in">
                <Button variant="outline" className="bg-white text-red-600 hover:bg-white/90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 transition-colors duration-200 rounded-full"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-red-700 rounded-lg p-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block py-2 text-white hover:text-white hover:bg-red-800 px-2 rounded transition-colors duration-200"
              >
                {link.title}
              </Link>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-2 mt-4 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || "/placeholder.svg?height=32&width=32"} alt={getDisplayName()} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-white">{getDisplayName()}</span>
                </div>
                <div className="mt-2 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="block py-2 text-white hover:text-white hover:bg-red-800 px-2 rounded transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar