import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ReservationCardProps {
  id: string
  restaurant: string
  date: string
  time: string
  guests: number
  status: string
  table: string
  specialRequests?: string
  cancellationReason?: string
  isPast?: boolean
}

export function ReservationCard({
  id,
  restaurant,
  date,
  time,
  guests,
  status,
  table,
  specialRequests,
  cancellationReason,
  isPast = false,
}: ReservationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-amber-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className={!isPast ? "bg-primary/5 pb-3" : "pb-3"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{restaurant}</CardTitle>
            <CardDescription>
              {date} at {time}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Table</p>
            <p className="text-sm font-medium">{table}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Guests</p>
            <p className="text-sm font-medium">{guests} people</p>
          </div>
        </div>
        {specialRequests && (
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Special Requests</p>
            <p className="text-sm">{specialRequests}</p>
          </div>
        )}
        {cancellationReason && (
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Cancellation Reason</p>
            <p className="text-sm">{cancellationReason}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <Button variant="ghost" size="sm">
          {isPast ? "View Details" : "Contact Restaurant"}
        </Button>
        <Button variant="outline" size="sm">
          {isPast ? "Book Again" : "Modify Reservation"}
        </Button>
      </CardFooter>
    </Card>
  )
}

