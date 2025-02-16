'use client';

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { recommendedForYou, chefsSpecials, todaysSpecials, Special } from "../../data/data";
import FoodCard from "../../components/FoodCard";
import usePreOrder from "../../hooks/usePreOrder";
import FloatingButtons from "../../components/FloatingButtons";

interface PreOrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  ingredients: string[];
  plating: string;
  cookingMethod: string;
  seasonalSelection: boolean;
  drinkPairing: string;
}


interface Customizations {
  quantity: number;
  ingredients: string[];
  plating: string;
  cookingMethod: string;
  seasonalSelection: boolean;
  drinkPairing: string;
}

export default function CategoryViewMore() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category as string);

  const allSpecials: Special[] = [...recommendedForYou, ...chefsSpecials, ...todaysSpecials];

  // Filter specials by category from the URL
  const categorySpecials = allSpecials.filter((special) => special.category === decodedCategory);

  // Sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sort category specials by price
  const sortedSpecials = [...categorySpecials].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const handleAddToPreOrder = (customizations: Customizations, cuisine: any) => {
    const preOrderItem: PreOrderItem = {
      id: cuisine.id,
      name: cuisine.name,
      price: cuisine.price,
      image: cuisine.image,
      quantity: customizations.quantity,
      ingredients: customizations.ingredients,
      plating: customizations.plating,
      cookingMethod: customizations.cookingMethod,
      seasonalSelection: customizations.seasonalSelection,
      drinkPairing: customizations.drinkPairing,
    };
    addItemToPreOrder(preOrderItem);
  };

  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  return (
    <div className="bg-[url('/background.png')] bg-cover bg-center bg-fixed min-h-screen">
      <nav>Navigation Bar</nav>

      {/* Floating Buttons */}
      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons preOrderCount={preOrderCount} setPreOrderCount={clearPreOrder} />
      </section>

      {/* Sorting Dropdown */}
      <section className="py-4 mx-4 md:mx-14 flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="px-4 py-2 border rounded-md text-gray-700 font-semibold cursor-pointer"
        >
          <option value="asc">Sort by Price: Low to High</option>
          <option value="desc">Sort by Price: High to Low</option>
        </select>
      </section>

      {/* Display Sorted Category Specials */}
      <section className="py-4 mx-4 md:mx-14 relative">
        <h1 className="text-3xl font-bold mb-6 text-center capitalize">{decodedCategory} Foods</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedSpecials.length > 0 ? (
            sortedSpecials.map((food) => (
              <div key={food.id}>
                <FoodCard
                  image={food.image}
                  rating={food.rating}
                  name={food.name}
                  description={food.description}
                  price={food.price}
                  carouselImages={food.carouselImages}
                  onAddToPreOrder={(customizations) => {
                    const preOrderItem: PreOrderItem = {
                      id: food.id,
                      name: food.name,
                      price: food.price,
                      image: food.image,
                      quantity: customizations.quantity,
                      ingredients: customizations.ingredients.split(','), // Convert the string into an array of strings
                      plating: customizations.plating,
                      cookingMethod: customizations.cookingMethod,
                      seasonalSelection: customizations.seasonalSelection,
                      drinkPairing: customizations.drinkPairing,
                    };
                    addItemToPreOrder(preOrderItem);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-2xl font-bold text-gray-800">
              No items available for {decodedCategory}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
