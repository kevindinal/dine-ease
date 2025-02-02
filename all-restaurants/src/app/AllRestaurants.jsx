"use client";  // ✅ Add this at the very top

import { useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaSearch } from "react-icons/fa";

export default function RestaurantBooking() {
  const [date, setDate] = useState("2025-02-02");
  const [time, setTime] = useState("19:00");
  const [people, setPeople] = useState(2);
  const [search, setSearch] = useState("");

  return (
    <div className="bg-gray-900 text-white">
      <div className="relative h-64 bg-cover bg-center flex items-center justify-center text-center px-4" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?restaurant,food')" }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-xl">
          <h1 className="text-4xl font-bold">Make a free reservation</h1>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaCalendarAlt className="mr-2" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent outline-none" />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaClock className="mr-2" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent outline-none" />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg">
              <FaUsers className="mr-2" />
              <input type="number" value={people} min="1" onChange={(e) => setPeople(e.target.value)} className="bg-transparent outline-none w-12" />
            </div>
            <div className="flex items-center bg-white text-black p-2 rounded-lg w-64">
              <FaSearch className="mr-2" />
              <input type="text" placeholder="Location, Restaurant, or Cuisine" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full" />
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Let's go</button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Book for lunch today in Sri Lanka</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          <div className="bg-white text-black rounded-lg overflow-hidden shadow-lg w-64">
            <img src="https://source.unsplash.com/300x200/?restaurant" alt="Restaurant" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Hilton Colombo</h3>
              <p className="text-sm text-gray-500">Global, International - $250</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">12:00 PM</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">12:15 PM</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">12:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
