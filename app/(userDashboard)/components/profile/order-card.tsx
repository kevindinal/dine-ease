import { CheckCircle2, Clock3, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TrackingStep {
  name: string
  completed: boolean
  time: string
}

interface OrderCardProps {
  id: string
  restaurant: string
  date: string
  items: string[]
  total: string
  status: string
  estimatedDelivery?: string
  trackingSteps?: TrackingStep[]
  deliveryTime?: string
}

export function OrderCard({
  id,
  restaurant,
  date,
  items,
  total,
  status,
  estimatedDelivery,
  trackingSteps,
  deliveryTime,
}: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "bg-amber-500"
      case "on the way":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return <Clock3 className="h-4 w-4 text-amber-500" />
      case "on the way":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const isActive = status.toLowerCase() !== "delivered" && status.toLowerCase() !== "cancelled"

  return (
    <Card className="overflow-hidden">
      <CardHeader className={isActive ? "bg-primary/5 pb-3" : "pb-3"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{restaurant}</CardTitle>
            <CardDescription>{date}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Order #{id}</span>
            <span className="text-sm font-bold">{total}</span>
          </div>
          <div className="text-sm text-muted-foreground mb-3">{items.join(", ")}</div>
          {isActive && estimatedDelivery && (
            <div className="flex items-center text-sm">
              <Clock3 className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Estimated delivery: {estimatedDelivery}</span>
            </div>
          )}
          {!isActive && deliveryTime && (
            <div className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              <span>Delivered at: {deliveryTime}</span>
            </div>
          )}
        </div>

        {isActive && trackingSteps && (
          <div className="relative">
            <div className="flex justify-between mb-2 relative z-10">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-primary text-white" : "bg-gray-200"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-[60px] truncate">{step.name}</span>
                  {step.completed && step.time && <span className="text-xs text-muted-foreground">{step.time}</span>}
                </div>
              ))}
            </div>
            <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 -z-0"></div>
            <div
              className="absolute top-3 left-3 h-0.5 bg-primary -z-0"
              style={{
                width: `${
                  ((trackingSteps.filter((step) => step.completed).length - 1) / (trackingSteps.length - 1)) * 100
                }%`,
              }}
            ></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <Button variant="ghost" size="sm">
          {isActive ? "Contact Restaurant" : "View Details"}
        </Button>
        <Button variant="outline" size="sm">
          {isActive ? "Track Order" : "Order Again"}
        </Button>
      </CardFooter>
    </Card>
  )
}

