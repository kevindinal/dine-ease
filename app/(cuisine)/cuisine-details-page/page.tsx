"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import usePreOrder from "../hooks/usePreOrder";
import CuisineDetailContainer from "../components/CuisineDetailContainer";
import FloatingButtons from "../components/FloatingButtons";
import PreOrderModal from "../components/PreOrderModel";

const MealDetailsPage: React.FC = () => {
  const { preOrders, preOrderCount, addItemToPreOrder, removePreOrderItem, clearPreOrder } = usePreOrder();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface Customizations {
    id: string;
    name: string;
    quantity: number;
    size: string;
    spiceLevel: string;
    drink: string;
    price: number;
    image: string;
    addOns?: string[];
  }

  const handleAddToPreOrder = (customizations: Customizations) => {
    const preOrderItem = {
      id: customizations.id,
      name: customizations.name,
      quantity: customizations.quantity, 
      ingredients: customizations.addOns?.join(", ") || "", 
      portionSize: customizations.size, 
      spiceLevel: customizations.spiceLevel,
      drinkPairing: customizations.drink, 
      price: customizations.price,
      image: customizations.image,
      addOns: customizations.addOns
      // uniqueId will be added by the hook
    };

    addItemToPreOrder(preOrderItem);
  };

  return (
    <div>
      <PreOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preOrders={preOrders}
        removeItem={removePreOrderItem} // Updated to just pass the uniqueId
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

      <section className="relative py-20 px-4 md:px-14 text-white mb-20">
        <CuisineDetailContainer
          handleAddToPreOrder={handleAddToPreOrder}
        />
      </section>
    </div>
  );
};

export default MealDetailsPage;