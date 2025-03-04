"use client";

import React, { useState, useRef, useEffect } from "react";
import usePreOrder from "../hooks/usePreOrder";
import FoodCategory from "../components/FoodCategory";
import { Readex_Pro } from "next/font/google";
import FoodCard from "../components/FoodCard";
import FloatingButtons from "../components/FloatingButtons";
import { recommendedForYou } from "../data/data";
import PreOrderModal from "../components/PreOrderModel";
import { useRestaurant } from "../hooks/useRestaurant";
import { useCategories } from "../hooks/useCategories";
import { useChefsSpecials } from "../hooks/useChefsSpecials";
import { useTodaysSpecials } from "../hooks/useTodaysSpecials";
import { useMeals } from "../hooks/useMeals";
import { Category } from "../types/category";

interface MealPreOrderMainProps {
  hotelImage?: string;
}

export default function MealPreOrderMain({ hotelImage }: MealPreOrderMainProps) {
  const restaurantId = "restaurant_1";
  const categoryId = "category_1";

  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(restaurantId || "");
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(restaurantId);
  const { meals: todaysSpecials, loading: todaysLoading, error: todaysSpecialsError } = useTodaysSpecials(restaurantId);
  const { meals: chefsSpecials, loading: chefsLoading, error: chefsError } = useChefsSpecials(restaurantId);

  const { preOrders, preOrderCount, addItemToPreOrder, removePreOrderItem, clearPreOrder } = usePreOrder();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { meals, loading: mealsLoading, error: mealsError } = useMeals(restaurantId, selectedCategory as string);

  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (restaurant && restaurant.mealPageImage) {
      let imageUrl = restaurant.mealPageImage;
      
      if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }
      
      setBackgroundImageUrl(imageUrl);
      
      console.log("Restaurant image URL:", imageUrl);
    }
  }, [restaurant]);

  const handleCategoryClick = (category: Category | string | null) => {
    if (typeof category === 'string') {
      setSelectedCategory(category);
    } else if (category) {
      setSelectedCategory(category.id);
    } else {
      setSelectedCategory(null);
    }
  };

  const renderFoodCard = (cuisine: any) => (
    <div key={cuisine.id}>
      <div className="h-full mb-8">
        <FoodCard {...cuisine} restaurantId={restaurantId} onAddToPreOrder={addItemToPreOrder} />
      </div>
    </div>
  );

  if (restaurantLoading) return <div>Loading...</div>;
  if (restaurantError) return <div>Error: {restaurantError} </div>;
  if (categoriesError) return <div>Error loading categories: {categoriesError}</div>
  if (!restaurant) return <div>Restaurant not found</div>;

  const fallbackImage = hotelImage || "/default-restaurant-banner.jpg";

  return (
    <div className={` bg-fixed min-h-screen bg-[#F5F5F5]`}>
      <PreOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preOrders={preOrders}
        removeItem={removePreOrderItem}
      />

      <section className="py-4 mx-4 md:mx-14 z-10 fixed slide-in-from-bottom-28 left-0 right-0 flex justify-center bottom-24">
        <FloatingButtons 
          preOrderCount={preOrderCount} 
          preOrders={preOrders}
          clearPreOrder={clearPreOrder}
          removePreOrderItem={removePreOrderItem}
          onPreOrderCountClick={() => setIsModalOpen(true)}
        />
      </section>

      <section 
        className="relative bg-cover bg-center bg-no-repeat py-16 sm:py-32 px-4 md:px-14 text-white" 
        style={{ 
          backgroundImage: `url("${backgroundImageUrl || fallbackImage}")`, 
          backgroundAttachment: "scroll" 
        }}
      >
        {!backgroundImageUrl && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
            Using fallback image
          </div>
        )}

        <div className="bg-[#121212] bg-opacity-70 backdrop-blur-sm p-6 sm:p-16">
          <h2 className="text-3xl sm:text-5xl font-semibold mb-4 sm:mb-6 tracking-wide">{restaurant.name}</h2>
          <p className="text-base sm:text-lg leading-relaxed font-light">
            {restaurant.mealPageDesc}
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 mx-4 md:mx-14 border-b border-black">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#121212] mb-4 sm:mb-6 tracking-wide">Cuisine Categories</h2>
        <div
          ref={categoriesRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory p-4 sm:p-8 rounded-2xl gap-4 sm:gap-6 justify-center md:justify-center items-center"
        >
          <div
            className="cursor-pointer flex-none snap-start flex flex-col items-center transition-all hover:scale-110"
            onClick={() => handleCategoryClick(null)}
          >
            <FoodCategory imageSrc="/cate-all.jpg" foodType="All Categories" />
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer flex-none snap-start flex flex-col items-center transition-all hover:scale-110"
              onClick={() => handleCategoryClick(category)}
            >
              <FoodCategory imageSrc={category.categoryImage} foodType={category.name} />
            </div>
          ))}
        </div>
      </section>


      {selectedCategory ? (
        <section className="py-6 sm:py-8 mx-4 md:mx-14">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#121212] mb-4 sm:mb-6 tracking-wide">
            {categories.find((category) => category.id === selectedCategory)?.name || 'Unknown Category'}
          </h2>
          {mealsLoading ? (
            <div>Loading...</div>
          ) : meals && meals.length > 0 ? (
            <div className="flex flex-wrap -mx-2 sm:-mx-4">
              {meals.map(renderFoodCard)}
            </div>
          ) : (
            <div>No meals found in this category.</div>
          )}
        </section>
      ) : (
        <>
          <section className="py-6 sm:py-8 mx-4 md:mx-14 relative mt-8 sm:mt-12">
            <div className="rounded-2xl shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#121212] mb-4 sm:mb-6 ml-4 sm:ml-8 pt-4 sm:pt-6 tracking-wide">
                Recommended for you
              </h2>
              <div className="flex gap-4 sm:gap-6 overflow-x-auto p-4 sm:p-8 scrollbar-hide snap-x snap-mandatory">
                {recommendedForYou.map((cuisine) => (
                  <div key={cuisine.id} className="min-w-[250px] sm:min-w-[320px] lg:min-w-[calc(25%-1rem)] flex-none snap-start">
                    {renderFoodCard(cuisine)}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {chefsSpecials && chefsSpecials.length > 0 && (
            <section className="py-6 sm:py-8 mx-4 md:mx-14 relative mt-8 sm:mt-12">
              <div className="rounded-2xl shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#121212] mb-4 sm:mb-6 ml-4 sm:ml-8 pt-4 sm:pt-6 tracking-wide">
                  Chef's specials for you
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-8">
                  {chefsSpecials.map((cuisine) => renderFoodCard(cuisine))}
                </div>
              </div>
            </section>
          )}

          {todaysSpecials && todaysSpecials.length > 0 && (
            <section className="py-6 sm:py-8 mx-4 md:mx-14 relative mt-8 sm:mt-12">
              <div className="rounded-2xl shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#121212] mb-4 sm:mb-6 ml-4 sm:ml-8 pt-4 sm:pt-6 tracking-wide">
                  Today's specials for you
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-8">
                  {todaysSpecials.map((cuisine) => renderFoodCard(cuisine))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}