"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaUsers, FaSearch, FaStar, FaMapMarkerAlt, FaCar, FaWifi, FaCreditCard, FaBus } from "react-icons/fa";
import { restaurants } from "@/data/restaurrants";

export default function RestaurantBooking() {
  const [date, setDate] = useState("2025-02-02");
  const [time, setTime] = useState("19:00");
  const [people, setPeople] = useState(2);
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className="text-black bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[450px] bg-cover bg-center flex items-center justify-center text-center px-4 text-white" style={{backgroundImage: "url('https://www.hilton.com/im/en/COLHITW/11397333/graze.jpg?impolicy=crop&cw=6250&ch=3336&gravity=NorthWest&xposition=0&yposition=417&rw=768&rh=410')"}}>
        <div className="bg-black bg-opacity-60 p-6 rounded-xl">
          <h1 className="text-4xl font-bold">FLOW - Hilton Colombo Residences</h1>
          <p className="text-lg">Experience Modern Asian Fusion Dining</p>
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
              <input type="number" value={people} min="1" onChange={(e) => setPeople(Number(e.target.value))} className="bg-transparent outline-none w-12" />
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Find a Table</button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold">About FLOW</h2>
        <p className="mt-2">FLOW Restaurant at Hilton Colombo Residences offers an exceptional dining experience, featuring a diverse menu spanning Sri Lankan, Indian, Chinese, Japanese, and Western cuisines.</p>
      </div>

      {/* Facilities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="flex items-center gap-2"><FaCar /> Valet Parking Available</div>
        <div className="flex items-center gap-2"><FaBus /> Accessible by Bus & Train</div>
        <div className="flex items-center gap-2"><FaCreditCard /> All Major Cards Accepted</div>
        <div className="flex items-center gap-2"><FaWifi /> Free Wi-Fi Available</div>
      </div>

      {/* Featured Menu */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Featured Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="/grilled-salmon.jpg" alt="Grilled Salmon" className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">Grilled Salmon</h3>
            <p>Fresh Atlantic salmon with seasonal vegetables</p>
            <p className="text-red-500 font-semibold">$32</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="/duck.jpg" alt="Pan-Seared Duck" className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">Pan-Seared Duck</h3>
            <p>Duck breast with cherry reduction</p>
            <p className="text-red-500 font-semibold">$38</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="/truffle-pasta.jpg" alt="Truffle Pasta" className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">Truffle Pasta</h3>
            <p>Handmade pasta with black truffle</p>
            <p className="text-red-500 font-semibold">$28</p>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Location</h2>
        <p>200 Union Place, Colombo 00200, Sri Lanka</p>
        <p>Monday - Sunday: 12:00 PM - 10:30 PM</p>
        <p>Happy Hour: 4:00 PM - 6:00 PM</p>
        <p>Contact: +94 11 2492 492</p>
        <div className="mt-4">
          <img src="/map.png" alt="Map" className="w-full h-64 object-cover rounded-lg" />
        </div>
      </div>

      {/* Guest Reviews */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Guest Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Sarah Johnson</h3>
            <p>December 2023</p>
            <p>⭐⭐⭐⭐⭐ Exceptional dining experience!</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Michael Chen</h3>
            <p>November 2023</p>
            <p>⭐⭐⭐⭐⭐ Perfect atmosphere for a business dinner.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Emma Williams</h3>
            <p>November 2023</p>
            <p>⭐⭐⭐⭐⭐ Lovely ambiance and great food.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
