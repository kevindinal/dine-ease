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
      image: "https://www.theworlds50best.com/discovery/filestore/jpg/The%20Lagoon-Colombo-Sri%20Lanka-1.jpg",
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
      image: "https://lightmoment.jp/_wp/wp-content/uploads/2018/04/western_sgh_corombo_004-1200x800.jpg",
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
      image: "https://www.ministryofcrab.com/bangkok/wp-content/uploads/sites/3/2023/11/MOC-Resturent-1200x800-1.jpg",
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
      image: "https://live.staticflickr.com/2930/14346747774_7400b5b572_b.jpg",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjI5Hka-ADD6juFqmDSDnyYo1zIE2fDra0Sg&s",
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
      image: "https://live.staticflickr.com/8285/7771522272_a7211f9b58_b.jpg",
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
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/ef/96/af/main-dining-room-in-tao.jpg?w=900&h=500&s=1",
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
      image: "https://d18slle4wlf9ku.cloudfront.net/www.cinnamonhotels.com-1302818674/cms/cache/v2/66bd61ab411ad.jpg/1920x1080/fit/80/e025f0c5fa81a93236d946f06d436f9c.jpg",
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
      image: "https://img.easemytrip.com/EMTHotel-1216209/a/large/646161_1.jpg",
      rating: 5,
      reviews: 140,
      cuisine: "European, International",
      category: "Fine Dining - $$$$",
      priceRange: "$$$",
      times: ["10:00 PM", "10:15 PM", "10:30 PM"],
    },
  ];
  