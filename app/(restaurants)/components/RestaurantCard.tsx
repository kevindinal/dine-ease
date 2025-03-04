import { FaStar } from "react-icons/fa";
import { Restaurant } from "@/data/restaurrants";  // Import the type from your data file

type RestaurantCardProps = {
  restaurant: Restaurant;
  router: any;
};

export default function RestaurantCard({ restaurant, router }: RestaurantCardProps) {
  return (
    <div
      className="bg-white text-black rounded-xl shadow-lg overflow-hidden border cursor-pointer transition hover:shadow-2xl"
      onClick={() => router.push(`/restaurants-profile/${restaurant.id}`)}
    >
      {/* Image */}
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />

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
        <p className="text-md font-medium text-gray-700 mb-2">Tonight's availability</p>
        <div className="flex gap-2 flex-wrap">
          {restaurant.times.map((time) => (
            <button
              key={time}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 transition hover:bg-purple-500 hover:text-white"
            >
              {time}
            </button>
          ))}
        </div>

        <button
          className="mt-4 w-full text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition"
          onClick={(e) => {
            e.stopPropagation(); // Prevents parent `div` click
            router.push(`/restaurants-profile/${restaurant.id}`);
          }}
        >
          RESERVE
        </button>
      </div>
    </div>
  );
}