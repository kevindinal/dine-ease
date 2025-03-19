import { Button } from "@/components/ui/button";
import { Clock, ChevronRight } from "lucide-react";

const meals = [
  {
    id: 1,
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with herbs",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    estimatedTime: "25-30 min",
  },
  {
    id: 2,
    name: "Beef Wellington",
    description: "Classic dish with mushroom duxelles",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    estimatedTime: "35-40 min",
  },
  {
    id: 3,
    name: "Vegetable Curry",
    description: "Aromatic curry with fresh vegetables",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    estimatedTime: "20-25 min",
  },
];

const WeeklyOffers = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-accent-dark mb-8 text-center">
          This Week's Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-accent-dark">
                    {meal.name}
                  </h3>
                  <span className="text-lg font-bold text-primary">
                    ${meal.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{meal.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  {meal.estimatedTime}
                </div>
                <Button className="w-full bg-[#FA4032] hover:bg-[#FFECEB] text-white hover:text-[#FA4032] transition-all duration-300 animate-fade-in">
                  Order Now
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyOffers;