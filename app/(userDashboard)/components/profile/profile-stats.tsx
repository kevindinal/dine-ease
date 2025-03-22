import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Calendar, Gift } from "lucide-react"

interface ProfileStatsProps {
  totalOrders: number
  activeOrders: number
  upcomingReservations: number
  nextReservation?: {
    restaurant: string
    date: string
  }
  rewardPoints: number
  nextLevelPoints: number
  nextLevel: string
}

export function ProfileStats({
  totalOrders,
  activeOrders,
  upcomingReservations,
  nextReservation,
  rewardPoints,
  nextLevelPoints,
  nextLevel,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {activeOrders} active, {totalOrders - activeOrders} completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{upcomingReservations}</div>
              {nextReservation ? (
                <p className="text-xs text-muted-foreground">
                  Next: {nextReservation.restaurant}, {nextReservation.date}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">No upcoming reservations</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reward Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-2">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{rewardPoints}</div>
              <p className="text-xs text-muted-foreground">
                {nextLevelPoints - rewardPoints} points to {nextLevel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

