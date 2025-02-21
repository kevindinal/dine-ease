"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaUsers, FaStar, FaBus } from "react-icons/fa";
import { restaurants } from "@/data/restaurrants";
import { FaCar, FaCreditCard, FaWifi } from "react-icons/fa6";

export default function RestaurantBooking() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className="text-gray-900">
      {/* Banner Section */}
      <div className="relative h-[500px]">
        <img
          src="https://www.hilton.com/im/en/TYOHITW/17641801/marblelounge-1.jpg?impolicy=crop&cw=4500&ch=2402&gravity=NorthWest&xposition=0&yposition=298&rw=768&rh=410"
          alt="Restaurant Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold">FLOW - Hilton Colombo Residences</h1>
          <p className="text-lg">Experience Modern Asian Fusion Dining</p>
          {/* Reservation Bar */}
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
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">About FLOW</h2>
        <p className="mb-4">FLOW Restaurant at Hilton Colombo Residences offers an exceptional dining experience, featuring a diverse menu that spans Sri Lankan, Indian, Chinese, Japanese, and Western cuisines. Our casual elegant atmosphere provides the perfect setting for both intimate dinners and business meetings.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold">Cuisine</h3>
            <ul className="list-disc pl-4">
              <li>Sri Lankan</li>
              <li>Indian</li>
              <li>Chinese</li>
              <li>Japanese</li>
              <li>Western</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Details</h3>
            <p>Price Range: $31-$50</p>
            <p>Dining Style: Casual Elegant</p>
            <p>Dress Code: Smart Casual</p>
          </div>
        </div>
        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/612342474.jpg?k=027a217399df0ebe6e714352acfcb5b135be0a32a1b8a46adcebbc1f2b2a4a19&o=&hp=1" className="w-full rounded-lg" />
          <img src="https://hiltoncolombo1.com/resturant-gallery/4911708326618gk-g2.jpg" className="w-full rounded-lg" />
          <img src="https://c7.staticflickr.com/6/5799/30508881102_8384b152a7_b.jpg" className="w-full rounded-lg" />
          <img src="https://cdn.squaremeal.co.uk/restaurants/2747/images/waldorf-7_05012024112304.jpg?w=1200&h=800&fit=crop&auto=format%2Ccompress" className="w-full rounded-lg" />
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold  items-center gap-2"><FaCar />Fine Dining</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold  items-center gap-2"><FaBus />Event Catering</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold items-center gap-2"><FaCreditCard />Outdoor Seating</h3>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-semibold  items-center gap-2"><FaWifi />Private Events</h3>
          </div>
        </div>
      </div>

            {/* Featured Menu */}
      <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <img src="https://www.dinneratthezoo.com/wp-content/uploads/2019/05/grilled-salmon-final-2.jpg" alt="Grilled Salmon" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="mt-2 font-semibold text-gray-800">Grilled Salmon</h3>
          <p className="text-gray-700 mb-2">Fresh Atlantic salmon with seasonal vegetables</p>
          <p className="text-red-500 font-semibold">$32</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCH9SwLz4kQKwXhf8lzDnoupISsGn9RNpdXw&s" alt="Pan-Seared Duck" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="mt-2 font-semibold text-gray-800">Pan-Seared Duck</h3>
          <p className="text-gray-700 mb-2">Duck breast with cherry reduction</p>
          <p className="text-red-500 font-semibold">$38</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <img src="https://www.milkandhoneynutrition.com/wp-content/uploads/2020/12/truffle-mushroom-pasta-5.jpg" alt="Truffle Pasta" className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="mt-2 font-semibold text-gray-800">Truffle Pasta</h3>
          <p className="text-gray-700 mb-2">Handmade pasta with black truffle</p>
          <p className="text-red-500 font-semibold">$28</p>
        </div>
      </div>
      </div>

      {/* Location Section */}
      <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d16910.53136808493!2d79.84858051275081!3d6.915889554168836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shilton!5e0!3m2!1sen!2slk!4v1740059849563!5m2!1sen!2slk"
            className="w-full h-64 rounded-lg"
          ></iframe>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Location</h3>
          <p>123 Hilton Road, Colombo, Sri Lanka</p>
          <p>Opening Hours: 10 AM - 10 PM</p>
          <p>Contact: +94 77 123 4567</p>
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
    </div>
  );
}

