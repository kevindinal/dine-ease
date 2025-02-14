"use client";

import Image from 'next/image';
import React, { FC, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FoodCardProps {
  image: string;
  name: string;
  rating: string;
  description: string;
  price: number;
  onAddToPreOrder: () => void;
}

const FoodCard: FC<FoodCardProps> = ({ image, name, rating, description, price, onAddToPreOrder }) => {
  const router = useRouter();

  const handleAddToPreOrder = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToPreOrder();
  };

  const handleCardClick = () => {
    router.push(`/cuisine-details-page?name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}&rating=${rating}&description=${encodeURIComponent(description)}&price=${price}`);
  };
  

  return (
    <div className="flex items-center justify-center px-2">
      <div
        className="w-[300px] h-[480px] bg-white rounded-3xl shadow-xl overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-56">
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
            <p className="text-[#3C3C4399] text-[17px] mr-2 line-through">{rating}</p>
            <p className="text-[17px] font-bold text-[#0FB478]">Rs. {price}</p>
          </div>
          <p className="text-[#7C7C80] font-[15px] mt-6">{description}</p>

          <button
            onClick={handleAddToPreOrder}
            className="block mt-6 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] bg-[#FFC933] hover:bg-[#FFC933DD] focus:ring-[#FFC933DD] focus:outline-none focus:ring-opacity-80"
          >
            Add to Pre-order
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
