"use client";

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

export default function CuisineViewMore() {
  const { type } = useParams();
  const decodedType = decodeURIComponent(type as string);

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

  const cuisineData: Record<string, Special[]> = {
    "recommended": recommendedForYou,
    "chefs-specials": chefsSpecials,
    "todays-specials": todaysSpecials,
  };

  const allCuisines = cuisineData[decodedType] || [];
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedCuisines = [...allCuisines].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <nav className="bg-[#121212] text-[#BFA980] py-6 px-8 shadow-lg">
        Navigation Bar
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-16 pb-12 text-left">
          <h1 className="text-4xl font-serif text-[#121212] capitalize mb-2">
            {decodedType.split('-').join(' ')} for you
          </h1>
        </header>

        <section className="mb-8 flex justify-end">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="bg-[#FB6658] text-black px-6 py-3 rounded border-2 border-black font-light cursor-pointer hover:bg-[#FA4032] hover:text-[#F5F5F5] transition-colors duration-300"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </section>

        <section className="pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedCuisines.length > 0 ? (
              sortedCuisines.map((cuisine) => (
                <div key={cuisine.id} className="transform hover:scale-100 transition-transform duration-100">
                  <FoodCard
                    image={cuisine.image}
                    rating={cuisine.rating}
                    name={cuisine.name}
                    description={cuisine.description}
                    price={cuisine.price}
                    carouselImages={cuisine.carouselImages}
                    onAddToPreOrder={(customizations) => {
                      const preOrderItem: PreOrderItem = {
                        id: cuisine.id,
                        name: cuisine.name,
                        price: cuisine.price,
                        image: cuisine.image,
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
              <div className="col-span-full text-center py-16">
                <p className="text-2xl text-[#121212] font-serif">
                  No {decodedType.split('-').join(' ')} available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="fixed bottom-32 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingButtons preOrderCount={preOrderCount} setPreOrderCount={clearPreOrder} />
        </div>
      </section>
    </div>
  );
}