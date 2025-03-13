import { useState } from "react";
import { FaCalendar, FaClock, FaUsers } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type BannerSectionProps = {
  restaurant: {
    id: string,
    name: string;
    bannerImage: string;
    description: string;
  };
};

export default function BannerSection({ restaurant }: BannerSectionProps) {
  const router = useRouter();

  return (
    <div className="text-gray-900">
      <div className="relative h-[500px]">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-lg">{restaurant.description}</p>

          {/* Make a Reservation Box */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6 flex flex-col sm:flex-row gap-4 items-center text-black w-[90%] sm:w-auto">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Guests</label>
              <select className="p-2 border rounded w-full">
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">Date</label>
              <input type="date" className="p-2 border rounded w-full" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold">Time</label>
              <input
                type="time"
                className="p-2 border rounded w-full"
                defaultValue="18:00"
              />
            </div>

            <button
              className="bg-red-500 text-white px-6 py-2 rounded w-full sm:w-auto mt-2 sm:mt-5"
              onClick={() =>
                router.push(
                  `/table-reservation?name=${encodeURIComponent(
                    restaurant.name
                  )}&id=${encodeURIComponent(restaurant.id)}`
                )
              }
            >
              Find a Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
