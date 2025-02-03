"use client";

import { useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

export default function RestaurantProfile() {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("2025-02-03");
  const [time, setTime] = useState("19:00");

  return (
    <div className="bg-white text-black">
      {/* Header Image */}
      <div className="relative w-full h-[400px]">
        <img src="/restaurant-banner.jpg" alt="Restaurant Banner" className="w-full h-full object-cover"/>
      </div>

      {/* Restaurant Details */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">FLOW - Hilton Colombo Residences</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <span>⭐ 4.5 (634)</span>
          <span>📍 Colombo</span>
          <span>💰 $31 to $50</span>
          <span>🍽️ Global, International</span>
        </div>

        {/* Reservation Box */}
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-100">
          <h2 className="text-xl font-semibold">Make a Reservation</h2>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center border px-3 py-2 rounded">
              <FaUsers />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="ml-2 bg-transparent outline-none"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} People
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center border px-3 py-2 rounded">
              <FaCalendarAlt />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="ml-2 bg-transparent outline-none" />
            </div>
            <div className="flex items-center border px-3 py-2 rounded">
              <FaClock />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ml-2 bg-transparent outline-none" />
            </div>
          </div>
          <button className="mt-4 w-full bg-red-500 text-white py-2 rounded">
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}
