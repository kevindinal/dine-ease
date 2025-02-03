"use client";

import { useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaWifi, FaParking, FaChair } from "react-icons/fa";

export default function RestaurantPage() {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("2025-02-03");
  const [time, setTime] = useState("19:00");

  return (
    <div className="bg-white text-black">
      {/* Header Image */}
      <div className="relative w-full h-[400px]">
        <img src="https://resizer.otstatic.com/v2/photos/wide-xlarge/2/41686450.jpg" alt="Restaurant Banner" className="w-full h-full object-cover" />
      </div>

      {/* Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4 border-b flex space-x-8 text-lg font-semibold">
        <a href="#overview">Overview</a>
        <a href="#photos">Photos</a>
        <a href="#menu">Menu</a>
        <a href="#reviews">Reviews</a>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full md:w-2/3">
          {/* Overview */}
          <section id="overview">
            <h1 className="text-3xl font-bold">FLOW - Hilton Colombo</h1>
            <p className="text-gray-600">⭐ 4.5 (634) • 📍 Colombo • 💰 $31 to $50 • 🍽️ Global, International</p>
          </section>
          
          {/* Photos Section */}
          <section id="photos" className="mt-8">
            <h2 className="text-2xl font-semibold">Photos</h2>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <img src="https://hiltoncolombo1.com/resturant-gallery/6271610003271G3-1.jpg" className="w-full h-32 object-cover rounded" />
              <img src="https://www.hilton.com/im/en/COLHITW/15076023/lab.jpg?impolicy=crop&cw=5362&ch=4171&gravity=NorthWest&xposition=443&yposition=0&rw=684&rh=532" className="w-full h-32 object-cover rounded" />
              <img src="https://bmkltsly13vb.compat.objectstorage.ap-mumbai-1.oraclecloud.com/cdn.dailymirror.lk/assets/uploads/image_a9ff965e05.jpg" className="w-full h-32 object-cover rounded" />
            </div>
          </section>

          {/* Menu Section */}
          <section id="menu" className="mt-8">
            <h2 className="text-2xl font-semibold">Menu</h2>
            <p>Check out our delicious menu items:</p>
            <ul className="list-disc pl-5">
              <li>Grilled Salmon - $25</li>
              <li>Classic Cheeseburger - $18</li>
              <li>Vegetarian Pasta - $20</li>
            </ul>
          </section>

          {/* Reviews */}
          <section id="reviews" className="mt-8">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <p>No Reviews Yet. Be the first to review this restaurant.</p>
          </section>
        </div>

        {/* Right Column - Reservation Box */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="p-4 border rounded-lg shadow-md bg-gray-100">
            <h2 className="text-xl font-semibold">Make a Reservation</h2>
            <div className="flex flex-col space-y-4 mt-2">
              <div className="flex items-center border px-3 py-2 rounded">
                <FaUsers />
                <select value={guests} onChange={(e) => setGuests(e.target.value)} className="ml-2 bg-transparent outline-none">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} People</option>
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
            <button className="mt-4 w-full bg-red-500 text-white py-2 rounded">Check Availability</button>
          </div>
          
          {/* Location */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h2 className="text-xl font-semibold">Location</h2>
        <p><FaMapMarkerAlt className="inline-block" /> Hilton Colombo, Colombo, Sri Lanka</p>
        <div className="mt-2">
            <iframe
            width="100%"
            height="250"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3767.303100728047!2d79.84209671881013!3d6.932460466772743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shilton%20colombo!5e0!3m2!1sen!2slk!4v1738600192251!5m2!1sen!2slk"
            allowFullScreen
            ></iframe>
        </div>
        </div>


          
          {/* Additional Information */}
          <div className="p-4 border rounded-lg shadow-md bg-gray-100">
            <h2 className="text-xl font-semibold">Additional Information</h2>
            <p><FaChair className="inline-block" /> Outdoor seating available.</p>
            <p><FaWifi className="inline-block" /> Free WiFi.</p>
            <p><FaParking className="inline-block" /> Parking available.</p>
          </div>
        </div>
      </div>
    </div>
  );
}