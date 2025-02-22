"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendar, FaClock, FaUsers, FaStar, FaBus, FaCar, FaCreditCard, FaWifi } from "react-icons/fa6";
import { restaurants } from "@/data/restaurrants";

export default function RestaurantBooking() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const restaurant = restaurants.find((r) => r.id === 1) || restaurants[0];

  return (
    <div className="text-gray-900">
      {/* Banner Section */}
      <div className="relative h-[500px]">
        <img src={restaurant.bannerImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-lg">{restaurant.description}</p>
          <div className="bg-white p-4 rounded-lg shadow-md mt-6 flex gap-4 text-black">
            <select className="p-2 border rounded">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <input type="date" className="p-2 border rounded" />
            <input type="time" className="p-2 border rounded" defaultValue="18:00" />
            <button className="bg-red-500 text-white px-4 py-2 rounded">Find a Table</button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-8 max-w-8xl mx-auto">
        {/* Main Container - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Side - About, Cuisine & Details */}
          <div>
            {/* About Description */}
            <h2 className="text-4xl font-semibold mb-4">About {restaurant.name}</h2>
            <p className="mb-6">{restaurant.about}</p>

            {/* Two Columns for Cuisine & Details */}
            <div className="grid grid-cols-2">
              {/* Cuisine List */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Cuisine</h3>
                <ul className="list-disc ml-5 space-y-1">
                  {restaurant.cuisine.map((cuisine, index) => (
                    <li key={index}>{cuisine}</li>
                  ))}
                </ul>
              </div>
              
              {/* Restaurant Details */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Details</h3>
                <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
                <p><strong>Dining Style:</strong> {restaurant.category}</p>
                <p><strong>Dress Code:</strong> {restaurant.location}</p>
              </div>
            </div>
          </div>

          {/* Right Side - 2x2 Image Grid */}
          <div className="grid grid-cols-2 gap-4">
          {restaurant.photos.slice(0, 4).map((photo, index) => (
            <img 
              key={index} 
              src={photo} 
              className="w-full h-[180px] md:h-[220px] object-cover rounded-lg" 
              alt="Restaurant Photo" 
            />
          ))}
        </div>
        </div>
      </div>




      {/* Services Section */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold"><FaCar className="text-red-500" /> Fine Dining</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold"><FaBus className="text-red-500" /> Event Catering</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold"><FaCreditCard className="text-red-500" /> Outdoor Seating</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold"><FaWifi className="text-red-500" /> Private Events</h3>
          </div>
        </div>
      </div>

      {/* Featured Menu */}
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurant.featuredMenu.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="mt-2 font-semibold text-gray-800">{item.name}</h3>
              <p className="text-red-500 font-semibold">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Reviews */}
      <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Guest Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
            <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
            <p className="text-gray-600 text-sm">December 2023</p>
            <div className="flex text-yellow-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-gray-700 mt-2">Exceptional dining experience! The fusion dishes were innovative and delicious.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
            <h3 className="font-semibold text-gray-800">Michael Chen</h3>
            <p className="text-gray-600 text-sm">November 2023</p>
            <div className="flex text-yellow-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-gray-700 mt-2">Perfect atmosphere for a business dinner. Service was impeccable.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
            <h3 className="font-semibold text-gray-800">Emma Williams</h3>
            <p className="text-gray-600 text-sm">November 2023</p>
            <div className="flex text-yellow-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-gray-700 mt-2">Lovely ambiance and great food. The dessert menu was outstanding.</p>
          </div>
        </div>
        </div>

      {/* Location Section */}
      <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <iframe src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.address)}&output=embed`} className="w-full h-64 rounded-lg"></iframe>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Location</h3>
          <p>{restaurant.address}</p>
          <p>Contact: +94 77 123 4567</p>
        </div>
      </div>
    </div>
  );
}
