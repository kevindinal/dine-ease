"use client"

import { useState, useEffect } from "react";
import { useMeals } from "../hooks/useMeals";
import usePreOrder from "../hooks/usePreOrder";
import { useSearchParams } from "next/navigation";
import CuisineDetailContainer from "../components/CuisineDetailContainer";
import FoodCard from "../components/FoodCard";
import FloatingButtons from "../components/FloatingButtons";
import PreOrderModal from "../components/PreOrderModel";

const MealDetailsPage: React.FC = () => {
  const { preOrders, preOrderCount, addItemToPreOrder, removePreOrderItem, clearPreOrder } = usePreOrder();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("id") || "";
  const restaurantId = searchParams.get("restaurantId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { meals: recommendedMeals, loading } = useMeals(restaurantId, "recommended");

  const handleAddToPreOrder = (customizations: any) => {
    addItemToPreOrder({
      id: customizations.id || crypto.randomUUID(),
      name: customizations.name,
      quantity: 1,
      ingredients: "",
      portionSize: customizations.size,
      spiceLevel: customizations.spiceLevel,
      drinkPairing: customizations.drink,
      price: customizations.price,
      image: customizations.image,
      addOns: customizations.addOns,
    });
  };

  // const limitedRecommendations = recommendedMeals? recommendedMeals.slice(0, 6) : [];

  return (
    <div>
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

      <section className="relative py-32 px-4 md:px-14 text-white">
        <CuisineDetailContainer

          handleAddToPreOrder={handleAddToPreOrder}
        />
      </section>

      {/* <section className="py-4 mx-4 md:mx-14 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended for you</h2>
        {loading? (
          <div className="flex justify-center p-8">Loading recommendations...</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide p-6">
            {limitedRecommendations.map((meal) => (
              <div key={meal.id} className="min-w-[calc(25%-1rem)] flex-none scroll-snap-align-start">
                <FoodCard
                  id={meal.id}
                  restaurantId={restaurantId}
                  categoryId={categoryId}
                  image={meal.imageUrl}
                  rating={meal.rating}
                  name={meal.name}
                  description={meal.description}
                  price={meal.price}
                  carouselImages={meal.imageCarousal}
                  onAddToPreOrder={() => handleAddToPreOrder({
                    id: meal.id,
                    name: meal.name,
                    price: meal.price,
                    image: meal.imageUrl,
                    size: "Regular",
                    spiceLevel: "Mild",
                    addOns: [],
                    drink: "Water"
                  })}
                />
              </div>
            ))}
          </div>
        )}
      </section> */}
    </div>
  );
};

export default MealDetailsPage;