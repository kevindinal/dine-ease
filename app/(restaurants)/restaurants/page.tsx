"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaUsers, FaSearch, FaStar } from "react-icons/fa";
import { restaurants } from "@/data/restaurrants";

export default function RestaurantBooking() {
  const [date, setDate] = useState("2025-02-02");
  const [time, setTime] = useState("19:00");
  const [people, setPeople] = useState(2);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const filteredRestaurants = restaurants.filter((restaurant) =>
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
      <div className="p-6 ">
  <h2 className="text-2xl font-semibold mb-4 ">Book for lunch today in Sri Lanka</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {filteredRestaurants.map((restaurant) => (
      <div
        key={restaurant.id}
        className="bg-white text-black rounded-xl shadow-lg overflow-hidden border cursor-pointer transition hover:shadow-2xl"
        onClick={() => router.push(`/restaurants-profile/${restaurant.id}`)}>
        {/* Image */}
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover " />

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-semibold">{restaurant.name}</h3>

          {/* Star Ratings */}
          <div className="flex items-center text-yellow-500 mt-1">
            {[...Array(restaurant.rating)].map((_, index) => (
              <FaStar key={index} />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {restaurant.rating}.0 ({restaurant.reviews})
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">{restaurant.category}</p>
          <p className="text-sm text-gray-600 mt-1">
            Small plates, salads & sandwiches with an intimate setting.
          </p>

          <hr className="my-3 border-gray-300" />

          {/* Availability */}
          <p className="text-md font-medium text-gray-700 mb-2">Tonight’s availability</p>
          <div className="flex gap-2 flex-wrap">
            {restaurant.times.map((time) => (
              <button
                key={time}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 transition hover:bg-purple-500 hover:text-white">
                {time}
              </button>
            ))}
          </div>

          <button
            className="mt-4 w-full text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition"
            onClick={() => router.push(`/restaurants-profiles/${restaurant.id}`)}
          >
            RESERVE
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
