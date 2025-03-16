"use client"

import { CheckCircle, Coffee, Award, Zap, Sparkles, Users, Wind, Wifi, Cigarette, CigaretteOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FeaturesSectionProps {
  features: string[]
  seats: number
}

// Map feature IDs to their display properties (icon, color, label)
const FEATURE_MAP = {
  "window-view": {
    icon: <Coffee className="h-5 w-5 text-purple-500 mr-2" />,
    color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    label: "Window View",
  },
  "premium-service": {
    icon: <Award className="h-5 w-5 text-amber-500 mr-2" />,
    color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    label: "Premium Service",
  },
  "charging-outlets": {
    icon: <Zap className="h-5 w-5 text-blue-500 mr-2" />,
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    label: "Charging Outlets",
  },
  "ambient-lighting": {
    icon: <Sparkles className="h-5 w-5 text-pink-500 mr-2" />,
    color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
    label: "Ambient Lighting",
  },
  privacy: {
    icon: <Users className="h-5 w-5 text-green-500 mr-2" />,
    color: "bg-green-50 text-green-700 hover:bg-green-100",
    label: "Privacy",
  },
  "air-conditioning": {
    icon: <Wind className="h-5 w-5 text-cyan-500 mr-2" />,
    color: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
    label: "Air Conditioning",
  },
  "smoking-allowed": {
    icon: <Cigarette className="h-5 w-5 text-orange-500 mr-2" />,
    color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    label: "Smoking Allowed",
  },
  "non-smoking": {
    icon: <CigaretteOff className="h-5 w-5 text-teal-500 mr-2" />,
    color: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    label: "Non-Smoking",
  },
  wifi: {
    icon: <Wifi className="h-5 w-5 text-indigo-500 mr-2" />,
    color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    label: "Free WiFi",
  },
}

// Helper function to get feature display properties
const getFeatureDisplay = (featureId: string) => {
  // Convert string like "Window View" to "window-view"
  const normalizedId = featureId.toLowerCase().replace(/\s+/g, "-")

  // Try to find the feature in our map
  const mappedFeature = FEATURE_MAP[normalizedId as keyof typeof FEATURE_MAP]

  if (mappedFeature) {
    return mappedFeature
  }

  // Fallback for features not in our map
  return {
    icon: <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />,
    color: "bg-gray-50 text-gray-700 hover:bg-gray-100",
    label: featureId,
  }
}

// Get appropriate seat arrangement description
const getSeatArrangement = (seats: number) => {
  if (seats <= 2) return "Intimate setting for couples"
  if (seats <= 4) return "Perfect for small groups"
  if (seats <= 6) return "Great for medium-sized groups"
  return "Ideal for large gatherings"
}

export default function FeaturesSection({ features, seats }: FeaturesSectionProps) {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Features & Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features?.map((feature, index) => {
          const displayInfo = getFeatureDisplay(feature)
          return (
            <div key={index} className="flex items-center">
              {displayInfo.icon}
              <span className="text-gray-700">{displayInfo.label}</span>
            </div>
          )
        })}
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

          {features.includes("Window View") && (
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
          )}

          {features.includes("Premium Service") && (
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
          )}

          {features.includes("Smoking Allowed") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <Cigarette size={14} className="mr-1.5" />
                  Smoking Allowed
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Smoking is permitted in this area</p>
              </TooltipContent>
            </Tooltip>
          )}

          {features.includes("Non-Smoking") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100">
                  <CigaretteOff size={14} className="mr-1.5" />
                  Non-Smoking
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Smoking is not permitted in this area</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  )
}

