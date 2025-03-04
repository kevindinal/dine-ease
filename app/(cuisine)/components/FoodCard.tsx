"use client"

import Image from "next/image";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";

interface FoodCardProps {
  id: string;
  restaurantId: string;
  categoryId?: string; // Make categoryId optional
  image: string;
  name: string;
  rating: number;
  description: string;
  price: number;
  carouselImages?: string[];
  onAddToPreOrder: (customizations: any) => void;
}

const FoodCard: FC<FoodCardProps> = ({
  id,
  restaurantId,
  categoryId,
  image,
  name,
  rating,
  description,
  price,
  carouselImages = [],
  onAddToPreOrder,
}) => {
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState("");
  const [portionSize, setPortionSize] = useState("Regular");
  const [spiceLevel, setSpiceLevel] = useState("Mild");
  const [addOns, setAddOns] = useState("");
  const [drinkPairing, setDrinkPairing] = useState("No pairing");

  const handleAddToPreOrder = () => {
    const customizations = {
      id: `${name}-${Math.random().toString(36).substring(7)}`,
      name,
      price,
      image,
      quantity,
      ingredients,
      portionSize,
      spiceLevel,
      addOns,
      drinkPairing,
    };

    console.log("Added to pre-order:", customizations);

    localStorage.setItem("preOrder", JSON.stringify(customizations));

    onAddToPreOrder(customizations);
  };

  const handleCardClick = () => {
    const url = `/cuisine-details-page?id=${id}&restaurantId=${restaurantId}`;
    
    const fullUrl = categoryId ? `${url}&categoryId=${categoryId}` : url;
    
    console.log("Card clicked:", id, restaurantId, categoryId);
    console.log("Navigating to:", fullUrl);
    
    router.push(fullUrl);
  };  

  return (
    <div className="flex items-center justify-center px-2">
      <div
        className="cursor-pointer w-full sm:w-[400px] h-auto sm:h-[480px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:scale-105 hover:delay-200"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-40 sm:h-56 ">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-3xl"
            priority={true}
          />
        </div>

        <div className="p-3 sm:p-6">
          <p className="font-bold text-gray-700 text-lg sm:text-[22px] leading-6 sm:leading-7 mb-1">
            {name}
          </p>
          <p className="text-gray-500 text-xs sm:text-[15px] mt-4 sm:mt-6 line-clamp-2 font-bold ">
            {description}
          </p>
          <div className="flex flex-row mt-3 sm:mt-4 justify-between items-center">
            <p className="text-sm sm:text-[17px] font-bold text-[#FB665B]">Rs. {price}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToPreOrder();
              }}
              className="px-2 py-1 sm:py-2 text-white text-xs sm:text-base font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] bg-[#FB665B] hover:bg-[#FA4032] focus:ring-[#FB665B] focus:outline-none focus:ring-opacity-80 "
            >
              Add to Pre-order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;