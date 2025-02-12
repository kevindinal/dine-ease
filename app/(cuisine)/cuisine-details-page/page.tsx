'use client';

import React from 'react';
import CuisineDetailContainer from '../components/CuisineDetailContainer';
import FoodCard from '../components/FoodCard';
import FloatingButtons from '../components/FloatingButtons';
import usePreOrder from '../hooks/usePreOrder';
import { useRouter } from 'next/navigation';

interface Cuisine {
  id: number;
  image: string;
  rating: string;
  name: string;
  description: string;
  price: number;
}

const cuisines: Cuisine[] = [
  {
    id: 1,
    image: "/placeholder.jpeg",
    rating: "4.5",
    name: "Italian Pasta",
    description: "A delicious blend of fresh tomatoes, basil, and cheese.",
    price: 12.99,
  },
  {
    id: 2,
    image: "/placeholder.jpeg",
    rating: "4.2",
    name: "Sushi Platter",
    description: "Fresh sushi rolls with authentic Japanese flavors.",
    price: 18.99,
  },
  {
    id: 3,
    image: "/placeholder.jpeg",
    rating: "4.8",
    name: "Tacos",
    description: "Soft-shell tacos with flavorful meat and fresh toppings.",
    price: 9.99,
  },
  {
    id: 4,
    image: "/placeholder.jpeg",
    rating: "4.7",
    name: "Indian Curry",
    description: "Spicy and rich curry served with fluffy naan bread.",
    price: 14.99,
  },
];

const MealDetailsPage: React.FC = () => {
  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  const handleAddToPreOrder = () => {
    addItemToPreOrder();
  }

  return (
    <div>
      <h1>Meal Details Page</h1>

      <section className="relative py-32 px-4 md:px-14 text-black">
        Navbar
      </section>

      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons preOrderCount={preOrderCount} setPreOrderCount={clearPreOrder} />
      </section>

      <section className="relative py-32 px-4 md:px-14 text-white">
        <CuisineDetailContainer handleAddToPreOrder={handleAddToPreOrder} />
      </section>

      <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended for you</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide p-6 bg-gray-100">
          {cuisines.map((cuisine) => (
            <div key={cuisine.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
              <FoodCard
                image={cuisine.image}
                rating={cuisine.rating}
                name={cuisine.name}
                description={cuisine.description}
                price={cuisine.price}
                onAddToPreOrder={addItemToPreOrder}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MealDetailsPage;
