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

export default function MealPreOrderMain({ hotelImage }: MealPreOrderMainProps) {
  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  return (
    <div
      className={`${readexPro.className} bg-[url('/background.png')] bg-cover bg-center bg-fixed min-h-screen`}
    >
      <nav>Navigation Bar</nav>

      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons
          preOrderCount={preOrderCount}
          setPreOrderCount={clearPreOrder}
        />
      </section>

      <section className="relative bg-[url('/hilton.png')] bg-cover bg-center bg-no-repeat py-32 px-4 md:px-14 text-white">
        <div className="bg-black bg-opacity-60 p-16">
          <h2 className="text-4xl font-semibold mb-4">Hilton Colombo</h2>
          <p className="text-lg">
            Experience the finest dining at Hilton Colombo, offering a blend of
            local and international cuisines crafted by top chefs. From
            authentic Sri Lankan flavors to global delicacies, indulge in a
            culinary journey like no other.
          </p>
        </div>
      </section>

      <section className="py-4 mx-4 md:mx-14">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Cuisine Categories
        </h2>
        <div
          className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide p-5 rounded-full"
          style={{ backgroundColor: "#FEC6C2" }}
        >
          {categories.map((category, index) => (
            <Link key={index} href={`/categories-expanded-page/${encodeURIComponent(category.foodType)}`}passHref>
              <div className="cursor-pointer flex flex-col items-center transition-all hover:scale-110">
                <FoodCategory imageSrc={category.imageSrc} foodType={category.foodType} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recommended for you
        </h2>
        <div className="flex gap-6 overflow-x-auto p-6 bg-gray-100 scrollbar-hide">
          {recommendedForYou.map((cuisine) => (
            <div
              key={cuisine.id}
              className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start"
            >
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
        <Link href={`/cuisines-expanded-page/recommended`}  className="absolute bottom-4 right-4 text-gray-500 font-semibold hover:underline">
          View More &gt;&gt;&gt;
        </Link>
       
      </section>


      <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Chef's Specials for you
        </h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide p-6 bg-gray-100 ">
          {chefsSpecials.map((cuisine) => (
            <div
              key={cuisine.id}
              className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start"
            >
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
        <Link href={`/cuisines-expanded-page/chefs-specials`}  className="absolute bottom-4 right-4 text-gray-500 font-semibold hover:underline">
          View More &gt;&gt;&gt;
        </Link>
      </section>


      <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Today's specials for you
        </h2>
        <div className="flex gap-6 overflow-x-auto p-6 bg-gray-100 scrollbar-hide">
          {todaysSpecials.map((cuisine) => (
            <div
              key={cuisine.id}
              className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start"
            >
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
        <Link href={`/cuisines-expanded-page/todays-specials`}  className="absolute bottom-4 right-4 text-gray-500 font-semibold hover:underline">
          View More &gt;&gt;&gt;
        </Link>
      </section>

      <section className="py-4 mx-4 md:mx-14">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          A Word From Our Chef
        </h3>
        <blockquote className="italic text-gray-600 border-l-4 border-gray-300 pl-4">
          "At Hilton Colombo, we pride ourselves on creating memorable dining
          experiences with fresh, locally sourced ingredients and innovative
          recipes. We look forward to serving you!"
        </blockquote>
      </section>
    </div>
  );
}
