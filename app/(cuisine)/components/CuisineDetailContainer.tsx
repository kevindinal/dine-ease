"use client"

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useMealsById } from "../hooks/useMeals";
import dynamic from "next/dynamic";

// Dynamically import the model viewer to avoid SSR issues
const MealModelViewer = dynamic(
  () => import("../components/MealModelViewer"),
  { ssr: false }
);

interface CuisineDetailContainerProps {
  handleAddToPreOrder: (customizations: any) => void;
}

const CuisineDetailContainer: React.FC<CuisineDetailContainerProps> = ({ handleAddToPreOrder }) => {
  const searchParams = useSearchParams();
  const mealId = searchParams.get("id") || "";
  const restaurantId = searchParams.get("restaurantId") || "";
  const categoryIdFromUrl = searchParams.get("categoryId") || undefined;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [spiceLevel, setSpiceLevel] = useState("Mild");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string>("Water");
  const [imageError, setImageError] = useState<string | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [modelViewerLoading, setModelViewerLoading] = useState(false);

  const { meal, loading, error, categoryId: resolvedCategoryId } = useMealsById(mealId, restaurantId, categoryIdFromUrl);

  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(null);
    // Reset AR view when meal changes
    setShowAR(false);
  }, [meal]);

  useEffect(() => {
    if (categoryIdFromUrl && resolvedCategoryId !== categoryIdFromUrl) {
      console.log("Category ID from URL does not match resolved category ID");
    } 
  }, [mealId, restaurantId, categoryIdFromUrl, resolvedCategoryId]);

  // Handle model viewer loading state
  useEffect(() => {
    if (showAR) {
      setModelViewerLoading(true);
      // Simulate loading completion after components are mounted
      const timer = setTimeout(() => {
        setModelViewerLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAR]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg">Loading meal details...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg text-red-500">Error: {error}</div>
    </div>;
  }

  if (!meal) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg">Meal not found</div>
    </div>;
  }

  const getCarouselImages = () => {
    let images: string[] = [];

    try {
      if (meal && meal.carouselImages && Array.isArray(meal.carouselImages)) {
        images = meal.carouselImages;
      }
      else if (meal && meal.image) {
        images = [meal.image];
      }
      else {
        images = ["/placeholder-image.jpg"];
      }

      return images;
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Unknown image error");
      return ["/placeholder-image.jpg"];
    }
  };

  const carouselImages = getCarouselImages();

  if (currentImageIndex >= carouselImages.length) {
    setCurrentImageIndex(0);
  }

  const handleAddToPreOrderFromCard = () => {
    const customizations = {
      id: meal.id,
      name: meal.name,
      price: calculateTotalPrice(),
      basePrice: meal.price,
      image: meal.image || (carouselImages.length > 0 ? carouselImages[0] : null),
      size: selectedSize,
      spiceLevel,
      addOns,
      drink: selectedDrink,
      categoryId: resolvedCategoryId 
    };
    console.log('Adding to pre-order:', customizations);
    handleAddToPreOrder(customizations);
  };

  const calculateTotalPrice = () => {
    let total = meal.price;

    if (selectedSize === "Large") total += 400;
    if (selectedSize === "Extra Large") total += 700;

    if (addOns.includes("Extra Avocado")) total += 200;
    if (addOns.includes("Extra Salmon")) total += 600;
    if (addOns.includes("Extra Sauce")) total += 100;
    if (addOns.includes("Brown Rice")) total += 150;

    return total;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {imageError && (
            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
              Image Error: {imageError}
            </div>
          )}

          <div className="relative">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-medium">View this meal:</h3>
              <div>
                <button 
                  onClick={() => setShowAR(false)} 
                  className={`px-3 py-1 text-sm rounded-l-lg border ${!showAR ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  Photos
                </button>
                <button 
                  onClick={() => setShowAR(true)} 
                  className={`px-3 py-1 text-sm rounded-r-lg border ${showAR ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} ${!meal.arModelUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!meal.arModelUrl}
                >
                  3D/AR View
                </button>
              </div>
            </div>

            {showAR ? (
              meal.arModelUrl ? (
                modelViewerLoading ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-500">Loading 3D model...</div>
                  </div>
                ) : (
                  <MealModelViewer arModelUrl={meal.arModelUrl} />
                )
              ) : (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500">3D model not available for this meal</div>
                </div>
              )
            ) : (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                {carouselImages.length > 0 && (
                  <>
                    <Image
                      src={carouselImages[currentImageIndex]}
                      alt={meal.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                      priority
                      onError={() => {
                        setImageError(`Failed to load image: ${carouselImages[currentImageIndex]}`);
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                      {currentImageIndex + 1}/{carouselImages.length}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {!showAR && carouselImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {carouselImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100 ${index === currentImageIndex ? "ring-2 ring-red-500" : ""
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 12vw"
                    style={{ objectFit: "cover" }}
                    onError={() => {
                      console.error("Thumbnail failed to load:", img);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meal.name}</h1>
            <div className="text-2xl font-bold text-red-500 mt-2">Rs. {meal.price}</div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">{meal.longDescription || meal.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Customize Your Order</h2>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Select Portion Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Regular", "Large (+Rs.400)", "Extra Large (+Rs.700)"].map((size) => (
                  <button
                    key={size}
                    className={`p-2 border rounded-xl ${selectedSize === size.split(" ")[0] ? "bg-red-500 text-white" : "text-gray-700"
                      }`}
                    onClick={() => setSelectedSize(size.split(" ")[0])}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Spice Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Mild", "Medium", "Hot"].map((level) => (
                  <button
                    key={level}
                    className={`p-2 border rounded-xl ${spiceLevel === level ? "bg-red-500 text-white" : "text-gray-700"
                      }`}
                    onClick={() => setSpiceLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Add-ons</h3>
              <div className="grid grid-cols-2 gap-2 text-black rounded-xl">
                {[
                  ["Extra Avocado", "Rs.200"],
                  ["Extra Salmon", "Rs.600"],
                  ["Extra Sauce", "Rs.100"],
                  ["Brown Rice", "Rs.150"]
                ].map(([item, price]) => (
                  <label key={item} className="flex items-center p-2 border rounded">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={addOns.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAddOns([...addOns, item]);
                        } else {
                          setAddOns(addOns.filter(addon => addon !== item));
                        }
                      }}
                    />
                    {item} (+{price})
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Select a Drink Pairing</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Water", "Lemonade", "Iced Tea", "Soda"].map((drink) => (
                  <button
                    key={drink}
                    className={`p-2 border rounded-xl ${selectedDrink === drink ? "bg-red-500 text-white" : "text-gray-700"
                      }`}
                    onClick={() => setSelectedDrink(drink)}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToPreOrderFromCard}
              className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-colors"
            >
              Add to Pre-Order
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineDetailContainer;