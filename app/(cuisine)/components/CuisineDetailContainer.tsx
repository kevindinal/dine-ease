"use client"

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShoppingBag, ChevronLeft, Info, Camera, Image as ImageIcon } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);

  // Destructure values returned from the useMealsById custom hook
  const { meal, loading, error, categoryId: resolvedCategoryId } = useMealsById(mealId, restaurantId, categoryIdFromUrl);

  /**
 * Effect to reset meal-related UI states when a new meal is loaded.
 * - Ensures the first image is shown.
 * - Clears any image loading errors.
 * - Hides the AR (Augmented Reality) view.
 * - Resets the quantity to default (1).
 * 
 * Dependencies:
 * - Runs when 'meal' changes, ensuring state is reset upon meal selection/update.
 */
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(null);
    setShowAR(false);
    setQuantity(1);
  }, [meal]);

  /**
 * Effect to check if the category ID from the URL matches the resolved category ID.
 * - Logs a message if there is a mismatch between the categoryIdFromUrl and resolvedCategoryId.
 * 
 * Dependencies:
 * - Runs whenever mealId, restaurantId, categoryIdFromUrl, or resolvedCategoryId changes.
 * - Ensures the check is performed when any of these values update.
 */
  useEffect(() => {
    if (categoryIdFromUrl && resolvedCategoryId !== categoryIdFromUrl) {
      console.log("Category ID from URL does not match resolved category ID");
    }
  }, [mealId, restaurantId, categoryIdFromUrl, resolvedCategoryId]);

  /**
 * Effect to handle AR model loading state.
 * - When 'showAR' is enabled, it triggers a loading state.
 * - Uses a timeout to simulate model loading for 1 second.
 * - Cleans up the timer on unmount or when 'showAR' changes to prevent memory leaks.
 * 
 * Dependencies:
 * - Runs only when 'showAR' changes, ensuring loading state updates accordingly.
 */ 
  useEffect(() => {
    if (showAR) {
      setModelViewerLoading(true);
      const timer = setTimeout(() => {
        setModelViewerLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAR]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading meal details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-red-50 rounded-lg">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Info size={28} className="text-red-500" />
          </div>
          <div className="text-lg font-medium text-red-700 mb-2">Error Loading Meal</div>
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Info size={28} className="text-gray-500" />
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">Meal Not Found</div>
          <div className="text-gray-500">We couldn't find the meal you're looking for.</div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" /> Go Back
          </button>
        </div>
      </div>
    );
  }
/**
 * Function to retrieve carousel images for a meal.
 * - If 'meal.carouselImages' is available and valid, it returns the array.
 * - If only a single meal image exists, it wraps it in an array.
 * - If no images exist, it falls back to a default placeholder image.
 * - Handles errors gracefully and updates the image error state.
 * 
 * Return:
 * - An array of image URLs.
 */
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

  /**
 * Function to handle adding a meal to the pre-order list.
 * - Collects and structures meal details, including selected customizations.
 * - Ensures a valid meal image is assigned (either main image or fallback).
 * - Logs the customization details for debugging purposes.
 * - Calls `handleAddToPreOrder` to update the pre-order list.
 */
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
      categoryId: resolvedCategoryId,
      quantity: quantity 
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

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
        >
          <ChevronLeft size={18} className="mr-1" /> Back to Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {imageError && (
            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <Info size={18} className="mr-2" />
              Image Error: {imageError}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
            <div className="mb-2 flex justify-between items-center">

              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setShowAR(false)}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center ${!showAR ? 'bg-red-500 text-white shadow-sm' : 'bg-transparent text-gray-700'}`}
                >
                  <ImageIcon size={16} className="mr-2" />
                  Photos
                </button>
                <button
                  onClick={() => setShowAR(true)}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center ${showAR ? 'bg-red-500 text-white shadow-sm' : 'bg-transparent text-gray-700'} ${!meal.arModelUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!meal.arModelUrl}
                >
                  <Camera size={16} className="mr-2" />
                  3D/AR
                </button>
              </div>
            </div>

            {showAR ? (
              meal.arModelUrl ? (
                modelViewerLoading ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <div className="text-gray-500">Loading 3D model...</div>
                    </div>
                  </div>
                ) : (
                  <MealModelViewer />
                )
              ) : (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500 p-4 text-center">
                    <Camera size={32} className="mx-auto mb-2 opacity-30" />
                    <div>3D model not available for this meal</div>
                  </div>
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
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 text-sm rounded-full">
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
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100 transition-all hover:opacity-90 ${index === currentImageIndex ? "ring-2 ring-red-500 shadow-md" : ""
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{meal.name}</h1>
                
              </div>
              <div className="text-2xl font-bold text-red-500">Rs. {formatPrice(meal.price)}</div>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <h2 className="font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{meal.longDescription || meal.description}</p>
            </div>

            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900 mb-4">Customize Your Order</h2>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Portion Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Regular", price: 0 },
                    { name: "Large", price: 400 },
                    { name: "Extra Large", price: 700 }
                  ].map((size) => (
                    <button
                      key={size.name}
                      className={`p-3 border rounded-lg transition-all hover:border-red-300 ${selectedSize === size.name
                          ? "bg-red-50 border-red-500 text-red-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                      onClick={() => setSelectedSize(size.name)}
                    >
                      <div className="text-sm mb-1">{size.name}</div>
                      {size.price > 0 && (
                        <div className="text-xs text-gray-500">+Rs. {formatPrice(size.price)}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Spice Level</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Mild", "Medium", "Hot"].map((level) => (
                    <button
                      key={level}
                      className={`p-3 border rounded-lg transition-all hover:border-red-300 ${spiceLevel === level
                          ? "bg-red-50 border-red-500 text-red-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                      onClick={() => setSpiceLevel(level)}
                    >
                      <div className="text-sm">{level}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add-ons</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Extra Beef", price: 200 },
                    { name: "Extra Salmon", price: 600 },
                    { name: "Extra Sauce", price: 100 },
                    { name: "Brown Rice", price: 150 }
                  ].map((addon) => (
                    <label
                      key={addon.name}
                      className={`text-black flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${addOns.includes(addon.name) ? "bg-red-50 border-red-300" : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-red-500 mr-3"
                        checked={addOns.includes(addon.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAddOns([...addOns, addon.name]);
                          } else {
                            setAddOns(addOns.filter(item => item !== addon.name));
                          }
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">{addon.name}</div>
                        <div className="text-xs text-gray-500">+Rs. {formatPrice(addon.price)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select a Drink Pairing</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Water", "Lemonade", "Iced Tea", "Soda"].map((drink) => (
                    <button
                      key={drink}
                      className={`p-3 border rounded-lg transition-all hover:border-red-300 ${selectedDrink === drink
                          ? "bg-red-50 border-red-500 text-red-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                      onClick={() => setSelectedDrink(drink)}
                    >
                      <div className="text-sm">{drink}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price:</span>
                <span>Rs. {formatPrice(meal.price)}</span>
              </div>
              {selectedSize !== "Regular" && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Size ({selectedSize}):</span>
                  <span>+Rs. {selectedSize === "Large" ? "400" : "700"}</span>
                </div>
              )}
              {addOns.length > 0 && addOns.map(addon => {
                let price = 0;
                if (addon === "Extra Beef") price = 200;
                if (addon === "Extra Salmon") price = 600;
                if (addon === "Extra Sauce") price = 100;
                if (addon === "Brown Rice") price = 150;

                return (
                  <div key={addon} className="flex justify-between mb-2">
                    <span className=" text-black">{addon}:</span>
                    <span className="">+Rs. {price}</span>
                  </div>
                );
              })}
              {quantity > 1 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span>x{quantity}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-500">Rs. {formatPrice(calculateTotalPrice() * quantity)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.history.back()}
                className="border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleAddToPreOrderFromCard}
                className="bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Pre-Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineDetailContainer;