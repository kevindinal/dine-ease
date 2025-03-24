"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCw, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Fallback360ViewerProps {
  imageUrl: string
}


const Fallback360Viewer = ({ imageUrl }: Fallback360ViewerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handlePan = (direction: "left" | "right" | "up" | "down") => {
    const step = 10
    setPosition((prev) => {
      switch (direction) {
        case "left":
          return { ...prev, x: prev.x + step }
        case "right":
          return { ...prev, x: prev.x - step }
        case "up":
          return { ...prev, y: prev.y + step }
        case "down":
          return { ...prev, y: prev.y - step }
      }
    })
  }

  const handleZoom = (direction: "in" | "out") => {
    const step = 0.1
    setZoom((prev) => {
      if (direction === "in") {
        return Math.min(prev + step, 3)
      } else {
        return Math.max(prev - step, 0.5)
      }
    })
  }

  const handleRotate = (direction: "cw" | "ccw") => {
    const step = 15
    setRotation((prev) => {
      if (direction === "cw") {
        return prev + step
      } else {
        return prev - step
      }
    })
  }

  const handleReset = () => {
    setPosition({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="360 view"
          className="max-w-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => handlePan("left")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handlePan("right")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handlePan("up")}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handlePan("down")}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button variant="ghost" size="icon" onClick={() => handleZoom("in")}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleZoom("out")}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button variant="ghost" size="icon" onClick={() => handleRotate("cw")}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleRotate("ccw")}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-700">
        Basic View Mode (CORS Restriction)
      </div>
    </div>
  )
}

export default Fallback360Viewer

