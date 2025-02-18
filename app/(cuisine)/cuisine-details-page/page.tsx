"use client";

import React, { useState } from "react";
import CuisineDetailContainer from "../components/CuisineDetailContainer";
import FoodCard from "../components/FoodCard";
import FloatingButtons from "../components/FloatingButtons";
import { recommendedForYou } from "../data/data";
import usePreOrder from "../hooks/usePreOrder";

const MealDetailsPage: React.FC = () => {
 const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

 const handleAddToPreOrder = (customizations: any) => {
  addItemToPreOrder({
    id: crypto.randomUUID(), 
    name: customizations.name, 
    quantity: 1, 
    ingredients: "", 
    portionSize: customizations.size,
    spiceLevel: customizations.spiceLevel, 
    drinkPairing: customizations.drink, 
    price: 0, 
    image: "", 
    addOns: customizations.addOns, 
  });
};
  const handleClearPreOrder = () => {
    clearPreOrder();
  };

  const limitedCuisines = recommendedForYou.slice(0, 6);

  return (
    <div>
      <section className="relative py-32 px-4 md:px-14 text-black">
        Navbar
      </section>

      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons preOrderCount={preOrderCount} clearPreOrder={clearPreOrder} />
      </section>

      <section className="relative py-32 px-4 md:px-14 text-white">
        <CuisineDetailContainer handleAddToPreOrder={handleAddToPreOrder} />
      </section>

      <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended for you</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide p-6">
          {limitedCuisines.map((cuisine) => (
            <div key={cuisine.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
              <FoodCard
                image={cuisine.image}
                rating={cuisine.rating}
                name={cuisine.name}
                description={cuisine.description}
                price={cuisine.price}
                carouselImages={cuisine.carouselImages}
                onAddToPreOrder={handleAddToPreOrder} 
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MealDetailsPage;
