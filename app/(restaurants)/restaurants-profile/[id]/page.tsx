"use client";

import { useParams } from "next/navigation";
import { restaurants } from "@/data/restaurrants";
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

export default function RestaurantProfile() {
  const params = useParams();
  const id = params.id;
  const restaurant = restaurants.find((r) => r.id.toString() === id);

  if (!restaurant) {
    return <p className="text-center text-red-500">Restaurant not found!</p>;
  }

  return (
    <div className="bg-white text-black">
      <div className="relative w-full h-[400px]">
        <img src={restaurant.bannerImage} alt="Restaurant Banner" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600">⭐ {restaurant.rating} ({restaurant.reviews}) • {restaurant.location} • {restaurant.priceRange} • {restaurant.cuisine}</p>
      </div>
    </div>
  );
}
