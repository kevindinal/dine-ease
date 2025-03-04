type AboutSectionProps = {
    restaurant: {
      name: string;
      about: string;
      cuisine: string[];
      priceRange: string;
      category: string;
      location: string;
      photos: string[];
    };
  };
  
  export default function AboutSection({ restaurant }: AboutSectionProps) {
    return (
      <div className="p-8 max-w-8xl mx-auto">
        {/* Main Container - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Side - About, Cuisine & Details */}
          <div>
            {/* About Description */}
            <h2 className="text-4xl font-semibold mb-4">About {restaurant.name}</h2>
            <p className="mb-6">{restaurant.about}</p>
  
            {/* Two Columns for Cuisine & Details */}
            <div className="grid grid-cols-2">
              {/* Cuisine List */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Cuisine</h3>
                <ul className="list-disc ml-5 space-y-1">
                  {restaurant.cuisine.map((cuisine, index) => (
                    <li key={index}>{cuisine}</li>
                  ))}
                </ul>
              </div>
              
              {/* Restaurant Details */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Details</h3>
                <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
                <p><strong>Dining Style:</strong> {restaurant.category}</p>
                <p><strong>Dress Code:</strong> {restaurant.location}</p>
              </div>
            </div>
          </div>
  
          {/* Right Side - 2x2 Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {restaurant.photos.slice(0, 4).map((photo, index) => (
              <img 
                key={index} 
                src={photo} 
                className="w-full h-[180px] md:h-[220px] object-cover rounded-lg" 
                alt="Restaurant Photo" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }