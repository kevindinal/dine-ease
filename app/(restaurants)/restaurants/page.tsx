import { getUserData } from "@/lib/auth";
import AllRestaurants from "../components/AllRestaurants";
import Navbar from "@/components/header/Navbar";

export default function RestaurantBooking() {
  
  return (
    <>
    <Navbar />

    <div className="pt-20">
      <AllRestaurants />
    </div>
  </>
  )
  
}