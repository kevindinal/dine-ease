import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Special, recommendedForYou, chefsSpecials, todaysSpecials } from "../data/data";

interface CuisineDetailContainerProps {
  handleAddToPreOrder: (customizations: any) => void;
}

const CuisineDetailContainer: React.FC<CuisineDetailContainerProps> = ({ handleAddToPreOrder }) => {
  const searchParams = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cuisineDetails, setCuisineDetails] = useState<Special | null>(null);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [spiceLevel, setSpiceLevel] = useState("Mild");
  const [addOns, setAddOns] = useState<string[]>([]);

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

  const carouselImages = cuisineDetails.carouselImages?.length
    ? cuisineDetails.carouselImages
    : [cuisineDetails.image];

  const handleAddToPreOrderFromCard = () => {
    const customizations = {
      size: selectedSize,
      spiceLevel,
      addOns,
    };
    handleAddToPreOrder(customizations);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={carouselImages[currentImageIndex]}
              alt={cuisineDetails.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                  index === currentImageIndex ? "ring-2 ring-red-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cuisineDetails.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(Math.floor(cuisineDetails.rating))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {cuisineDetails.rating % 1 > 0 && (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" strokeWidth={1} />
                )}
              </div>
              <span className="text-gray-600">{cuisineDetails.rating} (245 reviews)</span>
            </div>
            <div className="text-2xl font-bold text-red-500 mt-2">Rs. {cuisineDetails.price}</div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">{cuisineDetails.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>🍽️ Serves 1</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Customize Your Order</h2>
            
            <div>
              <h3 className="text-sm text-gray-700 mb-2">Select Portion Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Regular", "Large (+$4)", "Extra Large (+$7)"].map((size) => (
                  <button
                    key={size}
                    className={`p-2 border rounded ${
                      selectedSize === size.split(" ")[0] ? "bg-red-500 text-white" : "text-gray-700"
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
                    className={`p-2 border rounded ${
                      spiceLevel === level ? "bg-red-500 text-white" : "text-gray-700"
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
                  ["Extra Avocado", "$2"],
                  ["Extra Salmon", "$6"],
                  ["Extra Sauce", "$1"],
                  ["Brown Rice", "$1"]
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
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToPreOrderFromCard}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Add to Pre-Order
            </button>
            <button className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineDetailContainer;