import {
  CheckCircle,
  Users,
  Wifi,
  Wind,
  Zap,
  Sparkles,
  Coffee,
  Award,
  CigaretteOff,
  Cigarette,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FeaturesSectionProps {
  features: string[]
  seats: number
}

export default function FeaturesSection({ features, seats }: FeaturesSectionProps) {
  // Helper function to get icon for a feature
  const getFeatureIcon = (feature: string) => {
    const featureId = feature.toLowerCase().replace(/\s+/g, "-")

    switch (featureId) {
      case "window-view":
        return <Coffee className="h-4 w-4 text-purple-600" />
      case "premium-service":
        return <Award className="h-4 w-4 text-amber-600" />
      case "charging-outlets":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "ambient-lighting":
        return <Sparkles className="h-4 w-4 text-pink-600" />
      case "wifi":
      case "free-wifi":
        return <Wifi className="h-4 w-4 text-indigo-600" />
      case "air-conditioning":
        return <Wind className="h-4 w-4 text-cyan-600" />
      case "privacy":
        return <Lock className="h-4 w-4 text-green-600" />
      case "smoking-allowed":
        return <Cigarette className="h-4 w-4 text-orange-600" />
      case "non-smoking":
        return <CigaretteOff className="h-4 w-4 text-teal-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // Helper function to get color for a feature
  const getFeatureColor = (feature: string) => {
    const featureId = feature.toLowerCase().replace(/\s+/g, "-")

    switch (featureId) {
      case "window-view":
        return "bg-purple-100 text-purple-600 border-purple-200"
      case "premium-service":
        return "bg-amber-100 text-amber-600 border-amber-200"
      case "charging-outlets":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "ambient-lighting":
        return "bg-pink-100 text-pink-600 border-pink-200"
      case "wifi":
      case "free-wifi":
        return "bg-indigo-100 text-indigo-600 border-indigo-200"
      case "air-conditioning":
        return "bg-cyan-100 text-cyan-600 border-cyan-200"
      case "privacy":
        return "bg-green-100 text-green-600 border-green-200"
      case "smoking-allowed":
        return "bg-orange-100 text-orange-600 border-orange-200"
      case "non-smoking":
        return "bg-teal-100 text-teal-600 border-teal-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="pt-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Features & Amenities</h3>
      <div className="flex flex-wrap gap-2">
        {/* Seats badge */}
        <Badge variant="outline" className="bg-gray-100 border-gray-200">
          <Users className="h-4 w-4 mr-1.5 text-gray-600" />
          {seats} {seats === 1 ? "seat" : "seats"}
        </Badge>

        {/* Feature badges */}
        {features.map((feature, index) => (
          <Badge key={index} variant="outline" className={getFeatureColor(feature)}>
            {getFeatureIcon(feature)}
            <span className="ml-1.5">{feature}</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}

