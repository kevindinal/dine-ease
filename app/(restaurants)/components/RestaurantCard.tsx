import { FaStar } from "react-icons/fa";
import { Restaurant } from "../types/restaurant"; // Updated import
import { useRouter } from "next/navigation";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white text-black rounded-xl shadow-lg overflow-hidden border cursor-pointer transition hover:shadow-2xl"
      onClick={() => router.push(`/restaurants-profile/${restaurant.id}`)}
    >
      {/* Image */}
      <img 
        src={restaurant.image || '/placeholder-restaurant.jpg'} 
        alt={restaurant.name || 'Restaurant'} 
        className="w-full h-48 object-cover" 
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold">{restaurant.name || 'Restaurant'}</h3>

        {/* Star Ratings */}
        <div className="flex items-center text-yellow-500 mt-1">
          {[...Array(Math.floor(restaurant.rating || 0))].map((_, index) => (
            <FaStar key={index} />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {(restaurant.rating || 0).toFixed(1)} ({restaurant.reviews?.length || 0})
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">{restaurant.category || 'Uncategorized'}</p>
        <p className="text-sm text-gray-600 mt-1">
          {restaurant.description?.length > 60
            ? `${restaurant.description.substring(0, 60)}...`
            : restaurant.description || 'No description available'}
        </p>

        <hr className="my-3 border-gray-300" />

        {/* Availability */}
        <p className="text-md font-medium text-gray-700 mb-2">Tonight's availability</p>
        <div className="flex gap-2 flex-wrap">
          {(restaurant.times || []).map((time) => (
            <button
              key={time}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 transition hover:bg-purple-500 hover:text-white"
            >
              {time}
            </button>
          ))}
          {!(restaurant.times?.length) && (
            <p className="text-sm text-gray-500">No times available</p>
          )}
        </div>

        <button
          className="mt-4 w-full text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition"
          onClick={(e) => {
            e.stopPropagation(); // Prevents parent div click
            router.push(`/restaurants-profile/${restaurant.id}`);
          }}
        >
          RESERVE
        </button>
      </div>
    </div>
  );
}