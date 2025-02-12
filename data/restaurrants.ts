export type Restaurant = {
   
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    cuisine: string;
    category: string;
    priceRange: string;
    times: string[];
  };
  
  export const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Hilton Colombo",
      image: "https://hiltoncolombo1.com/uploads/poster/6881610003007Cover1.jpg",
      rating: 5,
      reviews: 120,
      cuisine: "International",
      category: "Global, International - $$$",
      priceRange: "$$$",
      times: ["12:00 PM", "12:15 PM", "12:30 PM"],
    },
    {
      id: 2,
      name: "The Lagoon",
      image: "https://www.johnkeellshotels.com/hotels/photos/lagoon-restaurant.jpg",
      rating: 4,
      reviews: 98,
      cuisine: "Seafood",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["1:00 PM", "1:15 PM", "1:30 PM"],
    },
    {
      id: 3,
      name: "Shangri-La Colombo",
      image: "https://media.timeout.com/images/105240304/image.jpg",
      rating: 5,
      reviews: 150,
      cuisine: "Asian Fusion",
      category: "Fine Dining - $$$$",
      priceRange: "$$$$",
      times: ["7:00 PM", "7:15 PM", "7:30 PM"],
    },
    {
      id: 4,
      name: "Ministry of Crab",
      image: "https://www.ministryofcrab.com/images/gallery/moc-restaurant.jpg",
      rating: 5,
      reviews: 200,
      cuisine: "Sri Lankan, Seafood",
      category: "Fine Dining - $$$$",
      priceRange: "$$$$",
      times: ["8:00 PM", "8:15 PM", "8:30 PM"],
    },
    {
      id: 5,
      name: "Café Français",
      image: "https://cafe-francais.com/uploads/photos/cafe.jpg",
      rating: 4,
      reviews: 85,
      cuisine: "French",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["6:00 PM", "6:15 PM", "6:30 PM"],
    },
    {
      id: 6,
      name: "Nuga Gama",
      image: "https://www.cinnamonhotels.com/images/dining/nugagama.jpg",
      rating: 4,
      reviews: 110,
      cuisine: "Sri Lankan",
      category: "Fine Dining - $$$$",
      priceRange: "$$",
      times: ["5:00 PM", "5:15 PM", "5:30 PM"],
    },
    {
      id: 7,
      name: "Colombo Court Hotel & Spa",
      image: "https://colombocourthotel.com/wp-content/uploads/2016/08/courtyard.jpg",
      rating: 5,
      reviews: 95,
      cuisine: "Organic, Healthy",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["7:00 PM", "7:15 PM", "7:30 PM"],
    },
    {
      id: 8,
      name: "Tao",
      image: "https://www.cinnamonhotels.com/images/dining/tao.jpg",
      rating: 4,
      reviews: 102,
      cuisine: "Chinese, Asian",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["8:00 PM", "8:15 PM", "8:30 PM"],
    },
    {
      id: 9,
      name: "Cinnamon Grand",
      image: "https://www.cinnamonhotels.com/images/dining/Nuga-Gama_2.jpg",
      rating: 5,
      reviews: 160,
      cuisine: "Sri Lankan, International",
      category: "Fine Dining - $$$$",
      priceRange: "$$$$",
      times: ["9:00 PM", "9:15 PM", "9:30 PM"],
    },
    {
      id: 10,
      name: "Mövenpick Hotel Colombo",
      image: "https://www.movenpick.com/uploads/images/hotel_colombo.jpg",
      rating: 5,
      reviews: 140,
      cuisine: "European, International",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["10:00 PM", "10:15 PM", "10:30 PM"],
    },
  ];
  