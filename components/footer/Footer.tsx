"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, ChefHat, Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, useAnimation } from "framer-motion"

export default function Footer() {
  // Reduce the number of animated elements
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    // Simplify the background animation - slower and less dramatic
    controls.start({
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 30, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" },
    })
  }, [controls])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="relative overflow-hidden py-16"
      animate={controls}
      style={{
        background: "#4B130F",
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(75, 19, 15, 0.9) 0%, rgba(95, 25, 20, 1) 90%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Reduce decorative elements - fewer circles and no animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Reduced static circles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: i % 2 === 0 ? "#FA4032" : "#FFECEB",
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              left: `${(i * 15) % 100}%`,
              top: `${(i * 20) % 100}%`,
            }}
          />
        ))}

        {/* Remove the floating food icons */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Simplified logo with reduced animation */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <ChefHat className="h-6 w-6 text-[#4B130F]" />
              </div>
              <h3 className="text-3xl font-bold text-white">DineEase</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-[#FFECEB]/80">
              Revolutionizing the dining experience with smart technology and connecting food lovers with exceptional
              culinary experiences.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-white relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 h-0.5 w-full bg-[#FA4032]" />
            </h4>
            <ul className="space-y-3">
              {["About", "Features", "Restaurants", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-[#FFECEB]/70 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FA4032] mr-2 inline-block" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-white relative inline-block">
              Legal
              <div className="absolute -bottom-2 left-0 h-0.5 w-full bg-[#FA4032]" />
            </h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[#FFECEB]/70 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FA4032] mr-2 inline-block" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white relative inline-block">
              Newsletter
              <div className="absolute -bottom-2 left-0 h-0.5 w-full bg-[#FA4032]" />
            </h4>
            <p className="text-[#FFECEB]/70">Stay updated with our latest features and restaurants.</p>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#FA4032]"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#FA4032] hover:bg-[#E63326] text-white transition-all duration-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isSubmitted && (
                <div className="absolute -bottom-8 left-0 text-sm text-[#FFECEB]">Thank you for subscribing!</div>
              )}
            </form>
          </div>
        </div>

        
      </div>

      {/* Simple static wave instead of animated */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12"
          style={{ fill: "rgba(255, 236, 235, 0.05)" }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c62.5,0,125.91-16.88,186.19-32.47C443.88,89.44,486.26,74.93,531.35,61.32Z"></path>
        </svg>
      </div>
    </motion.footer>
  )
}

