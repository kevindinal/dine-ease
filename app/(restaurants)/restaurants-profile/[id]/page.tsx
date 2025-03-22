"use client";

import { useParams } from "next/navigation";
import { useRestaurant } from "../../hooks/useRestaurants";
import RestaurantProfile from "../../components/RestaurantProfile/RestaurantProfile";
import Navbar from "@/components/header/Navbar";

export default function RestaurantProfilePage() {
  // Use the useParams hook to get the params object
  const params = useParams();
  const id = params.id as string;
  
  // Now use the id from useParams in your custom hook
  const { restaurant, loading, error } = useRestaurant(id);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading restaurant details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Error: {error.message}</div>
      </div>
    );
  }
  
  if (!restaurant) {

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Restaurant not found</div>
      </div>
    );
  }

  return <><Navbar /><RestaurantProfile restaurant={restaurant} /></>;
}