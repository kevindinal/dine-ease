"use client"

import Image from "next/image";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingBag, Info, ChevronRight } from "lucide-react";

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
  const [showTags, setShowTags] = useState(true);

  /**
 * Function to handle adding a meal to the pre-order list.
 * - Prevents event propagation to avoid unintended side effects.
 * - Generates a unique ID to differentiate pre-order items.
 * - Stores pre-order details in `localStorage` for persistence.
 * - Calls `onAddToPreOrder` to update the UI/state.
 */
  const handleAddToPreOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  /**
 * Function to handle click events on meal cards.
 * - Constructs the navigation URL with required query parameters.
 * - Logs click event details and generated URL for debugging.
 * - Redirects the user to the cuisine details page.
 */
  const handleCardClick = () => {
    const url = `/cuisine-details-page?id=${id}&restaurantId=${restaurantId}`;
    const fullUrl = categoryId ? `${url}&categoryId=${categoryId}` : url;
    
    console.log("Card clicked:", id, restaurantId, categoryId);
    console.log("Navigating to:", fullUrl);
    
    router.push(fullUrl);
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Ensure we have a valid alt text for the image
  const imageAltText = name || "Food item";

  return (
    <div className="flex items-center justify-center px-2">
      <div
        className="cursor-pointer w-full sm:w-[400px] h-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg relative group"
        onClick={handleCardClick}
        role="button"
        aria-label={`View details for ${name}`}
      >
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={image}
            alt={imageAltText}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
            priority={true}
          />
          
          {showTags && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">Popular</span>
              {portionSize === "Regular" && (
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">Chef's Pick</span>
              )}
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1 flex-1">
              {name}
            </h3>
            <span className="text-lg font-bold text-red-500 ml-2">Rs. {formatPrice(price)}</span>
          </div>
          
          <p className="text-gray-600 text-sm mt-1 line-clamp-2 mb-3 min-h-[40px]">
            {description}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <button
                onClick={handleAddToPreOrder}
                className="flex items-center justify-center px-3 py-2 text-white text-sm font-medium bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                aria-label={`Add ${name} to order`}
              >
                <ShoppingBag size={16} className="mr-1" />
                <span>Add</span>
              </button>
            </div>
            
            <button 
              className="flex items-center text-sm font-medium text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                const url = `/cuisine-details-page?id=${id}&restaurantId=${restaurantId}`;
                const fullUrl = categoryId ? `${url}&categoryId=${categoryId}` : url;
                router.push(fullUrl);
              }}
              aria-label={`View details for ${name}`}
            >
              <span>Details</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;