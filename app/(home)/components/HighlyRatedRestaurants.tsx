import { Button } from "@/components/ui/button";
import { Star, Bookmark } from "lucide-react";

const restaurants = [
  {
    id: 1,
    name: "The Golden Plate",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    cuisine: "Contemporary",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Mamma Mia",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    cuisine: "Italian",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    cuisine: "Japanese",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Le Bistrot",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
    cuisine: "French",
    rating: 4.7,
  },
  {
    id: 5,
    name: "The Spice Route",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    cuisine: "Indian",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Verde",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791",
    cuisine: "Vegetarian",
    rating: 4.7,
  },
];

const HighlyRatedRestaurants = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-accent-dark mb-8 text-center">
        Highly Rated Restaurants
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Bookmark className="h-5 w-5 text-accent-dark" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-accent-dark">
                  {restaurant.name}
                </h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
              <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlyRatedRestaurants;
