"use client";

import React, { useState } from "react";

interface CousineDetailContainerProps {
  handleAddToPreOrder: () => void;
}

const CousineDetailContainer: React.FC<CousineDetailContainerProps> = ({ handleAddToPreOrder }) => {
  const [mainImage, setMainImage] = useState<string>("/placeholder.jpeg");

  const thumbnails: string[] = [
    "/placeholder.jpeg",
    "/hilton.png",
    "/placeholder.jpeg",
    "/placeholder.jpeg",
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        <div className="flex-1">
          {/* Main Image */}
          <div>
            <img
              id="mainImage"
              src={mainImage}
              alt="Main Product"
              className="w-full max-w-md mx-auto rounded-lg object-cover shadow-md"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 justify-center">
            {thumbnails.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover cursor-pointer transition-opacity hover:opacity-100 hover:scale-105"
                onClick={() => setMainImage(src)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <div className="mt-6 lg:mt-0">
            <h1 className="text-2xl font-bold">Product Name</h1>
            <p className="text-gray-600 mt-2">$49.99</p>
            <div className="flex items-center mt-4">
              <span className="text-yellow-400">★★★★★</span>
              <p className="text-sm text-gray-500 ml-2">(123 reviews)</p>
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleAddToPreOrder}
            >
              Add to Pre-order
            </button>
          </div>

          {/* Description Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">
              Indulge in this delicious and nutritious meal, prepared with fresh ingredients 
              and crafted to perfection. Whether you're craving a light lunch or a hearty dinner, 
              this dish is sure to satisfy your taste buds. Packed with flavors and balanced nutrition, 
              it's the perfect choice for any occasion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CousineDetailContainer;
