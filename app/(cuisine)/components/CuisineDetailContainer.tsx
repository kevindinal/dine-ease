"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface CuisineDetailContainerProps {
  handleAddToPreOrder: () => void;
}

const CuisineDetailContainer: React.FC<CuisineDetailContainerProps> = ({ handleAddToPreOrder }) => {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "Product Name";
  const image = searchParams.get("image") || "/placeholder.jpeg";
  const rating = searchParams.get("rating") || "0.0";
  const description = searchParams.get("description") || "No description available.";
  const price = searchParams.get("price") || "0.00";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <img src={image} alt={name} className="w-full max-w-md mx-auto rounded-lg object-cover shadow-md" />
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-2xl font-bold text-black">{name}</h1>
          <p className="text-gray-600 mt-2">Rs. {price}</p>
          <p className="text-sm text-gray-500">{rating} ★</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddToPreOrder}
          >
            Add to Pre-order
          </button>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineDetailContainer;
