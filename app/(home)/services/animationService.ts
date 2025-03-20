"use client"

import type { AnimationControls } from "framer-motion"

/**
 * Starts background gradient animation
 */
export const startBackgroundAnimation = (controls: AnimationControls): void => {
  controls.start({
    backgroundPosition: ["0% 0%", "100% 100%"],
    transition: { duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" },
  })
}

/**
 * Utility function to generate a random number between min and max
 */
export const getRandomNumber = (min: number, max: number, seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return min + (hash % (max - min + 1))
}
