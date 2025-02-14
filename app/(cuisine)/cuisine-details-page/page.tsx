"use client";

import React from "react";
import CuisineDetailContainer from "../components/CuisineDetailContainer";
import FoodCard from "../components/FoodCard";
import FloatingButtons from "../components/FloatingButtons";
import usePreOrder from "../hooks/usePreOrder";
import { recommendedForYou } from "../data/data";

const MealDetailsPage: React.FC = () => {
  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  const handleAddToPreOrder = () => {
    addItemToPreOrder();
  };

  // Get only the first 6 recommended cuisines
  const limitedCuisines = recommendedForYou.slice(0, 6);

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
          {limitedCuisines.map((cuisine) => (
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
};

export default MealDetailsPage;
