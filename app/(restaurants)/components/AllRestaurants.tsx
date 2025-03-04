"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaUsers, FaSearch } from "react-icons/fa";
import { restaurants } from "@/data/restaurrants";
import RestaurantCard from "./RestaurantCard";

// Define the Restaurant type
export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  times: string[];
};

export default function AllRestaurants() {
  const [date, setDate] = useState("2025-02-02");
  const [time, setTime] = useState("19:00");
  const [people, setPeople] = useState(2);
  const [search, setSearch] = useState("");

  const router = useRouter();

  // Type-safe alternative without type assertion
  const filteredRestaurants = restaurants.filter((restaurant: any) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
    restaurant.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "url('https://t3.ftcdn.net/jpg/02/05/87/60/360_F_205876015_hYYs7ugqoU8QAobSS3TbnGQ92qyS5gEc.jpg')",
        }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-xl">
          <h1 className="text-4xl font-bold">Make a free reservation</h1>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaCalendarAlt className="mr-2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaClock className="mr-2" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaUsers className="mr-2" />
              <input
                type="number"
                value={people}
                min="1"
                onChange={(e) => setPeople(Number(e.target.value))}
                className="bg-transparent outline-none w-12"
              />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg w-64">
              <FaSearch className="mr-2" />
              <input
                type="text"
                placeholder="Location, Restaurant, or Cuisine"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Let's go</button>
          </div>
        </div>
      </div>

      {/* Restaurant Listing */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Book for lunch today in Sri Lanka</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              router={router} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}