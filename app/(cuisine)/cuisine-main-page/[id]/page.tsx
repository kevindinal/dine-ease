"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import usePreOrder from "../../hooks/usePreOrder";
import FoodCategory from "../../components/FoodCategory";
import FoodCard from "../../components/FoodCard";
import FloatingButtons from "../../components/FloatingButtons";
import { recommendedForYou } from "../../data/data";
import PreOrderModal from "../../components/PreOrderModel";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useCategories } from "../../hooks/useCategories";
import { useChefsSpecials } from "../../hooks/useChefsSpecials";
import { useTodaysSpecials } from "../../hooks/useTodaysSpecials";
import { useMeals } from "../../hooks/useMeals";
import { Category } from "../../types/category";
import { Loader2, ArrowLeft, ChevronUp } from "lucide-react";

interface MealPreOrderMainProps {
  hotelImage?: string;
}

export default function MealPreOrderMain({ hotelImage }: MealPreOrderMainProps) {
  const {id} = useParams<{id:string}> ();

  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(id || "");
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(id);
  const { meals: todaysSpecials, loading: todaysLoading, error: todaysSpecialsError } = useTodaysSpecials(id);
  const { meals: chefsSpecials, loading: chefsLoading, error: chefsError } = useChefsSpecials(id);

  const { preOrders, preOrderCount, addItemToPreOrder, removePreOrderItem, clearPreOrder } = usePreOrder();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { meals, loading: mealsLoading, error: mealsError } = useMeals(id, selectedCategory as string);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (restaurant && restaurant.mealPageImage) {
      let imageUrl = restaurant.mealPageImage;

      if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }

      setBackgroundImageUrl(imageUrl);
    }
  }, [restaurant]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (category: Category | string | null) => {
    if (typeof category === 'string') {
      setSelectedCategory(category);
    } else if (category) {
      setSelectedCategory(category.id);
    } else {
      setSelectedCategory(null);
    }
    
    // Scroll to top when changing categories
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderFoodCard = (cuisine: any) => (
    <div key={cuisine.id}>
      <div className="h-full mb-4">
        <FoodCard {...cuisine} id={id} onAddToPreOrder={addItemToPreOrder} />
      </div>
    </div>
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (restaurantLoading) return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
  
  if (restaurantError) return <div className="p-8 text-center text-red-500">Error: {restaurantError}</div>;
  if (categoriesError) return <div className="p-8 text-center text-red-500">Error loading categories: {categoriesError}</div>;
  if (!restaurant) return <div className="p-8 text-center">Restaurant not found</div>;

  const fallbackImage = hotelImage || "/default-restaurant-banner.jpg";

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Fixed Header on Scroll */}
      <div 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-4"
        }`}
      >
        
      </div>

      <PreOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preOrders={preOrders}
        removeItem={removePreOrderItem}
      />

      <section
        className="relative bg-cover bg-center bg-no-repeat pt-24 pb-16 px-4 md:px-14 text-white"
      >
        {backgroundImageUrl || fallbackImage ? (
          <img
            src={backgroundImageUrl || fallbackImage}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>

        <div className="relative bg-black/40 backdrop-blur-sm p-6 sm:p-12 rounded-xl max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-semibold mb-4 sm:mb-6 tracking-wide">{restaurant.name}</h2>
          <p className="text-base sm:text-lg leading-relaxed font-light">
            {restaurant.mealPageDesc}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4">Cuisine Categories</h2>
          <div
            ref={categoriesRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 gap-6 items-center"
          >
            <div
              className={`cursor-pointer flex-none snap-start flex flex-col items-center transition-all hover:scale-105 ${!selectedCategory ? 'scale-105' : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              <FoodCategory 
                imageSrc="/cate-all.jpg" 
                foodType="All" 
                
              />
            </div>
            {categoriesLoading ? (
              <div className="flex justify-center p-4 w-full">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`cursor-pointer flex-none snap-start flex flex-col items-center transition-all hover:scale-105 ${selectedCategory === category.id ? 'scale-105' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <FoodCategory 
                    imageSrc={category.categoryImage} 
                    foodType={category.name} 
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {selectedCategory ? (
          <section className="pb-24">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {categories.find((category) => category.id === selectedCategory)?.name || 'Unknown Category'}
            </h2>
            {mealsLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : mealsError ? (
              <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
                Error loading meals: {mealsError}
              </div>
            ) : meals && meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map(renderFoodCard)}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No meals found in this category.</p>
              </div>
            )}
          </section>
        ) : (
          <div className="pb-24">
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">
                  Recommended for you
                </h2>
                <div className="flex gap-6 overflow-x-auto p-6 scrollbar-hide snap-x snap-mandatory">
                  {recommendedForYou.map((cuisine) => (
                    <div key={cuisine.id} className="min-w-[280px] flex-none snap-start">
                      {renderFoodCard(cuisine)}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {chefsLoading ? (
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">
                    Chef's specials
                  </h2>
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                </div>
              </section>
            ) : chefsError ? (
              <div className="text-center p-6 mb-8 bg-red-50 rounded-lg text-red-500">
                Error loading chef's specials: {chefsError}
              </div>
            ) : chefsSpecials && chefsSpecials.length > 0 ? (
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">
                    Chef's specials
                  </h2>
                  <div className="flex gap-6 overflow-x-auto p-6 scrollbar-hide snap-x snap-mandatory">
                    {chefsSpecials.map((cuisine) => (
                      <div key={cuisine.id} className="min-w-[280px] flex-none snap-start">
                        {renderFoodCard(cuisine)}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {todaysLoading ? (
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">
                    Today's specials
                  </h2>
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                </div>
              </section>
            ) : todaysSpecialsError ? (
              <div className="text-center p-6 mb-8 bg-red-50 rounded-lg text-red-500">
                Error loading today's specials: {todaysSpecialsError}
              </div>
            ) : todaysSpecials && todaysSpecials.length > 0 ? (
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">
                    Today's specials
                  </h2>
                  <div className="flex gap-6 overflow-x-auto p-6 scrollbar-hide snap-x snap-mandatory">
                    {todaysSpecials.map((cuisine) => (
                      <div key={cuisine.id} className="min-w-[280px] flex-none snap-start">
                        {renderFoodCard(cuisine)}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-28 bg-primary text-white p-3 rounded-full shadow-lg transition-opacity duration-300 z-30 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <section className="py-4 mx-4 fixed z-20 slide-in-from-bottom-4 left-0 right-0 flex justify-center bottom-6">
        <FloatingButtons
          preOrderCount={preOrderCount}
          preOrders={preOrders}
          clearPreOrder={clearPreOrder}
          removePreOrderItem={removePreOrderItem}
          onPreOrderCountClick={() => setIsModalOpen(true)}
        />
      </section>
    </div>
  );
}