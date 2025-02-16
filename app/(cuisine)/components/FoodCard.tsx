import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FoodCardProps {
  image: string;
  name: string;
  rating: string;
  description: string;
  price: number;
  carouselImages: string[];
  onAddToPreOrder: (customizations: {
    quantity: number;
    ingredients: string;
    plating: string;
    cookingMethod: string;
    seasonalSelection: boolean;
    drinkPairing: string;
  }) => void;
}

const FoodCard: FC<FoodCardProps> = ({ 
  image, 
  name, 
  rating, 
  description, 
  price, 
  carouselImages, 
  onAddToPreOrder 
}) => {
  const router = useRouter();

  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState('');
  const [plating, setPlating] = useState('Standard');
  const [cookingMethod, setCookingMethod] = useState('Traditional');
  const [seasonalSelection, setSeasonalSelection] = useState(false);
  const [drinkPairing, setDrinkPairing] = useState('No pairing');

  // Handle adding item to pre-order
  const handleAddToPreOrder = () => {
    const customizations = { quantity, ingredients, plating, cookingMethod, seasonalSelection, drinkPairing };
    onAddToPreOrder(customizations);
  };

  // Handle navigation to cuisine details page
  const handleCardClick = () => {
    router.push(`/cuisine-details-page?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex items-center justify-center px-2">
      <div
        className="cursor-pointer w-[300px] h-[480px] bg-white rounded-3xl shadow-xl overflow-hidden border border-black transition-all hover:scale-110 hover:delay-200"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-56 border-b-2 border-black">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-3xl"
            priority={true}
          />
        </div>

        <div className="p-4 sm:p-6">
          <p className="font-bold text-gray-700 text-[22px] leading-7 mb-1">{name}</p>
          <div className="flex flex-row">
            <p className="text-[#3C3C4399] text-[17px] mr-2">{rating} ★</p>
            <p className="text-[17px] font-bold">Rs. {price}</p>
          </div>
          <p className="text-[#7C7C80] font-[15px] mt-6">{description}</p>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigation on button click
              handleAddToPreOrder();
            }}
            className="block mt-6 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] bg-[#FB665B] hover:bg-[#FA4032] focus:ring-[#FB665B] focus:outline-none focus:ring-opacity-80 border border-black"
          >
            Add to Pre-order
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
