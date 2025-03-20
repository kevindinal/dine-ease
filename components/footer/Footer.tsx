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

