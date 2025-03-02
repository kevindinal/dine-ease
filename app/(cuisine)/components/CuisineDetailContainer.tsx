"use client"

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useMealsById } from "../hooks/useMeals";

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

  // The enhanced hook now handles finding the categoryId if not provided
  const { meal, loading, error, categoryId: resolvedCategoryId } = useMealsById(mealId, restaurantId, categoryIdFromUrl);

  // Reset the image index when the meal changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(null);
  }, [meal]);

  useEffect(() => {
    console.log("Params:", mealId, restaurantId, categoryIdFromUrl);
    if (resolvedCategoryId && resolvedCategoryId !== categoryIdFromUrl) {
      console.log("Resolved category ID:", resolvedCategoryId);
    }
  }, [mealId, restaurantId, categoryIdFromUrl, resolvedCategoryId]);

  // Debug the meal object and image URLs
  useEffect(() => {
    if (meal && meal.carouselImages) {
      console.log("Meal object:", meal);
      console.log("Category ID:", resolvedCategoryId);
      console.log("Image URL:", meal.image);
      console.log("Image Carousel:", meal.carouselImages);
    }
  }, [meal, resolvedCategoryId]);

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

  // Determine the proper images to display
  const getCarouselImages = () => {
    // Debug the image carousel data
    console.log("Getting carousel images");
    console.log("carouselImages type:", typeof meal.carouselImages);
    console.log("carouselImages value:", meal.carouselImages);

    // More safely handle the carousel images
    let images: string[] = [];

    try {
      // Check if carouselImages exists and is an array
      if (meal && meal.carouselImages && Array.isArray(meal.carouselImages)) {
        console.log("Using carouselImages array");
        images = meal.carouselImages;
      }
      // Fallback to imageUrl if available
      else if (meal && meal.image) {
        console.log("Falling back to imageUrl");
        images = [meal.image];
      }
      // Default placeholder if no images are available
      else {
        console.log("Using placeholder image");
        images = ["/placeholder-image.jpg"];
      }

      console.log("Final images array:", images);
      return images;
    } catch (err) {
      console.error("Error processing images:", err);
      setImageError(err instanceof Error ? err.message : "Unknown image error");
      return ["/placeholder-image.jpg"];
    }
  };

  const carouselImages = getCarouselImages();

  // Ensure currentImageIndex is within bounds
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
      categoryId: resolvedCategoryId // Include the resolved categoryId
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
                    console.error("Image failed to load:", carouselImages[currentImageIndex]);
                    setImageError(`Failed to load image: ${carouselImages[currentImageIndex]}`);
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                  {currentImageIndex + 1}/{carouselImages.length}
                </div>
              </>
            )}
          </div>

          {carouselImages.length > 1 && (
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
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(Math.floor(meal.rating || 0))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {(meal.rating || 0) % 1 > 0 && (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" strokeWidth={1} />
                )}
              </div>
              <span className="text-gray-600">{meal.rating || 0} (245 reviews)</span>
            </div>
            <div className="text-2xl font-bold text-red-500 mt-2">Rs. {meal.price}</div>
            {resolvedCategoryId && (
              <div className="text-sm text-gray-500 mt-1">
                Category ID: {resolvedCategoryId}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">{meal.longDescription || meal.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Serves 1</div>
              {meal.isTodaysSpecial && <div>Today's Special</div>}
              {meal.isChefsSpecial && <div>Chef's Special</div>}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Customize Your Order</h2>

            <div>
              <h3 className="text-sm text-gray-700 mb-2">Select Portion Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Regular", "Large (+Rs.400)", "Extra Large (+Rs.700)"].map((size) => (
                  <button
                    key={size}
                    className={`p-2 border rounded ${selectedSize === size.split(" ")[0] ? "bg-red-500 text-white" : "text-gray-700"
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
                    className={`p-2 border rounded ${spiceLevel === level ? "bg-red-500 text-white" : "text-gray-700"
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
              <div className="grid grid-cols-2 gap-2 text-black">
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
                    className={`p-2 border rounded ${selectedDrink === drink ? "bg-red-500 text-white" : "text-gray-700"
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
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Add to Pre-Order
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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