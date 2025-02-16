import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Special, recommendedForYou, chefsSpecials, todaysSpecials } from "../data/data";

interface CuisineDetailContainerProps {
  handleAddToPreOrder: (customizations: any) => void;
}

const CuisineDetailContainer: React.FC<CuisineDetailContainerProps> = ({ handleAddToPreOrder }) => {
  const searchParams = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cuisineDetails, setCuisineDetails] = useState<Special | null>(null);

  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState<string>("");
  const [plating, setPlating] = useState<string>("Standard");
  const [cookingMethod, setCookingMethod] = useState<string>("Traditional");
  const [seasonalSelection, setSeasonalSelection] = useState<boolean>(false);
  const [drinkPairing, setDrinkPairing] = useState<string>("No pairing");

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      const decodedName = decodeURIComponent(name);
      const cuisine = [...recommendedForYou, ...chefsSpecials, ...todaysSpecials].find(
        (item) => item.name === decodedName
      );
      if (cuisine) {
        setCuisineDetails(cuisine);
      }
    }
  }, [searchParams]);

  if (!cuisineDetails) {
    return <div>Loading...</div>;
  }

  // Default to main image if no carousel images are available
  const carouselImages = cuisineDetails.carouselImages?.length
    ? cuisineDetails.carouselImages
    : [cuisineDetails.image];
  const currentImage = carouselImages[currentImageIndex];

  const addItemToPreOrder = (item: any) => {
    const preOrders = JSON.parse(localStorage.getItem("preOrders") || "[]");
    preOrders.push(item);
    localStorage.setItem("preOrders", JSON.stringify(preOrders));
  };

  const handleAddToPreOrderFromCard = (customizations: any) => {
    addItemToPreOrder({
      id: cuisineDetails.id,
      name: cuisineDetails.name,
      quantity: customizations.quantity,
      ingredients: customizations.ingredients,
      plating: customizations.plating,
      cookingMethod: customizations.cookingMethod,
      seasonalSelection: customizations.seasonalSelection,
      drinkPairing: customizations.drinkPairing,
      price: cuisineDetails.price,
      image: currentImage,
    });
    handleAddToPreOrder(customizations);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Carousel Section */}
        <div className="flex-1">
          {/* Main Image */}
          <div className="relative w-full h-[500px]">
            <Image
              src={currentImage}
              alt={cuisineDetails.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 gap-2 justify-center">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`w-16 h-16 border-2 rounded-md overflow-hidden cursor-pointer ${
                  index === currentImageIndex ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} objectFit="cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2">
          <h1 className="text-2xl font-bold text-black">{cuisineDetails.name}</h1>
          <p className="text-gray-600">Rs. {cuisineDetails.price}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="text-yellow-400">★</span> {cuisineDetails.rating}
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-black text-xl font-semibold mb-4">Description</h2>
            <p className="text-black">{cuisineDetails.description}</p>
          </div>

          {/* Customization Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm text-black">
            <h2 className="text-xl font-semibold mb-4">Customize Your Meal</h2>

            {/* Quantity Control */}
            <div className="flex items-center mb-4">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-4 py-2 bg-gray-300 rounded-full text-lg"
              >
                -
              </button>
              <span className="mx-4 text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-gray-300 rounded-full text-lg"
              >
                +
              </button>
            </div>

            {/* Custom Ingredients */}
            <div className="mb-4">
              <label className="block text-gray-700">Custom Ingredients</label>
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ex: Premium cheese, exotic spices"
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Plating, Cooking Method, Drink Pairing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Plating Design</label>
                <select
                  value={plating}
                  onChange={(e) => setPlating(e.target.value)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                >
                  <option value="Standard">Standard</option>
                  <option value="Artistic">Artistic</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Cooking Method</label>
                <select
                  value={cookingMethod}
                  onChange={(e) => setCookingMethod(e.target.value)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                >
                  <option value="Traditional">Traditional</option>
                  <option value="Sous-vide">Sous-vide</option>
                  <option value="Flame-grilled">Flame-grilled</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Tailored Drink Pairing</label>
                <select
                  value={drinkPairing}
                  onChange={(e) => setDrinkPairing(e.target.value)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                >
                  <option value="No pairing">No pairing</option>
                  <option value="Wine">Wine</option>
                  <option value="Signature Cocktail">Signature Cocktail</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add to PreOrder */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                handleAddToPreOrderFromCard({
                  quantity,
                  ingredients,
                  plating,
                  cookingMethod,
                  seasonalSelection,
                  drinkPairing,
                })
              }
              className="px-8 py-3 text-white bg-blue-500 rounded-full shadow-lg"
            >
              Add to Pre-Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineDetailContainer;
