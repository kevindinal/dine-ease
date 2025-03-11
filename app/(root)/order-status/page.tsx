'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Loader2, XCircle, PencilLine } from "lucide-react";

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    date: "2024-03-20",
    time: "19:00",
    guests: 4,
    status: "confirmed"
  },
  {
    id: "2",
    date: "2024-03-22",
    time: "20:30",
    guests: 2,
    status: "pending"
  },
  {
    id: "3",
    date: "2024-03-25",
    time: "18:00",
    guests: 6,
    status: "confirmed"
  }
];

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: "cancelled" } : res
        )
      );
      
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Reservation["status"]) => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: newStatus } : res
        )
      );
      
      toast({
        title: "Status updated",
        description: "Reservation status has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">My Reservations</h1>
          <p className="text-muted-foreground">
            View and manage your restaurant reservations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4"
                >
                  <div className="flex flex-col space-y-2 flex-grow">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{reservation.guests} guests</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                      {reservation.status !== "cancelled" && (
                        <Select
                          defaultValue={reservation.status}
                          onValueChange={(value) => 
                            handleStatusChange(reservation.id, value as Reservation["status"])
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 w-full md:w-auto">
                    {reservation.status !== "cancelled" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 md:flex-none"
                          disabled={isLoading}
                        >
                          <PencilLine className="w-4 h-4 mr-2" />
                          Modify
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 md:flex-none"
                          onClick={() => handleCancel(reservation.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {reservations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No reservations found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReservationsPage;