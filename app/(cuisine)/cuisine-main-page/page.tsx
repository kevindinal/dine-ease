"use client";

import React, { useState } from "react";
import usePreOrder from "../hooks/usePreOrder";
import FoodCategory from "../components/FoodCategory";
import { Readex_Pro } from "next/font/google";
import FoodCard from "../components/FoodCard";
import FloatingButtons from "../components/FloatingButtons";
import { categories, recommendedForYou, todaysSpecials, chefsSpecials } from "../data/data";
import Link from "next/link";

const readexPro = Readex_Pro({ subsets: ["latin"], weight: ["400", "700"] });

interface MealPreOrderMainProps {
  hotelImage?: string;
}

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

export default function MealPreOrderMain({ hotelImage }: MealPreOrderMainProps) {
  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

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

  return (
    <div className={`${readexPro.className} bg-fixed min-h-screen bg-[#F5F5F5]`}>
      <nav>Navigation Bar</nav>

      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons preOrderCount={preOrderCount} setPreOrderCount={clearPreOrder} />
      </section>

      <section className="relative bg-[url('/hilton.png')] bg-cover bg-center bg-no-repeat py-32 px-4 md:px-14 text-white">
        <div className="bg-[#121212] bg-opacity-70 backdrop-blur-sm p-16">
          <h2 className="text-5xl font-semibold mb-6 tracking-wide">Hilton Colombo</h2>
          <p className="text-lg leading-relaxed font-light">
            Experience the finest dining at Hilton Colombo, offering a blend of local and international cuisines crafted by top chefs. From authentic Sri Lankan flavors to global delicacies, indulge in a culinary journey like no other.
          </p>
        </div>
      </section>

      <section className="py-8 mx-4 md:mx-14">
        <h2 className="text-3xl font-semibold text-[#121212] mb-6 tracking-wide">Cuisine Categories</h2>
        <div className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide p-8 rounded-2xl bg-white shadow-lg border border-[#BFA980]">
          {categories.map((category, index) => (
            <Link key={index} href={`/categories-expanded-page/${encodeURIComponent(category.foodType)}`} passHref>
              <div className="cursor-pointer flex flex-col items-center transition-all hover:scale-110">
                <FoodCategory imageSrc={category.imageSrc} foodType={category.foodType} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8 mx-4 md:mx-14 relative mt-12">
        <div className="bg-white rounded-2xl shadow-lg border border-[#BFA980]">
          <h2 className="text-3xl font-semibold text-[#121212] mb-6 ml-8 pt-6 tracking-wide">Recommended for you</h2>
          <div className="flex gap-6 overflow-x-auto p-8 scrollbar-hide">
            {recommendedForYou.map((cuisine) => (
              <div key={cuisine.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
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
            ))}
          </div>
          <Link href={`/cuisines-expanded-page/recommended`} className="absolute bottom-2 right-8 text-[#8C734B] font-medium hover:text-[#BFA980] transition-colors ">
            View More &gt;
          </Link>
        </div>
      </section>

      <section className="py-8 mx-4 md:mx-14 relative mt-12">
        <div className="bg-gradient-to-r from-[#F5F5F5] to-white rounded-2xl shadow-lg border border-[#BFA980]">
          <h2 className="text-3xl font-semibold text-[#121212] mb-6 ml-8 pt-6 tracking-wide">Chef's Specials for you</h2>
          <div className="flex gap-6 overflow-x-auto p-8 scrollbar-hide">
            {chefsSpecials.map((cuisine) => (
              <div key={cuisine.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
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
            ))}
          </div>
          <Link href={`/cuisines-expanded-page/chefs-specials`} className="absolute bottom-2 right-8 text-gray-500 font-medium hover:text-[#BFA980] transition-colors">
            View More &gt;
          </Link>
        </div>
      </section>

      <section className="py-8 mx-4 md:mx-14 relative mt-12">
        <div className="bg-white rounded-2xl shadow-lg border border-[#BFA980]">
          <h2 className="text-3xl font-semibold text-[#121212] mb-6 ml-8 pt-6 tracking-wide">Today's specials for you</h2>
          <div className="flex gap-6 overflow-x-auto p-8 scrollbar-hide">
            {todaysSpecials.map((cuisine) => (
              <div key={cuisine.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
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
            ))}
          </div>
          <Link href={`/cuisines-expanded-page/todays-specials`} className="absolute bottom-2 right-8 text-[#8C734B] font-medium hover:text-[#BFA980] transition-colors ">
            View More &gt;
          </Link>
        </div>
      </section>

      <section className="py-8 mx-4 md:mx-14 mt-12">
        <h3 className="text-2xl font-semibold text-[#121212] mb-4 tracking-wide">A Word From Our Chef</h3>
        <blockquote className="italic text-[#8C734B] border-l-4 border-[#BFA980] pl-8 py-4 text-lg leading-relaxed">
          "At Hilton Colombo, we pride ourselves on creating memorable dining experiences with fresh, locally sourced ingredients and innovative recipes. We look forward to serving you!"
        </blockquote>
      </section>
    </div>
  );
}
