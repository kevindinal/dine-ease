"use client"

import type React from "react"

import { CheckCircle, Coffee, Award, Zap, Sparkles, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FeaturesSectionProps {
  features: string[]
  seats: number
}

export default function FeaturesSection({ features, seats }: FeaturesSectionProps) {
  // Get appropriate seat arrangement description
  const getSeatArrangement = (seats: number) => {
    if (seats <= 2) return "Intimate setting for couples"
    if (seats <= 4) return "Perfect for small groups"
    if (seats <= 6) return "Great for medium-sized groups"
    return "Ideal for large gatherings"
  }

  return (
    <div className="pt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Features & Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-center">
            {feature === "Window View" && <Coffee className="h-5 w-5 text-purple-500 mr-2" />}
            {feature === "Premium Service" && <Award className="h-5 w-5 text-amber-500 mr-2" />}
            {feature === "Charging Outlets" && <Zap className="h-5 w-5 text-blue-500 mr-2" />}
            {feature === "Ambient Lighting" && <Sparkles className="h-5 w-5 text-pink-500 mr-2" />}
            {feature === "Privacy" && <Users className="h-5 w-5 text-green-500 mr-2" />}
            {feature === "Air Conditioning" && <Wind className="h-5 w-5 text-cyan-500 mr-2" />}
            {![
              "Window View",
              "Premium Service",
              "Charging Outlets",
              "Ambient Lighting",
              "Privacy",
              "Air Conditioning",
            ].includes(feature) && <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />}
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Users size={14} className="mr-1.5" />
                {getSeatArrangement(seats)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Table for {seats} people</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100">
                <Coffee size={14} className="mr-1.5" />
                Window View
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enjoy a beautiful view while dining</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100">
                <Award size={14} className="mr-1.5" />
                Premium Service
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enhanced dining experience with premium service</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

// Add the missing Wind component
function Wind(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}

